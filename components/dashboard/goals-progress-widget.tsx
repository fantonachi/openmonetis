"use client";

import { RiFundsLine, RiPencilLine } from "@remixicon/react";
import { useCallback, useMemo, useState } from "react";
import { CategoryIconBadge } from "@/components/categorias/category-icon-badge";
import MoneyValues from "@/components/money-values";
import { BudgetDialog } from "@/components/orcamentos/budget-dialog";
import type { Budget, BudgetCategory } from "@/components/orcamentos/types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { GoalsProgressData } from "@/lib/dashboard/goals-progress";
import { WidgetEmptyState } from "../widget-empty-state";

type GoalsProgressWidgetProps = {
	data: GoalsProgressData;
};

const clamp = (value: number, min: number, max: number) =>
	Math.min(max, Math.max(min, value));

const formatPercentage = (value: number, withSign = false) =>
	`${new Intl.NumberFormat("pt-BR", {
		minimumFractionDigits: 0,
		maximumFractionDigits: 1,
		...(withSign ? { signDisplay: "always" as const } : {}),
	}).format(value)}%`;

export function GoalsProgressWidget({ data }: GoalsProgressWidgetProps) {
	const [editOpen, setEditOpen] = useState(false);
	const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);

	const categories = useMemo<BudgetCategory[]>(
		() =>
			data.categories.map((category) => ({
				id: category.id,
				name: category.name,
				icon: category.icon,
			})),
		[data.categories],
	);

	const defaultPeriod = data.items[0]?.period ?? "";

	const handleEdit = useCallback((item: GoalsProgressData["items"][number]) => {
		setSelectedBudget({
			id: item.id,
			amount: item.budgetAmount,
			spent: item.spentAmount,
			period: item.period,
			createdAt: item.createdAt,
			category: item.categoryId
				? {
						id: item.categoryId,
						name: item.categoryName,
						icon: item.categoryIcon,
					}
				: null,
		});
		setEditOpen(true);
	}, []);

	const handleEditOpenChange = useCallback((open: boolean) => {
		setEditOpen(open);
		if (!open) {
			setSelectedBudget(null);
		}
	}, []);

	if (data.items.length === 0) {
		return (
			<WidgetEmptyState
				icon={<RiFundsLine className="size-6 text-muted-foreground" />}
				title="Nenhum orçamento para o período"
				description="Cadastre orçamentos para acompanhar o progresso das metas."
			/>
		);
	}

	return (
		<div className="flex flex-col gap-4 px-0">
			<ul className="flex flex-col">
				{data.items.map((item, index) => {
					const statusColor =
						item.status === "exceeded" ? "text-destructive" : "";
					const progressValue = clamp(item.usedPercentage, 0, 100);
					const percentageDelta = item.usedPercentage - 100;

					return (
						<li
							key={item.id}
							className="border-b border-dashed py-2 last:border-b-0 last:pb-0"
						>
							<div className="flex items-start justify-between gap-3">
								<div className="flex min-w-0 flex-1 items-start gap-2">
									<CategoryIconBadge
										icon={item.categoryIcon}
										name={item.categoryName}
										colorIndex={index}
										size="md"
									/>
									<div className="min-w-0 flex-1">
										<p className="truncate text-sm font-medium text-foreground">
											{item.categoryName}
										</p>
										<p className="mt-0.5 text-xs text-muted-foreground">
											<MoneyValues amount={item.spentAmount} /> de{" "}
											<MoneyValues amount={item.budgetAmount} />
										</p>
									</div>
								</div>

								<div className="flex shrink-0 items-center gap-2">
									<span className={`text-xs font-medium ${statusColor}`}>
										{formatPercentage(percentageDelta, true)}
									</span>
									<Button
										type="button"
										variant="ghost"
										size="icon-sm"
										className="size-7 text-muted-foreground hover:text-foreground"
										onClick={() => handleEdit(item)}
										aria-label={`Editar orçamento de ${item.categoryName}`}
									>
										<RiPencilLine className="size-3.5" />
									</Button>
								</div>
							</div>
							<div className="mt-1.5 ml-11">
								<Progress value={progressValue} />
							</div>
						</li>
					);
				})}
			</ul>

			<BudgetDialog
				mode="update"
				budget={selectedBudget ?? undefined}
				categories={categories}
				defaultPeriod={defaultPeriod}
				open={editOpen && !!selectedBudget}
				onOpenChange={handleEditOpenChange}
			/>
		</div>
	);
}
