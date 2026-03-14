"use server";

import { and, asc, eq } from "drizzle-orm";
import { transactions } from "@/db/schema";
import { db } from "@/shared/lib/db";
import { getAdminPayerId } from "@/shared/lib/payers/get-admin-id";
import { toDateOnlyString } from "@/shared/utils/date";
import { safeToNumber as toNumber } from "@/shared/utils/number";

const PAYMENT_METHOD_BOLETO = "Boleto";

type RawDashboardBill = {
	id: string;
	name: string;
	amount: string | number | null;
	dueDate: string | Date | null;
	boletoPaymentDate: string | Date | null;
	isSettled: boolean | null;
};

export type DashboardBill = {
	id: string;
	name: string;
	amount: number;
	dueDate: string | null;
	boletoPaymentDate: string | null;
	isSettled: boolean;
};

export type DashboardBillsSnapshot = {
	bills: DashboardBill[];
	totalPendingAmount: number;
	pendingCount: number;
};

export async function fetchDashboardBills(
	userId: string,
	period: string,
): Promise<DashboardBillsSnapshot> {
	const adminPayerId = await getAdminPayerId(userId);
	if (!adminPayerId) {
		return { bills: [], totalPendingAmount: 0, pendingCount: 0 };
	}

	const rows = await db
		.select({
			id: transactions.id,
			name: transactions.name,
			amount: transactions.amount,
			dueDate: transactions.dueDate,
			boletoPaymentDate: transactions.boletoPaymentDate,
			isSettled: transactions.isSettled,
		})
		.from(transactions)
		.where(
			and(
				eq(transactions.userId, userId),
				eq(transactions.period, period),
				eq(transactions.paymentMethod, PAYMENT_METHOD_BOLETO),
				eq(transactions.payerId, adminPayerId),
			),
		)
		.orderBy(
			asc(transactions.isSettled),
			asc(transactions.dueDate),
			asc(transactions.name),
		);

	const bills = rows.map((row: RawDashboardBill): DashboardBill => {
		const amount = Math.abs(toNumber(row.amount));
		return {
			id: row.id,
			name: row.name,
			amount,
			dueDate: toDateOnlyString(row.dueDate),
			boletoPaymentDate: toDateOnlyString(row.boletoPaymentDate),
			isSettled: Boolean(row.isSettled),
		};
	});

	let totalPendingAmount = 0;
	let pendingCount = 0;

	for (const bill of bills) {
		if (!bill.isSettled) {
			totalPendingAmount += bill.amount;
			pendingCount += 1;
		}
	}

	return {
		bills,
		totalPendingAmount,
		pendingCount,
	};
}
