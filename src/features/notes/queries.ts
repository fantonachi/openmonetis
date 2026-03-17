import { and, eq } from "drizzle-orm";
import { type Note, notes } from "@/db/schema";
import { db } from "@/shared/lib/db";

export type Task = {
	id: string;
	text: string;
	completed: boolean;
};

export type NoteData = {
	id: string;
	title: string;
	description: string;
	type: "nota" | "tarefa";
	tasks?: Task[];
	archived: boolean;
	createdAt: string;
};

function toNoteData(note: Note): NoteData {
	let tasks: Task[] | undefined;
	if (note.tasks) {
		try {
			tasks = JSON.parse(note.tasks);
		} catch (error) {
			console.error("Failed to parse tasks for note", note.id, error);
		}
	}
	return {
		id: note.id,
		title: (note.title ?? "").trim(),
		description: (note.description ?? "").trim(),
		type: (note.type ?? "nota") as "nota" | "tarefa",
		tasks,
		archived: note.archived,
		createdAt: note.createdAt.toISOString(),
	};
}

export async function fetchNotesForUser(userId: string): Promise<NoteData[]> {
	const noteRows = await db.query.notes.findMany({
		where: and(eq(notes.userId, userId), eq(notes.archived, false)),
		orderBy: (table, { desc }) => [desc(table.createdAt)],
	});

	return noteRows.map(toNoteData);
}

export async function fetchAllNotesForUser(
	userId: string,
): Promise<{ activeNotes: NoteData[]; archivedNotes: NoteData[] }> {
	const [activeNotes, archivedNotes] = await Promise.all([
		fetchNotesForUser(userId),
		fetchArchivedForUser(userId),
	]);

	return { activeNotes, archivedNotes };
}

export async function fetchArchivedForUser(
	userId: string,
): Promise<NoteData[]> {
	const noteRows = await db.query.notes.findMany({
		where: and(eq(notes.userId, userId), eq(notes.archived, true)),
		orderBy: (table, { desc }) => [desc(table.createdAt)],
	});

	return noteRows.map(toNoteData);
}
