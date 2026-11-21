import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, CheckCircle2, AlertCircle, Printer, Trash2 } from 'lucide-react';
import { useDashboard, type EnrolmentRow } from './DashboardContext';
import { RESOURCES } from '../../data/resources';
import { apiFetch, ApiError } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { EnrolmentModal } from '../../components/EnrolmentModal';

export function DashboardCertificates() {
  const { data } = useDashboard();
  const certificates = data?.certificates || [];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold text-slate-950">My Certificates</h1>
        <Link to="/verify-certificate" className="text-xs font-semibold text-blue-700 hover:underline">
          Public Verification Portal →
        </Link>
      </div>

      {certificates.length === 0 ? (
        <p className="text-sm text-slate-500">
          Certificates appear here once issued by Atlas AI Education upon completing cohort requirements.
        </p>
      ) : (
        <div className="space-y-4">
          {certificates.map((cert) => (
            <div key={cert.id} className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-mono-tabular uppercase tracking-wider text-blue-700 font-semibold">
                    {cert.certificate_type} · {cert.status.toUpperCase()}
                  </p>
                  <h2 className="font-display text-xl font-bold text-slate-950">{cert.programme_title}</h2>
                  <p className="text-sm text-slate-700">Recipient: {cert.participant_name}</p>
                  <p className="text-xs font-mono-tabular text-slate-500">
                    ID: {cert.certificate_code} · Issued: {cert.issue_date}
                  </p>
                </div>
                <Award className="w-8 h-8 text-blue-700 shrink-0" />
              </div>

              <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-200 no-print">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg"
                >
                  <Printer className="w-3.5 h-3.5" /> Print / Save PDF
                </button>
                <Link
                  to={`/verify-certificate?code=${encodeURIComponent(cert.certificate_code)}`}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 border border-slate-300 bg-white rounded-lg hover:bg-slate-50"
                >
                  Verify Publicly
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function DashboardResources() {
  const { data } = useDashboard();
  const savedIds = (data?.savedResources || []).map((s) => s.resource_id);
  const savedItems = RESOURCES.filter((r) => savedIds.includes(r.id));

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold text-slate-950">My Resources</h1>
        <Link to="/resources" className="text-xs font-semibold text-blue-700 hover:underline">
          Open Full Resources Library →
        </Link>
      </div>

      {savedItems.length === 0 ? (
        <div className="text-sm text-slate-500 space-y-3">
          <p>You have not bookmarked any eBooks or Prompts yet.</p>
          <Link to="/resources" className="inline-flex px-4 py-2 text-xs font-semibold text-white bg-blue-700 rounded-lg">
            Browse eBooks &amp; Prompt Library
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedItems.map((item) => (
            <div key={item.id} className="p-4 rounded-xl border border-slate-200 space-y-2">
              <p className="text-xs font-mono-tabular text-blue-700 font-semibold">
                {item.code} · {item.topicCategory}
              </p>
              <h2 className="font-semibold text-slate-900">{item.title}</h2>
              <Link
                to={`/resources/${item.id}`}
                className="inline-block text-xs font-semibold text-blue-700 hover:underline"
              >
                Open Resource →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function DashboardScholarships() {
  const { data } = useDashboard();
  const scholarships = data?.scholarships || [];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold text-slate-950">Scholarship Applications</h1>
        <Link to="/scholarships" className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 rounded-lg">
          New Application
        </Link>
      </div>

      {scholarships.length === 0 ? (
        <p className="text-sm text-slate-500">You have not submitted any scholarship applications yet.</p>
      ) : (
        <div className="space-y-3">
          {scholarships.map((s) => (
            <div key={s.id} className="p-4 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between gap-4">
                <p className="font-semibold text-slate-900">
                  {s.course_code} — {s.course_title}
                </p>
                <span className="text-xs font-mono-tabular font-bold uppercase text-blue-700">
                  {s.status.replace('_', ' ')}
                </span>
              </div>
              {s.approved_waiver_percent > 0 && (
                <p className="text-xs text-emerald-700 font-medium">
                  Approved Waiver: {s.approved_waiver_percent}% · Remaining Payable: BDT{' '}
                  {s.remaining_payable_bdt?.toLocaleString() ?? 'Calculated at enrolment'}
                </p>
              )}
              {s.admin_notes && <p className="text-xs text-slate-600">Committee Note: {s.admin_notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function DashboardPayments() {
  const { data, reload } = useDashboard();
  const payments = data?.payments || [];
  const pendingEnrolments = (data?.enrolments || []).filter((e) => e.status === 'pending_payment');
  const [payingEnrolment, setPayingEnrolment] = useState<EnrolmentRow | null>(null);

  return (
    <div className="space-y-6">
      {pendingEnrolments.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 space-y-4">
          <h2 className="font-display text-lg font-bold text-amber-950">
            Pending Enrolments Awaiting Manual Payment
          </h2>
          <div className="space-y-3">
            {pendingEnrolments.map((e) => (
              <div
                key={e.id}
                className="bg-white border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <p className="text-xs font-mono-tabular font-bold text-blue-700">{e.programme_code}</p>
                  <p className="font-semibold text-sm text-slate-900">{e.programme_title}</p>
                  <p className="text-xs font-mono-tabular text-slate-600 mt-0.5">
                    Payable Fee: BDT {e.payable_fee_bdt.toLocaleString()}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPayingEnrolment(e)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg"
                >
                  Submit bKash / Nagad TrxID
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4">
        <h1 className="font-display text-2xl font-bold text-slate-950">Payments &amp; Enrolments</h1>
        {payments.length === 0 ? (
          <p className="text-sm text-slate-500">No payment transactions recorded yet.</p>
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="min-w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold text-slate-800">Programme</th>
                  <th className="px-4 py-3 font-semibold text-slate-800">Method</th>
                  <th className="px-4 py-3 font-semibold text-slate-800">TrxID</th>
                  <th className="px-4 py-3 font-semibold text-slate-800">Amount</th>
                  <th className="px-4 py-3 font-semibold text-slate-800">Status</th>
                  <th className="px-4 py-3 font-semibold text-slate-800">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3 font-medium text-slate-900">{p.programme_code}</td>
                    <td className="px-4 py-3 uppercase font-mono-tabular">{p.method}</td>
                    <td className="px-4 py-3 font-mono-tabular">{p.transaction_id}</td>
                    <td className="px-4 py-3 font-mono-tabular">BDT {p.amount_bdt.toLocaleString()}</td>
                    <td className="px-4 py-3 uppercase font-mono-tabular font-semibold">{p.status}</td>
                    <td className="px-4 py-3 font-mono-tabular text-slate-600">{p.receipt_number || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {payingEnrolment && (
        <EnrolmentModal
          isOpen={Boolean(payingEnrolment)}
          onClose={() => {
            setPayingEnrolment(null);
            reload();
          }}
          programmeCode={payingEnrolment.programme_code}
          programmeTitle={payingEnrolment.programme_title}
          isFreeSpecialized={false}
          regularFeeBdt={payingEnrolment.regular_fee_bdt}
          discountedFeeBdt={payingEnrolment.payable_fee_bdt}
        />
      )}
    </div>
  );
}

export function DashboardNotifications() {
  const { data, reload } = useDashboard();
  const notifications = data?.notifications || [];

  async function markAllRead() {
    await apiFetch('/api/learner/notifications/read', {
      method: 'PATCH',
      requireAuth: true,
      body: JSON.stringify({}),
    });
    await reload();
  }

  async function deleteItem(id: string) {
    await apiFetch(`/api/learner/notifications/${id}`, {
      method: 'DELETE',
      requireAuth: true,
    });
    await reload();
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold text-slate-950">Notifications</h1>
        {notifications.some((n) => !n.is_read) && (
          <button
            type="button"
            onClick={markAllRead}
            className="text-xs font-semibold text-blue-700 hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <p className="text-sm text-slate-500">You have no notifications.</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-xl border flex items-start justify-between gap-4 ${
                n.is_read ? 'bg-white border-slate-200' : 'bg-blue-50/50 border-blue-200'
              }`}
            >
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-900">{n.title}</p>
                <p className="text-xs text-slate-600 leading-relaxed">{n.body}</p>
                <p className="text-[11px] font-mono-tabular text-slate-400">
                  {new Date(n.created_at).toLocaleString()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => deleteItem(n.id)}
                aria-label="Delete notification"
                className="p-1.5 text-slate-400 hover:text-red-700 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function DashboardSettings() {
  const { updatePassword, signOut } = useAuth();
  const [newPass, setNewPass] = useState('');
  const [passMsg, setPassMsg] = useState<string | null>(null);
  const [confirmDeactivate, setConfirmDeactivate] = useState('');
  const [deactErr, setDeactErr] = useState<string | null>(null);

  async function handlePassUpdate(e: React.FormEvent) {
    e.preventDefault();
    setPassMsg(null);
    if (newPass.length < 8) {
      setPassMsg('Password must be at least 8 characters.');
      return;
    }
    const res = await updatePassword(newPass);
    setPassMsg(res.error || 'Password updated.');
    if (!res.error) setNewPass('');
  }

  async function handleExport() {
    const data = await apiFetch<Record<string, unknown>>('/api/learner/export-data', { requireAuth: true });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'atlas-ai-education-account-data.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleDeactivate(e: React.FormEvent) {
    e.preventDefault();
    setDeactErr(null);
    try {
      await apiFetch('/api/learner/deactivate-account', {
        method: 'POST',
        requireAuth: true,
        body: JSON.stringify({ confirmation: confirmDeactivate }),
      });
      await signOut();
    } catch (err) {
      setDeactErr(err instanceof ApiError ? err.message : 'Unable to deactivate account.');
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4">
        <h1 className="font-display text-2xl font-bold text-slate-950">Account Settings</h1>
        <form onSubmit={handlePassUpdate} className="space-y-3 max-w-md">
          <h2 className="font-semibold text-sm text-slate-900">Change Password</h2>
          {passMsg && <p className="text-xs text-blue-700">{passMsg}</p>}
          <input
            type="password"
            minLength={8}
            required
            placeholder="New Password (min 8 chars)"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
          />
          <button type="submit" className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 rounded-lg">
            Update Password
          </button>
        </form>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-3">
        <h2 className="font-semibold text-base text-slate-900">Data Export</h2>
        <p className="text-xs text-slate-600">
          Download a JSON copy of your profile, enrolments, payments, scholarships, and certificates.
        </p>
        <button
          type="button"
          onClick={handleExport}
          className="px-4 py-2 text-xs font-semibold text-slate-800 border border-slate-300 hover:bg-slate-50 rounded-lg"
        >
          Download My Account Data (JSON)
        </button>
      </div>

      <div className="bg-white border border-red-200 rounded-2xl p-6 sm:p-8 space-y-3">
        <h2 className="font-semibold text-base text-red-900">Deactivate Account</h2>
        <p className="text-xs text-slate-600">
          Type <span className="font-mono-tabular font-bold">DEACTIVATE</span> to deactivate your account access.
        </p>
        {deactErr && <p className="text-xs text-red-700">{deactErr}</p>}
        <form onSubmit={handleDeactivate} className="flex flex-col sm:flex-row gap-3 max-w-md">
          <input
            type="text"
            value={confirmDeactivate}
            onChange={(e) => setConfirmDeactivate(e.target.value)}
            placeholder="Type DEACTIVATE"
            className="px-3.5 py-2 text-sm border border-red-300 rounded-lg font-mono-tabular"
          />
          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 rounded-lg"
          >
            Deactivate Account
          </button>
        </form>
      </div>
    </div>
  );
}

export function DashboardSupport() {
  const { data, reload } = useDashboard();
  const tickets = data?.supportTickets || [];
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Enrolment & Payment');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setOk(false);
    setErr(null);
    try {
      await apiFetch('/api/learner/support-tickets', {
        method: 'POST',
        requireAuth: true,
        body: JSON.stringify({ subject, category, message }),
      });
      setSubject('');
      setMessage('');
      setOk(true);
      await reload();
    } catch (error) {
      setErr(error instanceof ApiError ? error.message : 'Unable to submit support ticket.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h1 className="font-display text-2xl font-bold text-slate-950">Help &amp; Support</h1>
          <Link to="/contact" className="text-xs font-semibold text-blue-700 hover:underline">
            Direct Email / WhatsApp Details →
          </Link>
        </div>

        {ok && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>Support ticket submitted. Our team will review and respond.</span>
          </div>
        )}
        {err && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-700" />
            <span>{err}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg bg-white"
              >
                <option>Enrolment & Payment</option>
                <option>Class Schedule & Access</option>
                <option>Scholarship Review</option>
                <option>Certificate Issue</option>
                <option>Technical Issue</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Subject *</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Message *</label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-700 rounded-lg"
          >
            {submitting ? 'Submitting...' : 'Submit Support Ticket'}
          </button>
        </form>
      </div>

      {tickets.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
          <h2 className="font-display text-lg font-bold text-slate-900">Your Support Tickets</h2>
          {tickets.map((t) => (
            <div key={t.id} className="p-4 rounded-xl border border-slate-200 space-y-1">
              <div className="flex justify-between gap-2 text-xs">
                <span className="font-semibold text-slate-900">{t.subject}</span>
                <span className="font-mono-tabular uppercase text-blue-700">{t.status}</span>
              </div>
              <p className="text-xs text-slate-600">{t.message}</p>
              {t.admin_reply && (
                <p className="text-xs text-emerald-800 pt-1">Admin Reply: {t.admin_reply}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
