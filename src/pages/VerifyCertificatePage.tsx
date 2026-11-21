import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Award, CheckCircle2, XCircle, Search, AlertCircle } from 'lucide-react';
import { apiFetch, ApiError } from '../lib/api';

interface VerifyResult {
  status: 'valid' | 'revoked' | 'not_found';
  certificate: {
    certificateCode: string;
    participantName: string;
    programmeCode: string;
    programmeTitle: string;
    certificateType: string;
    issueDate: string;
    status: string;
    revokedReason?: string;
  } | null;
}

export function VerifyCertificatePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [code, setCode] = useState(searchParams.get('code') || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function lookup(targetCode: string) {
    const trimmed = targetCode.trim();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await apiFetch<VerifyResult>(
        `/api/certificates/verify/${encodeURIComponent(trimmed)}`
      );
      setResult(res);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to verify certificate.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const initial = searchParams.get('code');
    if (initial) {
      lookup(initial);
    }
  }, [searchParams]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setSearchParams({ code: code.trim().toUpperCase() });
    lookup(code.trim().toUpperCase());
  }

  return (
    <div className="bg-white text-[#0F172A]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div className="space-y-4 border-b border-[#E3E8EF] pb-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#1D4ED8]">
            <Award className="w-4 h-4" strokeWidth={1.5} />
            <span>Public Registry Verification</span>
          </div>
          <h1 className="text-3xl sm:text-[36px] font-bold text-[#0F172A] tracking-[-0.02em]">
            Verify Certificate
          </h1>
          <p className="text-sm sm:text-base text-[#334155] leading-relaxed max-w-[68ch]">
            Enter the unique Atlas AI Education Certificate ID (for example,{' '}
            <span className="font-semibold text-[#0F172A]">AAE-AL101-2026-XXXXXX</span>) to confirm authenticity, participant details, programme name, and issuance status.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 pt-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" strokeWidth={1.5} />
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Enter Certificate ID..."
                className="w-full min-h-[48px] pl-10 pr-4 py-2.5 text-sm uppercase border border-[#CBD5E1] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="min-h-[48px] px-6 py-2.5 text-sm font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] disabled:opacity-60 rounded-[8px] whitespace-nowrap transition-colors"
            >
              {loading ? 'Verifying...' : 'Verify Certificate'}
            </button>
          </form>
        </div>

        {error && (
          <div className="p-4 rounded-[12px] bg-[#FFFBEB] border border-[#FDE68A] flex items-start gap-3 text-sm text-[#92400E]">
            <AlertCircle className="w-5 h-5 text-[#B45309] shrink-0 mt-0.5" strokeWidth={1.5} />
            <p>{error}</p>
          </div>
        )}

        {result && result.status === 'not_found' && (
          <div className="p-5 rounded-[12px] bg-[#FEF2F2] border border-[#FECACA] flex items-start gap-3 text-sm text-[#991B1B]">
            <XCircle className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" strokeWidth={1.5} />
            <div>
              <p className="font-semibold">Certificate Record Not Found</p>
              <p className="mt-1 text-xs">
                No issued certificate matches that ID. Please double-check the exact Certificate ID or contact educationatlas@gmail.com.
              </p>
            </div>
          </div>
        )}

        {result && result.certificate && (
          <div
            className={`p-6 rounded-[12px] border space-y-4 ${
              result.status === 'valid'
                ? 'bg-[#F0FDF4] border-[#BBF7D0]'
                : 'bg-[#FEF2F2] border-[#FECACA]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {result.status === 'valid' ? (
                <CheckCircle2 className="w-6 h-6 text-[#15803D]" strokeWidth={1.5} />
              ) : (
                <XCircle className="w-6 h-6 text-[#DC2626]" strokeWidth={1.5} />
              )}
              <div>
                <p className="text-xs uppercase tracking-wide font-bold text-[#334155]">
                  Verification Status: {result.status === 'valid' ? 'VALID CERTIFICATE' : 'REVOKED'}
                </p>
                <p className="text-lg font-bold text-[#0F172A]">
                  {result.certificate.participantName}
                </p>
              </div>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#E3E8EF] text-sm">
              <div>
                <dt className="text-xs text-[#64748B]">Certificate ID</dt>
                <dd className="font-semibold text-[#0F172A]">
                  {result.certificate.certificateCode}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[#64748B]">Certificate Type</dt>
                <dd className="font-medium text-[#0F172A]">{result.certificate.certificateType}</dd>
              </div>
              <div>
                <dt className="text-xs text-[#64748B]">Programme</dt>
                <dd className="font-medium text-[#0F172A]">
                  {result.certificate.programmeCode} — {result.certificate.programmeTitle}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[#64748B]">Issue Date</dt>
                <dd className="text-[#0F172A]">{result.certificate.issueDate}</dd>
              </div>
            </dl>

            {result.certificate.revokedReason && (
              <p className="text-xs text-[#991B1B] pt-2 border-t border-[#FECACA]">
                Revocation Note: {result.certificate.revokedReason}
              </p>
            )}
          </div>
        )}

        <p className="text-xs text-[#64748B] text-center pt-4 border-t border-[#E3E8EF]">
          View our{' '}
          <Link to="/certificate-policy" className="text-[#1D4ED8] underline">
            Certificate Policy
          </Link>{' '}
          for institutional verification and non-accredited recognition terms.
        </p>
      </div>
    </div>
  );
}
