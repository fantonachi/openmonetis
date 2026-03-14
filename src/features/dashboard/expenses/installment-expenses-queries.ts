import { and, desc, eq, isNull, or, sql } from "drizzle-orm";
import { transactions } from "@/db/schema";
import {
	ACCOUNT_AUTO_INVOICE_NOTE_PREFIX,
	INITIAL_BALANCE_NOTE,
} from "@/shared/lib/accounts/constants";
import { db } from "@/shared/lib/db";
import { getAdminPayerId } from "@/shared/lib/payers/get-admin-id";
import { safeToNumber as toNumber } from "@/shared/utils/number";

export type InstallmentExpense = {
	id: string;
	name: string;
	amount: number;
	paymentMethod: string;
	currentInstallment: number | null;
	installmentCount: number | null;
	dueDate: Date | null;
	purchaseDate: Date;
	period: string;
};

export type InstallmentExpensesData = {
	expenses: InstallmentExpense[];
};

export async function fetchInstallmentExpenses(
	userId: string,
	period: string,
): Promise<InstallmentExpensesData> {
	const adminPayerId = await getAdminPayerId(userId);
	if (!adminPayerId) {
		return { expenses: [] };
	}

	const rows = await db
		.select({
			id: transactions.id,
			name: transactions.name,
			amount: transactions.amount,
			paymentMethod: transactions.paymentMethod,
			currentInstallment: transactions.currentInstallment,
			installmentCount: transactions.installmentCount,
			dueDate: transactions.dueDate,
			purchaseDate: transactions.purchaseDate,
			period: transactions.period,
		})
		.from(transactions)
		.where(
			and(
				eq(transactions.userId, userId),
				eq(transactions.period, period),
				eq(transactions.transactionType, "Despesa"),
				eq(transactions.condition, "Parcelado"),
				eq(transactions.isAnticipated, false),
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

	type InstallmentExpenseRow = (typeof rows)[number];

	const expenses = rows
		.map(
			(row: InstallmentExpenseRow): InstallmentExpense => ({
				id: row.id,
				name: row.name,
				amount: Math.abs(toNumber(row.amount)),
				paymentMethod: row.paymentMethod,
				currentInstallment: row.currentInstallment,
				installmentCount: row.installmentCount,
				dueDate: row.dueDate ?? null,
				purchaseDate: row.purchaseDate,
				period: row.period,
			}),
		)
		.sort((a: InstallmentExpense, b: InstallmentExpense) => {
			// Calcula parcelas restantes para cada item
			const remainingA =
				a.installmentCount && a.currentInstallment
					? a.installmentCount - a.currentInstallment
					: 0;
			const remainingB =
				b.installmentCount && b.currentInstallment
					? b.installmentCount - b.currentInstallment
					: 0;

			// Ordena do menor número de parcelas restantes para o maior
			return remainingA - remainingB;
		});

	return { expenses };
}
