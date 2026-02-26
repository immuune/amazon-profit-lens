import { createClient } from "@/src/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
    }

    const { email } = body;

    if (!email) {
      return NextResponse.json({ ok: false, error: "Email is required" }, { status: 400 });
    }

    const supabase = await createClient();
    
    if (!supabase) {
      return NextResponse.json({ 
        ok: false, 
        error: "Supabase not configured on server. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY." 
      }, { status: 500 });
    }

    const redirectTo = new URL("/auth/callback", request.url).toString();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("OTP Request Error:", err);
    return NextResponse.json({ 
      ok: false, 
      error: `Internal Server Error: ${err.message || "Unknown error"}` 
    }, { status: 500 });
  }
}
