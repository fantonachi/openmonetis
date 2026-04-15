export const TRANSACTION_TYPES = [
	"Despesa",
	"Receita",
	"Transferência",
] as const;

export const TRANSACTION_CONDITIONS = [
	"À vista",
	"Parcelado",
	"Recorrente",
] as const;

export const PAYMENT_METHODS = [
	"Cartão de crédito",
	"Cartão de débito",
	"Pix",
	"Dinheiro",
	"Boleto",
	"Pré-Pago | VR/VA",
	"Transferência bancária",
] as const;

export const SETTLED_FILTER_VALUES = {
	PAID: "pago",
	UNPAID: "nao-pago",
} as const;

// Frequências de recorrência: value = número de meses entre cada meses
export const RECURRENCE_FREQUENCIES = [
	{ label: "Mensal", value: 1 },
	{ label: "Bimestral", value: 2 },
	{ label: "Trimestral", value: 3 },
	{ label: "Semestral", value: 6 },
	{ label: "Anual", value: 12 },
] as const;

export type RecurrenceFrequencyValue =
	(typeof RECURRENCE_FREQUENCIES)[number]["value"];
