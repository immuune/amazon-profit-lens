"use client";

import { useState } from "react";
import { createClient } from "@/src/utils/supabase/client";
import { Calculator, Mail, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorDetail(null);

    try {
      // Explicitly using leading slash for the API route
      const response = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const text = await response.text();
        setErrorDetail(`Server Error (${response.status}): ${text}`);
        toast.error("Failed to send magic link");
        return;
      }

      const result = await response.json();

      if (result.ok) {
        setSent(true);
        toast.success("Check your email for the login link!");
      } else {
        setErrorDetail(result.error || "Unknown error");
        toast.error(result.error || "Failed to send magic link");
      }
    } catch (error: any) {
      console.error("Login Error:", error);
      setErrorDetail(error.message || "Fetch failed");
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isDev = process.env.NODE_ENV === "development";
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
      {isDev && (
        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs font-mono text-amber-800 max-w-md w-full overflow-auto">
          <p className="font-bold mb-1 underline">Debug Info (Dev Only):</p>
          <p>NEXT_PUBLIC_SUPABASE_URL: {envUrl || "MISSING"}</p>
          {errorDetail && (
            <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded text-red-800 break-words">
              <p className="font-bold">Last Error:</p>
              <p>{errorDetail}</p>
            </div>
          )}
        </div>
      )}
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 p-8 md:p-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-2xl mb-6">
            <Calculator className="h-8 w-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome Back</h1>
          <p className="text-slate-500 mt-2">Enter your email to receive a magic link</p>
        </div>

        {!sent ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                "Send Magic Link"
              )}
            </button>
          </form>
        ) : (
          <div className="text-center py-8">
            <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl mb-6">
              A magic link has been sent to <strong>{email}</strong>. Please check your inbox and click the link to log in.
            </div>
            <button
              onClick={() => setSent(false)}
              className="text-indigo-600 font-semibold hover:text-indigo-700"
            >
              Try another email
            </button>
          </div>
        )}

        <div className="mt-10 pt-8 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-500">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
