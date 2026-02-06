"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";

export default function SignupPage() {
  const router = useRouter();

  // Redirect to login after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login");
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left Column - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white rounded-full blur-[100px] mix-blend-overlay" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-400 rounded-full blur-[100px] mix-blend-overlay" />
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
            Start Your
            <br />
            Journey.
          </h1>
          <p className="text-xl text-white/70">
            Join a community of disciplined traders. Get access to verified
            research and educational content.
          </p>
        </div>
        <div className="relative z-10 text-xs text-white/40">
          © 2024 SEBI Research Analyst. All rights reserved.
        </div>
      </div>

      {/* Right Column - Redirect Message */}
      <div className="flex items-center justify-center p-8 lg:p-12 relative">
        <div className="w-full max-w-md space-y-8 text-center">
          <FadeIn>
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-primary animate-pulse"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-foreground">
                Sign Up via OTP
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                We use WhatsApp OTP for secure authentication. No passwords needed!
              </p>
              <p className="text-sm text-gray-500">
                Redirecting you to login page...
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 w-full py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-primary/25"
            >
              Continue to Login
            </Link>
          </FadeIn>
        </div>
      </div>
    </main>
  );
}
