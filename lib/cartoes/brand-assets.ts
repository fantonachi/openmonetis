const CARD_BRAND_ASSET_BY_KEY = {
	visa: "/bandeiras/visa.svg",
	mastercard: "/bandeiras/mastercard.svg",
	amex: "/bandeiras/amex.svg",
	american: "/bandeiras/amex.svg",
	elo: "/bandeiras/elo.svg",
	hipercard: "/bandeiras/hipercard.svg",
	hiper: "/bandeiras/hipercard.svg",
} as const;

const CARD_BRAND_LOGO_BY_KEY = {
	visa: "/logos/visa.png",
	mastercard: "/logos/mastercard.png",
	amex: "/logos/amex.png",
	american: "/logos/amex.png",
	elo: "/logos/elo.png",
	hipercard: "/logos/hipercard.png",
	hiper: "/logos/hipercard.png",
} as const;

const findMatchingCardBrandKey = (brand?: string | null) => {
	if (!brand) {
		return null;
	}

	const normalizedBrand = brand.trim().toLowerCase();

	return (
		(
			Object.keys(CARD_BRAND_ASSET_BY_KEY) as Array<
				keyof typeof CARD_BRAND_ASSET_BY_KEY
			>
		).find((key) => normalizedBrand.includes(key)) ?? null
	);
};

export const resolveCardBrandAsset = (brand?: string | null) => {
	const key = findMatchingCardBrandKey(brand);
	return key ? CARD_BRAND_ASSET_BY_KEY[key] : null;
};

export const resolveCardBrandLogoSrc = (brand?: string | null) => {
	const key = findMatchingCardBrandKey(brand);
	return key ? CARD_BRAND_LOGO_BY_KEY[key] : null;
};
