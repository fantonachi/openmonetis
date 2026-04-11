import type { Metadata } from "next";
import { Suspense } from "react";
import { QueryProvider } from "@/shared/components/providers/query-provider";
import { ThemeProvider } from "@/shared/components/providers/theme-provider";
import { Toaster } from "@/shared/components/ui/sonner";
import "./globals.css";
import { inter } from "@/public/fonts/font_index";

export const metadata: Metadata = {
	title: {
		default: "OpenMonetis | Suas finanças, do seu jeito",
		template: "%s | OpenMonetis",
	},
	description:
		"Controle suas finanças pessoais de forma simples e transparente.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			data-scroll-behavior="smooth"
			lang="pt-BR"
			className={`${inter.variable}`}
			suppressHydrationWarning
		>
			<head>
				<meta name="apple-mobile-web-app-title" content="OpenMonetis" />
				<script
					defer
					src="https://umami.felipecoutinho.com/script.js"
					data-website-id="ea438854-a014-42ea-b416-0a8321471f0f"
					data-domains="openmonetis.com"
				/>
			</head>
			<body className="subpixel-antialiased" suppressHydrationWarning>
				<ThemeProvider attribute="class" defaultTheme="light">
					<QueryProvider>
						<Suspense>{children}</Suspense>
						<Toaster position="top-right" />
					</QueryProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
