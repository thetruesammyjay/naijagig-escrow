"use client";
import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "../../../lib/api";
import type { UserRegister } from "../../../types/user";

function RegisterForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const defaultType =
    searchParams?.get("type") === "client" ? "client" : "freelancer";

  const [accountType, setAccountType] = useState<"freelancer" | "client">(
    defaultType
  );
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const payload: UserRegister = {
        email,
        password,
        fullName,
        role: accountType,
      };

      await api.post("/auth/register", payload, { skipAuth: true });

      // Registration successful — redirect to login with a success hint
      router.push("/login?registered=1");
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.";
      setError(msg);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 py-12 relative overflow-x-hidden -mt-24">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none z-0 mt-24">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-green-200/20 blur-3xl float-animation" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-yellow-200/20 blur-3xl float-animation float-delay-1" />
      </div>

      <div className="container max-w-2xl mx-auto relative z-10 pt-16">
        <div className="text-center mb-8">
          <h2 className="mt-4 text-3xl font-bold font-bricolage text-gray-900">
            Join NaijaGig Escrow
          </h2>
          <p className="mt-2 text-gray-600 font-outfit">
            Sign up to hire top talent or find great work securely.
          </p>
        </div>

        {/* Step indicator */}
        <div className="mb-8 px-4">
          <div className="flex items-center justify-center gap-12 relative">
            <div className="absolute left-1/4 right-1/4 top-1/2 transform -translate-y-1/2 h-1 bg-gray-200 -z-10 rounded-full" />
            <div
              className="absolute left-1/4 right-1/4 top-1/2 transform -translate-y-1/2 h-1 bg-primary -z-10 rounded-full transition-all duration-500 origin-left"
              style={{ width: step === 2 ? "50%" : "0%" }}
            />
            {[
              { n: 1, label: "Account" },
              { n: 2, label: "Details" },
            ].map(({ n, label }) => (
              <div
                key={n}
                className="flex flex-col items-center gap-2 bg-white/50 backdrop-blur p-2 rounded-xl"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${
                    step >= n
                      ? "bg-primary text-white border-primary"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {step > n ? <i className="bi bi-check-lg" /> : n}
                </div>
                <span
                  className={`text-xs font-semibold ${
                    step >= n ? "text-primary" : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 sm:p-8">
          {/* Error banner */}
          {error && (
            <div className="mb-6 flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm">
              <i className="bi bi-exclamation-circle-fill text-red-500 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleStep1} className="space-y-6 animate-fade-in">
              {/* Role toggle */}
              <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                <button
                  type="button"
                  onClick={() => setAccountType("freelancer")}
                  className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all ${
                    accountType === "freelancer"
                      ? "bg-white text-primary shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  I&apos;m a Freelancer
                </button>
                <button
                  type="button"
                  onClick={() => setAccountType("client")}
                  className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all ${
                    accountType === "client"
                      ? "bg-white text-primary shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  I&apos;m a Client
                </button>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="input-group relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i className="bi bi-envelope text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white transition-all font-outfit"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="input-group relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i className="bi bi-lock text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-10 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white transition-all font-outfit"
                    placeholder="Create a strong password (min. 8 chars)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-green-700 transition-all transform hover:-translate-y-1 flex justify-center items-center"
              >
                Continue <i className="bi bi-arrow-right ml-2" />
              </button>
            </form>
          )}

          {step === 2 && (
            <form
              onSubmit={handleRegister}
              className="space-y-6 animate-fade-in"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {accountType === "client" ? "Company Name" : "Full Name"}
                </label>
                <div className="input-group relative">
                  <i className="bi bi-person absolute left-4 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white transition-all font-outfit"
                    placeholder={
                      accountType === "client"
                        ? "Your company name"
                        : "Your full name"
                    }
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary mt-1"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-primary font-bold hover:underline"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-primary font-bold hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </span>
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3.5 px-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  <i className="bi bi-arrow-left mr-2" />
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3.5 px-4 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl shadow-lg hover:from-green-700 hover:to-green-800 transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <i className="bi bi-arrow-repeat animate-spin mr-2" />
                      Creating Account…
                    </>
                  ) : (
                    <>
                      Complete Registration{" "}
                      <i className="bi bi-check-circle-fill ml-2" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {step === 1 && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-primary font-bold hover:underline"
                >
                  Login here
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Wrap in Suspense because useSearchParams() needs it in Next.js 15
export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}