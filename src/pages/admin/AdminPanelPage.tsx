import React, { useCallback, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiFetch, ApiError } from '../../lib/api';
import { COURSES, SPECIALIZED_PROGRAMMES } from '../../data/catalogue';
import { ConfigChecklistBanner } from '../../components/ConfigChecklistBanner';

type AdminTab =
  | 'payments'
  | 'scholarships'
  | 'academics'
  | 'certificates'
  | 'users'
  | 'enquiries'
  | 'settings';

interface AdminOverview {
  users: Array<{
    id: string;
    email: string;
    full_name: string;
    phone: string;
    role: 'user' | 'admin';
    account_status: string;
    created_at: string;
  }>;
  enrolments: Array<{
    id: string;
    user_id: string;
    programme_code: string;
    programme_title: string;
    status: string;
    payable_fee_bdt: number;
    enrolled_at: string;
    profiles?: { full_name?: string; email?: string; phone?: string };
  }>;
  payments: Array<{
    id: string;
    enrolment_id: string;
    programme_code: string;
    method: string;
    sender_number: string;
    transaction_id: string;
    amount_bdt: number;
    status: string;
    receipt_number: string | null;
    created_at: string;
    profiles?: { full_name?: string; email?: string };
  }>;
  scholarships: Array<{
    id: string;
    full_name: string;
    email: string;
    course_code: string;
    course_title: string;
    learning_motivation: string;
    financial_need: string;
    status: string;
    approved_waiver_percent: number;
    remaining_payable_bdt: number | null;
  }>;
  schedules: Array<{
    id: string;
    programme_code: string;
    cohort_name: string;
    session_title: string;
    session_date: string;
    start_time: string;
    end_time: string;
  }>;
  assignments: Array<{
    id: string;
    programme_code: string;
    title: string;
    due_date: string | null;
  }>;
  submissions: Array<{
    id: string;
    submission_text: string;
    status: string;
    feedback: string;
    profiles?: { full_name?: string; email?: string };
    assignments?: { title?: string; programme_code?: string };
  }>;
  certificates: Array<{
    id: string;
    certificate_code: string;
    participant_name: string;
    programme_code: string;
    programme_title: string;
    certificate_type: string;
    issue_date: string;
    status: 'valid' | 'revoked';
  }>;
  tickets: Array<{
    id: string;
    subject: string;
    category: string;
    message: string;
    status: string;
    admin_reply: string;
    profiles?: { full_name?: string; email?: string };
  }>;
  contactEnquiries: Array<{
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: string;
    created_at: string;
  }>;
  institutionalEnquiries: Array<{
    id: string;
    organization_name: string;
    contact_name: string;
    email: string;
    sector_type: string;
    participant_count: string;
    delivery_format: string;
    objectives: string;
    status: string;
  }>;
  paymentSettings: {
    bkash: { accountNumber: string | null; accountType: string; instructions: string; enabled: boolean };
    nagad: { accountNumber: string | null; accountType: string; instructions: string; enabled: boolean };
  };
}

