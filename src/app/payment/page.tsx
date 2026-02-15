"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { QrCode, Building2 } from "lucide-react";

function PaymentContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "Selected Plan";
  const price = searchParams.get("price") || "--";

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8 text-center text-foreground">
        Complete Your Subscription
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-primary dark:text-blue-400">
            Order Summary
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
              <span className="text-gray-600 dark:text-gray-400">
                Plan Name
              </span>
              <span className="font-medium text-foreground">{plan}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
              <span className="text-gray-600 dark:text-gray-400">
                Amount Payable
              </span>
              <span className="font-bold text-lg text-foreground">{price}</span>
            </div>
            <div className="text-xs text-gray-500 mt-4">
              * Inclusive of all taxes.
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-primary dark:text-blue-400">
            Payment Methods
          </h2>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2 font-medium text-foreground">
                <QrCode className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span>Scan & Pay (UPI)</span>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg flex flex-col items-center justify-center h-48">
                <div className="w-32 h-32 bg-white p-2 rounded flex items-center justify-center">
                  {/* Placeholder for QR Code */}
                  <QrCode className="w-24 h-24 text-gray-800" />
                </div>
                <p className="text-xs mt-2 text-gray-500">upi@example</p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2 font-medium text-foreground">
                <Building2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span>Bank Transfer</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg space-y-1">
                <p>Bank: Example Bank Ltd.</p>
                <p>Account Name: SEBI Research Analyst</p>
                <p>Account No: 1234567890</p>
                <p>IFSC: EXBK0001234</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
            <button
              className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
              onClick={async (e) => {
                const btn = e.currentTarget;
                btn.disabled = true;
                btn.textContent = "Processing...";

                try {
                  // Simulate API call
                  await new Promise((resolve) => setTimeout(resolve, 1500));
                  // const { PaymentApi } = await import("@/app/Api/Api");
                  // await PaymentApi.createOrder({ plan, price });

                  btn.textContent = "Payment Successful!";
                  btn.classList.replace("bg-primary", "bg-green-600");
                  setTimeout(() => {
                    alert(
                      "Payment simulated successfully! Please send screenshot to support.",
                    );
                    btn.disabled = false;
                    btn.textContent = "Pay Online";
                    btn.classList.replace("bg-green-600", "bg-primary");
                  }, 500);
                } catch (e) {
                  console.error(e);
                  btn.textContent = "Failed - Try Again";
                  btn.disabled = false;
                }
              }}
            >
              Pay Online
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          After payment, please send the screenshot to{" "}
          <strong>support@example.com</strong> or WhatsApp{" "}
          <strong>+91-9876543210</strong> to activate your plan.
        </p>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <main className="min-h-screen bg-background">
      <Suspense
        fallback={
          <div className="container mx-auto px-4 py-16 text-center">
            Loading...
          </div>
        }
      >
        <PaymentContent />
      </Suspense>
    </main>
  );
}
