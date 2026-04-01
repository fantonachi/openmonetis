import { LoginForm } from "@/features/auth/components/login-form";
import { Logo } from "@/shared/components/logo";

export default function LoginPage() {
	return (
		<div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-linear-to-b from-background via-background to-muted/20 px-5 py-8 md:px-8 md:py-10">
			<div className="pointer-events-none absolute inset-0">
				<div className="absolute -right-32 -top-32 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
				<div className="absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-primary/7 blur-3xl" />
			</div>

			<div className="relative mb-6 flex md:hidden">
				<Logo variant="compact" colorIcon />
			</div>

			<div className="relative w-full max-w-sm md:max-w-5xl">
				<LoginForm />
			</div>
		</div>
	);
}
