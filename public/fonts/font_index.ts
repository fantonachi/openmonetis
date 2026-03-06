import {
	Fira_Code,
	Fira_Sans,
	Geist,
	IBM_Plex_Mono,
	Inter,
	JetBrains_Mono,
	Reddit_Sans,
	Roboto,
	Ubuntu,
} from "next/font/google";
import localFont from "next/font/local";

const ai_sans = localFont({
	src: [
		{
			path: "./ai-sans-regular.woff2",
			weight: "400",
			style: "normal",
		},
		{
			path: "./ai-sans-semibold.woff2",
			weight: "700",
			style: "normal",
		},
	],
	display: "swap",
	variable: "--font-ai-sans",
});

const itau = localFont({
	src: [
		{
			path: "./itau-text-regular.woff2",
			weight: "400",
			style: "normal",
		},
		{
			path: "./itau-text-bold.woff2",
			weight: "700",
			style: "normal",
		},
	],
	display: "swap",
	variable: "--font-itau",
});

const anthropic_sans = localFont({
	src: "./anthropic-sans.woff2",
	display: "swap",
	variable: "--font-anthropic-sans",
});

const inter = Inter({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-inter",
});

const geist_sans = Geist({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-geist",
});

const roboto = Roboto({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-roboto",
});

const reddit_sans = Reddit_Sans({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-reddit-sans",
});

const fira_sans = Fira_Sans({
	weight: ["400", "500", "600", "700"],
	subsets: ["latin"],
	display: "swap",
	variable: "--font-fira-sans",
});

const ubuntu = Ubuntu({
	weight: ["400"],
	subsets: ["latin"],
	display: "swap",
	variable: "--font-ubuntu",
});

const jetbrains_mono = JetBrains_Mono({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-jetbrains-mono",
});

const fira_code = Fira_Code({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-fira-code",
});

const ibm_plex_mono = IBM_Plex_Mono({
	weight: ["400", "500", "600"],
	subsets: ["latin"],
	display: "swap",
	variable: "--font-ibm-plex-mono",
});

export const DEFAULT_FONT_KEY = "ai-sans";

export const FONT_OPTIONS = [
	{ key: "ai-sans", label: "Open AI Sans", variable: "var(--font-ai-sans)" },
	{
		key: "anthropic-sans",
		label: "Anthropic Sans",
		variable: "var(--font-anthropic-sans)",
	},
	{ key: "fira-code", label: "Fira Code", variable: "var(--font-fira-code)" },
	{
		key: "fira-sans",
		label: "Fira Sans",
		variable: "var(--font-fira-sans)",
	},
	{
		key: "itau",
		label: "Itaú Sans",
		variable: "var(--font-itau)",
	},
	{ key: "geist", label: "Geist Sans", variable: "var(--font-geist)" },
	{
		key: "ibm-plex-mono",
		label: "IBM Plex Mono",
		variable: "var(--font-ibm-plex-mono)",
	},
	{ key: "inter", label: "Inter", variable: "var(--font-inter)" },
	{
		key: "jetbrains-mono",
		label: "JetBrains Mono",
		variable: "var(--font-jetbrains-mono)",
	},
	{
		key: "reddit-sans",
		label: "Reddit Sans",
		variable: "var(--font-reddit-sans)",
	},
	{ key: "roboto", label: "Roboto", variable: "var(--font-roboto)" },
	{ key: "ubuntu", label: "Ubuntu", variable: "var(--font-ubuntu)" },
] as const;

export type FontKey = (typeof FONT_OPTIONS)[number]["key"];

export const FONT_KEYS = FONT_OPTIONS.map((option) => option.key) as [
	FontKey,
	...FontKey[],
];

const VALID_FONT_KEY_SET = new Set<string>(FONT_KEYS);

const allFonts = [
	ai_sans,
	anthropic_sans,
	inter,
	geist_sans,
	roboto,
	reddit_sans,
	fira_sans,
	ubuntu,
	jetbrains_mono,
	fira_code,
	ibm_plex_mono,
	itau,
];

export const allFontVariables = allFonts.map((f) => f.variable).join(" ");

function isValidFontKey(value: string): value is FontKey {
	return VALID_FONT_KEY_SET.has(value);
}

export function normalizeFontKey(value: string | null | undefined): FontKey {
	if (!value) return DEFAULT_FONT_KEY;
	return isValidFontKey(value) ? value : DEFAULT_FONT_KEY;
}

export function getFontVariable(key: string): string {
	const option = FONT_OPTIONS.find((o) => o.key === key);
	return option?.variable ?? `var(--font-${DEFAULT_FONT_KEY})`;
}
