"use server";

import { randomUUID } from "node:crypto";
import { and, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { transactions } from "@/db/schema";
import { revalidateForEntity } from "@/shared/lib/actions/helpers";
import { getUser } from "@/shared/lib/auth/server";
import { db } from "@/shared/lib/db";
import { uuidSchema } from "@/shared/lib/schemas/common";
import { addMonthsToDate } from "@/shared/utils/date";
import { addMonthsToPeriod } from "@/shared/utils/period";

/**
 * Verifica se o período atual já tem registros para todas as séries com renovação automática
 * do usuário. Se não tiver, estende a série por mais 12 meses.
 * Chamada silenciosamente ao navegar para um novo período.
 */
export async function verificarEExtenderRenovacaoAutomatica(
	currentPeriod: string,
	shouldRevalidate = true,
): Promise<void> {
	const user = await getUser();

	// Busca séries com renovação automática do usuário
	const seriesAutoRenovacao = await db
		.select({
			seriesId: transactions.seriesId,
		})
		.from(transactions)
		.where(
			and(
				eq(transactions.userId, user.id),
				eq(transactions.isAutoRenewal, true),
			),
		)
		.groupBy(transactions.seriesId);

	for (const { seriesId } of seriesAutoRenovacao) {
		if (!seriesId) continue;

		// Verifica se já existe registro no período atual para esta série
		const registroNoPeriodo = await db.query.transactions.findFirst({
			columns: { id: true },
			where: and(
				eq(transactions.seriesId, seriesId),
				eq(transactions.userId, user.id),
				eq(transactions.period, currentPeriod),
			),
		});

		if (registroNoPeriodo) continue;

		// Período atual não tem registros — estender a série por mais 12 meses
		await extenderSerieAutoRenovacao(seriesId, user.id, shouldRevalidate);
	}
}

/**
 * Estende uma série com renovação automática por mais 12 meses a partir do último registro.
 */
async function extenderSerieAutoRenovacao(
	seriesId: string,
	userId: string,
	shouldRevalidate = true,
): Promise<void> {
	// Busca o último registro da série para usar como base
	const ultimoRegistro = await db.query.transactions.findFirst({
		where: and(
			eq(transactions.seriesId, seriesId),
			eq(transactions.userId, userId),
		),
		orderBy: desc(transactions.period),
	});

	if (!ultimoRegistro) return;

	const freq = ultimoRegistro.recurrenceFrequency ?? 1;
	const ultimoPeriod = ultimoRegistro.period;
	const ultimaPurchaseDate = ultimoRegistro.purchaseDate;

	const novosRegistros: (typeof transactions.$inferInsert)[] = [];

	for (let i = 1; i <= 12; i++) {
		const monthOffset = i * freq;
		const novoPeriod = addMonthsToPeriod(ultimoPeriod, monthOffset);
		const novaPurchaseDate =
			ultimaPurchaseDate !== null && ultimaPurchaseDate !== undefined
				? addMonthsToDate(ultimaPurchaseDate, monthOffset)
				: new Date();
		const novaDueDate = ultimoRegistro.dueDate
			? addMonthsToDate(ultimoRegistro.dueDate, monthOffset)
			: null;

		novosRegistros.push({
			id: randomUUID(),
			name: ultimoRegistro.name,
			transactionType: ultimoRegistro.transactionType,
			condition: ultimoRegistro.condition,
			paymentMethod: ultimoRegistro.paymentMethod,
			note: ultimoRegistro.note,
			amount: ultimoRegistro.amount,
			purchaseDate: novaPurchaseDate,
			period: novoPeriod,
			recurrenceCount: null,
			recurrenceFrequency: freq,
			isAutoRenewal: true,
			installmentCount: null,
			currentInstallment: null,
			isDivided: ultimoRegistro.isDivided,
			isSettled:
				ultimoRegistro.paymentMethod === "Cartão de crédito" ? null : false,
			dueDate: novaDueDate,
			boletoPaymentDate: null,
			userId,
			seriesId,
			accountId: ultimoRegistro.accountId,
			cardId: ultimoRegistro.cardId,
			categoryId: ultimoRegistro.categoryId,
			payerId: ultimoRegistro.payerId,
		});
	}

	if (novosRegistros.length > 0) {
		await db.insert(transactions).values(novosRegistros);
		if (shouldRevalidate) {
			revalidateForEntity("transactions", userId);
		}
	}
}

/**
 * Verifica se um período específico já tem registros de auto-renovação
 * (usado para extensão pontual ao navegar para meses futuros).
 */
export async function verificarPeriodoSemRegistros(
	period: string,
): Promise<boolean> {
	const user = await getUser();

	const resultado = await db.query.transactions.findFirst({
		columns: { id: true },
		where: and(
			eq(transactions.userId, user.id),
			eq(transactions.isAutoRenewal, true),
			sql`NOT EXISTS (
				SELECT 1 FROM lancamentos t2
				WHERE t2.series_id = lancamentos.series_id
				AND t2.periodo = ${period}
				AND t2.user_id = ${user.id}
			)`,
		),
	});

	return Boolean(resultado);
}

// ============================================================================
// Cancelar Renovação Automática
// ============================================================================

const cancelAutoRenewalSchema = z.object({
	id: uuidSchema("Lançamento"),
	mode: z.enum(["keepExisting", "deleteFuture"], {
		message: "Modo de cancelamento inválido.",
	}),
});

type CancelAutoRenewalInput = z.infer<typeof cancelAutoRenewalSchema>;

export async function cancelAutoRenewalAction(
	input: CancelAutoRenewalInput,
): Promise<{ success: boolean; error?: string; message?: string }> {
	try {
		const { id, mode } = cancelAutoRenewalSchema.parse(input);
		const user = await getUser();

		const existing = await db.query.transactions.findFirst({
			columns: { id: true, seriesId: true, period: true, isAutoRenewal: true },
			where: and(
				eq(transactions.id, id),
				eq(transactions.userId, user.id),
			),
		});

		if (!existing) {
			return { success: false, error: "Lançamento não encontrado." };
		}

		if (!existing.isAutoRenewal) {
			return {
				success: false,
				error: "Este lançamento não possui renovação automática.",
			};
		}

		if (!existing.seriesId) {
			return {
				success: false,
				error: "Este lançamento não faz parte de uma série.",
			};
		}

		if (mode === "deleteFuture") {
			await db
				.delete(transactions)
				.where(
					and(
						eq(transactions.seriesId, existing.seriesId),
						eq(transactions.userId, user.id),
						sql`${transactions.period} > ${existing.period}`,
						eq(transactions.isSettled, false),
					),
				);
		}

		await db
			.update(transactions)
			.set({ isAutoRenewal: false })
			.where(
				and(
					eq(transactions.seriesId, existing.seriesId),
					eq(transactions.userId, user.id),
				),
			);

		revalidateForEntity("transactions", user.id);

		return {
			success: true,
			message:
				mode === "deleteFuture"
					? "Renovação cancelada e lançamentos futuros removidos."
					: "Renovação automática cancelada.",
		};
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Erro ao cancelar renovação.";
		return { success: false, error: message };
	}
}
