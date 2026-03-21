"use server";

import { generateInsightsAction as generateInsightsActionImpl } from "./actions/generate";
import {
	deleteSavedInsightsAction as deleteSavedInsightsActionImpl,
	loadSavedInsightsAction as loadSavedInsightsActionImpl,
	saveInsightsAction as saveInsightsActionImpl,
} from "./actions/storage";

export async function generateInsightsAction(
	...args: Parameters<typeof generateInsightsActionImpl>
): ReturnType<typeof generateInsightsActionImpl> {
	return generateInsightsActionImpl(...args);
}

export async function saveInsightsAction(
	...args: Parameters<typeof saveInsightsActionImpl>
): ReturnType<typeof saveInsightsActionImpl> {
	return saveInsightsActionImpl(...args);
}

export async function loadSavedInsightsAction(
	...args: Parameters<typeof loadSavedInsightsActionImpl>
): ReturnType<typeof loadSavedInsightsActionImpl> {
	return loadSavedInsightsActionImpl(...args);
}

export async function deleteSavedInsightsAction(
	...args: Parameters<typeof deleteSavedInsightsActionImpl>
): ReturnType<typeof deleteSavedInsightsActionImpl> {
	return deleteSavedInsightsActionImpl(...args);
}
