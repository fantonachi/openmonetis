"use client";

import {
	RiArrowGoBackLine,
	RiCheckLine,
	RiDeleteBinLine,
	RiFileList2Line,
} from "@remixicon/react";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import Image from "next/image";
import MoneyValues from "@/shared/components/money-values";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { resolveLogoSrc } from "@/shared/lib/logo";
import type { InboxItem } from "./types";

// O timestamp vem do app Android em horário local mas salvo como UTC.
// Adicionamos o offset de Brasília para corrigir o cálculo de "há X tempo".
const BRASILIA_OFFSET_MS = 3 * 60 * 60 * 1000;

function adjustToBrasilia(date: Date): Date {
	return new Date(date.getTime() + BRASILIA_OFFSET_MS);
}

function findMatchingLogo(
	sourceAppName: string | null,
	appLogoMap: Record<string, string>,
): string | null {
	if (!sourceAppName) return null;

	const appName = sourceAppName.toLowerCase();

	if (appLogoMap[appName]) return resolveLogoSrc(appLogoMap[appName]);

	for (const [name, logo] of Object.entries(appLogoMap)) {
		if (name.includes(appName) || appName.includes(name)) {
			return resolveLogoSrc(logo);
		}
	}

	return null;
}

interface InboxCardProps {
	item: InboxItem;
	readonly?: boolean;
	appLogoMap?: Record<string, string>;
	onProcess?: (item: InboxItem) => void;
	onDiscard?: (item: InboxItem) => void;
	onViewDetails?: (item: InboxItem) => void;
	onDelete?: (item: InboxItem) => void;
	onRestoreToPending?: (item: InboxItem) => void | Promise<void>;
	selected?: boolean;
	onSelectToggle?: (id: string) => void;
}

export function InboxCard({
	item,
	readonly,
	appLogoMap,
	onProcess,
	onDiscard,
	onViewDetails,
	onDelete,
	onRestoreToPending,
	selected,
	onSelectToggle,
}: InboxCardProps) {
	const matchedLogo = appLogoMap
		? findMatchingLogo(item.sourceAppName, appLogoMap)
		: null;

	const amount = item.parsedAmount ? parseFloat(item.parsedAmount) : null;

	const rawDate = new Date(item.notificationTimestamp);
	const notificationDate = adjustToBrasilia(rawDate);

	const timeAgo = formatDistanceToNow(notificationDate, {
		addSuffix: true,
		locale: ptBR,
	});

	const statusDate =
		item.status === "processed"
			? item.processedAt
			: item.status === "discarded"
				? item.discardedAt
				: null;

	const formattedStatusDate = statusDate
		? format(new Date(statusDate), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
		: null;

	return (
		<Card
			className={`flex h-54 flex-col gap-0 py-0 transition-colors ${selected ? "ring-2 ring-primary" : ""}`}
		>
			<CardHeader className="pt-4">
				<div className="flex items-center justify-between gap-2">
					<CardTitle className="flex min-w-0 items-center gap-1.5 text-sm">
						{matchedLogo && (
							<Image
								src={matchedLogo}
								alt=""
								width={24}
								height={24}
								className="shrink-0 rounded-full"
							/>
						)}
						<span className="truncate">
							{item.sourceAppName || item.sourceApp}
						</span>
						<span className="shrink-0 text-xs font-normal text-muted-foreground">
							{timeAgo}
						</span>
					</CardTitle>
					{amount !== null && (
						<MoneyValues amount={amount} className="shrink-0 text-sm" />
					)}
				</div>
			</CardHeader>

			<CardContent className="flex-1 py-2">
				{item.originalTitle && (
					<p className="mb-1 text-sm font-bold">{item.originalTitle}</p>
				)}
				<p className="line-clamp-4 whitespace-pre-wrap text-sm text-muted-foreground">
					{item.originalText}
				</p>
			</CardContent>

			{readonly ? (
				<CardFooter className="gap-2 pb-4 pt-3">
					<Badge
						variant={item.status === "processed" ? "default" : "secondary"}
					>
						{item.status === "processed" ? "Processado" : "Descartado"}
					</Badge>
					{formattedStatusDate && (
						<span className="text-xs text-muted-foreground">
							{formattedStatusDate}
						</span>
					)}
					<div className="ml-auto flex items-center gap-2">
						{item.status === "discarded" && onRestoreToPending && (
							<Button
								variant="ghost"
								size="icon-sm"
								className="text-muted-foreground hover:text-foreground"
								onClick={() => onRestoreToPending(item)}
								aria-label="Voltar para pendente"
								title="Voltar para pendente"
							>
								<RiArrowGoBackLine className="size-4" />
							</Button>
						)}
						{onDelete && (
							<Button
								variant="ghost"
								size="icon-sm"
								className="text-muted-foreground hover:text-destructive"
								onClick={() => onDelete(item)}
								aria-label="Excluir notificação"
							>
								<RiDeleteBinLine className="size-4" />
							</Button>
						)}
						{onSelectToggle && (
							<Checkbox
								checked={!!selected}
								onCheckedChange={() => onSelectToggle(item.id)}
								aria-label="Selecionar item"
							/>
						)}
					</div>
				</CardFooter>
			) : (
				<CardFooter className="gap-2 pb-4 pt-3">
					<Button
						size="sm"
						className="flex-1"
						onClick={() => onProcess?.(item)}
					>
						<RiCheckLine className="mr-1.5 size-4" />
						Processar
					</Button>
					<Button
						size="icon-sm"
						variant="ghost"
						onClick={() => onViewDetails?.(item)}
						className="text-muted-foreground hover:text-foreground"
						aria-label="Ver detalhes"
						title="Ver detalhes"
					>
						<RiFileList2Line className="size-4" />
					</Button>
					<Button
						size="icon-sm"
						variant="ghost"
						onClick={() => onDiscard?.(item)}
						className="text-muted-foreground hover:text-destructive"
						aria-label="Descartar notificação"
						title="Descartar notificação"
					>
						<RiDeleteBinLine className="size-4" />
					</Button>
					{onSelectToggle && (
						<Checkbox
							checked={!!selected}
							onCheckedChange={() => onSelectToggle(item.id)}
							aria-label="Selecionar item"
						/>
					)}
				</CardFooter>
			)}
		</Card>
	);
}
