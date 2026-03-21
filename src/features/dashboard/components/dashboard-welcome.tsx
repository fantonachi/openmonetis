import { formatCurrentDate, getGreeting } from "./welcome-widget";

export function DashboardWelcome({ name }: { name?: string | null }) {
	const displayName = name && name.trim().length > 0 ? name : "Administrador";
	const formattedDate = formatCurrentDate();
	const greeting = getGreeting();

	return (
		<section className="py-4">
			<div className="tracking-tight">
				<h1 className="text-xl">
					{greeting}, {displayName}
				</h1>
				<h2 className="text-sm mt-1 text-muted-foreground">{formattedDate}</h2>
			</div>
		</section>
	);
}
