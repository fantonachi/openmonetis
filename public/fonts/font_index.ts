import localFont from "next/font/local";

export const america = localFont({
	src: [
		{
			path: "./america-regular.woff2",
			weight: "400",
			style: "normal",
		},
	],
	display: "swap",
	variable: "--font-america",
});

export const americaFontVariable = america.variable;
