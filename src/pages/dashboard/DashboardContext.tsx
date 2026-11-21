import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { apiFetch, ApiError } from '../../lib/api';
import { useAuth, type UserProfile } from '../../context/AuthContext';

export interface EnrolmentRow {
  id: string;
  programme_code: string;
  programme_title: string;
  programme_type: 'course' | 'specialized';
  category_id: string;
  cohort_name: string;
  status: 'pending_payment' | 'active' | 'upcoming' | 'completed' | 'revoked' | 'cancelled';
  regular_fee_bdt: number;
  discounted_fee_bdt: number;
  scholarship_discount_bdt: number;
  payable_fee_bdt: number;
  enrolled_at: string;
  activated_at: string | null;
}

export interface PaymentRow {
  id: string;
  enrolment_id: string;
  programme_code: string;
  programme_title: string;
  method: 'bkash' | 'nagad' | 'free';
  sender_number: string;
  transaction_id: string;
  amount_bdt: number;
  status: 'pending' | 'approved' | 'rejected' | 'partial' | 'refunded';
  receipt_number: string | null;
  admin_notes: string;
  created_at: string;
}

export interface ScholarshipRow {
  id: string;
  course_code: string;
  course_title: string;
  status: 'submitted' | 'under_review' | 'approved' | 'partially_approved' | 'rejected';
  approved_waiver_percent: number;
  remaining_payable_bdt: number | null;
  admin_notes: string;
  created_at: string;
}

export interface ProgressRow {
  id: string;
  programme_code: string;
  completed_modules: string[];
  completed_sessions: string[];
  completion_percentage: number;
  last_activity_at: string;
}

export interface ScheduleRow {
  id: string;
  programme_code: string;
  cohort_name: string;
  session_title: string;
  session_date: string;
  start_time: string;
  end_time: string;
  timezone: string;
  delivery_mode: string;
  meeting_link: string;
  instructor_notes: string;
}

export interface AssignmentRow {
  id: string;
  programme_code: string;
  title: string;
  description: string;
  instructions: string;
  due_date: string | null;
}

export interface SubmissionRow {
  id: string;
  assignment_id: string;
  submission_text: string;
  submission_url: string;
  status: string;
  feedback: string;
  submitted_at: string;
}

export interface CertificateRow {
  id: string;
  certificate_code: string;
  participant_name: string;
  programme_code: string;
  programme_title: string;
  certificate_type: string;
  issue_date: string;
  status: 'valid' | 'revoked';
}

export interface NotificationRow {
  id: string;
  title: string;
  body: string;
  category: string;
  is_read: boolean;
  link_url: string;
  created_at: string;
}

export interface TicketRow {
  id: string;
  subject: string;
  category: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  admin_reply: string;
  created_at: string;
}

export interface DashboardOverviewData {
  profile: UserProfile | null;
  enrolments: EnrolmentRow[];
  payments: PaymentRow[];
  scholarships: ScholarshipRow[];
  progress: ProgressRow[];
  schedules: ScheduleRow[];
  assignments: AssignmentRow[];
  submissions: SubmissionRow[];
  certificates: CertificateRow[];
  savedResources: { id: string; resource_id: string; created_at: string }[];
  notifications: NotificationRow[];
  supportTickets: TicketRow[];
}

interface DashboardContextValue {
  data: DashboardOverviewData | null;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<DashboardOverviewData>('/api/learner/overview', {
        requireAuth: true,
      });
      setData(res);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    reload();
  }, [reload]);

  return (
    <DashboardContext.Provider value={{ data, loading, error, reload }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used inside DashboardProvider');
  return ctx;
}
