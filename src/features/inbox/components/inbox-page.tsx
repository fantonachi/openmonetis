"use client";

import {
	RiArrowLeftDoubleLine,
	RiArrowLeftSLine,
	RiArrowRightDoubleLine,
	RiArrowRightSLine,
	RiAtLine,
	RiDeleteBinLine,
} from "@remixicon/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import {
	bulkDeleteInboxItemsAction,
	bulkDeleteSelectedInboxItemsAction,
	bulkDiscardInboxItemsAction,
	deleteInboxItemAction,
	discardInboxItemAction,
	markInboxAsProcessedAction,
	restoreDiscardedInboxItemAction,
} from "@/features/inbox/actions";
import {
	INBOX_DEFAULT_PAGE_SIZE,
	INBOX_PAGE_SIZE_OPTIONS,
} from "@/features/inbox/page-helpers";
import { TransactionDialog } from "@/features/transactions/components/dialogs/transaction-dialog/transaction-dialog";
import { ConfirmActionDialog } from "@/shared/components/confirm-action-dialog";
import { EmptyState } from "@/shared/components/empty-state";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/components/ui/select";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/shared/components/ui/tabs";
import { InboxCard } from "./inbox-card";
import { InboxDetailsDialog } from "./inbox-details-dialog";
import type {
	InboxItem,
	InboxPaginationState,
	InboxStatus,
	InboxStatusCounts,
	SelectOption,
} from "./types";

interface InboxPageProps {
	activeStatus: InboxStatus;
	items: InboxItem[];
	counts: InboxStatusCounts;
	pagination: InboxPaginationState;
	payerOptions: SelectOption[];
	splitPayerOptions: SelectOption[];
	defaultPayerId: string | null;
	accountOptions: SelectOption[];
	cardOptions: SelectOption[];
	categoryOptions: SelectOption[];
	estabelecimentos: string[];
	appLogoMap: Record<string, string>;
}

