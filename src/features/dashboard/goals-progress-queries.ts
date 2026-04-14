import { and, eq, ne, or, sql } from "drizzle-orm";
import { budgets, categories, transactions } from "@/db/schema";
import { db } from "@/shared/lib/db";
import { getAdminPayerId } from "@/shared/lib/payers/get-admin-id";
import { safeToNumber as toNumber } from "@/shared/utils/number";

const BUDGET_CRITICAL_THRESHOLD = 80;

export type GoalProgressStatus = "on-track" | "critical" | "exceeded";

export type GoalProgressItem = {
	id: string;
	categoryId: string | null;
	categoryName: string;
	categoryIcon: string | null;
	period: string;
	createdAt: string;
	budgetAmount: number;
	spentAmount: number;
	usedPercentage: number;
	status: GoalProgressStatus;
};

export type GoalProgressCategory = {
	id: string;
	name: string;
	icon: string | null;
};

export type GoalsProgressData = {
	items: GoalProgressItem[];
	categories: GoalProgressCategory[];
	totalBudgets: number;
	exceededCount: number;
	criticalCount: number;
};

const resolveStatus = (usedPercentage: number): GoalProgressStatus => {
	if (usedPercentage >= 100) {
		return "exceeded";
	}
	if (usedPercentage >= BUDGET_CRITICAL_THRESHOLD) {
		return "critical";
	}
	return "on-track";
};

export async function fetchGoalsProgressData(
	userId: string,
	period: string,
): Promise<GoalsProgressData> {
	const adminPayerId = await getAdminPayerId(userId);

	if (!adminPayerId) {
		return {
			items: [],
			categories: [],
			totalBudgets: 0,
			exceededCount: 0,
			criticalCount: 0,
		};
	}

	const [rows, categoryRows] = await Promise.all([
		db
			.select({
				orcamentoId: budgets.id,
				categoryId: categories.id,
				categoryName: categories.name,
				categoryIcon: categories.icon,
				period: budgets.period,
				createdAt: budgets.createdAt,
				budgetAmount: budgets.amount,
				spentAmount: sql<number>`COALESCE(SUM(ABS(${transactions.amount})), 0)`,
			})
			.from(budgets)
			.innerJoin(categories, eq(budgets.categoryId, categories.id))
			.leftJoin(
				transactions,
				and(
					eq(transactions.categoryId, budgets.categoryId),
					eq(transactions.userId, budgets.userId),
					eq(transactions.period, budgets.period),
					or(
						eq(transactions.isDivided, false),
						eq(transactions.payerId, adminPayerId),
					),
					eq(transactions.transactionType, "Despesa"),
					ne(transactions.condition, "cancelado"),
				),
			)
			.where(and(eq(budgets.userId, userId), eq(budgets.period, period)))
			.groupBy(
				budgets.id,
				categories.id,
				categories.name,
				categories.icon,
				budgets.period,
				budgets.createdAt,
				budgets.amount,
			),
		db.query.categories.findMany({
			where: and(eq(categories.userId, userId), eq(categories.type, "despesa")),
			orderBy: (category, { asc }) => [asc(category.name)],
		}),
	]);

	const categoryList: GoalProgressCategory[] = categoryRows.map((category) => ({
		id: category.id,
		name: category.name,
		icon: category.icon,
	}));

	const items: GoalProgressItem[] = rows
		.map((row) => {
			const budgetAmount = toNumber(row.budgetAmount);
			const spentAmount = toNumber(row.spentAmount);
			const usedPercentage =
				budgetAmount > 0 ? (spentAmount / budgetAmount) * 100 : 0;

			return {
				id: row.orcamentoId,
				categoryId: row.categoryId,
				categoryName: row.categoryName,
				categoryIcon: row.categoryIcon,
				period: row.period,
				createdAt: row.createdAt.toISOString(),
				budgetAmount,
				spentAmount,
				usedPercentage,
				status: resolveStatus(usedPercentage),
			};
		})
		.sort((a, b) => b.usedPercentage - a.usedPercentage);

	const exceededCount = items.filter(
		(item) => item.status === "exceeded",
	).length;
	const criticalCount = items.filter(
		(item) => item.status === "critical",
	).length;

	return {
		items,
		categories: categoryList,
		totalBudgets: items.length,
		exceededCount,
		criticalCount,
	};
}
