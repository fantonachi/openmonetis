"use client";

import { RiEyeLine, RiEyeOffLine } from "@remixicon/react";
import type { VariantProps } from "class-variance-authority";
import { usePrivacyMode } from "@/shared/components/providers/privacy-provider";
import { buttonVariants } from "@/shared/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { cn } from "@/shared/utils/ui";

interface PrivacyTogglerProps extends React.ComponentPropsWithoutRef<"button"> {
	variant?: VariantProps<typeof buttonVariants>["variant"];
}

export const PrivacyToggler = ({
	className,
	variant = "ghost",
	...props
}: PrivacyTogglerProps) => {
	const { privacyMode, toggle } = usePrivacyMode();

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<button
					type="button"
					onClick={toggle}
					className={cn(
						buttonVariants({ variant, size: "icon-sm" }),
						variant === "ghost" &&
							"text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/40 data-[state=open]:bg-accent/60 data-[state=open]:text-foreground",
						className,
					)}
					{...props}
				>
					{privacyMode ? (
						<RiEyeOffLine className="size-4" aria-hidden />
					) : (
						<RiEyeLine className="size-4" aria-hidden />
					)}
					<span className="sr-only">
						{privacyMode ? "Mostrar valores" : "Ocultar valores"}
					</span>
				</button>
			</TooltipTrigger>
			<TooltipContent side="bottom" sideOffset={8}>
				{privacyMode ? "Mostrar valores" : "Ocultar valores"}
			</TooltipContent>
		</Tooltip>
	);
};
