"use server";

import { createClient } from "@/src/utils/supabase/server";
import { redirect } from "next/navigation";
import { format } from "date-fns";

export type CalculatorInputs = {
  buyCost: number;
  shippingPerUnit: number;
  prepCost: number;
  salePrice: number;
  referralPercent: number;
  fbaFee: number;
  monthlyStoragePerUnit: number;
  expectedMonthsToSell: number;
  vatIncluded: boolean;
};

export type CalculatorOutputs = {
  landedCost: number;
  referralFee: number;
  storageTotal: number;
  totalFees: number;
  netProfit: number;
  marginPercent: number;
  roiPercent: number;
};

export async function checkLimitsAndIncrement() {
  const supabase = await createClient();
  if (!supabase) return { allowed: false, reason: "Supabase not configured. Please set environment variables." };
  
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // 1) Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_pro")
    .eq("user_id", user.id)
    .single();

  if (profile?.is_pro) return { allowed: true };

  // 2) Compute current yyyymm
  const yyyymm = format(new Date(), "yyyy-MM");

  // 3) Upsert usage
  const { data: usage } = await supabase
    .from("usage_monthly")
    .select("calc_count")
    .eq("user_id", user.id)
    .eq("yyyymm", yyyymm)
    .single();

  const currentCount = usage?.calc_count || 0;

  if (currentCount >= 15) {
    return { allowed: false, reason: "Monthly calculation limit reached." };
  }

  // 4) Increment
  const { error } = await supabase
    .from("usage_monthly")
    .upsert({
      user_id: user.id,
      yyyymm,
      calc_count: currentCount + 1,
      updated_at: new Date().toISOString(),
    });

  if (error) throw error;

  return { allowed: true };
}

export async function saveScenarioAction(name: string, inputs: CalculatorInputs, outputs: CalculatorOutputs) {
  const supabase = await createClient();
  if (!supabase) return { success: false, reason: "Supabase not configured." };
  
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  // 1) Check profile for limits
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_pro")
    .eq("user_id", user.id)
    .single();

  if (!profile?.is_pro) {
    const { count } = await supabase
      .from("scenarios")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (count !== null && count >= 5) {
      return { success: false, reason: "Scenario limit reached (5 total)." };
    }
  }

  // 2) Save
  const scenarioName = name.trim() || `Scenario ${format(new Date(), "yyyy-MM-dd HH:mm")}`;
  
  const { error } = await supabase
    .from("scenarios")
    .insert({
      user_id: user.id,
      name: scenarioName,
      inputs_json: inputs,
      outputs_json: outputs,
    });

  if (error) throw error;

  return { success: true };
}

export async function deleteScenarioAction(id: string) {
  const supabase = await createClient();
  if (!supabase) return { success: false, reason: "Supabase not configured." };
  
  const { error } = await supabase
    .from("scenarios")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return { success: true };
}

export async function updateScenarioNameAction(id: string, name: string) {
  const supabase = await createClient();
  if (!supabase) return { success: false, reason: "Supabase not configured." };
  
  const { error } = await supabase
    .from("scenarios")
    .update({ name, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
  return { success: true };
}
