"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getUser } from "@/shared/lib/auth/server";
import { db, schema } from "@/shared/lib/db";

export type WidgetPreferences = {
	order: string[];
	hidden: string[];
};

export async function updateWidgetPreferences(
	preferences: WidgetPreferences,
): Promise<{ success: boolean; error?: string }> {
	try {
		const user = await getUser();

		// Check if preferences exist
		const existing = await db
			.select({ id: schema.userPreferences.id })
			.from(schema.userPreferences)
			.where(eq(schema.userPreferences.userId, user.id))
			.limit(1);

		if (existing.length > 0) {
			await db
				.update(schema.userPreferences)
				.set({
					dashboardWidgets: preferences,
					updatedAt: new Date(),
				})
				.where(eq(schema.userPreferences.userId, user.id));
		} else {
			await db.insert(schema.userPreferences).values({
				userId: user.id,
				dashboardWidgets: preferences,
			});
		}

		revalidatePath("/dashboard");
		return { success: true };
	} catch (error) {
		console.error("Error updating widget preferences:", error);
		return { success: false, error: "Erro ao salvar preferências" };
	}
}

export async function resetWidgetPreferences(): Promise<{
	success: boolean;
	error?: string;
}> {
	try {
		const user = await getUser();

		await db
			.update(schema.userPreferences)
			.set({
				dashboardWidgets: null,
				updatedAt: new Date(),
			})
			.where(eq(schema.userPreferences.userId, user.id));

		revalidatePath("/dashboard");
		return { success: true };
	} catch (error) {
		console.error("Error resetting widget preferences:", error);
		return { success: false, error: "Erro ao resetar preferências" };
	}
}
