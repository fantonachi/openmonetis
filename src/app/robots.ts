import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: [
					"/dashboard",
					"/transactions",
					"/accounts",
					"/cards",
					"/categories",
					"/budgets",
					"/payers",
					"/notes",
					"/insights",
					"/calendar",
					"/attachments",
					"/settings",
					"/reports",
					"/inbox",
					"/login",
					"/signup",
					"/api/",
				],
			},
		],
	};
}
