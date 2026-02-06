"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Phone, KeyRound, LogIn, Loader2, RefreshCw } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

type AuthStep = "phone" | "otp";

export default function LoginPage() {
  const [step, setStep] = useState<AuthStep>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const { sendOTP, verifyOTP, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const formatPhoneDisplay = (value: string) => {
    // Format for display: keep only digits
    return value.replace(/\D/g, "").slice(0, 10);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhoneDisplay(e.target.value));
    setError("");
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
    setError("");
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate phone number (10 digits for India)
    if (phone.length < 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setIsSubmitting(true);
    try {
      await sendOTP(phone);
      setStep("otp");
      setResendCooldown(30); // 30 seconds cooldown
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsSubmitting(true);
    try {
      const { isNewUser } = await verifyOTP(phone, otp);
      // Redirect based on whether it's a new user
      if (isNewUser) {
        router.push("/profile");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;

    setIsSubmitting(true);
    setError("");
    try {
      await sendOTP(phone);
      setResendCooldown(30);
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToPhone = () => {
    setStep("phone");
    setOtp("");
    setError("");
  };

  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left Column - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10">
          <Link
            href="/"
            className="inline-flex items-center text-white/80 hover:text-white transition-colors gap-2 font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
        <div className="relative z-10 text-white space-y-4">
          <h1 className="text-5xl font-bold leading-tight">
            Welcome Back,
            <br />
            Trader.
          </h1>
          <p className="text-xl text-white/60">
            Access your dashboard, saved strategies, and premium research.
          </p>
        </div>
        <div className="relative z-10 text-xs text-white/40">
          © 2024 SEBI Research Analyst. All rights reserved.
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="flex items-center justify-center p-8 lg:p-12 relative">
        <div className="w-full max-w-md space-y-8">
          <FadeIn>
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold text-foreground">
                {step === "phone" ? "Sign In" : "Verify OTP"}
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {step === "phone" ? (
                  <>
                    Enter your phone number to receive an OTP on WhatsApp
                  </>
                ) : (
                  <>
                    We&apos;ve sent a 6-digit OTP to{" "}
                    <span className="font-semibold text-foreground">+91 {phone}</span>
                  </>
                )}
              </p>
            </div>
          </FadeIn>

          {/* Error Message */}
          {error && (
            <FadeIn>
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            </FadeIn>
          )}

          {step === "phone" ? (
            /* Phone Input Step */
            <FadeIn delay={0.1}>
              <form className="space-y-6" onSubmit={handleSendOTP}>
                <div className="space-y-2">
                  <label
                    htmlFor="phone"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-gray-500 dark:text-gray-400">
                      <Phone className="w-5 h-5" />
                      <span className="text-sm font-medium">+91</span>
                    </div>
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={handlePhoneChange}
                      className="w-full pl-20 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="9876543210"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <p className="text-xs text-gray-400">
                    You&apos;ll receive an OTP on your WhatsApp
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || phone.length < 10}
                  className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Sending OTP...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5" /> Send OTP
                    </>
                  )}
                </button>
              </form>
            </FadeIn>
          ) : (
            /* OTP Verification Step */
            <FadeIn delay={0.1}>
              <form className="space-y-6" onSubmit={handleVerifyOTP}>
                <div className="space-y-2">
                  <label
                    htmlFor="otp"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Enter OTP
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={otp}
                      onChange={handleOtpChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-center text-2xl font-mono tracking-[0.5em]"
                      placeholder="••••••"
                      maxLength={6}
                      required
                      disabled={isSubmitting}
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || otp.length !== 6}
                  className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Verifying...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5" /> Verify & Sign In
                    </>
                  )}
                </button>

                {/* Resend OTP & Change Number */}
                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={handleBackToPhone}
                    className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                  >
                    ← Change number
                  </button>
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={resendCooldown > 0 || isSubmitting}
                    className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    <RefreshCw className="w-4 h-4" />
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
                  </button>
                </div>
              </form>
            </FadeIn>
          )}

          <FadeIn delay={0.2}>
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </main>
  );
}
