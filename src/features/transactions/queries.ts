import { and, desc, eq, gte, isNull, ne, or, type SQL } from "drizzle-orm";
import {
	cards,
	categories,
	financialAccounts,
	payers,
	transactions,
} from "@/db/schema";
import { INITIAL_BALANCE_NOTE } from "@/shared/lib/accounts/constants";
import { db } from "@/shared/lib/db";

export async function fetchTransactionFilterSources(userId: string) {
	const [payerRows, accountRows, cardRows, categoryRows] = await Promise.all([
		db.query.payers.findMany({
			where: eq(payers.userId, userId),
		}),
		db.query.financialAccounts.findMany({
			where: and(
				eq(financialAccounts.userId, userId),
				eq(financialAccounts.status, "Ativa"),
			),
		}),
		db.query.cards.findMany({
			where: and(eq(cards.userId, userId), eq(cards.status, "Ativo")),
		}),
		db.query.categories.findMany({
			where: eq(categories.userId, userId),
		}),
	]);

	return { payerRows, accountRows, cardRows, categoryRows };
}

export async function fetchTransactions(filters: SQL[]) {
	const transactionRows = await db
		.select({
			transaction: transactions,
			payer: payers,
			financialAccount: financialAccounts,
			card: cards,
			category: categories,
		})
		.from(transactions)
		.leftJoin(payers, eq(transactions.payerId, payers.id))
		.leftJoin(
			financialAccounts,
			eq(transactions.accountId, financialAccounts.id),
		)
		.leftJoin(cards, eq(transactions.cardId, cards.id))
		.leftJoin(categories, eq(transactions.categoryId, categories.id))
		.where(
			and(
				...filters,
				// Excluir saldos iniciais de financialAccounts que têm excludeInitialBalanceFromIncome = true
				or(
					ne(transactions.note, INITIAL_BALANCE_NOTE),
					isNull(financialAccounts.excludeInitialBalanceFromIncome),
					eq(financialAccounts.excludeInitialBalanceFromIncome, false),
				),
			),
		)
		.orderBy(desc(transactions.purchaseDate), desc(transactions.createdAt));

	// Transformar resultado para o formato esperado
	return transactionRows.map((row) => ({
		...row.transaction,
		payer: row.payer,
		financialAccount: row.financialAccount,
		card: row.card,
		category: row.category,
	}));
}

export async function fetchRecentEstablishments(
	userId: string,
): Promise<string[]> {
	const threeMonthsAgo = new Date();
	threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

	const results = await db
		.select({ name: transactions.name })
		.from(transactions)
		.where(
			and(
				eq(transactions.userId, userId),
				gte(transactions.purchaseDate, threeMonthsAgo),
			),
		)
		.orderBy(desc(transactions.purchaseDate));

	const uniqueNames = Array.from(
		new Set<string>(
			results
				.map((row) => row.name)
				.filter(
					(name: string | null): name is string =>
						name != null &&
						name.trim().length > 0 &&
						!name.toLowerCase().startsWith("pagamento fatura"),
				),
		),
	);

	return uniqueNames.slice(0, 100);
}
