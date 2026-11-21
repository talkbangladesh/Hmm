import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useDashboard } from './DashboardContext';
import { useAuth } from '../../context/AuthContext';
import { apiFetch, ApiError } from '../../lib/api';

export function DashboardOverview() {
  const { data } = useDashboard();
  const { profile } = useAuth();
  const enrolments = data?.enrolments || [];
  const active = enrolments.filter((e) => e.status === 'active');
  const completed = enrolments.filter((e) => e.status === 'completed');
  const certificates = data?.certificates || [];
  const schedules = data?.schedules || [];
  const assignments = data?.assignments || [];
  const submissions = data?.submissions || [];

  const pendingAssignments = assignments.filter(
    (a) => !submissions.some((s) => s.assignment_id === a.id)
  );

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-mono-tabular uppercase tracking-wider text-blue-700 font-semibold">
            Account Status: {profile?.account_status || 'active'}
          </p>
          <h1 className="font-display text-2xl font-bold text-slate-950 mt-1">
            Welcome, {profile?.full_name || profile?.email || 'Learner'}
          </h1>
        </div>
        <Link
          to="/programmes"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg whitespace-nowrap"
        >
          Browse Programmes <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 4 Dynamic Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Enrolled Courses', value: enrolments.length },
          { label: 'Active Courses', value: active.length },
          { label: 'Completed Courses', value: completed.length },
          { label: 'Certificates Earned', value: certificates.length },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-slate-200 rounded-xl p-5">
            <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
            <p className="font-mono-tabular text-3xl font-bold text-slate-950 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Continue Learning */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-slate-900">Continue Learning</h2>
          <Link to="/dashboard/courses" className="text-xs font-semibold text-blue-700 hover:underline">
            View All Courses
          </Link>
        </div>

        {enrolments.length === 0 ? (
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-600 space-y-3">
            <p>You have not enrolled in any programmes yet.</p>
            <Link
              to="/programmes/specialized"
              className="inline-flex px-4 py-2 text-xs font-semibold text-white bg-blue-700 rounded-lg"
            >
              Explore Free Specialized Programmes
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {enrolments.slice(0, 4).map((e) => {
              const prog = data?.progress.find((p) => p.programme_code === e.programme_code);
              return (
                <div key={e.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-mono-tabular text-blue-700 font-semibold">
                      {e.programme_code} · {e.status.replace('_', ' ').toUpperCase()}
                    </p>
                    <p className="font-semibold text-sm text-slate-900">{e.programme_title}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono-tabular text-xs text-slate-600">
                      {prog?.completion_percentage ?? 0}% complete
                    </span>
                    {e.status === 'pending_payment' ? (
                      <Link
                        to="/dashboard/payments"
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg"
                      >
                        Submit Payment
                      </Link>
                    ) : (
                      <Link
                        to="/dashboard/progress"
                        className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 rounded-lg"
                      >
                        Open Progress
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upcoming Classes & Pending Assignments & Certificates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-slate-900">Upcoming Classes</h2>
            <Link to="/dashboard/schedule" className="text-xs font-semibold text-blue-700 hover:underline">
              Full Schedule
            </Link>
          </div>
          {schedules.length === 0 ? (
            <p className="text-xs text-slate-500">No upcoming sessions published yet for your cohorts.</p>
          ) : (
            <ul className="space-y-2.5 text-xs">
              {schedules.slice(0, 3).map((s) => (
                <li key={s.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="font-semibold text-slate-900">{s.programme_code}: {s.session_title}</p>
                  <p className="font-mono-tabular text-slate-600 mt-0.5">
                    {s.session_date} · {s.start_time}–{s.end_time}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-slate-900">Pending Assignments</h2>
            <Link to="/dashboard/assignments" className="text-xs font-semibold text-blue-700 hover:underline">
              Open Assignments
            </Link>
          </div>
          {pendingAssignments.length === 0 ? (
            <p className="text-xs text-slate-500">No pending assignments right now.</p>
          ) : (
            <ul className="space-y-2.5 text-xs">
              {pendingAssignments.slice(0, 3).map((a) => (
                <li key={a.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="font-semibold text-slate-900">{a.programme_code}: {a.title}</p>
                  <p className="text-slate-600 mt-0.5">
                    {a.due_date ? `Due: ${new Date(a.due_date).toLocaleDateString()}` : 'Open submission'}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {certificates.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
          <h2 className="font-display text-base font-bold text-slate-900">Recently Issued Certificates</h2>
          <div className="space-y-2">
            {certificates.slice(0, 2).map((c) => (
              <div key={c.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{c.programme_title}</p>
                  <p className="text-xs font-mono-tabular text-slate-600">
                    {c.certificate_code} · {c.certificate_type}
                  </p>
                </div>
                <Link to="/dashboard/certificates" className="text-xs font-semibold text-blue-700 hover:underline">
                  View
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function DashboardProfile() {
  const { data, reload } = useDashboard();
  const { refreshProfile } = useAuth();
  const p = data?.profile;

  const [fullName, setFullName] = useState(p?.full_name || '');
  const [phone, setPhone] = useState(p?.phone || '');
  const [cityDistrict, setCityDistrict] = useState(p?.city_district || '');
  const [country, setCountry] = useState(p?.country || 'Bangladesh');
  const [educationLevel, setEducationLevel] = useState(p?.education_level || '');
  const [professionRole, setProfessionRole] = useState(p?.profession_role || '');
  const [organization, setOrganization] = useState(p?.organization || '');
  const [shortBio, setShortBio] = useState(p?.short_bio || '');
  const [preferredLanguage, setPreferredLanguage] = useState<'Bangla' | 'English' | 'Bilingual'>(
    p?.preferred_language || 'Bilingual'
  );
  const [avatarUrl, setAvatarUrl] = useState(p?.avatar_url || '');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const trackedFields = [fullName, phone, cityDistrict, educationLevel, professionRole, shortBio];
  const completionPct = Math.round(
    (trackedFields.filter((v) => v.trim().length > 0).length / trackedFields.length) * 100
  );

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    setErr(null);
    try {
      await apiFetch('/api/learner/profile', {
        method: 'PATCH',
        requireAuth: true,
        body: JSON.stringify({
          fullName,
          phone,
          cityDistrict,
          country,
          educationLevel,
          professionRole,
          organization,
          shortBio,
          preferredLanguage,
          avatarUrl,
        }),
      });
      await reload();
      await refreshProfile();
      setMsg('Profile updated successfully.');
    } catch (error) {
      setErr(error instanceof ApiError ? error.message : 'Unable to save profile.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-950">My Profile</h1>
          <p className="text-xs text-slate-500 mt-0.5">{p?.email}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">Profile Completion</p>
          <p className="font-mono-tabular text-sm font-bold text-blue-700">{completionPct}%</p>
        </div>
      </div>

      {msg && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>{msg}</span>
        </div>
      )}
      {err && <p className="text-xs text-red-700">{err}</p>}

      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Phone / WhatsApp</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">City / District</label>
            <input
              type="text"
              value={cityDistrict}
              onChange={(e) => setCityDistrict(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Preferred Language</label>
            <select
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value as 'Bangla' | 'English' | 'Bilingual')}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg bg-white"
            >
              <option value="Bilingual">Bilingual</option>
              <option value="Bangla">Bangla</option>
              <option value="English">English</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Education Level</label>
            <input
              type="text"
              value={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Profession / Role</label>
            <input
              type="text"
              value={professionRole}
              onChange={(e) => setProfessionRole(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Organisation / Institution</label>
            <input
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Profile Photo URL (Optional)</label>
          <input
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://..."
            className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Short Bio</label>
          <textarea
            rows={3}
            value={shortBio}
            onChange={(e) => setShortBio(e.target.value)}
            className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-60 rounded-lg"
        >
          {saving ? 'Saving Profile...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}

export function DashboardCourses() {
  const { data } = useDashboard();
  const [filter, setFilter] = useState('all');
  const enrolments = data?.enrolments || [];

  const filtered = enrolments.filter((e) => (filter === 'all' ? true : e.status === filter));

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold text-slate-950">My Courses</h1>
        <Link to="/programmes" className="text-xs font-semibold text-blue-700 hover:underline">
          Explore More Programmes →
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'all', label: 'All' },
          { id: 'active', label: 'Active' },
          { id: 'pending_payment', label: 'Pending Payment' },
          { id: 'upcoming', label: 'Upcoming' },
          { id: 'completed', label: 'Completed' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filter === tab.id ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-slate-500">No enrolments match this filter.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((e) => (
            <div key={e.id} className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-mono-tabular text-blue-700 font-semibold">
                  {e.programme_code} · {e.status.replace('_', ' ').toUpperCase()}
                </p>
                <h2 className="font-display text-base font-bold text-slate-900">{e.programme_title}</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Cohort: {e.cohort_name} · Fee: {e.payable_fee_bdt === 0 ? 'FREE' : `BDT ${e.payable_fee_bdt.toLocaleString()}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {e.status === 'pending_payment' ? (
                  <Link
                    to="/dashboard/payments"
                    className="px-3.5 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg"
                  >
                    Complete Payment
                  </Link>
                ) : (
                  <Link
                    to={e.programme_type === 'specialized' ? '/programmes/specialized' : `/courses/${e.programme_code.toLowerCase()}`}
                    className="px-3.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 rounded-lg"
                  >
                    Open Syllabus
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function DashboardProgress() {
  const { data, reload } = useDashboard();
  const activeEnrolments = (data?.enrolments || []).filter((e) =>
    ['active', 'completed'].includes(e.status)
  );
  const [savingCode, setSavingCode] = useState<string | null>(null);

  async function updatePct(code: string, pct: number) {
    setSavingCode(code);
    try {
      await apiFetch('/api/learner/progress', {
        method: 'POST',
        requireAuth: true,
        body: JSON.stringify({
          programmeCode: code,
          completionPercentage: pct,
        }),
      });
      await reload();
    } finally {
      setSavingCode(null);
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
      <h1 className="font-display text-2xl font-bold text-slate-950">Learning Progress</h1>
      {activeEnrolments.length === 0 ? (
        <p className="text-sm text-slate-500">
          Progress tracking begins once you have an active programme enrolment.
        </p>
      ) : (
        <div className="space-y-4">
          {activeEnrolments.map((enr) => {
            const prog = data?.progress.find((p) => p.programme_code === enr.programme_code);
            const pct = prog?.completion_percentage ?? 0;
            return (
              <div key={enr.id} className="p-5 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-mono-tabular text-blue-700 font-semibold">{enr.programme_code}</p>
                    <p className="font-semibold text-slate-900">{enr.programme_title}</p>
                  </div>
                  <span className="font-mono-tabular text-sm font-bold text-slate-900">{pct}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-700 transition-all" style={{ width: `${pct}%` }} />
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs text-slate-500 mr-1">Record milestone:</span>
                  {[25, 50, 75, 100].map((v) => (
                    <button
                      key={v}
                      type="button"
                      disabled={savingCode === enr.programme_code}
                      onClick={() => updatePct(enr.programme_code, v)}
                      className={`px-2.5 py-1 text-xs font-mono-tabular rounded border ${
                        pct === v
                          ? 'bg-blue-700 text-white border-blue-700'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {v}%
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function DashboardSchedule() {
  const { data } = useDashboard();
  const schedules = data?.schedules || [];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
      <h1 className="font-display text-2xl font-bold text-slate-950">Class Schedule</h1>
      {schedules.length === 0 ? (
        <p className="text-sm text-slate-500">
          No live class sessions have been published for your enrolled programmes yet. Administrators publish cohort schedules ahead of each live week.
        </p>
      ) : (
        <div className="space-y-3">
          {schedules.map((s) => (
            <div key={s.id} className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-mono-tabular text-blue-700 font-semibold">
                  {s.programme_code} · {s.cohort_name}
                </p>
                <p className="font-semibold text-slate-900">{s.session_title}</p>
                <p className="text-xs font-mono-tabular text-slate-600 mt-1">
                  {s.session_date} · {s.start_time} – {s.end_time} ({s.timezone}) · {s.delivery_mode}
                </p>
                {s.instructor_notes && <p className="text-xs text-slate-500 mt-1">{s.instructor_notes}</p>}
              </div>
              {s.meeting_link && (
                <a
                  href={s.meeting_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg whitespace-nowrap"
                >
                  Join Session
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function DashboardAssignments() {
  const { data, reload } = useDashboard();
  const assignments = data?.assignments || [];
  const submissions = data?.submissions || [];

  const [activeId, setActiveId] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent, assignmentId: string) {
    e.preventDefault();
    setSaving(true);
    try {
      await apiFetch(`/api/learner/assignments/${assignmentId}/submit`, {
        method: 'POST',
        requireAuth: true,
        body: JSON.stringify({ submissionText: text, submissionUrl: url }),
      });
      setActiveId(null);
      setText('');
      setUrl('');
      await reload();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
      <h1 className="font-display text-2xl font-bold text-slate-950">Assignments</h1>
      {assignments.length === 0 ? (
        <p className="text-sm text-slate-500">
          No coursework assignments are currently published for your active courses.
        </p>
      ) : (
        <div className="space-y-4">
          {assignments.map((a) => {
            const sub = submissions.find((s) => s.assignment_id === a.id);
            return (
              <div key={a.id} className="p-5 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-mono-tabular text-blue-700 font-semibold">{a.programme_code}</p>
                    <h2 className="font-semibold text-slate-900">{a.title}</h2>
                  </div>
                  <span className="text-xs font-mono-tabular text-slate-600">
                    {sub ? sub.status.toUpperCase() : 'PENDING'}
                  </span>
                </div>
                <p className="text-sm text-slate-600">{a.description}</p>
                {sub && (
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <p className="font-semibold text-slate-800">Submitted Response:</p>
                    <p className="text-slate-700">{sub.submission_text}</p>
                    {sub.feedback && <p className="text-blue-800 pt-1">Feedback: {sub.feedback}</p>}
                  </div>
                )}
                {activeId === a.id ? (
                  <form onSubmit={(e) => handleSubmit(e, a.id)} className="space-y-3 pt-2">
                    <textarea
                      required
                      rows={3}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Write your assignment response..."
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                    />
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="Optional supporting link (Google Doc / GitHub)"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 rounded-lg"
                      >
                        {saving ? 'Submitting...' : 'Submit Assignment'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveId(null)}
                        className="px-4 py-2 text-xs text-slate-600 border border-slate-300 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveId(a.id);
                      setText(sub?.submission_text || '');
                      setUrl(sub?.submission_url || '');
                    }}
                    className="px-3.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 rounded-lg"
                  >
                    {sub ? 'Update Submission' : 'Submit Assignment'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