export function AdminPanelPage() {
  const { user, profile, loading } = useAuth();
  const [tab, setTab] = useState<AdminTab>('payments');
  const [data, setData] = useState<AdminOverview | null>(null);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Bulk enrolment approval selection
  const [selectedEnrolmentIds, setSelectedEnrolmentIds] = useState<string[]>([]);

  // Scholarship review inline state
  const [waiverMap, setWaiverMap] = useState<Record<string, number>>({});

  // Schedule & assignment creation
  const [schedCode, setSchedCode] = useState('AL-101');
  const [schedTitle, setSchedTitle] = useState('');
  const [schedDate, setSchedDate] = useState('');
  const [schedStart, setSchedStart] = useState('20:00');
  const [schedEnd, setSchedEnd] = useState('21:30');
  const [schedLink, setSchedLink] = useState('');

  const [assignCode, setAssignCode] = useState('AL-101');
  const [assignTitle, setAssignTitle] = useState('');
  const [assignDesc, setAssignDesc] = useState('');

  // Certificate issuance
  const [certUserId, setCertUserId] = useState('');
  const [certProgCode, setCertProgCode] = useState('AL-101');
  const [certType, setCertType] = useState('Certificate of Participation');

  // Payment settings form
  const [bkashNum, setBkashNum] = useState('');
  const [bkashType, setBkashType] = useState('Personal / Merchant');
  const [bkashEnabled, setBkashEnabled] = useState(false);
  const [nagadNum, setNagadNum] = useState('');
  const [nagadType, setNagadType] = useState('Personal / Merchant');
  const [nagadEnabled, setNagadEnabled] = useState(false);

  const loadAdminOverview = useCallback(async () => {
    setFetching(true);
    setError(null);
    try {
      const res = await apiFetch<AdminOverview>('/api/admin/overview', { requireAuth: true });
      setData(res);
      setBkashNum(res.paymentSettings.bkash.accountNumber || '');
      setBkashType(res.paymentSettings.bkash.accountType || 'Personal / Merchant');
      setBkashEnabled(Boolean(res.paymentSettings.bkash.enabled));
      setNagadNum(res.paymentSettings.nagad.accountNumber || '');
      setNagadType(res.paymentSettings.nagad.accountType || 'Personal / Merchant');
      setNagadEnabled(Boolean(res.paymentSettings.nagad.enabled));
      if (!certUserId && res.users.length > 0) {
        setCertUserId(res.users[0].id);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to load admin operations.');
    } finally {
      setFetching(false);
    }
  }, [certUserId]);

  useEffect(() => {
    if (user && profile?.role === 'admin') {
      loadAdminOverview();
    }
  }, [user, profile?.role, loadAdminOverview]);

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-16 text-sm text-slate-500">Checking credentials...</div>;
  }

  if (!user) {
    return <Navigate to="/login?redirect=/admin" replace />;
  }

  if (profile?.role !== 'admin') {
    return (
      <div className="max-w-xl mx-auto px-4 py-16">
        <div className="bg-white border border-red-200 rounded-2xl p-8 space-y-4">
          <h1 className="font-display text-2xl font-bold text-slate-950">403 — Administrator Access Required</h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Your signed-in account (<span className="font-mono-tabular">{user.email}</span>) does not hold administrator privileges. Admin operations are strictly isolated from standard student accounts.
          </p>
          <Link to="/dashboard" className="inline-flex px-4 py-2 text-xs font-semibold text-white bg-blue-700 rounded-lg">
            Go to Student Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const pendingEnrolments = (data?.enrolments || []).filter((e) => e.status === 'pending_payment');

  async function verifyPayment(paymentId: string, action: 'approved' | 'rejected' | 'partial' | 'refunded') {
    setNotice(null);
    setError(null);
    try {
      await apiFetch(`/api/admin/payments/${paymentId}/verify`, {
        method: 'POST',
        requireAuth: true,
        body: JSON.stringify({ action }),
      });
      setNotice(`Payment marked as ${action}.`);
      await loadAdminOverview();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Verification failed.');
    }
  }

  async function bulkApproveEnrolments() {
    if (selectedEnrolmentIds.length === 0) return;
    setNotice(null);
    setError(null);
    try {
      const res = await apiFetch<{ approvedCount: number }>('/api/admin/enrolments/bulk-approve', {
        method: 'POST',
        requireAuth: true,
        body: JSON.stringify({ enrolmentIds: selectedEnrolmentIds }),
      });
      setSelectedEnrolmentIds([]);
      setNotice(`Bulk approved ${res.approvedCount} pending enrolment(s).`);
      await loadAdminOverview();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Bulk approval failed.');
    }
  }

  async function reviewScholarship(id: string, status: 'approved' | 'partially_approved' | 'rejected') {
    const pct = waiverMap[id] ?? (status === 'approved' ? 50 : status === 'partially_approved' ? 25 : 0);
    setNotice(null);
    try {
      await apiFetch(`/api/admin/scholarships/${id}/review`, {
        method: 'PATCH',
        requireAuth: true,
        body: JSON.stringify({ status, approvedWaiverPercent: pct }),
      });
      setNotice(`Scholarship updated (${status}, ${pct}% waiver).`);
      await loadAdminOverview();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Scholarship review failed.');
    }
  }

  async function createSchedule(e: React.FormEvent) {
    e.preventDefault();
    try {
      await apiFetch('/api/admin/schedules', {
        method: 'POST',
        requireAuth: true,
        body: JSON.stringify({
          programmeCode: schedCode,
          sessionTitle: schedTitle,
          sessionDate: schedDate,
          startTime: schedStart,
          endTime: schedEnd,
          meetingLink: schedLink,
        }),
      });
      setSchedTitle('');
      setSchedLink('');
      setNotice('Class schedule session published.');
      await loadAdminOverview();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to publish schedule.');
    }
  }

  async function createAssignment(e: React.FormEvent) {
    e.preventDefault();
    try {
      await apiFetch('/api/admin/assignments', {
        method: 'POST',
        requireAuth: true,
        body: JSON.stringify({
          programmeCode: assignCode,
          title: assignTitle,
          description: assignDesc,
        }),
      });
      setAssignTitle('');
      setAssignDesc('');
      setNotice('Assignment published.');
      await loadAdminOverview();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to publish assignment.');
    }
  }

  async function issueCertificate(e: React.FormEvent) {
    e.preventDefault();
    try {
      await apiFetch('/api/admin/certificates/issue', {
        method: 'POST',
        requireAuth: true,
        body: JSON.stringify({
          userId: certUserId,
          programmeCode: certProgCode,
          certificateType: certType,
        }),
      });
      setNotice('Verifiable certificate issued.');
      await loadAdminOverview();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to issue certificate.');
    }
  }

  async function toggleCertificateStatus(id: string, current: 'valid' | 'revoked') {
    await apiFetch(`/api/admin/certificates/${id}/revoke`, {
      method: 'PATCH',
      requireAuth: true,
      body: JSON.stringify({
        status: current === 'valid' ? 'revoked' : 'valid',
        revokedReason: current === 'valid' ? 'Revoked by administrator' : '',
      }),
    });
    await loadAdminOverview();
  }

  async function savePaymentMethod(method: 'bkash' | 'nagad') {
    setError(null);
    setNotice(null);
    try {
      await apiFetch('/api/admin/payment-settings', {
        method: 'PUT',
        requireAuth: true,
        body: JSON.stringify(
          method === 'bkash'
            ? { method: 'bkash', accountNumber: bkashNum, accountType: bkashType, isEnabled: bkashEnabled }
            : { method: 'nagad', accountNumber: nagadNum, accountType: nagadType, isEnabled: nagadEnabled }
        ),
      });
      setNotice(`Saved ${method.toUpperCase()} recipient settings.`);
      await loadAdminOverview();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to update payment settings.');
    }
  }

  const allProgrammeCodes = [
    ...COURSES.map((c) => ({ code: c.code, title: c.title })),
    ...SPECIALIZED_PROGRAMMES.map((p) => ({ code: p.code, title: p.title })),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="bg-white border border-slate-200 text-slate-950 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-tabular uppercase tracking-widest text-blue-700 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Atlas AI Education · Administrative Console</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-slate-950 mt-1">Admin Operations Panel</h1>
        </div>
        <button
          type="button"
          onClick={loadAdminOverview}
          disabled={fetching}
          className="px-4 py-2 text-xs font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors whitespace-nowrap"
        >
          {fetching ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      <ConfigChecklistBanner context="admin" />

      {notice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>{notice}</span>
        </div>
      )}
      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-900 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-700" />
          <span>{error}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar border-b border-slate-200 pb-2">
        {(
          [
            ['payments', 'Payments & Bulk Approval'],
            ['scholarships', 'Scholarships'],
            ['academics', 'Schedules & Assignments'],
            ['certificates', 'Certificates'],
            ['users', 'Users'],
            ['enquiries', 'Enquiries & Tickets'],
            ['settings', 'Payment Settings'],
          ] as Array<[AdminTab, string]>
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap ${
              tab === id ? 'bg-blue-700 text-white' : 'bg-white border border-slate-200 text-slate-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'payments' && data && (
        <div className="space-y-6">
          {/* Bulk Approval Queue */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900">
                  Pending Enrolments — Bulk Course Approval ({pendingEnrolments.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Select multiple pending enrolments to verify payments and activate course access in bulk.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedEnrolmentIds(
                      selectedEnrolmentIds.length === pendingEnrolments.length
                        ? []
                        : pendingEnrolments.map((e) => e.id)
                    )
                  }
                  className="px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-lg"
                >
                  {selectedEnrolmentIds.length === pendingEnrolments.length ? 'Deselect All' : 'Select All'}
                </button>
                <button
                  type="button"
                  disabled={selectedEnrolmentIds.length === 0}
                  onClick={bulkApproveEnrolments}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 rounded-lg"
                >
                  Bulk Approve ({selectedEnrolmentIds.length})
                </button>
              </div>
            </div>

            {pendingEnrolments.length === 0 ? (
              <p className="text-xs text-slate-500">No pending course enrolments awaiting approval.</p>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl">
                {pendingEnrolments.map((e) => (
                  <label key={e.id} className="p-3.5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedEnrolmentIds.includes(e.id)}
                        onChange={(ev) =>
                          setSelectedEnrolmentIds((prev) =>
                            ev.target.checked ? [...prev, e.id] : prev.filter((x) => x !== e.id)
                          )
                        }
                        className="rounded border-slate-300 text-blue-700"
                      />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {e.profiles?.full_name || e.profiles?.email} — {e.programme_code}
                        </p>
                        <p className="text-xs text-slate-500">{e.programme_title}</p>
                      </div>
                    </div>
                    <span className="font-mono-tabular text-xs font-bold text-slate-900">
                      BDT {e.payable_fee_bdt.toLocaleString()}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Manual Payment Verification Table */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <h2 className="font-display text-lg font-bold text-slate-900">
              bKash &amp; Nagad Payment Submissions ({data.payments.length})
            </h2>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="min-w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2.5">Learner</th>
                    <th className="px-3 py-2.5">Course</th>
                    <th className="px-3 py-2.5">Method / Sender</th>
                    <th className="px-3 py-2.5">TrxID</th>
                    <th className="px-3 py-2.5">Amount</th>
                    <th className="px-3 py-2.5">Status</th>
                    <th className="px-3 py-2.5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.payments.map((p) => (
                    <tr key={p.id}>
                      <td className="px-3 py-2.5">{p.profiles?.full_name || p.profiles?.email}</td>
                      <td className="px-3 py-2.5 font-mono-tabular">{p.programme_code}</td>
                      <td className="px-3 py-2.5 font-mono-tabular">
                        {p.method.toUpperCase()} · {p.sender_number}
                      </td>
                      <td className="px-3 py-2.5 font-mono-tabular font-semibold">{p.transaction_id}</td>
                      <td className="px-3 py-2.5 font-mono-tabular">BDT {p.amount_bdt}</td>
                      <td className="px-3 py-2.5 font-mono-tabular uppercase font-semibold">{p.status}</td>
                      <td className="px-3 py-2.5">
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => verifyPayment(p.id, 'approved')}
                            className="px-2 py-1 text-[11px] font-semibold bg-emerald-700 text-white rounded"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => verifyPayment(p.id, 'rejected')}
                            className="px-2 py-1 text-[11px] font-semibold bg-red-700 text-white rounded"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'scholarships' && data && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <h2 className="font-display text-lg font-bold text-slate-900">
            Scholarship Applications ({data.scholarships.length})
          </h2>
          {data.scholarships.map((s) => (
            <div key={s.id} className="p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex flex-wrap justify-between gap-2">
                <p className="font-bold text-sm text-slate-900">
                  {s.full_name} ({s.email}) — {s.course_code}
                </p>
                <span className="font-mono-tabular uppercase font-bold text-blue-700">
                  {s.status} ({s.approved_waiver_percent}%)
                </span>
              </div>
              <p className="text-slate-700"><strong>Motivation:</strong> {s.learning_motivation}</p>
              <p className="text-slate-700"><strong>Financial Need:</strong> {s.financial_need}</p>
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <label className="text-slate-600">Waiver % (0–50):</label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={waiverMap[s.id] ?? s.approved_waiver_percent}
                  onChange={(e) => setWaiverMap((prev) => ({ ...prev, [s.id]: Number(e.target.value) }))}
                  className="w-20 px-2 py-1 border border-slate-300 rounded font-mono-tabular"
                />
                <button
                  type="button"
                  onClick={() => reviewScholarship(s.id, 'approved')}
                  className="px-3 py-1 bg-emerald-700 text-white font-semibold rounded"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => reviewScholarship(s.id, 'partially_approved')}
                  className="px-3 py-1 bg-blue-700 text-white font-semibold rounded"
                >
                  Partial
                </button>
                <button
                  type="button"
                  onClick={() => reviewScholarship(s.id, 'rejected')}
                  className="px-3 py-1 bg-red-700 text-white font-semibold rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'academics' && data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <form onSubmit={createSchedule} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <h2 className="font-display text-lg font-bold text-slate-900">Publish Live Class Session</h2>
            <select
              value={schedCode}
              onChange={(e) => setSchedCode(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
            >
              {allProgrammeCodes.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.code} — {p.title}
                </option>
              ))}
            </select>
            <input
              type="text"
              required
              placeholder="Session Title (e.g. Week 1: Prompt Foundations)"
              value={schedTitle}
              onChange={(e) => setSchedTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
            />
            <div className="grid grid-cols-3 gap-2">
              <input
                type="date"
                required
                value={schedDate}
                onChange={(e) => setSchedDate(e.target.value)}
                className="px-2 py-2 text-xs border border-slate-300 rounded-lg"
              />
              <input
                type="text"
                required
                value={schedStart}
                onChange={(e) => setSchedStart(e.target.value)}
                placeholder="Start"
                className="px-2 py-2 text-xs border border-slate-300 rounded-lg"
              />
              <input
                type="text"
                required
                value={schedEnd}
                onChange={(e) => setSchedEnd(e.target.value)}
                placeholder="End"
                className="px-2 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>
            <input
              type="url"
              placeholder="Live Meeting Link (Optional)"
              value={schedLink}
              onChange={(e) => setSchedLink(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
            />
            <button type="submit" className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 rounded-lg">
              Publish Schedule
            </button>
          </form>

          <form onSubmit={createAssignment} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <h2 className="font-display text-lg font-bold text-slate-900">Publish Assignment</h2>
            <select
              value={assignCode}
              onChange={(e) => setAssignCode(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
            >
              {allProgrammeCodes.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.code} — {p.title}
                </option>
              ))}
            </select>
            <input
              type="text"
              required
              placeholder="Assignment Title"
              value={assignTitle}
              onChange={(e) => setAssignTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
            />
            <textarea
              required
              rows={3}
              placeholder="Assignment description & instructions..."
              value={assignDesc}
              onChange={(e) => setAssignDesc(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
            />
            <button type="submit" className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 rounded-lg">
              Publish Assignment
            </button>
          </form>
        </div>
      )}

      {tab === 'certificates' && data && (
        <div className="space-y-6">
          <form onSubmit={issueCertificate} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <h2 className="font-display text-lg font-bold text-slate-900">Issue Verifiable Certificate</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <select
                value={certUserId}
                onChange={(e) => setCertUserId(e.target.value)}
                className="px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
              >
                {data.users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.full_name || u.email} ({u.email})
                  </option>
                ))}
              </select>
              <select
                value={certProgCode}
                onChange={(e) => setCertProgCode(e.target.value)}
                className="px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
              >
                {allProgrammeCodes.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.code} — {p.title}
                  </option>
                ))}
              </select>
              <select
                value={certType}
                onChange={(e) => setCertType(e.target.value)}
                className="px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
              >
                <option>Certificate of Participation</option>
                <option>Foundation Certificate</option>
                <option>Professional Development Certificate</option>
                <option>Executive Development Certificate</option>
                <option>Specialised Professional Certificate</option>
              </select>
            </div>
            <button type="submit" className="px-5 py-2 text-xs font-semibold text-white bg-blue-700 rounded-lg">
              Issue Certificate
            </button>
          </form>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
            <h3 className="font-display text-base font-bold text-slate-900">
              Issued Certificates ({data.certificates.length})
            </h3>
            {data.certificates.map((c) => (
              <div key={c.id} className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between gap-4 text-xs">
                <div>
                  <p className="font-mono-tabular font-bold text-blue-700">{c.certificate_code}</p>
                  <p className="font-semibold text-slate-900">
                    {c.participant_name} · {c.programme_code} ({c.certificate_type})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleCertificateStatus(c.id, c.status)}
                  className={`px-3 py-1 font-semibold rounded text-white ${
                    c.status === 'valid' ? 'bg-red-700' : 'bg-emerald-700'
                  }`}
                >
                  {c.status === 'valid' ? 'Revoke' : 'Restore'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'users' && data && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <h2 className="font-display text-lg font-bold text-slate-900">Registered Users ({data.users.length})</h2>
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="min-w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2.5">Name</th>
                  <th className="px-3 py-2.5">Email</th>
                  <th className="px-3 py-2.5">Role</th>
                  <th className="px-3 py-2.5">Status</th>
                  <th className="px-3 py-2.5">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.users.map((u) => (
                  <tr key={u.id}>
                    <td className="px-3 py-2.5 font-medium">{u.full_name || '—'}</td>
                    <td className="px-3 py-2.5 font-mono-tabular">{u.email}</td>
                    <td className="px-3 py-2.5 uppercase font-mono-tabular">{u.role}</td>
                    <td className="px-3 py-2.5 uppercase font-mono-tabular">{u.account_status}</td>
                    <td className="px-3 py-2.5">
                      <select
                        value={u.account_status}
                        onChange={async (e) => {
                          await apiFetch(`/api/admin/users/${u.id}/status`, {
                            method: 'PATCH',
                            requireAuth: true,
                            body: JSON.stringify({ accountStatus: e.target.value }),
                          });
                          loadAdminOverview();
                        }}
                        className="px-2 py-1 border border-slate-300 rounded text-xs bg-white"
                      >
                        <option value="active">active</option>
                        <option value="pending_verification">pending_verification</option>
                        <option value="suspended">suspended</option>
                        <option value="deactivated">deactivated</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'enquiries' && data && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
            <h2 className="font-display text-lg font-bold text-slate-900">
              Institutional Training Enquiries ({data.institutionalEnquiries.length})
            </h2>
            {data.institutionalEnquiries.map((ie) => (
              <div key={ie.id} className="p-4 rounded-xl border border-slate-200 text-xs space-y-1">
                <p className="font-bold text-sm text-slate-900">
                  {ie.organization_name} — {ie.contact_name} ({ie.email})
                </p>
                <p className="text-slate-600">
                  {ie.sector_type} · {ie.participant_count} · {ie.delivery_format}
                </p>
                <p className="text-slate-700">{ie.objectives}</p>
              </div>
            ))}
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
            <h2 className="font-display text-lg font-bold text-slate-900">
              Contact Enquiries ({data.contactEnquiries.length}) &amp; Support Tickets ({data.tickets.length})
            </h2>
            {data.contactEnquiries.map((ce) => (
              <div key={ce.id} className="p-4 rounded-xl border border-slate-200 text-xs space-y-1">
                <p className="font-bold text-slate-900">
                  [Contact] {ce.subject} — {ce.name} ({ce.email})
                </p>
                <p className="text-slate-700">{ce.message}</p>
              </div>
            ))}
            {data.tickets.map((t) => (
              <div key={t.id} className="p-4 rounded-xl border border-slate-200 text-xs space-y-1">
                <p className="font-bold text-slate-900">
                  [Ticket: {t.status}] {t.subject} — {t.profiles?.email}
                </p>
                <p className="text-slate-700">{t.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <h2 className="font-display text-lg font-bold text-slate-900">bKash Recipient Settings</h2>
            <input
              type="tel"
              placeholder="Real bKash 11-digit number (e.g. 01XXXXXXXXX)"
              value={bkashNum}
              onChange={(e) => setBkashNum(e.target.value)}
              className="w-full px-3.5 py-2 text-sm font-mono-tabular border border-slate-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Account Type (Merchant / Personal)"
              value={bkashType}
              onChange={(e) => setBkashType(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
            />
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={bkashEnabled}
                onChange={(e) => setBkashEnabled(e.target.checked)}
              />
              <span>Enable bKash at Checkout</span>
            </label>
            <button
              type="button"
              onClick={() => savePaymentMethod('bkash')}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 rounded-lg"
            >
              Save bKash Settings
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <h2 className="font-display text-lg font-bold text-slate-900">Nagad Recipient Settings</h2>
            <input
              type="tel"
              placeholder="Real Nagad 11-digit number (e.g. 01XXXXXXXXX)"
              value={nagadNum}
              onChange={(e) => setNagadNum(e.target.value)}
              className="w-full px-3.5 py-2 text-sm font-mono-tabular border border-slate-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Account Type (Merchant / Personal)"
              value={nagadType}
              onChange={(e) => setNagadType(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
            />
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={nagadEnabled}
                onChange={(e) => setNagadEnabled(e.target.checked)}
              />
              <span>Enable Nagad at Checkout</span>
            </label>
            <button
              type="button"
              onClick={() => savePaymentMethod('nagad')}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 rounded-lg"
            >
              Save Nagad Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
