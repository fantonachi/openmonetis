"use client";

import {
	RECURRENCE_FREQUENCIES,
	TRANSACTION_CONDITIONS,
} from "@/features/transactions/constants";
import { Label } from "@/shared/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/components/ui/select";
import { Switch } from "@/shared/components/ui/switch";
import { formatCurrency } from "@/shared/utils/currency";
import { cn } from "@/shared/utils/ui";
import { ConditionSelectContent } from "../../select-items";
import type { ConditionSectionProps } from "./transaction-dialog-types";

export function ConditionSection({
	formState,
	onFieldChange,
	showInstallments,
	showRecurrence,
}: ConditionSectionProps) {
	const parsedAmount = Number(formState.amount);
	const amount =
		Number.isNaN(parsedAmount) || parsedAmount <= 0 ? null : parsedAmount;

	const getInstallmentLabel = (count: number) => {
		if (amount) {
			const installmentValue = amount / count;
			return `${count}x de R$ ${formatCurrency(installmentValue)}`;
		}

		return `${count}x`;
	};

	const installmentCount = Number(formState.installmentCount);
	const installmentSummary =
		showInstallments &&
		formState.installmentCount &&
		amount &&
		!Number.isNaN(installmentCount) &&
		installmentCount > 0
			? getInstallmentLabel(installmentCount)
			: null;

	const currentFrequencyLabel =
		RECURRENCE_FREQUENCIES.find(
			(f) => String(f.value) === formState.recurrenceFrequency,
		)?.label ?? "Mensal";

	return (
		<div className="flex w-full flex-col gap-4">
			{/* Condição Principal */}
			<div className="space-y-1.5 w-full">
				<Label htmlFor="condition" className="text-xs font-medium">
					Condição de pagamento
				</Label>
				<Select
					value={formState.condition}
					onValueChange={(value) => onFieldChange("condition", value)}
				>
					<SelectTrigger id="condition" className="w-full">
						<SelectValue placeholder="Selecione">
							{formState.condition && (
								<ConditionSelectContent label={formState.condition} />
							)}
						</SelectValue>
					</SelectTrigger>
					<SelectContent>
						{TRANSACTION_CONDITIONS.map((condition) => (
							<SelectItem key={condition} value={condition}>
								<ConditionSelectContent label={condition} />
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Detalhes de Parcelamento */}
			{showInstallments && (
				<div className="space-y-1.5 w-full animate-in fade-in slide-in-from-top-2 duration-300">
					<Label htmlFor="installmentCount" className="text-xs font-medium">
						Número de parcelas
					</Label>
					<Select
						value={formState.installmentCount}
						onValueChange={(value) => onFieldChange("installmentCount", value)}
					>
						<SelectTrigger id="installmentCount" className="w-full">
							<SelectValue placeholder="Selecione">
								{installmentSummary}
							</SelectValue>
						</SelectTrigger>
						<SelectContent>
							{[...Array(24)].map((_, index) => {
								const count = index + 2;
								return (
									<SelectItem key={count} value={String(count)}>
										{getInstallmentLabel(count)}
									</SelectItem>
								);
							})}
						</SelectContent>
					</Select>
				</div>
			)}

			{/* Detalhes de Recorrência */}
			{showRecurrence && (
				<div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						{/* Seletor de frequência */}
						<div className="space-y-1.5 w-full">
							<Label htmlFor="recurrenceFrequency" className="text-xs font-medium">
								Frequência
							</Label>
							<Select
								value={formState.recurrenceFrequency}
								onValueChange={(value) =>
									onFieldChange("recurrenceFrequency", value)
								}
							>
								<SelectTrigger id="recurrenceFrequency" className="w-full">
									<SelectValue placeholder="Mensal">
										{currentFrequencyLabel}
									</SelectValue>
								</SelectTrigger>
								<SelectContent>
									{RECURRENCE_FREQUENCIES.map((freq) => (
										<SelectItem key={freq.value} value={String(freq.value)}>
											{freq.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Contador de meses — só aparece quando SEM renovação automática */}
						{!formState.isAutoRenewal && (
							<div className="space-y-1.5 w-full animate-in fade-in zoom-in-95 duration-200">
								<Label htmlFor="recurrenceCount" className="text-xs font-medium">
									Repetirá por
								</Label>
								<Select
									value={formState.recurrenceCount}
									onValueChange={(value) =>
										onFieldChange("recurrenceCount", value)
									}
								>
									<SelectTrigger id="recurrenceCount" className="w-full">
										<SelectValue placeholder="Selecione">
											{formState.recurrenceCount
												? `${formState.recurrenceCount} ${Number(formState.recurrenceCount) === 1 ? "meses" : "meses"}`
												: null}
										</SelectValue>
									</SelectTrigger>
									<SelectContent>
										{[...Array(47)].map((_, index) => (
											<SelectItem key={index + 2} value={String(index + 2)}>
												{index + 2} {index + 2 === 1 ? "meses" : "meses"}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						)}
					</div>

					{/* Toggle de renovação automática */}
					<div className="flex items-center justify-between rounded-lg border border-border/40 bg-muted/30 px-3 py-2.5 transition-all hover:bg-muted/50">
						<div className="space-y-0.5">
							<Label
								htmlFor="isAutoRenewal"
								className="text-sm font-medium cursor-pointer"
							>
								Renovação automática
							</Label>
							<p className="text-[11px] text-muted-foreground leading-tight">
								{formState.isAutoRenewal
									? "Renova o ciclo de 12 meses automaticamente"
									: "Gerar apenas a quantidade de meses acima"}
							</p>
						</div>
						<Switch
							id="isAutoRenewal"
							checked={formState.isAutoRenewal}
							onCheckedChange={(checked) => onFieldChange("isAutoRenewal", checked)}
						/>
					</div>
				</div>
			)}
		</div>
	);
}
