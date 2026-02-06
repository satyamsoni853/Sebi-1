"use client";

import { PricingCard } from "@/components/ui/pricing-card";
import { DisclaimerStrip } from "@/components/sections/disclaimer-strip";
import { FadeIn } from "@/components/ui/fade-in";
import { FloatingIcons } from "@/components/ui/floating-icons";
import { PageHeader } from "@/components/layout/page-header";

import { useState, useEffect } from "react";
import { PlansApi } from "@/app/Api/Api";

export default function PlansPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const mockPlans = [
    {
      title: "Silver Plan",
      price: "₹9,999",
      duration: "3 Months",
      features: ["Daily Intraday Calls", "Equity Cash Only", "Basic Support"],
      recommended: false,
    },
    {
      title: "Gold Plan",
      price: "₹19,999",
      duration: "6 Months",
      features: [
        "Intraday + Positional",
        "F&O Access",
        "Priority Support",
        "Risk Management Guide",
      ],
      recommended: true,
    },
    {
      title: "Platinum Plan",
      price: "₹29,999",
      duration: "12 Months",
      features: [
        "All Segments Access",
        "Direct Analyst Access",
        "Portfolio Review",
        "Algo Trading Setup",
      ],
      recommended: false,
    },
  ];

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data: any = await PlansApi.getAllPlans();
        const apiPlans = Array.isArray(data) ? data : data.data || [];
        if (apiPlans.length > 0) {
          setPlans(apiPlans);
        } else {
          setPlans(mockPlans);
        }
      } catch (error) {
        console.warn("Failed to fetch plans, using mock data.", error);
        setPlans(mockPlans);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      <FloatingIcons />
      <PageHeader
        title="Subscription Plans"
        description="Transparent pricing for professional research. Choose a plan that suits your trading needs."
      />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-4 text-center py-20">Loading plans...</div>
          ) : (
            plans.map((plan, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <PricingCard {...plan} />
              </FadeIn>
            ))
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16 text-center relative z-10">
        <FadeIn delay={0.2}>
          <p className="text-sm text-gray-500">
            <strong>Refund Policy:</strong> Fees once paid are non-refundable.
            Please read the terms and conditions carefully.
          </p>
        </FadeIn>
      </div>

      <DisclaimerStrip />
    </main>
  );
}
