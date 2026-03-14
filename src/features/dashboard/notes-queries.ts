import { and, eq } from "drizzle-orm";
import { notes } from "@/db/schema";
import { db } from "@/shared/lib/db";

export type DashboardTask = {
	id: string;
	text: string;
	completed: boolean;
};

export type DashboardNote = {
	id: string;
	title: string;
	description: string;
	type: "nota" | "tarefa";
	tasks?: DashboardTask[];
	archived: boolean;
	createdAt: string;
};

const parseTasks = (value: string | null): DashboardTask[] | undefined => {
	if (!value) {
		return undefined;
	}

	try {
		const parsed = JSON.parse(value);
		if (!Array.isArray(parsed)) {
			return undefined;
		}

		return parsed
			.filter((item): item is DashboardTask => {
				if (!item || typeof item !== "object") {
					return false;
				}
				const candidate = item as Partial<DashboardTask>;
				return (
					typeof candidate.id === "string" &&
					typeof candidate.text === "string" &&
					typeof candidate.completed === "boolean"
				);
			})
			.map((task) => ({
				id: task.id,
				text: task.text,
				completed: task.completed,
			}));
	} catch (error) {
		console.error("Failed to parse dashboard note tasks", error);
		return undefined;
	}
};

export async function fetchDashboardNotes(
	userId: string,
): Promise<DashboardNote[]> {
	const noteRows = await db.query.notes.findMany({
		where: and(eq(notes.userId, userId), eq(notes.archived, false)),
		orderBy: (note, { desc }) => [desc(note.createdAt)],
		limit: 5,
	});

	return noteRows.map((note) => ({
		id: note.id,
		title: (note.title ?? "").trim(),
		description: (note.description ?? "").trim(),
		type: (note.type ?? "nota") as "nota" | "tarefa",
		tasks: parseTasks(note.tasks),
		archived: note.archived,
		createdAt: note.createdAt.toISOString(),
	}));
}