export function InboxPage({
	activeStatus,
	items,
	counts,
	pagination,
	payerOptions,
	splitPayerOptions,
	defaultPayerId,
	accountOptions,
	cardOptions,
	categoryOptions,
	estabelecimentos,
	appLogoMap,
}: InboxPageProps) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();
	const [processOpen, setProcessOpen] = useState(false);
	const [itemToProcess, setItemToProcess] = useState<InboxItem | null>(null);

	const [detailsOpen, setDetailsOpen] = useState(false);
	const [itemDetails, setItemDetails] = useState<InboxItem | null>(null);

	const [discardOpen, setDiscardOpen] = useState(false);
	const [itemToDiscard, setItemToDiscard] = useState<InboxItem | null>(null);

	const [deleteOpen, setDeleteOpen] = useState(false);
	const [itemToDelete, setItemToDelete] = useState<InboxItem | null>(null);

	const [restoreOpen, setRestoreOpen] = useState(false);
	const [itemToRestore, setItemToRestore] = useState<InboxItem | null>(null);

	const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
	const [bulkDeleteStatus, setBulkDeleteStatus] = useState<
		"processed" | "discarded"
	>("processed");

	const [selectedIds, setSelectedIds] = useState<string[]>([]);

	const [selectionBulkOpen, setSelectionBulkOpen] = useState(false);
	const [selectionBulkStatus, setSelectionBulkStatus] =
		useState<InboxStatus>("pending");

	const handleProcessOpenChange = (open: boolean) => {
		setProcessOpen(open);
		if (!open) {
			setItemToProcess(null);
		}
	};

	const handleDetailsOpenChange = (open: boolean) => {
		setDetailsOpen(open);
		if (!open) {
			setItemDetails(null);
		}
	};

	const handleDiscardOpenChange = (open: boolean) => {
		setDiscardOpen(open);
		if (!open) {
			setItemToDiscard(null);
		}
	};

	const handleProcessRequest = (item: InboxItem) => {
		setItemToProcess(item);
		setProcessOpen(true);
	};

	const handleDetailsRequest = (item: InboxItem) => {
		setItemDetails(item);
		setDetailsOpen(true);
	};

	const handleDiscardRequest = (item: InboxItem) => {
		setItemToDiscard(item);
		setDiscardOpen(true);
	};

	const handleDiscardConfirm = async () => {
		if (!itemToDiscard) return;

		const result = await discardInboxItemAction({
			inboxItemId: itemToDiscard.id,
		});

		if (result.success) {
			toast.success(result.message);
			return;
		}

		toast.error(result.error);
		throw new Error(result.error);
	};

	const handleDeleteOpenChange = (open: boolean) => {
		setDeleteOpen(open);
		if (!open) {
			setItemToDelete(null);
		}
	};

	const handleDeleteRequest = (item: InboxItem) => {
		setItemToDelete(item);
		setDeleteOpen(true);
	};

	const handleDeleteConfirm = async () => {
		if (!itemToDelete) return;

		const result = await deleteInboxItemAction({
			inboxItemId: itemToDelete.id,
		});

		if (result.success) {
			toast.success(result.message);
			return;
		}

		toast.error(result.error);
		throw new Error(result.error);
	};

	const handleRestoreOpenChange = (open: boolean) => {
		setRestoreOpen(open);
		if (!open) {
			setItemToRestore(null);
		}
	};

	const handleRestoreRequest = (item: InboxItem) => {
		setItemToRestore(item);
		setRestoreOpen(true);
	};

	const handleRestoreToPendingConfirm = async () => {
		if (!itemToRestore) return;

		const result = await restoreDiscardedInboxItemAction({
			inboxItemId: itemToRestore.id,
		});

		if (result.success) {
			toast.success(result.message);
			return;
		}

		toast.error(result.error);
		throw new Error(result.error);
	};

	useEffect(() => {
		const visibleIds = new Set(items.map((item) => item.id));
		setSelectedIds((current) => current.filter((id) => visibleIds.has(id)));
	}, [items]);

	const toggleSelection = (id: string) => {
		setSelectedIds((current) =>
			current.includes(id)
				? current.filter((value) => value !== id)
				: [...current, id],
		);
	};

	const allSelected = items.length > 0 && selectedIds.length === items.length;

	const toggleSelectAll = () => {
		if (allSelected) {
			setSelectedIds([]);
			return;
		}

		setSelectedIds(items.map((item) => item.id));
	};

	const updateUrl = (
		nextStatus: InboxStatus,
		nextPage: number,
		nextPageSize: number,
	) => {
		const nextParams = new URLSearchParams(searchParams.toString());

		if (nextStatus === "pending") {
			nextParams.delete("status");
		} else {
			nextParams.set("status", nextStatus);
		}

		if (nextPage <= 1) {
			nextParams.delete("page");
		} else {
			nextParams.set("page", nextPage.toString());
		}

		if (nextPageSize === INBOX_DEFAULT_PAGE_SIZE) {
			nextParams.delete("pageSize");
		} else {
			nextParams.set("pageSize", nextPageSize.toString());
		}

		startTransition(() => {
			const target = nextParams.toString()
				? `${pathname}?${nextParams.toString()}`
				: pathname;
			router.replace(target, { scroll: false });
		});
	};

	const handleTabChange = (nextStatus: string) => {
		updateUrl(nextStatus as InboxStatus, 1, pagination.pageSize);
	};

	const handleSelectionBulkRequest = (status: InboxStatus) => {
		if (selectedIds.length === 0) {
			return;
		}

		setSelectionBulkStatus(status);
		setSelectionBulkOpen(true);
	};

	const handleSelectionBulkConfirm = async () => {
		if (selectionBulkStatus === "pending") {
			const result = await bulkDiscardInboxItemsAction({
				inboxItemIds: selectedIds,
			});
			if (result.success) {
				toast.success(result.message);
				setSelectedIds([]);
				return;
			}
			toast.error(result.error);
			throw new Error(result.error);
		} else {
			const result = await bulkDeleteSelectedInboxItemsAction({
				inboxItemIds: selectedIds,
			});
			if (result.success) {
				toast.success(result.message);
				setSelectedIds([]);
				return;
			}
			toast.error(result.error);
			throw new Error(result.error);
		}
	};

	const handleBulkDeleteOpenChange = (open: boolean) => {
		setBulkDeleteOpen(open);
	};

	const handleBulkDeleteRequest = (status: "processed" | "discarded") => {
		setBulkDeleteStatus(status);
		setBulkDeleteOpen(true);
	};

	const handleBulkDeleteConfirm = async () => {
		const result = await bulkDeleteInboxItemsAction({
			status: bulkDeleteStatus,
		});

		if (result.success) {
			toast.success(result.message);
			return;
		}

		toast.error(result.error);
		throw new Error(result.error);
	};

	const handleLancamentoSuccess = async () => {
		if (!itemToProcess) return;

		const result = await markInboxAsProcessedAction({
			inboxItemId: itemToProcess.id,
		});

		if (result.success) {
			toast.success("Notificação processada!");
		} else {
			toast.error(result.error);
		}
	};

	const canPreviousPage = pagination.page > 1;
	const canNextPage = pagination.page < pagination.totalPages;

	// Prepare default values from inbox item
	const getDateString = (
		date: Date | string | null | undefined,
	): string | null => {
		if (!date) return null;
		if (typeof date === "string") return date.slice(0, 10);
		return date.toISOString().slice(0, 10);
	};

	const defaultPurchaseDate =
		getDateString(itemToProcess?.notificationTimestamp) ?? null;

	const defaultName = itemToProcess?.parsedName
		? itemToProcess.parsedName
				.toLowerCase()
				.replace(/\b\w/g, (char) => char.toUpperCase())
		: null;

	const defaultAmount = itemToProcess?.parsedAmount
		? String(Math.abs(Number(itemToProcess.parsedAmount)))
		: null;

	// Match sourceAppName with a cartão to pre-fill card select
	const matchedCartaoId = useMemo(() => {
		const appName = itemToProcess?.sourceAppName?.toLowerCase();
		if (!appName) return null;

		for (const option of cardOptions) {
			const label = option.label.toLowerCase();
			if (label.includes(appName) || appName.includes(label)) {
				return option.value;
			}
		}
		return null;
	}, [itemToProcess?.sourceAppName, cardOptions]);

	const renderEmptyState = (message: string) => (
		<Card className="flex min-h-[50vh] w-full items-center justify-center py-12">
			<EmptyState
				media={<RiAtLine className="size-6 text-primary" />}
				title={message}
				description="As notificações capturadas pelo app OpenMonetis Companion aparecerão aqui. Saiba mais em Ajustes > Companion."
			/>
		</Card>
	);

	const renderGrid = (list: InboxItem[], readonly?: boolean) =>
		list.length === 0 ? (
			renderEmptyState(
				readonly
					? "Nenhuma notificação nesta aba"
					: "Nenhum pré-lançamento pendente",
			)
		) : (
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{list.map((item) => (
					<InboxCard
						key={item.id}
						item={item}
						readonly={readonly}
						appLogoMap={appLogoMap}
						onProcess={readonly ? undefined : handleProcessRequest}
						onDiscard={readonly ? undefined : handleDiscardRequest}
						onViewDetails={readonly ? undefined : handleDetailsRequest}
						onDelete={readonly ? handleDeleteRequest : undefined}
						onRestoreToPending={readonly ? handleRestoreRequest : undefined}
						selected={selectedIds.includes(item.id)}
						onSelectToggle={toggleSelection}
					/>
				))}
			</div>
		);

	return (
		<>
			<Tabs
				value={activeStatus}
				onValueChange={handleTabChange}
				className="w-full"
			>
				<TabsList className="grid h-auto w-full grid-cols-3 sm:inline-flex sm:h-9 sm:grid-cols-none">
					<TabsTrigger
						value="pending"
						disabled={isPending}
						className="h-11 min-w-0 flex-col gap-0 px-1 text-sm leading-tight sm:h-9 sm:flex-row sm:gap-1 sm:px-4"
					>
						<span>Pendentes</span>
						<span>({counts.pending})</span>
					</TabsTrigger>
					<TabsTrigger
						value="processed"
						disabled={isPending}
						className="h-11 min-w-0 flex-col gap-0 px-1 text-sm leading-tight sm:h-9 sm:flex-row sm:gap-1 sm:px-4"
					>
						<span>Processados</span>
						<span>({counts.processed})</span>
					</TabsTrigger>
					<TabsTrigger
						value="discarded"
						disabled={isPending}
						className="h-11 min-w-0 flex-col gap-0 px-1 text-sm leading-tight sm:h-9 sm:flex-row sm:gap-1 sm:px-4"
					>
						<span>Descartados</span>
						<span>({counts.discarded})</span>
					</TabsTrigger>
				</TabsList>

				<TabsContent value="pending" className="mt-4">
					{activeStatus === "pending" && items.length > 0 && (
						<div className="mb-4 flex items-center justify-end gap-2">
							<Button variant="outline" size="sm" onClick={toggleSelectAll}>
								{allSelected ? "Cancelar seleção" : "Selecionar página"}
							</Button>
							{selectedIds.length > 0 && (
								<Button
									variant="destructive"
									size="sm"
									onClick={() => handleSelectionBulkRequest("pending")}
								>
									<RiDeleteBinLine className="mr-1.5 size-4" />
									Descartar selecionados ({selectedIds.length})
								</Button>
							)}
						</div>
					)}
					{activeStatus === "pending" ? renderGrid(items, false) : null}
				</TabsContent>
				<TabsContent value="processed" className="mt-4">
					{activeStatus === "processed" && items.length > 0 && (
						<div className="mb-4 flex items-center justify-end gap-2">
							<Button variant="outline" size="sm" onClick={toggleSelectAll}>
								{allSelected ? "Cancelar seleção" : "Selecionar página"}
							</Button>
							{selectedIds.length > 0 && (
								<Button
									variant="destructive"
									size="sm"
									onClick={() => handleSelectionBulkRequest("processed")}
								>
									<RiDeleteBinLine className="mr-1.5 size-4" />
									Excluir selecionados ({selectedIds.length})
								</Button>
							)}
							<Button
								variant="outline"
								size="sm"
								onClick={() => handleBulkDeleteRequest("processed")}
							>
								<RiDeleteBinLine className="mr-1.5 size-4" />
								Limpar processados
							</Button>
						</div>
					)}
					{activeStatus === "processed" ? renderGrid(items, true) : null}
				</TabsContent>
				<TabsContent value="discarded" className="mt-4">
					{activeStatus === "discarded" && items.length > 0 && (
						<div className="mb-4 flex items-center justify-end gap-2">
							<Button variant="outline" size="sm" onClick={toggleSelectAll}>
								{allSelected ? "Cancelar seleção" : "Selecionar página"}
							</Button>
							{selectedIds.length > 0 && (
								<Button
									variant="destructive"
									size="sm"
									onClick={() => handleSelectionBulkRequest("discarded")}
								>
									<RiDeleteBinLine className="mr-1.5 size-4" />
									Excluir selecionados ({selectedIds.length})
								</Button>
							)}
							<Button
								variant="outline"
								size="sm"
								onClick={() => handleBulkDeleteRequest("discarded")}
							>
								<RiDeleteBinLine className="mr-1.5 size-4" />
								Limpar descartados
							</Button>
						</div>
					)}
					{activeStatus === "discarded" ? renderGrid(items, true) : null}
				</TabsContent>
			</Tabs>

			{pagination.totalItems > 0 ? (
				<div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex items-center gap-2">
						<span className="text-sm text-muted-foreground">
							{pagination.totalItems} notificações
						</span>
						<Select
							disabled={isPending}
							value={pagination.pageSize.toString()}
							onValueChange={(value) => {
								updateUrl(activeStatus, 1, Number(value));
							}}
						>
							<SelectTrigger className="w-max">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{INBOX_PAGE_SIZE_OPTIONS.map((option) => (
									<SelectItem key={option} value={option.toString()}>
										{option} itens
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="flex items-center gap-2">
						<span className="text-sm text-muted-foreground">
							Página {pagination.page} de {pagination.totalPages}
						</span>
						<div className="flex items-center gap-1">
							<Button
								variant="outline"
								size="icon-sm"
								onClick={() => updateUrl(activeStatus, 1, pagination.pageSize)}
								disabled={!canPreviousPage || isPending}
								aria-label="Primeira página"
							>
								<RiArrowLeftDoubleLine className="size-4" />
							</Button>
							<Button
								variant="outline"
								size="icon-sm"
								onClick={() =>
									updateUrl(
										activeStatus,
										pagination.page - 1,
										pagination.pageSize,
									)
								}
								disabled={!canPreviousPage || isPending}
								aria-label="Página anterior"
							>
								<RiArrowLeftSLine className="size-4" />
							</Button>
							<Button
								variant="outline"
								size="icon-sm"
								onClick={() =>
									updateUrl(
										activeStatus,
										pagination.page + 1,
										pagination.pageSize,
									)
								}
								disabled={!canNextPage || isPending}
								aria-label="Próxima página"
							>
								<RiArrowRightSLine className="size-4" />
							</Button>
							<Button
								variant="outline"
								size="icon-sm"
								onClick={() =>
									updateUrl(
										activeStatus,
										pagination.totalPages,
										pagination.pageSize,
									)
								}
								disabled={!canNextPage || isPending}
								aria-label="Última página"
							>
								<RiArrowRightDoubleLine className="size-4" />
							</Button>
						</div>
					</div>
				</div>
			) : null}

			<TransactionDialog
				mode="create"
				open={processOpen}
				onOpenChange={handleProcessOpenChange}
				payerOptions={payerOptions}
				splitPayerOptions={splitPayerOptions}
				defaultPayerId={defaultPayerId}
				accountOptions={accountOptions}
				cardOptions={cardOptions}
				categoryOptions={categoryOptions}
				estabelecimentos={estabelecimentos}
				defaultPurchaseDate={defaultPurchaseDate}
				defaultName={defaultName}
				defaultAmount={defaultAmount}
				defaultCardId={matchedCartaoId}
				defaultPaymentMethod={matchedCartaoId ? "Cartão de crédito" : null}
				defaultTransactionType="Despesa"
				forceShowTransactionType
				onSuccess={handleLancamentoSuccess}
			/>

			<InboxDetailsDialog
				open={detailsOpen}
				onOpenChange={handleDetailsOpenChange}
				item={itemDetails}
				onProcess={handleProcessRequest}
			/>

			<ConfirmActionDialog
				open={discardOpen}
				onOpenChange={handleDiscardOpenChange}
				title="Descartar notificação?"
				description="A notificação será marcada como descartada e não aparecerá mais na lista de pendentes."
				confirmLabel="Descartar"
				confirmVariant="destructive"
				pendingLabel="Descartando..."
				onConfirm={handleDiscardConfirm}
			/>

			<ConfirmActionDialog
				open={deleteOpen}
				onOpenChange={handleDeleteOpenChange}
				title="Excluir notificação?"
				description="A notificação será excluída permanentemente."
				confirmLabel="Excluir"
				confirmVariant="destructive"
				pendingLabel="Excluindo..."
				onConfirm={handleDeleteConfirm}
			/>

			<ConfirmActionDialog
				open={restoreOpen}
				onOpenChange={handleRestoreOpenChange}
				title="Retornar para pendentes?"
				description="A notificação voltará para a lista de pendentes e poderá ser processada depois."
				confirmLabel="Retornar"
				pendingLabel="Retornando..."
				onConfirm={handleRestoreToPendingConfirm}
			/>

			<ConfirmActionDialog
				open={bulkDeleteOpen}
				onOpenChange={handleBulkDeleteOpenChange}
				title={`Limpar ${bulkDeleteStatus === "processed" ? "processados" : "descartados"}?`}
				description={`Todos os itens ${bulkDeleteStatus === "processed" ? "processados" : "descartados"} serão excluídos permanentemente.`}
				confirmLabel="Limpar tudo"
				confirmVariant="destructive"
				pendingLabel="Excluindo..."
				onConfirm={handleBulkDeleteConfirm}
			/>

			<ConfirmActionDialog
				open={selectionBulkOpen}
				onOpenChange={setSelectionBulkOpen}
				title={
					selectionBulkStatus === "pending"
						? "Descartar selecionados?"
						: "Excluir selecionados?"
				}
				description={
					selectionBulkStatus === "pending"
						? `${selectedIds.length} item(s) serão descartados.`
						: `${selectedIds.length} item(s) serão excluídos permanentemente.`
				}
				confirmLabel={
					selectionBulkStatus === "pending" ? "Descartar" : "Excluir"
				}
				confirmVariant="destructive"
				pendingLabel={
					selectionBulkStatus === "pending" ? "Descartando..." : "Excluindo..."
				}
				onConfirm={handleSelectionBulkConfirm}
			/>
		</>
	);
}
