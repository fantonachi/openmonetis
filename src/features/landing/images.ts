/**
 * Centraliza todos os assets de imagem da landing page.
 * Para adicionar ou renomear uma imagem, altere apenas aqui.
 *
 * Convenção:
 *   - { light, dark } → imagem com variante de tema
 *   - string          → imagem única (sem variante dark)
 */

export const landingImages = {
	/** Preview do dashboard no hero da página */
	hero: {
		light: "/images/dashboard-preview-light.webp",
		dark: "/images/dashboard-preview-dark.webp",
	},

	/** Mockup do app instalado como PWA */
	pwa: {
		light: "/images/pwa-preview-light.webp",
		dark: "/images/pwa-preview-dark.webp",
	},

	/** Mockup do Companion Android */
	companion: {
		light: "/images/companion-preview-light.webp",
		dark: "/images/companion-preview-dark.webp",
	},

	/** Screenshots usados nas abas da seção "Conheça as telas" */
	screenshots: {
		lancamentos: {
			light: "/images/preview-lancamentos-light.webp",
			dark: "/images/preview-lancamentos-dark.webp",
		},
		/** Ainda sem print próprio — usando lançamentos como placeholder */
		preLancamentos: {
			light: "/images/preview-pre-lancamentos-light.webp",
			dark: "/images/preview-pre-lancamentos-dark.webp",
		},
		importacao: {
			light: "/images/preview-importacao-light.webp",
			dark: "/images/preview-importacao-dark.webp",
		},
		/** Ainda sem print próprio — usando lançamentos como placeholder */
		orcamentos: {
			light: "/images/preview-orcamentos-light.webp",
			dark: "/images/preview-orcamentos-dark.webp",
		},
		/** Ainda sem print próprio — usando lançamentos como placeholder */
		parcelas: {
			light: "/images/preview-parcelas-light.webp",
			dark: "/images/preview-parcelas-dark.webp",
		},
		calendario: {
			light: "/images/preview-calendario-light.webp",
			dark: "/images/preview-calendario-dark.webp",
		},
		cartoes: {
			light: "/images/preview-cartao-light.webp",
			dark: "/images/preview-cartao-dark.webp",
		},
	},
} as const;
