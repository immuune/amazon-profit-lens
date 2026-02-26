"use client";

import { useState, useEffect } from "react";
import { CalculatorInputs, CalculatorOutputs, checkLimitsAndIncrement, saveScenarioAction } from "@/src/actions";
import { Calculator, Save, RefreshCw, AlertCircle, TrendingUp, DollarSign, Percent } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const initialInputs: CalculatorInputs = {
  buyCost: 0,
  shippingPerUnit: 0,
  prepCost: 0,
  salePrice: 0,
  referralPercent: 15,
  fbaFee: 0,
  monthlyStoragePerUnit: 0,
  expectedMonthsToSell: 2,
  vatIncluded: false,
};

import { motion } from "motion/react";

export default function CalculatorComponent() {
  const [inputs, setInputs] = useState<CalculatorInputs>(initialInputs);
  const [outputs, setOutputs] = useState<CalculatorOutputs | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [scenarioName, setScenarioName] = useState("");
  const router = useRouter();

  const calculate = async () => {
    setLoading(true);
    try {
      const limitCheck = await checkLimitsAndIncrement();
      if (!limitCheck.allowed) {
        toast.error(limitCheck.reason || "Limit reached");
        router.push("/upgrade");
        return;
      }

      const landedCost = inputs.buyCost + inputs.shippingPerUnit + inputs.prepCost;
      const referralFee = inputs.salePrice * (inputs.referralPercent / 100);
      const storageTotal = inputs.monthlyStoragePerUnit * inputs.expectedMonthsToSell;
      const totalFees = referralFee + inputs.fbaFee + storageTotal;
      const netProfit = inputs.salePrice - landedCost - totalFees;
      
      const marginPercent = inputs.salePrice > 0 ? (netProfit / inputs.salePrice) * 100 : 0;
      const roiPercent = landedCost > 0 ? (netProfit / landedCost) * 100 : 0;

      setOutputs({
        landedCost,
        referralFee,
        storageTotal,
        totalFees,
        netProfit,
        marginPercent,
        roiPercent,
      });
      toast.success("Calculation complete!");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during calculation.");
    } finally {
      setLoading(false);
    }
  };

  const saveScenario = async () => {
    if (!outputs) return;
    setSaving(true);
    try {
      const result = await saveScenarioAction(scenarioName, inputs, outputs);
      if (result.success) {
        toast.success("Scenario saved successfully!");
        setScenarioName("");
      } else {
        toast.error(result.reason || "Failed to save");
        if (result.reason?.includes("limit")) router.push("/upgrade");
      }
    } catch (error) {
      toast.error("An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  const getIndicatorColor = (roi: number) => {
    if (roi >= 40) return "bg-emerald-500";
    if (roi >= 25) return "bg-amber-500";
    return "bg-red-500";
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  const formatPercent = (val: number) => `${val.toFixed(2)}%`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid lg:grid-cols-2 gap-8"
    >
      {/* Inputs Column */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Calculator className="h-5 w-5 text-indigo-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Product Details</h2>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Buy Cost ($)</label>
              <input
                type="number"
                value={inputs.buyCost || ""}
                onChange={(e) => setInputs({ ...inputs, buyCost: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sale Price ($)</label>
              <input
                type="number"
                value={inputs.salePrice || ""}
                onChange={(e) => setInputs({ ...inputs, salePrice: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Shipping ($)</label>
              <input
                type="number"
                value={inputs.shippingPerUnit || ""}
                onChange={(e) => setInputs({ ...inputs, shippingPerUnit: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Prep Cost ($)</label>
              <input
                type="number"
                value={inputs.prepCost || ""}
                onChange={(e) => setInputs({ ...inputs, prepCost: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">FBA Fee ($)</label>
              <input
                type="number"
                value={inputs.fbaFee || ""}
                onChange={(e) => setInputs({ ...inputs, fbaFee: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Referral (%)</label>
              <input
                type="number"
                value={inputs.referralPercent || ""}
                onChange={(e) => setInputs({ ...inputs, referralPercent: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Storage/Mo ($)</label>
              <input
                type="number"
                value={inputs.monthlyStoragePerUnit || ""}
                onChange={(e) => setInputs({ ...inputs, monthlyStoragePerUnit: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Months to Sell</label>
              <input
                type="number"
                value={inputs.expectedMonthsToSell || ""}
                onChange={(e) => setInputs({ ...inputs, expectedMonthsToSell: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <button
            onClick={calculate}
            disabled={loading}
            className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Calculator className="h-5 w-5" />}
            Calculate Profit
          </button>
        </div>
      </div>

      {/* Outputs Column */}
      <div className="space-y-6">
        {outputs ? (
          <>
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className={`h-2 ${getIndicatorColor(outputs.roiPercent)}`} />
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">Net Profit</h3>
                    <div className="text-4xl font-extrabold text-slate-900 mt-1">{formatCurrency(outputs.netProfit)}</div>
                  </div>
                  <div className={`px-4 py-2 rounded-xl text-white font-bold flex items-center gap-2 ${getIndicatorColor(outputs.roiPercent)}`}>
                    <TrendingUp className="h-4 w-4" />
                    {formatPercent(outputs.roiPercent)} ROI
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <div className="text-slate-500 text-xs font-medium uppercase mb-1">Margin</div>
                    <div className="text-xl font-bold text-slate-900">{formatPercent(outputs.marginPercent)}</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <div className="text-slate-500 text-xs font-medium uppercase mb-1">Landed Cost</div>
                    <div className="text-xl font-bold text-slate-900">{formatCurrency(outputs.landedCost)}</div>
                  </div>
                </div>

                <div className="mt-8 space-y-3 border-t border-slate-100 pt-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Referral Fee</span>
                    <span className="font-medium">{formatCurrency(outputs.referralFee)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">FBA Fee</span>
                    <span className="font-medium">{formatCurrency(inputs.fbaFee)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Storage Total</span>
                    <span className="font-medium">{formatCurrency(outputs.storageTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold pt-2 border-t border-slate-50">
                    <span className="text-slate-900">Total Fees</span>
                    <span className="text-indigo-600">{formatCurrency(outputs.totalFees)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
              <h4 className="text-sm font-bold text-slate-900 mb-4">Save this scenario</h4>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Scenario name (optional)"
                  value={scenarioName}
                  onChange={(e) => setScenarioName(e.target.value)}
                  className="flex-grow px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <button
                  onClick={saveScenario}
                  disabled={saving}
                  className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-12 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <Calculator className="h-8 w-8 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Ready to calculate?</h3>
            <p className="text-slate-500 max-w-xs">Enter your product details on the left and click calculate to see your potential profit.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
