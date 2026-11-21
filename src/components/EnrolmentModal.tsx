import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiFetch, ApiError } from '../lib/api';

interface PaymentMethodInfo {
  method: 'bkash' | 'nagad';
  enabled: boolean;
  accountNumber: string | null;
  accountType: string;
  instructions: string;
}

interface PaymentMethodsResponse {
  bkash: PaymentMethodInfo;
  nagad: PaymentMethodInfo;
  configured: boolean;
}

interface EnrolmentRecord {
  id: string;
  programme_code: string;
  programme_title: string;
  status: string;
  discounted_fee_bdt: number;
  scholarship_discount_bdt: number;
  payable_fee_bdt: number;
}

export function EnrolmentModal({
  isOpen,
  onClose,
  programmeCode,
  programmeTitle,
  isFreeSpecialized,
  eligibilityLabel,
  regularFeeBdt,
  discountedFeeBdt,
}: {
  isOpen: boolean;
  onClose: () => void;
  programmeCode: string;
  programmeTitle: string;
  isFreeSpecialized: boolean;
  eligibilityLabel?: string;
  regularFeeBdt: number;
  discountedFeeBdt: number;
}) {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [eligibilityConfirmed, setEligibilityConfirmed] = useState(false);
  const [enrolment, setEnrolment] = useState<EnrolmentRecord | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodsResponse | null>(null);
  const [method, setMethod] = useState<'bkash' | 'nagad'>('bkash');
  const [senderNumber, setSenderNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [amountBdt, setAmountBdt] = useState('');
  const [studentNotes, setStudentNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    setSuccessMsg(null);
    setEnrolment(null);
    setEligibilityConfirmed(false);
    setSenderNumber(profile?.phone || '');
    setAmountBdt(String(discountedFeeBdt || 0));

    if (!isFreeSpecialized) {
      fetch('/api/payment-methods')
        .then((r) => r.json())
        .then((d: PaymentMethodsResponse) => {
          setPaymentMethods(d);
          if (!d.bkash.enabled && d.nagad.enabled) setMethod('nagad');
        })
        .catch(() => null);
    }
  }, [isOpen, discountedFeeBdt, isFreeSpecialized, profile?.phone]);

  if (!isOpen) return null;

  const needsEligibilityCheck = programmeCode === 'SP-05' || programmeCode === 'SP-06';

  async function handleStartEnrolment() {
    setError(null);
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    if (needsEligibilityCheck && !eligibilityConfirmed) {
      setError(`Please confirm the ${eligibilityLabel || 'programme eligibility'} requirement first.`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiFetch<{ enrolment: EnrolmentRecord; alreadyExists?: boolean }>(
        '/api/learner/enrol',
        {
          method: 'POST',
          requireAuth: true,
          body: JSON.stringify({
            programmeCode,
            eligibilityConfirmed,
          }),
        }
      );

      setEnrolment(res.enrolment);
      setAmountBdt(String(res.enrolment.payable_fee_bdt));

      if (isFreeSpecialized) {
        setSuccessMsg(
          res.alreadyExists
            ? 'You are already enrolled in this Specialized Programme. Access your course in Dashboard.'
            : 'Enrolment confirmed. Your tuition-free Specialized Programme is now active in your dashboard.'
        );
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to process enrolment.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePaymentSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!enrolment) return;
    setError(null);
    setSubmitting(true);
    try {
      await apiFetch('/api/learner/payments', {
        method: 'POST',
        requireAuth: true,
        body: JSON.stringify({
          enrolmentId: enrolment.id,
          method,
          senderNumber,
          transactionId,
          amountBdt: Number(amountBdt),
          studentNotes,
        }),
      });
      setSuccessMsg(
        'Your manual payment details have been submitted for verification. Course access will activate once confirmed by an administrator.'
      );
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Payment submission failed.');
    } finally {
      setSubmitting(false);
    }
  }

  const activeChannel = paymentMethods ? paymentMethods[method] : null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="enrol-modal-title"
    >
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4 sticky top-0 bg-white z-10">
          <div>
            <p className="text-xs tabular-nums uppercase tracking-wider text-blue-700 font-semibold">
              {programmeCode}
            </p>
            <h2 id="enrol-modal-title" className="font-display text-lg font-bold text-slate-900">
              {programmeTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {!user ? (
            <div className="space-y-4">
              <p className="text-sm text-slate-700 leading-relaxed">
                Please sign in with your verified Atlas AI Education account to enrol in{' '}
                <strong className="text-slate-900">{programmeTitle}</strong>.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to={`/login?redirect=${encodeURIComponent(window.location.pathname)}`}
                  className="px-4 py-2.5 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg"
                >
                  Sign In to Continue
                </Link>
                <Link
                  to={`/signup?redirect=${encodeURIComponent(window.location.pathname)}`}
                  className="px-4 py-2.5 text-sm font-medium text-slate-700 border border-slate-300 hover:bg-slate-50 rounded-lg"
                >
                  Create Account
                </Link>
              </div>
            </div>
          ) : successMsg ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <p className="text-sm text-emerald-950 leading-relaxed">{successMsg}</p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate(isFreeSpecialized ? '/dashboard/courses' : '/dashboard/payments');
                  }}
                  className="px-4 py-2.5 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg"
                >
                  Go to My Dashboard
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-sm font-medium text-slate-700 border border-slate-300 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          ) : !enrolment ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Programme Fee</span>
                  <span className="tabular-nums font-semibold text-slate-900">
                    {isFreeSpecialized
                      ? 'FREE (BDT 0)'
                      : `BDT ${discountedFeeBdt.toLocaleString()}`}
                  </span>
                </div>
                {!isFreeSpecialized && regularFeeBdt > discountedFeeBdt && (
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Regular Fee</span>
                    <span className="line-through tabular-nums">
                      BDT {regularFeeBdt.toLocaleString()}
                    </span>
                  </div>
                )}
                {!isFreeSpecialized && (
                  <p className="text-xs text-slate-600 pt-2 border-t border-slate-200">
                    Approved scholarship waivers on {programmeCode} are automatically applied in the next step.
                  </p>
                )}
              </div>

              {needsEligibilityCheck && (
                <label className="flex items-start gap-2.5 text-sm text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={eligibilityConfirmed}
                    onChange={(e) => setEligibilityConfirmed(e.target.checked)}
                    className="mt-1 rounded border-slate-300 text-blue-700 focus:ring-blue-600"
                  />
                  <span>
                    I confirm that I meet the stated participant eligibility requirement:{' '}
                    <strong>{eligibilityLabel}</strong>.
                  </span>
                </label>
              )}

              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="button"
                disabled={submitting}
                onClick={handleStartEnrolment}
                className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-60 rounded-lg transition-colors"
              >
                {submitting
                  ? 'Processing...'
                  : isFreeSpecialized
                  ? 'Confirm Free Enrolment'
                  : 'Continue to Manual Payment (bKash / Nagad)'}
              </button>
            </div>
          ) : (
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Discounted Course Fee</span>
                  <span className="tabular-nums text-slate-900">
                    BDT {enrolment.discounted_fee_bdt.toLocaleString()}
                  </span>
                </div>
                {enrolment.scholarship_discount_bdt > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Approved Scholarship Waiver</span>
                    <span className="tabular-nums">
                      - BDT {enrolment.scholarship_discount_bdt.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Payable Amount</span>
                  <span className="tabular-nums text-blue-700">
                    BDT {enrolment.payable_fee_bdt.toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Select Payment Method
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {(['bkash', 'nagad'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMethod(m)}
                      className={`py-2.5 px-3 rounded-lg border text-sm font-semibold transition-colors ${
                        method === m
                          ? 'border-blue-700 bg-blue-50 text-blue-800'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {m === 'bkash' ? 'bKash' : 'Nagad'}
                    </button>
                  ))}
                </div>
              </div>

              {activeChannel?.enabled && activeChannel.accountNumber ? (
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-sm space-y-1.5">
                  <p className="font-semibold text-slate-900">
                    Official {method === 'bkash' ? 'bKash' : 'Nagad'} Recipient ({activeChannel.accountType})
                  </p>
                  <p className="tabular-nums text-lg font-bold text-blue-800">
                    {activeChannel.accountNumber}
                  </p>
                  <p className="text-xs text-slate-700">{activeChannel.instructions}</p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold">
                      Recipient {method === 'bkash' ? 'bKash' : 'Nagad'} Number Not Yet Configured
                    </p>
                    <p>
                      The administrator has not yet published a recipient account number in Admin Panel → Payment Settings. Your enrolment has been saved as Pending Payment; you can also confirm official payment details via educationatlas@gmail.com or WhatsApp Only: 01608401507 before transferring.
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Sender Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={senderNumber}
                    onChange={(e) => setSenderNumber(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Transaction ID (TrxID) *
                  </label>
                  <input
                    type="text"
                    required
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                    placeholder="e.g. 9K4L7M2P8Q"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg tabular-nums uppercase focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Amount Sent (BDT) *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={amountBdt}
                  onChange={(e) => setAmountBdt(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Reference Note (Optional)
                </label>
                <input
                  type="text"
                  value={studentNotes}
                  onChange={(e) => setStudentNotes(e.target.value)}
                  placeholder="Any helpful payment note"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-60 rounded-lg transition-colors"
              >
                {submitting ? 'Submitting Payment Verification...' : 'Submit Payment for Verification'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
