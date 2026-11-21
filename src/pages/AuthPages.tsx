import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ConfigChecklistBanner } from '../components/ConfigChecklistBanner';

export function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const res = await signIn(email, password);
    setSubmitting(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    navigate(redirect);
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <ConfigChecklistBanner context="auth" />
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-blue-700 font-semibold">
            Atlas AI Education Account
          </p>
          <h1 className="font-display text-2xl font-bold text-slate-950 mt-1">Sign In</h1>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-900">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="block text-xs font-medium text-slate-700 mb-1">
              Email Address *
            </label>
            <input
              id="login-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="login-password" className="block text-xs font-medium text-slate-700">
                Password *
              </label>
              <Link to="/forgot-password" className="text-xs font-medium text-blue-700 hover:underline">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="login-password"
                type={showPass ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-3.5 pr-10 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                type="button"
                onClick={() => setShowPass((p) => !p)}
                aria-label={showPass ? 'Hide password' : 'Show password'}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-800"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-60 rounded-lg transition-colors"
          >
            {submitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-xs text-slate-600 space-y-2">
          <p>
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="font-semibold text-blue-700 hover:underline">
              Create an Account
            </Link>
          </p>
          <p className="text-[11px] text-slate-500">
            By signing in, you agree to the{' '}
            <Link to="/terms-and-conditions" className="underline">Terms &amp; Conditions</Link> and{' '}
            <Link to="/privacy-policy" className="underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

export function SignupPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState<'Bangla' | 'English' | 'Bilingual'>('Bilingual');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!acceptedTerms) {
      setError('Please accept the Terms & Conditions and acknowledge the Privacy Policy.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    setSubmitting(true);
    const res = await signUp({
      email,
      password,
      fullName,
      phone,
      preferredLanguage,
      marketingOptIn,
    });
    setSubmitting(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    if (res.needsVerification) {
      setCreated(true);
    } else {
      navigate('/dashboard');
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12 space-y-6">
      <ConfigChecklistBanner context="auth" />
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
        {created ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-sm text-emerald-950">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Your Account Has Been Created</p>
                <p className="mt-1">
                  Please verify your email address ({email}) via the confirmation link sent to your inbox to activate your account.
                </p>
              </div>
            </div>
            <Link
              to={`/verify-email?email=${encodeURIComponent(email)}`}
              className="inline-flex px-5 py-2.5 text-sm font-semibold text-white bg-blue-700 rounded-lg"
            >
              Verify Your Email
            </Link>
          </div>
        ) : (
          <>
            <div>
              <p className="text-xs uppercase tracking-wide text-blue-700 font-semibold">
                One Account Across Atlas AI Education
              </p>
              <h1 className="font-display text-2xl font-bold text-slate-950 mt-1">Create Account</h1>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-900">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Mobile / WhatsApp (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Preferred Language</label>
                <select
                  value={preferredLanguage}
                  onChange={(e) =>
                    setPreferredLanguage(e.target.value as 'Bangla' | 'English' | 'Bilingual')
                  }
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Bilingual">Bilingual (Bangla &amp; English)</option>
                  <option value="Bangla">Bangla</option>
                  <option value="English">English</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Password (min. 8 characters) *
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-3.5 pr-10 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((p) => !p)}
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-800"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-3 pt-1">
                <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-blue-700 focus:ring-blue-600"
                  />
                  <span>
                    I agree to the{' '}
                    <Link to="/terms-and-conditions" className="text-blue-700 underline">
                      Terms &amp; Conditions
                    </Link>{' '}
                    and acknowledge the{' '}
                    <Link to="/privacy-policy" className="text-blue-700 underline">
                      Privacy Policy
                    </Link>{' '}
                    of Atlas AI Education. *
                  </span>
                </label>

                <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={marketingOptIn}
                    onChange={(e) => setMarketingOptIn(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-blue-700 focus:ring-blue-600"
                  />
                  <span>
                    I would like to receive educational updates, programme announcements and learning opportunities. (Optional)
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-60 rounded-lg transition-colors"
              >
                {submitting ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <p className="text-xs text-slate-600 pt-2 border-t border-slate-100">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-blue-700 hover:underline">
                Sign In
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export function VerifyEmailPage() {
  const { user, resendVerification } = useAuth();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(searchParams.get('email') || user?.email || '');
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleResend(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setSending(true);
    const res = await resendVerification(email);
    setSending(false);
    if (res.error) setError(res.error);
    else setMessage('Verification email sent. Please check your inbox and spam folder.');
  }

  return (
    <div className="max-w-md mx-auto px-4 py-14">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-5">
        <h1 className="font-display text-2xl font-bold text-slate-950">Verify Your Email</h1>
        {user?.email_confirmed_at ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-950">
              Your email address ({user.email}) is verified.
            </div>
            <Link to="/dashboard" className="inline-flex px-4 py-2 text-sm font-semibold text-white bg-blue-700 rounded-lg">
              Open Dashboard
            </Link>
          </div>
        ) : (
          <form onSubmit={handleResend} className="space-y-4">
            <p className="text-sm text-slate-600">
              Confirm your email address using the link sent during registration, or resend a fresh verification link below.
            </p>
            {message && <p className="text-xs text-emerald-700 font-medium">{message}</p>}
            {error && <p className="text-xs text-red-700 font-medium">{error}</p>}
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg"
            />
            <button
              type="submit"
              disabled={sending}
              className="w-full py-2.5 text-sm font-semibold text-white bg-blue-700 rounded-lg"
            >
              {sending ? 'Sending...' : 'Resend Verification Email'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export function ForgotPasswordPage() {
  const { sendPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSending(true);
    const res = await sendPasswordReset(email);
    setSending(false);
    if (res.error) setError(res.error);
    else setSent(true);
  }

  return (
    <div className="max-w-md mx-auto px-4 py-14">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-5">
        <h1 className="font-display text-2xl font-bold text-slate-950">Reset Password</h1>
        {sent ? (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-950">
            If an account exists for <strong>{email}</strong>, a password reset link has been sent.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-slate-600">
              Enter your registered email address to receive a secure password reset link.
            </p>
            {error && <p className="text-xs text-red-700">{error}</p>}
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg"
            />
            <button
              type="submit"
              disabled={sending}
              className="w-full py-2.5 text-sm font-semibold text-white bg-blue-700 rounded-lg"
            >
              {sending ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export function ResetPasswordPage() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setSaving(true);
    const res = await updatePassword(password);
    setSaving(false);
    if (res.error) setError(res.error);
    else navigate('/dashboard');
  }

  return (
    <div className="max-w-md mx-auto px-4 py-14">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-5">
        <h1 className="font-display text-2xl font-bold text-slate-950">Set New Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-xs text-red-700">{error}</p>}
          <input
            type="password"
            required
            minLength={8}
            placeholder="New Password (min. 8 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg"
          />
          <input
            type="password"
            required
            minLength={8}
            placeholder="Confirm New Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg"
          />
          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 text-sm font-semibold text-white bg-blue-700 rounded-lg"
          >
            {saving ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
