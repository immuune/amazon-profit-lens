import { createClient } from "@/src/utils/supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/src/components/Navbar";
import CalculatorComponent from "@/src/components/Calculator";

export default async function AppPage() {
  const supabase = await createClient();
  
  if (!supabase) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-md text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Configuration Required</h1>
          <p className="text-slate-600 mb-6">
            Please set your Supabase environment variables (URL and Anon Key) to use this application.
          </p>
        </div>
      </div>
    );
  }

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900">Profit Calculator</h1>
          <p className="text-slate-600 mt-2">Analyze your Amazon FBA product profitability with precision.</p>
        </header>
        
        <CalculatorComponent />
      </main>
    </div>
  );
}
