import { SignupForm } from "@/features/auth/components/signup-form";

export default function Page() {
	return (
		<div className="flex min-h-svh flex-col items-center justify-center bg-linear-to-b from-background via-background to-muted/20 px-5 py-8 md:px-8 md:py-10">
			<div className="w-full max-w-sm md:max-w-5xl">
				<SignupForm />
			</div>
		</div>
	);
}
