import Navbar from "@/src/components/Navbar";
import { Check, Rocket, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function UpgradePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Upgrade to Pro</h1>
          <p className="text-xl text-slate-600">Unlock unlimited potential and scale your Amazon business.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Current Plan */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-2">Free Plan</h2>
            <div className="text-3xl font-extrabold mb-6">$0<span className="text-lg font-normal text-slate-500">/mo</span></div>
            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3 text-slate-600">
                <Check className="h-5 w-5 text-emerald-500" />
                <span>15 Calculations / month</span>
              </li>
              <li className="flex items-center gap-3 text-slate-600">
                <Check className="h-5 w-5 text-emerald-500" />
                <span>5 Saved scenarios</span>
              </li>
              <li className="flex items-center gap-3 text-slate-600">
                <Check className="h-5 w-5 text-emerald-500" />
                <span>Basic ROI indicators</span>
              </li>
            </ul>
            <div className="w-full py-3 bg-slate-100 text-slate-500 font-bold rounded-xl text-center">
              Current Plan
            </div>
          </div>

          {/* Pro Plan */}
          <div className="bg-white rounded-3xl border-2 border-indigo-600 p-8 shadow-xl shadow-indigo-100 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Coming Soon
            </div>
            <h2 className="text-xl font-bold mb-2 text-indigo-600">Pro Plan</h2>
            <div className="text-3xl font-extrabold mb-6">$19<span className="text-lg font-normal text-slate-500">/mo</span></div>
            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3 text-slate-900 font-medium">
                <Rocket className="h-5 w-5 text-indigo-600" />
                <span>Unlimited Calculations</span>
              </li>
              <li className="flex items-center gap-3 text-slate-900 font-medium">
                <Rocket className="h-5 w-5 text-indigo-600" />
                <span>Unlimited Scenarios</span>
              </li>
              <li className="flex items-center gap-3 text-slate-900 font-medium">
                <Rocket className="h-5 w-5 text-indigo-600" />
                <span>Advanced Analytics</span>
              </li>
              <li className="flex items-center gap-3 text-slate-900 font-medium">
                <Rocket className="h-5 w-5 text-indigo-600" />
                <span>Priority Support</span>
              </li>
            </ul>
            <button disabled className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl opacity-50 cursor-not-allowed">
              Coming Soon
            </button>
          </div>
        </div>

        <div className="mt-16 bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
          <ShieldAlert className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-amber-900">Reached your limit?</h3>
            <p className="text-amber-800 text-sm mt-1">
              Our free plan is designed for new sellers. If you've reached your monthly limit of 15 calculations or 5 scenarios, you'll need to wait for the next calendar month (UTC) for your limits to reset, or delete old scenarios.
            </p>
            <Link href="/app" className="inline-block mt-4 text-amber-900 font-bold underline">
              Back to Calculator
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
