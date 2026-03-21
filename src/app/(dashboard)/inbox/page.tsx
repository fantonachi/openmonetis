import { InboxPage } from "@/features/inbox/components/inbox-page";
import {
	type ResolvedInboxSearchParams,
	resolveInboxPagination,
	resolveInboxStatus,
} from "@/features/inbox/page-helpers";
import {
	fetchAppLogoMap,
	fetchInboxDialogData,
	fetchInboxItemsPage,
	fetchInboxStatusCounts,
} from "@/features/inbox/queries";
import { getUserId } from "@/shared/lib/auth/server";

type PageSearchParams = Promise<ResolvedInboxSearchParams>;

type PageProps = {
	searchParams?: PageSearchParams;
};

const EMPTY_DIALOG_DATA = {
	payerOptions: [],
	splitPayerOptions: [],
	defaultPayerId: null,
	accountOptions: [],
	cardOptions: [],
	categoryOptions: [],
	estabelecimentos: [],
};

export default async function Page({ searchParams }: PageProps) {
	const userId = await getUserId();
	const resolvedSearchParams = searchParams ? await searchParams : undefined;
	const activeStatus = resolveInboxStatus(resolvedSearchParams);
	const paginationInput = resolveInboxPagination(resolvedSearchParams);

	const [itemsPage, counts, dialogData, appLogoMap] = await Promise.all([
		fetchInboxItemsPage(userId, activeStatus, paginationInput),
		fetchInboxStatusCounts(userId),
		activeStatus === "pending"
			? fetchInboxDialogData(userId)
			: Promise.resolve(EMPTY_DIALOG_DATA),
		fetchAppLogoMap(userId),
	]);

	return (
		<main className="flex flex-col items-start gap-6">
			<InboxPage
				activeStatus={activeStatus}
				items={itemsPage.items}
				counts={counts}
				pagination={itemsPage.pagination}
				payerOptions={dialogData.payerOptions}
				splitPayerOptions={dialogData.splitPayerOptions}
				defaultPayerId={dialogData.defaultPayerId}
				accountOptions={dialogData.accountOptions}
				cardOptions={dialogData.cardOptions}
				categoryOptions={dialogData.categoryOptions}
				estabelecimentos={dialogData.estabelecimentos}
				appLogoMap={appLogoMap}
			/>
		</main>
	);
}
