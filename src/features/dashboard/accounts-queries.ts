import { and, eq, sql } from "drizzle-orm";
import { financialAccounts, payers, transactions } from "@/db/schema";
import { INITIAL_BALANCE_NOTE } from "@/shared/lib/accounts/constants";
import { db } from "@/shared/lib/db";
import { PAYER_ROLE_ADMIN } from "@/shared/lib/payers/constants";
import { safeToNumber as toNumber } from "@/shared/utils/number";

type RawDashboardAccount = {
	id: string;
	name: string;
	accountType: string;
	status: string;
	logo: string | null;
	initialBalance: string | number | null;
	balanceMovements: unknown;
};

export type DashboardAccount = {
	id: string;
	name: string;
	accountType: string;
	status: string;
	logo: string | null;
	initialBalance: number;
	balance: number;
	excludeFromBalance: boolean;
};

export type DashboardAccountsSnapshot = {
	totalBalance: number;
	accounts: DashboardAccount[];
};

export async function fetchDashboardAccounts(
	userId: string,
): Promise<DashboardAccountsSnapshot> {
	const rows = await db
		.select({
			id: financialAccounts.id,
			name: financialAccounts.name,
			accountType: financialAccounts.accountType,
			status: financialAccounts.status,
			logo: financialAccounts.logo,
			initialBalance: financialAccounts.initialBalance,
			excludeFromBalance: financialAccounts.excludeFromBalance,
			balanceMovements: sql<number>`
        coalesce(
          sum(
            case
              when ${transactions.note} = ${INITIAL_BALANCE_NOTE} then 0
              else ${transactions.amount}
            end
          ),
          0
        )
      `,
		})
		.from(financialAccounts)
		.leftJoin(
			transactions,
			and(
				eq(transactions.accountId, financialAccounts.id),
				eq(transactions.userId, userId),
				eq(transactions.isSettled, true),
			),
		)
		.leftJoin(payers, eq(transactions.payerId, payers.id))
		.where(
			and(
				eq(financialAccounts.userId, userId),
				sql`(${transactions.id} IS NULL OR ${payers.role} = ${PAYER_ROLE_ADMIN})`,
			),
		)
		.groupBy(
			financialAccounts.id,
			financialAccounts.name,
			financialAccounts.accountType,
			financialAccounts.status,
			financialAccounts.logo,
			financialAccounts.initialBalance,
			financialAccounts.excludeFromBalance,
		);

	const accounts = rows
		.map(
			(
				row: RawDashboardAccount & { excludeFromBalance: boolean },
			): DashboardAccount => {
				const initialBalance = toNumber(row.initialBalance);
				const balanceMovements = toNumber(row.balanceMovements);

				return {
					id: row.id,
					name: row.name,
					accountType: row.accountType,
					status: row.status,
					logo: row.logo,
					initialBalance,
					balance: initialBalance + balanceMovements,
					excludeFromBalance: row.excludeFromBalance,
				};
			},
		)
		.sort((a, b) => b.balance - a.balance);

	const totalBalance = accounts
		.filter((account) => !account.excludeFromBalance)
		.reduce((total, account) => total + account.balance, 0);

	return {
		totalBalance,
		accounts,
	};
}
