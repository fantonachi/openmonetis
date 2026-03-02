"use client";

import { RiMoneyDollarCircleLine, RiSlideshowLine } from "@remixicon/react";
import { useState } from "react";
import type { PaymentConditionsData } from "@/lib/dashboard/payments/payment-conditions";
import type { PaymentMethodsData } from "@/lib/dashboard/payments/payment-methods";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { PaymentConditionsWidget } from "./payment-conditions-widget";
import { PaymentMethodsWidget } from "./payment-methods-widget";

type PaymentOverviewWidgetProps = {
	paymentConditionsData: PaymentConditionsData;
	paymentMethodsData: PaymentMethodsData;
};

export function PaymentOverviewWidget({
	paymentConditionsData,
	paymentMethodsData,
}: PaymentOverviewWidgetProps) {
	const [activeTab, setActiveTab] = useState<"conditions" | "methods">(
		"conditions",
	);

	return (
		<Tabs
			value={activeTab}
			onValueChange={(value) => setActiveTab(value as "conditions" | "methods")}
			className="w-full"
		>
			<TabsList className="grid grid-cols-2">
				<TabsTrigger value="conditions" className="text-xs">
					<RiSlideshowLine className="mr-1 size-3.5" />
					Condições
				</TabsTrigger>
				<TabsTrigger value="methods" className="text-xs">
					<RiMoneyDollarCircleLine className="mr-1 size-3.5" />
					Formas
				</TabsTrigger>
			</TabsList>

			<TabsContent value="conditions" className="mt-2">
				<PaymentConditionsWidget data={paymentConditionsData} />
			</TabsContent>

			<TabsContent value="methods" className="mt-2">
				<PaymentMethodsWidget data={paymentMethodsData} />
			</TabsContent>
		</Tabs>
	);
}
