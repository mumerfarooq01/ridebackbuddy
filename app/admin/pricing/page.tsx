"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";

interface PricingSetting {
  id: string;
  key: string;
  value: string;
  label: string;
}

const DEFAULT_PRICING = [
  { key: "BASE_FARE", label: "Base Fare (first 10 km)", value: "31.00" },
  { key: "BASE_KM", label: "Included kilometres in base fare", value: "10" },
  { key: "PER_KM_RATE", label: "Rate per km over base ($/km)", value: "2.75" },
  { key: "CC_SURCHARGE", label: "Credit card surcharge ($)", value: "1.00" },
  { key: "STOP_FEE", label: "Intermediate stop fee ($ each)", value: "3.00" },
  { key: "TOLL_407_BASE", label: "407 ETR base fee ($)", value: "15.00" },
  { key: "TOLL_407_PER_KM", label: "407 ETR per km rate ($/km)", value: "0.25" },
];

export default function PricingPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/pricing")
      .then((r) => r.json())
      .then((settings: PricingSetting[]) => {
        const map: Record<string, string> = {};
        DEFAULT_PRICING.forEach((d) => { map[d.key] = d.value; });
        settings.forEach((s) => { map[s.key] = s.value; });
        setValues(map);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const updates = DEFAULT_PRICING.map((d) => ({ key: d.key, value: values[d.key] ?? d.value }));
    await fetch("/api/admin/pricing", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputCls = "w-full px-4 py-3 rounded-xl bg-white border border-mist text-ink focus:border-amber focus:outline-none transition-colors text-right font-mono";

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="font-heading text-2xl font-bold text-navy">Pricing Settings</h1>
        <p className="text-muted text-sm mt-1">Edit fare rates — changes take effect immediately on the booking form</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-6 h-6 border-2 border-amber border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white border border-mist rounded-2xl shadow-sm divide-y divide-mist">
          {DEFAULT_PRICING.map((item) => (
            <div key={item.key} className="flex items-center justify-between gap-4 px-6 py-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-navy">{item.label}</p>
                <p className="text-xs text-muted font-mono mt-0.5">{item.key}</p>
              </div>
              <div className="w-28">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={values[item.key] ?? item.value}
                  onChange={(e) => setValues({ ...values, [item.key]: e.target.value })}
                  className={inputCls}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving || loading}
        className="flex items-center gap-2 bg-amber hover:opacity-90 text-navy px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-amber/20 disabled:opacity-50"
      >
        <Save className="w-4 h-4" />
        {saving ? "Saving…" : saved ? "Saved!" : "Save Changes"}
      </button>

      <div className="bg-amber/10 border border-amber/30 rounded-xl px-5 py-4 text-sm text-navy">
        <p className="font-semibold mb-1">Note on pricing updates</p>
        <p className="text-muted">
          The booking form currently uses the hardcoded fare logic in BookingContent.tsx.
          After saving here, update the <code className="bg-white px-1 rounded text-xs">calcFare</code> function
          in <code className="bg-white px-1 rounded text-xs">app/book/BookingContent.tsx</code> to
          fetch these values dynamically if you want the form to reflect changes automatically.
        </p>
      </div>
    </div>
  );
}
