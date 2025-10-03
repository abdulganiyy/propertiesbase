"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";
import { PageLayout } from "@/components/shared/page-layout";
import { useRouter } from "next/navigation";

const plans = [
  {
    name: "Free",
    price: "₦0",
    description: "Basic features to get started.",
    features: ["List up to 2 properties", "Basic support"],
    // link: "/subscribe/free",
  },
  {
    name: "Standard",
    price: "₦5,000 / month",
    description: "For active property owners.",
    features: [
      "List up to 10 properties",
      "Featured listing option",
      "Priority support",
    ],
    link: "https://paystack.shop/pay/8tlbtace1i",
  },
  {
    name: "Premium",
    price: "₦15,000 / month",
    description: "Best for property managers and businesses.",
    features: [
      "Unlimited property listings",
      "Featured listing boost",
      "Premium support",
      "Analytics dashboard",
    ],
    link: "https://paystack.shop/pay/kodh62czmq",
  },
];

export default function SubscriptionPlansPage() {
  const { data: user } = useUser();

  const [selectedPlan, setSelectedPlan] = useState("Free");

  const router = useRouter();

  const onSubscribe = async (tier: string) => {
    if (user == null) {
      router.push("/signin");
      return;
    }

    if (tier == "FREE") return;

    const r = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/subscription/checkout`,
      {
        method: "POST",
        body: JSON.stringify({ tier, userId: user.id }),
        headers: { "Content-Type": "application/json" },
      }
    ).then((r) => r.json());

    console.log(r);

    window.location.href = r.authorizationUrl; // redirect to Paystack
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800">Choose Your Plan</h1>
          <p className="mt-2 text-gray-600">
            Select a subscription that suits your needs.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col"
            >
              <h2 className="text-2xl font-semibold text-gray-800">
                {plan.name}
              </h2>
              <p className="text-xl font-bold text-indigo-600 mt-2">
                {plan.price}
              </p>
              <p className="text-gray-600 mt-2">{plan.description}</p>

              <ul className="mt-4 text-sm text-gray-700 space-y-1 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    ✅ <span className="ml-2">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* <Link
              href={plan.link}
              className="mt-6 inline-block text-center bg-black text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Choose {plan.name}
            </Link> */}
              <Button
                onClick={() => onSubscribe(plan.name.toUpperCase())}
                // className="mt-6 inline-block text-center bg-black text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                className={`mt-6 inline-block text-center px-4 py-2 rounded-lg transition 
                  ${
                    plan.name != "Free"
                      ? "bg-black text-white hover:bg-blue-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                Choose {plan.name}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
