import { PayersPage } from "@/features/payers/components/payers-page";
import { fetchPayersForUser } from "@/features/payers/queries";
import { getUserId } from "@/shared/lib/auth/server";

export default async function Page() {
	const userId = await getUserId();
	const { payers, avatarOptions } = await fetchPayersForUser(userId);

	return (
		<main className="flex flex-col items-start gap-6">
			<PayersPage payers={payers} avatarOptions={avatarOptions} />
		</main>
	);
}
