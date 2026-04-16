import type { PropsWithChildren } from "react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { DotPattern } from "@/shared/components/ui/dot-pattern";
import AuthSidebar from "./auth-sidebar";

export function AuthCardShell({ children }: PropsWithChildren) {
	return (
		<Card className="relative overflow-hidden rounded-2xl md:rounded-[2rem] p-0 shadow-lg border-primary/10">
			<div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--color-primary)_0%,transparent_70%)] opacity-10 blur-3xl animate-blob mix-blend-multiply" />
				<DotPattern
					width={17}
					height={17}
					cx={1.3}
					cy={1.3}
					cr={1.3}
					className="text-primary/8 mask-[linear-gradient(to_bottom,black,transparent_84%)]"
				/>
				<div className="absolute inset-0 bg-linear-to-br from-primary/6 via-transparent to-transparent opacity-80" />
			</div>

			<CardContent className="relative z-10 grid gap-0 p-0 md:min-h-[640px] md:grid-cols-[1.05fr_0.95fr] overflow-hidden rounded-[inherit]">
				<div className="flex bg-card/60 backdrop-blur-xl md:rounded-l-[2rem]">
					{children}
				</div>
				<AuthSidebar />
			</CardContent>
		</Card>
	);
}
