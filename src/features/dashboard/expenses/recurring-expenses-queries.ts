import { and, desc, eq, isNull, or, sql } from "drizzle-orm";
import { transactions } from "@/db/schema";
import {
	ACCOUNT_AUTO_INVOICE_NOTE_PREFIX,
	INITIAL_BALANCE_NOTE,
} from "@/shared/lib/accounts/constants";
import { db } from "@/shared/lib/db";
import { getAdminPayerId } from "@/shared/lib/payers/get-admin-id";
import { safeToNumber as toNumber } from "@/shared/utils/number";

export type RecurringExpense = {
	id: string;
	name: string;
	amount: number;
	paymentMethod: string;
	recurrenceCount: number | null;
};

export type RecurringExpensesData = {
	expenses: RecurringExpense[];
};

export async function fetchRecurringExpenses(
	userId: string,
	period: string,
): Promise<RecurringExpensesData> {
	const adminPayerId = await getAdminPayerId(userId);
	if (!adminPayerId) {
		return { expenses: [] };
	}

	const results = await db
		.select({
			id: transactions.id,
			name: transactions.name,
			amount: transactions.amount,
			paymentMethod: transactions.paymentMethod,
			recurrenceCount: transactions.recurrenceCount,
		})
		.from(transactions)
		.where(
			and(
				eq(transactions.userId, userId),
				eq(transactions.period, period),
				eq(transactions.transactionType, "Despesa"),
				eq(transactions.condition, "Recorrente"),
				eq(transactions.payerId, adminPayerId),
				or(
					isNull(transactions.note),
					and(
						sql`${transactions.note} != ${INITIAL_BALANCE_NOTE}`,
						sql`${transactions.note} NOT LIKE ${`${ACCOUNT_AUTO_INVOICE_NOTE_PREFIX}%`}`,
					),
				),
			),
		)
		.orderBy(desc(transactions.purchaseDate), desc(transactions.createdAt));

	const expenses = results.map(
		(row): RecurringExpense => ({
			id: row.id,
			name: row.name,
			amount: Math.abs(toNumber(row.amount)),
			paymentMethod: row.paymentMethod,
			recurrenceCount: row.recurrenceCount,
		}),
	);

	return {
		expenses,
	};
}
