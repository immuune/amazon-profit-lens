import Link from "next/link";
import Navbar from "@/src/components/Navbar";
import { ArrowRight, BarChart3, Calculator, Save, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
                Master Your Amazon <span className="text-indigo-600">Profitability</span>
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
                Stop guessing. Calculate exact ROI, margins, and fees for your FBA business in seconds. Save scenarios and grow with confidence.
              </p>
              <div className="flex justify-center gap-4">
                <Link
                  href="/login"
                  className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-1"
                >
                  Start Free <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="#features"
                  className="inline-flex items-center px-8 py-4 border border-slate-200 text-lg font-semibold rounded-xl text-slate-700 bg-white hover:bg-slate-50 transition-all"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
          
          {/* Decorative background elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-3xl opacity-50"></div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900">Everything you need to scale</h2>
              <p className="mt-4 text-slate-600">Built by sellers, for sellers. Simple, fast, and accurate.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                  <Calculator className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Precision Calculator</h3>
                <p className="text-slate-600">Account for every fee: referral, FBA, storage, and prep costs. Know your true landed cost.</p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                  <Save className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Save Scenarios</h3>
                <p className="text-slate-600">Compare different buy costs or sale prices. Save up to 5 scenarios on our free plan.</p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-6">
                  <BarChart3 className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Visual Indicators</h3>
                <p className="text-slate-600">Instant color-coded feedback on your ROI. Know immediately if a deal is worth pursuing.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-24 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Simple, transparent pricing</h2>
            <div className="bg-slate-50 rounded-3xl p-10 border border-slate-200 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                Current Plan
              </div>
              <h3 className="text-2xl font-bold mb-2">Free Plan</h3>
              <div className="text-4xl font-extrabold mb-6">$0<span className="text-lg font-normal text-slate-500">/mo</span></div>
              <ul className="text-left space-y-4 mb-10">
                <li className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-indigo-600" />
                  <span>15 Calculations per month</span>
                </li>
                <li className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-indigo-600" />
                  <span>5 Saved scenarios</span>
                </li>
                <li className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-indigo-600" />
                  <span>Basic ROI indicators</span>
                </li>
              </ul>
              <Link
                href="/login"
                className="block w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
            <p className="mt-8 text-slate-500 italic">Pro plan coming soon with unlimited everything.</p>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Calculator className="h-5 w-5 text-indigo-400" />
            <span className="font-bold text-white">Profit Lens</span>
          </div>
          <p className="text-sm">© 2026 Amazon Profit Lens. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
