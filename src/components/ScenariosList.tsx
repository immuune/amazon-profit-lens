"use client";

import { useState } from "react";
import { deleteScenarioAction, updateScenarioNameAction } from "@/src/actions";
import { Trash2, Edit2, Check, X, Calendar, TrendingUp, DollarSign, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";

type Scenario = {
  id: string;
  name: string;
  inputs_json: any;
  outputs_json: any;
  updated_at: string;
};

import { motion, AnimatePresence } from "motion/react";

export default function ScenariosList({ initialScenarios }: { initialScenarios: Scenario[] }) {
  const [scenarios, setScenarios] = useState(initialScenarios);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [search, setSearch] = useState("");

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this scenario?")) return;
    try {
      await deleteScenarioAction(id);
      setScenarios(scenarios.filter(s => s.id !== id));
      toast.success("Scenario deleted");
    } catch (error) {
      toast.error("Failed to delete scenario");
    }
  };

  const handleUpdateName = async (id: string) => {
    if (!editName.trim()) return;
    try {
      await updateScenarioNameAction(id, editName);
      setScenarios(scenarios.map(s => s.id === id ? { ...s, name: editName } : s));
      setEditingId(null);
      toast.success("Name updated");
    } catch (error) {
      toast.error("Failed to update name");
    }
  };

  const filteredScenarios = scenarios.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  const formatPercent = (val: number) => `${val.toFixed(2)}%`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="Search scenarios..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div className="text-sm text-slate-500 font-medium">
          {filteredScenarios.length} Scenarios
        </div>
      </div>

      <div className="grid gap-4">
        <AnimatePresence mode="popLayout">
          {filteredScenarios.length > 0 ? (
            filteredScenarios.map((scenario, index) => (
              <motion.div
                key={scenario.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-grow">
                      {editingId === scenario.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="px-3 py-1 border border-indigo-500 rounded-lg outline-none text-lg font-bold"
                            autoFocus
                          />
                          <button onClick={() => handleUpdateName(scenario.id)} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-lg">
                            <Check className="h-5 w-5" />
                          </button>
                          <button onClick={() => setEditingId(null)} className="p-1 text-red-600 hover:bg-red-50 rounded-lg">
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 group">
                          <h3 className="text-xl font-bold text-slate-900">{scenario.name}</h3>
                          <button 
                            onClick={() => { setEditingId(scenario.id); setEditName(scenario.name); }}
                            className="p-1 text-slate-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-slate-400 text-xs mt-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(scenario.updated_at), "MMM d, yyyy HH:mm")}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleDelete(scenario.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">ROI</div>
                      <div className={`text-lg font-bold ${scenario.outputs_json.roiPercent >= 25 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {formatPercent(scenario.outputs_json.roiPercent)}
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Margin</div>
                      <div className="text-lg font-bold text-slate-900">
                        {formatPercent(scenario.outputs_json.marginPercent)}
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Profit</div>
                      <div className="text-lg font-bold text-slate-900">
                        {formatCurrency(scenario.outputs_json.netProfit)}
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Sale Price</div>
                      <div className="text-lg font-bold text-slate-900">
                        {formatCurrency(scenario.inputs_json.salePrice)}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-8 w-8 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No scenarios found</h3>
              <p className="text-slate-500">Start by calculating a deal and saving it to your list.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
