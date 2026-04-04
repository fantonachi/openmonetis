import { and, eq, gt, isNull } from "drizzle-orm";
import { NextResponse } from "next/server";
import { apiTokens } from "@/db/schema";
import { extractBearerToken, verifyJwt } from "@/shared/lib/auth/api-token";
import { db } from "@/shared/lib/db";

export async function POST(request: Request) {
	try {
		// Extrair token do header
		const authHeader = request.headers.get("Authorization");
		const token = extractBearerToken(authHeader);

		if (!token) {
			return NextResponse.json(
				{ valid: false, error: "Token não fornecido" },
				{ status: 401 },
			);
		}

		// Verificar JWT (assinatura + expiração)
		const payload = verifyJwt(token);

		if (!payload || payload.type !== "api_access") {
			return NextResponse.json(
				{ valid: false, error: "Token inválido ou expirado" },
				{ status: 401 },
			);
		}

		// Buscar token no banco por tokenId para checar revogação
		const tokenRecord = await db.query.apiTokens.findFirst({
			where: and(
				eq(apiTokens.id, payload.tokenId),
				eq(apiTokens.userId, payload.sub),
				isNull(apiTokens.revokedAt),
				gt(apiTokens.expiresAt, new Date()),
			),
		});

		if (!tokenRecord) {
			return NextResponse.json(
				{ valid: false, error: "Token revogado ou não encontrado" },
				{ status: 401 },
			);
		}

		// Atualizar último uso
		const clientIp =
			request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
			request.headers.get("x-real-ip") ||
			null;

		await db
			.update(apiTokens)
			.set({
				lastUsedAt: new Date(),
				lastUsedIp: clientIp,
			})
			.where(eq(apiTokens.id, tokenRecord.id));

		return NextResponse.json({
			valid: true,
			userId: tokenRecord.userId,
			tokenId: tokenRecord.id,
			tokenName: tokenRecord.name,
		});
	} catch (error) {
		console.error("[API] Error verifying device token:", error);
		return NextResponse.json(
			{ valid: false, error: "Erro ao validar token" },
			{ status: 500 },
		);
	}
}
