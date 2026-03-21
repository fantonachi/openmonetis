import {
	Card,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

export function DashboardMetricsCardsSkeleton() {
	return (
		<div className="grid grid-cols-1 gap-3 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
			{Array.from({ length: 4 }).map((_, index) => (
				<Card
					key={index}
					className="@container/card min-h-36 justify-between gap-0"
				>
					<CardHeader className="gap-4 pb-3">
						<CardTitle className="flex items-center gap-2">
							<Skeleton className="size-8 rounded-md bg-foreground/10" />
							<Skeleton className="h-4 w-24 rounded-md bg-foreground/10" />
						</CardTitle>
						<div className="flex flex-wrap items-end justify-between gap-3">
							<Skeleton className="h-10 w-36 rounded-md bg-foreground/10" />
							<Skeleton className="h-7 w-20 rounded-full bg-foreground/10" />
						</div>
					</CardHeader>

					<CardFooter className="items-start pt-0">
						<div className="flex flex-col items-start gap-1.5">
							<Skeleton className="h-3 w-24 rounded-md bg-foreground/10" />
							<Skeleton className="h-4 w-20 rounded-md bg-foreground/10" />
						</div>
					</CardFooter>
				</Card>
			))}
		</div>
	);
}
