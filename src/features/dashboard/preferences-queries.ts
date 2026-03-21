import { eq } from "drizzle-orm";
import type { WidgetPreferences } from "@/features/dashboard/widgets/actions";
import { db, schema } from "@/shared/lib/db";

export interface UserDashboardPreferences {
	dashboardWidgets: WidgetPreferences | null;
}

export async function fetchUserDashboardPreferences(
	userId: string,
): Promise<UserDashboardPreferences> {
	const result = await db
		.select({
			dashboardWidgets: schema.userPreferences.dashboardWidgets,
		})
		.from(schema.userPreferences)
		.where(eq(schema.userPreferences.userId, userId))
		.limit(1);

	return {
		dashboardWidgets: result[0]?.dashboardWidgets ?? null,
	};
}
