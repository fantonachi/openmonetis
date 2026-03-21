"use client";

import {
	RiArrowLeftRightLine,
	RiAtLine,
	RiBankCard2Line,
	RiBarChart2Line,
	RiCalendarEventLine,
	RiFileDownloadLine,
	RiSecurePaymentLine,
} from "@remixicon/react";
import Image from "next/image";
import { landingImages } from "@/features/landing/images";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/shared/components/ui/tabs";

const { screenshots } = landingImages;

const sections = [
	{
		value: "lancamentos",
		label: "Lançamentos",
		icon: RiArrowLeftRightLine,
		...screenshots.lancamentos,
	},
	{
		value: "pre-lancamentos",
		label: "Pré-lançamentos",
		icon: RiAtLine,
		...screenshots.preLancamentos,
	},
	{
		value: "importacao",
		label: "Importação",
		icon: RiFileDownloadLine,
		...screenshots.importacao,
	},
	{
		value: "orcamentos",
		label: "Orçamentos",
		icon: RiBarChart2Line,
		...screenshots.orcamentos,
	},
	{
		value: "parcelas",
		label: "Análise de Parcelas",
		icon: RiSecurePaymentLine,
		...screenshots.parcelas,
	},
	{
		value: "calendario",
		label: "Calendário",
		icon: RiCalendarEventLine,
		...screenshots.calendario,
	},
	{
		value: "cartoes",
		label: "Cartões",
		icon: RiBankCard2Line,
		...screenshots.cartoes,
	},
];

export function ScreenshotTabs() {
	return (
		<Tabs defaultValue="lancamentos" className="w-full">
			<div className="flex flex-col gap-6">
				<TabsList className="w-full h-auto flex-wrap gap-1">
					{sections.map((s) => (
						<TabsTrigger
							key={s.value}
							value={s.value}
							className="flex-1 gap-1.5 lowercase"
						>
							<s.icon className="size-4" />
							{s.label}
						</TabsTrigger>
					))}
				</TabsList>

				{sections.map((s) => (
					<TabsContent key={s.value} value={s.value} className="w-full mt-0">
						<div className="rounded-lg overflow-hidden border bg-card">
							<div className="flex items-center gap-1.5 px-3 h-8 border-b bg-muted/50">
								<div className="size-2.5 rounded-full bg-muted-foreground/20" />
								<div className="size-2.5 rounded-full bg-muted-foreground/20" />
								<div className="size-2.5 rounded-full bg-muted-foreground/20" />
								<div className="ml-2 flex-1 max-w-52 h-4 rounded bg-muted-foreground/10" />
							</div>
							<Image
								src={s.light}
								alt={`Preview ${s.label}`}
								width={1920}
								height={1080}
								className="w-full h-auto dark:hidden"
							/>
							<Image
								src={s.dark}
								alt={`Preview ${s.label}`}
								width={1920}
								height={1080}
								className="w-full h-auto hidden dark:block"
							/>
						</div>
					</TabsContent>
				))}
			</div>
		</Tabs>
	);
}
