import { createClient } from "@/src/utils/supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/src/components/Navbar";
import ScenariosList from "@/src/components/ScenariosList";

export default async function ScenariosPage() {
  const supabase = await createClient();
  
  if (!supabase) {
    return redirect("/app"); // Let app page handle the error message
  }

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: scenarios } = await supabase
    .from("scenarios")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900">Saved Scenarios</h1>
          <p className="text-slate-600 mt-2">Manage and compare your saved product calculations.</p>
        </header>
        
        <ScenariosList initialScenarios={scenarios || []} />
      </main>
    </div>
  );
}
