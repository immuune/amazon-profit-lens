import Link from "next/link";
import { createClient } from "@/src/utils/supabase/server";
import { Calculator, LayoutDashboard, LogOut, User } from "lucide-react";

export default async function Navbar() {
  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  return (
    <nav className="border-b border-slate-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Calculator className="h-6 w-6 text-indigo-600" />
              <span className="font-bold text-xl tracking-tight">Profit Lens</span>
            </Link>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            {user ? (
              <>
                <Link
                  href="/app"
                  className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1"
                >
                  <Calculator className="h-4 w-4" />
                  <span className="hidden sm:inline">Calculator</span>
                </Link>
                <Link
                  href="/scenarios"
                  className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden sm:inline">Scenarios</span>
                </Link>
                <Link
                  href="/upgrade"
                  className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Account</span>
                </Link>
                <form action="/auth/signout" method="post">
                  <button
                    type="submit"
                    className="text-sm font-medium text-slate-600 hover:text-red-600 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
