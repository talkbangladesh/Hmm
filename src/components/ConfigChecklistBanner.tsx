import React, { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';

export interface ConfigStatus {
  supabaseClientConfigured: boolean;
  supabaseAdminConfigured: boolean;
  web3formsConfigured: boolean;
  paymentMethodsConfigured: {
    bkash: boolean;
    nagad: boolean;
  };
}

export function ConfigChecklistBanner({ context }: { context: 'auth' | 'payment' | 'admin' | 'enquiry' }) {
  const [status, setStatus] = useState<ConfigStatus | null>(null);

  useEffect(() => {
    fetch('/api/config-status')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setStatus(data))
      .catch(() => null);
  }, []);

  if (!status) return null;

  const missing: string[] = [];
  if (context === 'auth' || context === 'admin') {
    if (!status.supabaseClientConfigured) missing.push('VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY');
    if (!status.supabaseAdminConfigured) missing.push('SUPABASE_URL & SUPABASE_SERVICE_ROLE_KEY');
  }
  if (context === 'payment' || context === 'admin') {
    if (!status.paymentMethodsConfigured.bkash && !status.paymentMethodsConfigured.nagad) {
      missing.push('bKash / Nagad recipient numbers (configure in Admin Panel -> Payment Settings or .env)');
    }
  }
  if (context === 'enquiry' || context === 'admin') {
    if (!status.web3formsConfigured) missing.push('WEB3FORMS_ACCESS_KEY (for email delivery to educationatlas@gmail.com)');
  }

  if (missing.length === 0) return null;

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-sm text-amber-950">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold">Configuration Required for Full Live Operation</p>
          <ul className="list-disc pl-5 text-xs space-y-1 text-amber-900">
            {missing.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
