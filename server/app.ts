import express, { type Request, type Response } from 'express';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {
  getSupabaseAdmin,
  isSupabaseAdminConfigured,
  isSupabaseClientConfigured,
  requireAdminUser,
  requireAuthenticatedUser,
  resolveAuthContext,
  type AuthedRequest,
} from './supabaseAdmin.ts';
import { isWeb3FormsConfigured, sendWeb3FormsNotification } from './web3forms.ts';

interface CatalogueEntry {
  id: string;
  code: string;
  title: string;
  categoryId: string;
  regularFeeBdt: number;
  discountedFeeBdt: number;
  scholarshipEligible: boolean;
}

interface SpecializedEntry {
  id: string;
  code: string;
  title: string;
  feeBdt: number;
}

let cachedCatalogue: { courses: CatalogueEntry[]; specialized: SpecializedEntry[] } | null = null;
function loadCatalogue(): { courses: CatalogueEntry[]; specialized: SpecializedEntry[] } {
  if (cachedCatalogue) return cachedCatalogue;
  const candidatePaths = [
    path.resolve(process.cwd(), 'src/data/generatedCatalogue.json'),
    path.resolve(process.cwd(), 'dist/generatedCatalogue.json'),
  ];
  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      cachedCatalogue = JSON.parse(fs.readFileSync(p, 'utf8'));
      return cachedCatalogue!;
    }
  }
  return { courses: [], specialized: [] };
}

function getCatalogueItem(code: string) {
  const cat = loadCatalogue();
  const normalized = code.trim().toUpperCase() === 'AL-100' ? 'AG-101' : code.trim().toUpperCase();
  const course = cat.courses.find((c) => c.code.toUpperCase() === normalized);
  if (course) {
    return {
      type: 'course' as const,
      code: course.code,
      title: course.title,
      categoryId: course.categoryId,
      regularFeeBdt: course.regularFeeBdt,
      discountedFeeBdt: course.discountedFeeBdt,
      scholarshipEligible: course.scholarshipEligible,
    };
  }
  const spec = cat.specialized.find((s) => s.code.toUpperCase() === normalized || s.id.toUpperCase() === normalized);
  if (spec) {
    return {
      type: 'specialized' as const,
      code: spec.code,
      title: spec.title,
      categoryId: 'specialized',
      regularFeeBdt: 0,
      discountedFeeBdt: 0,
      scholarshipEligible: false,
    };
  }
  return null;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function containsSensitiveFinancialTokens(text: string): boolean {
  return /\b(\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}|cvv|cvc|pin\s*code|otp)\b/i.test(text);
}

async function getPaymentSettingsSummary() {
  const envBkash = (process.env.BKASH_MERCHANT_OR_PERSONAL_NUMBER || '').trim();
  const envNagad = (process.env.NAGAD_MERCHANT_OR_PERSONAL_NUMBER || '').trim();

  const defaults = {
    bkash: {
      method: 'bkash' as const,
      enabled: Boolean(envBkash),
      accountNumber: envBkash || null,
      accountType: (process.env.BKASH_ACCOUNT_TYPE || '').trim() || 'Merchant / Personal',
      instructions:
        'Send exact payable amount via bKash Send Money / Payment and submit your sender mobile number and Transaction ID (TrxID).',
    },
    nagad: {
      method: 'nagad' as const,
      enabled: Boolean(envNagad),
      accountNumber: envNagad || null,
      accountType: (process.env.NAGAD_ACCOUNT_TYPE || '').trim() || 'Merchant / Personal',
      instructions:
        'Send exact payable amount via Nagad Send Money / Payment and submit your sender mobile number and Transaction ID (TrxID).',
    },
  };

  const admin = getSupabaseAdmin();
  if (!admin) return defaults;

  const { data } = await admin.from('payment_settings').select('*');
  if (data && data.length > 0) {
    for (const row of data) {
      if (row.method === 'bkash' && (row.account_number || row.is_enabled)) {
        defaults.bkash = {
          method: 'bkash',
          enabled: Boolean(row.is_enabled && row.account_number),
          accountNumber: row.account_number || defaults.bkash.accountNumber,
          accountType: row.account_type || defaults.bkash.accountType,
          instructions: row.instructions || defaults.bkash.instructions,
        };
      }
      if (row.method === 'nagad' && (row.account_number || row.is_enabled)) {
        defaults.nagad = {
          method: 'nagad',
          enabled: Boolean(row.is_enabled && row.account_number),
          accountNumber: row.account_number || defaults.nagad.accountNumber,
          accountType: row.account_type || defaults.nagad.accountType,
          instructions: row.instructions || defaults.nagad.instructions,
        };
      }
    }
  }
  return defaults;
}

export function createApiApp() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  const router = express.Router();

  router.get('/health', (_req: Request, res: Response) => {
    res.json({ ok: true, service: 'Atlas AI Education API', timestamp: new Date().toISOString() });
  });

  router.get('/config-status', async (_req: Request, res: Response) => {
    const payment = await getPaymentSettingsSummary();
    res.json({
      supabaseClientConfigured: isSupabaseClientConfigured(),
      supabaseAdminConfigured: isSupabaseAdminConfigured(),
      web3formsConfigured: isWeb3FormsConfigured(),
      paymentMethodsConfigured: {
        bkash: Boolean(payment.bkash.enabled && payment.bkash.accountNumber),
        nagad: Boolean(payment.nagad.enabled && payment.nagad.accountNumber),
      },
    });
  });

  router.get('/payment-methods', async (_req: Request, res: Response) => {
    const summary = await getPaymentSettingsSummary();
    res.json({
      ...summary,
      configured: Boolean(
        (summary.bkash.enabled && summary.bkash.accountNumber) ||
          (summary.nagad.enabled && summary.nagad.accountNumber)
      ),
    });
  });

  // --------------------------------------------------------------------------
  // PUBLIC CONTACT & INSTITUTIONAL TRAINING & FREE SESSION ENQUIRIES
  // --------------------------------------------------------------------------
  router.post('/contact', async (req: Request, res: Response) => {
    const { name, email, phone, organization, subject, message, website } = req.body || {};
    if (website) {
      res.status(200).json({ ok: true, message: 'Enquiry received.' });
      return;
    }
    if (!name || !email || !subject || !message || !isValidEmail(String(email))) {
      res.status(400).json({ error: 'Please provide a valid name, email address, subject, and message.' });
      return;
    }

    const admin = getSupabaseAdmin();
    let storedInDb = false;
    if (admin) {
      const { error } = await admin.from('contact_enquiries').insert({
        name: String(name).trim(),
        email: String(email).trim().toLowerCase(),
        phone: String(phone || '').trim(),
        organization: String(organization || '').trim(),
        subject: String(subject).trim(),
        message: String(message).trim(),
      });
      if (!error) storedInDb = true;
    }

    const wf = await sendWeb3FormsNotification({
      subject: `[Atlas AI Education Contact] ${String(subject).trim()}`,
      fromName: String(name).trim(),
      replyTo: String(email).trim(),
      fields: {
        name,
        email,
        phone,
        organization,
        subject,
        message,
      },
    });

    if (!storedInDb && !wf.sent) {
      res.status(503).json({
        error:
          'Neither Supabase backend storage nor Web3Forms access key is configured on this server. Please configure credentials or reach out directly via educationatlas@gmail.com or WhatsApp Only: 01608401507.',
        configRequired: true,
      });
      return;
    }

    res.status(201).json({
      ok: true,
      storedInDb,
      emailDelivered: wf.sent,
      message: 'Thank you for contacting Atlas AI Education. Your message has been recorded for review.',
    });
  });

  router.post('/institutional-training', async (req: Request, res: Response) => {
    const {
      organizationName,
      contactName,
      roleTitle,
      email,
      phone,
      sectorType,
      participantCount,
      deliveryFormat,
      areasOfInterest,
      timeline,
      objectives,
      website,
    } = req.body || {};

    if (website) {
      res.status(200).json({ ok: true });
      return;
    }

    if (
      !organizationName ||
      !contactName ||
      !roleTitle ||
      !email ||
      !isValidEmail(String(email)) ||
      !phone ||
      !sectorType ||
      !participantCount ||
      !deliveryFormat ||
      !objectives
    ) {
      res.status(400).json({ error: 'Please complete all required institutional training enquiry fields.' });
      return;
    }

    const admin = getSupabaseAdmin();
    let storedInDb = false;
    if (admin) {
      const { error } = await admin.from('institutional_enquiries').insert({
        organization_name: String(organizationName).trim(),
        contact_name: String(contactName).trim(),
        role_title: String(roleTitle).trim(),
        email: String(email).trim().toLowerCase(),
        phone: String(phone).trim(),
        sector_type: String(sectorType).trim(),
        participant_count: String(participantCount).trim(),
        delivery_format: String(deliveryFormat).trim(),
        areas_of_interest: Array.isArray(areasOfInterest) ? areasOfInterest : [],
        timeline: String(timeline || '').trim(),
        objectives: String(objectives).trim(),
      });
      if (!error) storedInDb = true;
    }

    const wf = await sendWeb3FormsNotification({
      subject: `[Institutional Training Enquiry] ${String(organizationName).trim()}`,
      fromName: String(contactName).trim(),
      replyTo: String(email).trim(),
      fields: {
        organizationName,
        contactName,
        roleTitle,
        email,
        phone,
        sectorType,
        participantCount,
        deliveryFormat,
        areasOfInterest: Array.isArray(areasOfInterest) ? areasOfInterest.join(', ') : '',
        timeline,
        objectives,
      },
    });

    if (!storedInDb && !wf.sent) {
      res.status(503).json({
        error:
          'Institutional enquiry forwarding requires Supabase or Web3Forms server configuration. Please contact educationatlas@gmail.com directly.',
        configRequired: true,
      });
      return;
    }

    res.status(201).json({
      ok: true,
      storedInDb,
      emailDelivered: wf.sent,
      message:
        'Thank you for contacting Atlas AI Education. Your institutional training enquiry will be reviewed, and the team will follow up regarding the next steps.',
    });
  });

  // --------------------------------------------------------------------------
  // PUBLIC CERTIFICATE VERIFICATION
  // --------------------------------------------------------------------------
  router.get('/certificates/verify/:code', async (req: Request, res: Response) => {
    const code = String(req.params.code || '').trim().toUpperCase();
    if (!code || code.length < 4) {
      res.status(400).json({ error: 'Please enter a valid Certificate ID.' });
      return;
    }

    const admin = getSupabaseAdmin();
    if (!admin) {
      res.status(503).json({
        error: 'Certificate registry database is not configured on this server.',
        configRequired: true,
      });
      return;
    }

    const { data, error } = await admin
      .from('certificates')
      .select('certificate_code, participant_name, programme_code, programme_title, certificate_type, issue_date, status, revoked_reason')
      .ilike('certificate_code', code)
      .maybeSingle();

    if (error) {
      res.status(500).json({ error: 'Unable to verify certificate at this time.' });
      return;
    }

    if (!data) {
      res.json({ status: 'not_found', certificate: null });
      return;
    }

    res.json({
      status: data.status === 'revoked' ? 'revoked' : 'valid',
      certificate: {
        certificateCode: data.certificate_code,
        participantName: data.participant_name,
        programmeCode: data.programme_code,
        programmeTitle: data.programme_title,
        certificateType: data.certificate_type,
        issueDate: data.issue_date,
        status: data.status,
        revokedReason: data.revoked_reason,
      },
    });
  });

  // --------------------------------------------------------------------------
  // SERVER-VERIFIED RESOURCE ACCESS CHECK
  // --------------------------------------------------------------------------
  router.get('/resources/:id/access', async (req: Request, res: Response) => {
    const resourceId = String(req.params.id || '').trim();
    const auth = await resolveAuthContext(req);
    if (!auth) {
      res.status(401).json({
        authorized: false,
        reason: 'Authentication required. Please sign in with a verified Atlas AI Education member account.',
      });
      return;
    }
    if (auth.accountStatus !== 'active') {
      res.status(403).json({
        authorized: false,
        reason: `Your account status is ${auth.accountStatus}. Email verification and active standing are required for Member Access.`,
      });
      return;
    }

    const admin = getSupabaseAdmin();
    if (!admin) {
      res.status(503).json({ authorized: false, error: 'Database not configured.' });
      return;
    }

    // Admin always has access; learners have access when they hold at least one active/upcoming/completed enrolment
    let hasActiveEnrolment = auth.role === 'admin';
    if (!hasActiveEnrolment) {
      const { count } = await admin
        .from('enrolments')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', auth.userId)
        .in('status', ['active', 'upcoming', 'completed']);
      hasActiveEnrolment = (count || 0) > 0;
    }

    if (!hasActiveEnrolment) {
      res.status(403).json({
        authorized: false,
        reason:
          'Member Access is unlocked for learners with at least one verified active or free Specialized Programme enrolment. Enrol in a free Specialized Programme or wait for payment verification.',
      });
      return;
    }

    res.json({
      authorized: true,
      resourceId,
      memberAccessNote:
        'Verified Member Access granted. Full companion study notes and structured prompt workflow checklist unlocked for your active cohort.',
      fullPromptTemplate:
        `[ATLAS AI EDUCATION — MEMBER WORKFLOW GUIDE: ${resourceId.toUpperCase()}]\n` +
        `1. Context & Role: Define your specific objective, audience (Bangla / English), and institutional domain.\n` +
        `2. Input Hygiene: Remove personal identifiers, passwords, financial records, or confidential files before prompting.\n` +
        `3. Structured Instruction: Specify task steps, output format, constraints, and verification checkpoints.\n` +
        `4. Human Verification: Independently verify facts, citations, dates, and tone prior to external use.`,
    });
  });

  // --------------------------------------------------------------------------
  // AUTHENTICATED LEARNER ROUTES (/api/learner/*)
  // --------------------------------------------------------------------------
  router.get('/learner/overview', requireAuthenticatedUser, async (req: AuthedRequest, res: Response) => {
    const admin = getSupabaseAdmin()!;
    const userId = req.auth!.userId;

    const [
      profileRes,
      enrolmentsRes,
      paymentsRes,
      scholarshipsRes,
      progressRes,
      certificatesRes,
      savedRes,
      notificationsRes,
      ticketsRes,
    ] = await Promise.all([
      admin.from('profiles').select('*').eq('id', userId).single(),
      admin.from('enrolments').select('*').eq('user_id', userId).order('enrolled_at', { ascending: false }),
      admin.from('payments').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      admin.from('scholarship_applications').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      admin.from('learning_progress').select('*').eq('user_id', userId),
      admin.from('certificates').select('*').eq('user_id', userId).order('issue_date', { ascending: false }),
      admin.from('saved_resources').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      admin.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      admin.from('support_tickets').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    ]);

    const enrolments = enrolmentsRes.data || [];
    const accessibleCodes = enrolments
      .filter((e) => ['active', 'upcoming', 'completed'].includes(e.status))
      .map((e) => e.programme_code);

    let schedules: unknown[] = [];
    let assignments: unknown[] = [];
    let submissions: unknown[] = [];

    if (accessibleCodes.length > 0) {
      const [schedRes, assignRes, subRes] = await Promise.all([
        admin
          .from('class_schedules')
          .select('*')
          .in('programme_code', accessibleCodes)
          .eq('is_published', true)
          .order('session_date', { ascending: true }),
        admin
          .from('assignments')
          .select('*')
          .in('programme_code', accessibleCodes)
          .eq('is_published', true)
          .order('due_date', { ascending: true }),
        admin.from('assignment_submissions').select('*').eq('user_id', userId),
      ]);
      schedules = schedRes.data || [];
      assignments = assignRes.data || [];
      submissions = subRes.data || [];
    }

    res.json({
      profile: profileRes.data,
      enrolments,
      payments: paymentsRes.data || [],
      scholarships: scholarshipsRes.data || [],
      progress: progressRes.data || [],
      schedules,
      assignments,
      submissions,
      certificates: certificatesRes.data || [],
      savedResources: savedRes.data || [],
      notifications: notificationsRes.data || [],
      supportTickets: ticketsRes.data || [],
    });
  });

  router.patch('/learner/profile', requireAuthenticatedUser, async (req: AuthedRequest, res: Response) => {
    const admin = getSupabaseAdmin()!;
    const userId = req.auth!.userId;
    const {
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
    } = req.body || {};

    const allowedLang = ['Bangla', 'English', 'Bilingual'].includes(preferredLanguage)
      ? preferredLanguage
      : 'Bilingual';

    const { data, error } = await admin
      .from('profiles')
      .update({
        full_name: String(fullName ?? '').trim(),
        phone: String(phone ?? '').trim(),
        city_district: String(cityDistrict ?? '').trim(),
        country: String(country ?? 'Bangladesh').trim(),
        education_level: String(educationLevel ?? '').trim(),
        profession_role: String(professionRole ?? '').trim(),
        organization: String(organization ?? '').trim(),
        short_bio: String(shortBio ?? '').trim().slice(0, 600),
        preferred_language: allowedLang,
        avatar_url: String(avatarUrl ?? '').trim().slice(0, 500),
      })
      .eq('id', userId)
      .select('*')
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.json({ profile: data });
  });

  router.post('/learner/enrol', requireAuthenticatedUser, async (req: AuthedRequest, res: Response) => {
    const admin = getSupabaseAdmin()!;
    const userId = req.auth!.userId;
    const { programmeCode, eligibilityConfirmed } = req.body || {};

    const item = getCatalogueItem(String(programmeCode || ''));
    if (!item) {
      res.status(404).json({ error: 'Selected programme or course was not found in the catalogue.' });
      return;
    }

    if (item.code === 'SP-05' && !eligibilityConfirmed) {
      res.status(400).json({ error: 'Please confirm the Women Only (18+) eligibility requirement to enrol.' });
      return;
    }
    if (item.code === 'SP-06' && !eligibilityConfirmed) {
      res.status(400).json({ error: 'Please confirm current student eligibility to enrol.' });
      return;
    }

    // Check existing enrolment
    const { data: existing } = await admin
      .from('enrolments')
      .select('*')
      .eq('user_id', userId)
      .eq('programme_code', item.code)
      .maybeSingle();

    if (existing) {
      res.json({ enrolment: existing, alreadyExists: true });
      return;
    }

    if (item.type === 'specialized') {
      const { data: enrolment, error } = await admin
        .from('enrolments')
        .insert({
          user_id: userId,
          programme_code: item.code,
          programme_title: item.title,
          programme_type: 'specialized',
          category_id: item.categoryId,
          cohort_name: 'Open Cohort',
          status: 'active',
          regular_fee_bdt: 0,
          discounted_fee_bdt: 0,
          scholarship_discount_bdt: 0,
          payable_fee_bdt: 0,
          activated_at: new Date().toISOString(),
        })
        .select('*')
        .single();

      if (error) {
        res.status(400).json({ error: error.message });
        return;
      }

      await admin.from('payments').insert({
        enrolment_id: enrolment.id,
        user_id: userId,
        programme_code: item.code,
        programme_title: item.title,
        method: 'free',
        sender_number: 'FREE',
        transaction_id: `FREE-${item.code}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
        amount_bdt: 0,
        status: 'approved',
        receipt_number: `AAE-FREE-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
        verified_at: new Date().toISOString(),
      });

      await admin.from('learning_progress').upsert(
        {
          user_id: userId,
          programme_code: item.code,
          completion_percentage: 0,
        },
        { onConflict: 'user_id,programme_code' }
      );

      await admin.from('notifications').insert({
        user_id: userId,
        title: `Enrolled in ${item.title}`,
        body: 'Your tuition-free Specialized Foundation Programme enrolment is active. Check Class Schedule and Resources in your dashboard.',
        category: 'enrolment',
        link_url: '/dashboard/courses',
      });

      res.status(201).json({ enrolment });
      return;
    }

    // Paid Course: check for approved scholarship waiver on this course
    const { data: approvedSchol } = await admin
      .from('scholarship_applications')
      .select('*')
      .eq('user_id', userId)
      .eq('course_code', item.code)
      .in('status', ['approved', 'partially_approved'])
      .order('reviewed_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    let scholarshipDiscount = 0;
    let payable = item.discountedFeeBdt;
    let scholarshipId: string | null = null;

    if (approvedSchol && approvedSchol.approved_waiver_percent > 0) {
      scholarshipDiscount = Math.round((item.discountedFeeBdt * approvedSchol.approved_waiver_percent) / 100);
      payable = Math.max(0, item.discountedFeeBdt - scholarshipDiscount);
      scholarshipId = approvedSchol.id;
    }

    const { data: enrolment, error } = await admin
      .from('enrolments')
      .insert({
        user_id: userId,
        programme_code: item.code,
        programme_title: item.title,
        programme_type: 'course',
        category_id: item.categoryId,
        status: 'pending_payment',
        regular_fee_bdt: item.regularFeeBdt,
        discounted_fee_bdt: item.discountedFeeBdt,
        scholarship_discount_bdt: scholarshipDiscount,
        payable_fee_bdt: payable,
        scholarship_id: scholarshipId,
      })
      .select('*')
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    await admin.from('notifications').insert({
      user_id: userId,
      title: `Enrolment Started: ${item.code}`,
      body: `Please complete manual bKash or Nagad payment of BDT ${payable.toLocaleString()} and submit your TrxID for verification.`,
      category: 'enrolment',
      link_url: '/dashboard/payments',
    });

    res.status(201).json({ enrolment });
  });

  router.post('/learner/payments', requireAuthenticatedUser, async (req: AuthedRequest, res: Response) => {
    const admin = getSupabaseAdmin()!;
    const userId = req.auth!.userId;
    const { enrolmentId, method, senderNumber, transactionId, amountBdt, studentNotes } = req.body || {};

    if (!enrolmentId || !['bkash', 'nagad'].includes(method)) {
      res.status(400).json({ error: 'Please select a valid payment method (bKash or Nagad).' });
      return;
    }

    const cleanSender = String(senderNumber || '').trim();
    const cleanTrxId = String(transactionId || '').trim().toUpperCase();
    const numericAmount = Number(amountBdt);

    if (!/^(\+?88)?01[3-9]\d{8}$/.test(cleanSender.replace(/[\s-]/g, ''))) {
      res.status(400).json({ error: 'Please enter a valid 11-digit Bangladesh mobile number (e.g. 01XXXXXXXXX).' });
      return;
    }
    if (cleanTrxId.length < 6 || cleanTrxId.length > 32 || !/^[A-Z0-9_-]+$/.test(cleanTrxId)) {
      res.status(400).json({ error: 'Please enter a valid Transaction ID (TrxID).' });
      return;
    }
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      res.status(400).json({ error: 'Please enter a valid payment amount in BDT.' });
      return;
    }

    const { data: enrolment } = await admin
      .from('enrolments')
      .select('*')
      .eq('id', enrolmentId)
      .eq('user_id', userId)
      .maybeSingle();

    if (!enrolment) {
      res.status(404).json({ error: 'Enrolment record not found.' });
      return;
    }

    // Prevent duplicate TrxID reuse
    const { data: dupTrx } = await admin
      .from('payments')
      .select('id')
      .eq('transaction_id', cleanTrxId)
      .neq('status', 'rejected')
      .maybeSingle();

    if (dupTrx) {
      res.status(409).json({
        error: 'This Transaction ID (TrxID) has already been submitted. If you believe this is an error, contact Support.',
      });
      return;
    }

    const { data: payment, error } = await admin
      .from('payments')
      .insert({
        enrolment_id: enrolment.id,
        user_id: userId,
        programme_code: enrolment.programme_code,
        programme_title: enrolment.programme_title,
        method,
        sender_number: cleanSender,
        transaction_id: cleanTrxId,
        amount_bdt: Math.round(numericAmount),
        status: 'pending',
        student_notes: String(studentNotes || '').trim().slice(0, 400),
      })
      .select('*')
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    await admin.from('notifications').insert({
      user_id: userId,
      title: `Payment Submitted (${method.toUpperCase()})`,
      body: `TrxID ${cleanTrxId} for ${enrolment.programme_code} (BDT ${Math.round(numericAmount).toLocaleString()}) is pending verification by Atlas AI Education.`,
      category: 'payment',
      link_url: '/dashboard/payments',
    });

    await sendWeb3FormsNotification({
      subject: `[Payment Verification Pending] ${enrolment.programme_code} — ${method.toUpperCase()}`,
      fromName: req.auth!.fullName || req.auth!.email,
      replyTo: req.auth!.email,
      fields: {
        studentEmail: req.auth!.email,
        programme: `${enrolment.programme_code} — ${enrolment.programme_title}`,
        method: method.toUpperCase(),
        senderNumber: cleanSender,
        transactionId: cleanTrxId,
        amountBdt: Math.round(numericAmount),
      },
    });

    res.status(201).json({ payment });
  });

  router.post('/learner/scholarships', requireAuthenticatedUser, async (req: AuthedRequest, res: Response) => {
    const admin = getSupabaseAdmin()!;
    const userId = req.auth!.userId;
    const {
      fullName,
      email,
      phone,
      educationLevel,
      professionRole,
      institutionOrg,
      cityDistrict,
      courseCode,
      learningMotivation,
      financialNeed,
      educationalRelevance,
      commitmentStatement,
    } = req.body || {};

    const item = getCatalogueItem(String(courseCode || ''));
    if (!item || item.type !== 'course' || !item.scholarshipEligible) {
      res.status(400).json({
        error: 'Scholarships apply only to eligible paid courses (AI Literacy, Applied AI, Professional Development, and Governance tracks). Free Specialized Programmes are already tuition-free.',
      });
      return;
    }

    if (
      !fullName ||
      !email ||
      !phone ||
      !educationLevel ||
      !professionRole ||
      !cityDistrict ||
      !learningMotivation ||
      !financialNeed ||
      !educationalRelevance ||
      !commitmentStatement
    ) {
      res.status(400).json({ error: 'Please complete all required scholarship application sections.' });
      return;
    }

    if (containsSensitiveFinancialTokens(`${financialNeed} ${learningMotivation}`)) {
      res.status(400).json({
        error: 'For your safety, please remove any bank card numbers, PINs, or OTPs. Atlas AI Education never requests financial credentials.',
      });
      return;
    }

    const { data, error } = await admin
      .from('scholarship_applications')
      .insert({
        user_id: userId,
        full_name: String(fullName).trim(),
        email: String(email).trim().toLowerCase(),
        phone: String(phone).trim(),
        education_level: String(educationLevel).trim(),
        profession_role: String(professionRole).trim(),
        institution_org: String(institutionOrg || '').trim(),
        city_district: String(cityDistrict).trim(),
        course_code: item.code,
        course_title: item.title,
        learning_motivation: String(learningMotivation).trim(),
        financial_need: String(financialNeed).trim(),
        educational_relevance: String(educationalRelevance).trim(),
        commitment_statement: String(commitmentStatement).trim(),
        status: 'submitted',
      })
      .select('*')
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    await admin.from('notifications').insert({
      user_id: userId,
      title: `Scholarship Application Received (${item.code})`,
      body: 'Your scholarship application has been submitted for committee review. Up to 50% course fee waiver may be awarded.',
      category: 'scholarship',
      link_url: '/dashboard/scholarships',
    });

    await sendWeb3FormsNotification({
      subject: `[Scholarship Application] ${item.code} — ${String(fullName).trim()}`,
      fromName: String(fullName).trim(),
      replyTo: String(email).trim(),
      fields: {
        course: `${item.code} — ${item.title}`,
        applicantEmail: email,
        phone,
        cityDistrict,
        educationLevel,
        professionRole,
      },
    });

    res.status(201).json({ application: data });
  });

  router.post('/learner/progress', requireAuthenticatedUser, async (req: AuthedRequest, res: Response) => {
    const admin = getSupabaseAdmin()!;
    const userId = req.auth!.userId;
    const { programmeCode, completedModules, completedSessions, completionPercentage } = req.body || {};

    if (!programmeCode) {
      res.status(400).json({ error: 'programmeCode is required.' });
      return;
    }

    const pct = Math.max(0, Math.min(100, Math.round(Number(completionPercentage) || 0)));
    const { data, error } = await admin
      .from('learning_progress')
      .upsert(
        {
          user_id: userId,
          programme_code: String(programmeCode).trim().toUpperCase(),
          completed_modules: Array.isArray(completedModules) ? completedModules : [],
          completed_sessions: Array.isArray(completedSessions) ? completedSessions : [],
          completion_percentage: pct,
          last_activity_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,programme_code' }
      )
      .select('*')
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.json({ progress: data });
  });

  router.post('/learner/assignments/:id/submit', requireAuthenticatedUser, async (req: AuthedRequest, res: Response) => {
    const admin = getSupabaseAdmin()!;
    const userId = req.auth!.userId;
    const assignmentId = String(req.params.id || '').trim();
    const { submissionText, submissionUrl } = req.body || {};

    if (!submissionText || String(submissionText).trim().length < 10) {
      res.status(400).json({ error: 'Please provide your assignment response (at least 10 characters).' });
      return;
    }

    const { data, error } = await admin
      .from('assignment_submissions')
      .upsert(
        {
          assignment_id: assignmentId,
          user_id: userId,
          submission_text: String(submissionText).trim(),
          submission_url: String(submissionUrl || '').trim(),
          status: 'submitted',
          submitted_at: new Date().toISOString(),
        },
        { onConflict: 'assignment_id,user_id' }
      )
      .select('*')
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(201).json({ submission: data });
  });

  router.post('/learner/saved-resources/toggle', requireAuthenticatedUser, async (req: AuthedRequest, res: Response) => {
    const admin = getSupabaseAdmin()!;
    const userId = req.auth!.userId;
    const resourceId = String(req.body?.resourceId || '').trim();
    if (!resourceId) {
      res.status(400).json({ error: 'resourceId is required.' });
      return;
    }

    const { data: existing } = await admin
      .from('saved_resources')
      .select('id')
      .eq('user_id', userId)
      .eq('resource_id', resourceId)
      .maybeSingle();

    if (existing) {
      await admin.from('saved_resources').delete().eq('id', existing.id);
      res.json({ saved: false, resourceId });
    } else {
      await admin.from('saved_resources').insert({ user_id: userId, resource_id: resourceId });
      res.json({ saved: true, resourceId });
    }
  });

  router.patch('/learner/notifications/read', requireAuthenticatedUser, async (req: AuthedRequest, res: Response) => {
    const admin = getSupabaseAdmin()!;
    const userId = req.auth!.userId;
    const notificationId = req.body?.id ? String(req.body.id) : null;

    const query = admin.from('notifications').update({ is_read: true }).eq('user_id', userId);
    if (notificationId) {
      await query.eq('id', notificationId);
    } else {
      await query;
    }
    res.json({ ok: true });
  });

  router.delete('/learner/notifications/:id', requireAuthenticatedUser, async (req: AuthedRequest, res: Response) => {
    const admin = getSupabaseAdmin()!;
    await admin.from('notifications').delete().eq('id', req.params.id).eq('user_id', req.auth!.userId);
    res.json({ ok: true });
  });

  router.post('/learner/support-tickets', requireAuthenticatedUser, async (req: AuthedRequest, res: Response) => {
    const admin = getSupabaseAdmin()!;
    const userId = req.auth!.userId;
    const { subject, category, message } = req.body || {};

    if (!subject || !message) {
      res.status(400).json({ error: 'Please provide both a subject and message.' });
      return;
    }

    const { data, error } = await admin
      .from('support_tickets')
      .insert({
        user_id: userId,
        subject: String(subject).trim(),
        category: String(category || 'General').trim(),
        message: String(message).trim(),
      })
      .select('*')
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    await sendWeb3FormsNotification({
      subject: `[Student Support Ticket] ${String(subject).trim()}`,
      fromName: req.auth!.fullName || req.auth!.email,
      replyTo: req.auth!.email,
      fields: { category, message, studentEmail: req.auth!.email },
    });

    res.status(201).json({ ticket: data });
  });

  router.get('/learner/export-data', requireAuthenticatedUser, async (req: AuthedRequest, res: Response) => {
    const admin = getSupabaseAdmin()!;
    const userId = req.auth!.userId;
    const [profile, enrolments, payments, scholarships, certificates] = await Promise.all([
      admin.from('profiles').select('*').eq('id', userId).single(),
      admin.from('enrolments').select('*').eq('user_id', userId),
      admin.from('payments').select('*').eq('user_id', userId),
      admin.from('scholarship_applications').select('*').eq('user_id', userId),
      admin.from('certificates').select('*').eq('user_id', userId),
    ]);
    res.json({
      exportedAt: new Date().toISOString(),
      institution: 'Atlas AI Education',
      profile: profile.data,
      enrolments: enrolments.data || [],
      payments: payments.data || [],
      scholarships: scholarships.data || [],
      certificates: certificates.data || [],
    });
  });

  router.post('/learner/deactivate-account', requireAuthenticatedUser, async (req: AuthedRequest, res: Response) => {
    const admin = getSupabaseAdmin()!;
    const userId = req.auth!.userId;
    const { confirmation } = req.body || {};
    if (confirmation !== 'DEACTIVATE') {
      res.status(400).json({ error: 'Please type DEACTIVATE to confirm account deactivation.' });
      return;
    }
    await admin.from('profiles').update({ account_status: 'deactivated' }).eq('id', userId);
    res.json({ ok: true });
  });

  // --------------------------------------------------------------------------
  // SECURE ADMIN PANEL ROUTES (/api/admin/*)
  // --------------------------------------------------------------------------
  router.get('/admin/overview', requireAdminUser, async (_req: AuthedRequest, res: Response) => {
    const admin = getSupabaseAdmin()!;
    const [
      usersRes,
      enrolmentsRes,
      paymentsRes,
      scholarshipsRes,
      schedulesRes,
      assignmentsRes,
      submissionsRes,
      certificatesRes,
      ticketsRes,
      contactRes,
      instRes,
      paymentSettings,
    ] = await Promise.all([
      admin.from('profiles').select('*').order('created_at', { ascending: false }),
      admin.from('enrolments').select('*, profiles(full_name, email, phone)').order('enrolled_at', { ascending: false }),
      admin.from('payments').select('*, profiles(full_name, email, phone)').order('created_at', { ascending: false }),
      admin.from('scholarship_applications').select('*').order('created_at', { ascending: false }),
      admin.from('class_schedules').select('*').order('session_date', { ascending: true }),
      admin.from('assignments').select('*').order('created_at', { ascending: false }),
      admin.from('assignment_submissions').select('*, profiles(full_name, email), assignments(title, programme_code)').order('submitted_at', { ascending: false }),
      admin.from('certificates').select('*').order('created_at', { ascending: false }),
      admin.from('support_tickets').select('*, profiles(full_name, email)').order('created_at', { ascending: false }),
      admin.from('contact_enquiries').select('*').order('created_at', { ascending: false }),
      admin.from('institutional_enquiries').select('*').order('created_at', { ascending: false }),
      getPaymentSettingsSummary(),
    ]);

    res.json({
      users: usersRes.data || [],
      enrolments: enrolmentsRes.data || [],
      payments: paymentsRes.data || [],
      scholarships: scholarshipsRes.data || [],
      schedules: schedulesRes.data || [],
      assignments: assignmentsRes.data || [],
      submissions: submissionsRes.data || [],
      certificates: certificatesRes.data || [],
      tickets: ticketsRes.data || [],
      contactEnquiries: contactRes.data || [],
      institutionalEnquiries: instRes.data || [],
      paymentSettings,
    });
  });

  router.post('/admin/payments/:id/verify', requireAdminUser, async (req: AuthedRequest, res: Response) => {
    const admin = getSupabaseAdmin()!;
    const paymentId = String(req.params.id || '');
    const { action, adminNotes } = req.body || {};

    if (!['approved', 'rejected', 'partial', 'refunded'].includes(action)) {
      res.status(400).json({ error: 'Invalid verification action.' });
      return;
    }

    const { data: payment } = await admin.from('payments').select('*').eq('id', paymentId).maybeSingle();
    if (!payment) {
      res.status(404).json({ error: 'Payment record not found.' });
      return;
    }

    const receiptNumber =
      action === 'approved'
        ? payment.receipt_number || `AAE-REC-${new Date().getFullYear()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`
        : payment.receipt_number;

    const { data: updatedPayment, error } = await admin
      .from('payments')
      .update({
        status: action,
        admin_notes: String(adminNotes || '').trim(),
        receipt_number: receiptNumber,
        verified_by: req.auth!.userId,
        verified_at: new Date().toISOString(),
      })
      .eq('id', paymentId)
      .select('*')
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    if (action === 'approved') {
      await admin
        .from('enrolments')
        .update({ status: 'active', activated_at: new Date().toISOString() })
        .eq('id', payment.enrolment_id);

      await admin.from('learning_progress').upsert(
        {
          user_id: payment.user_id,
          programme_code: payment.programme_code,
          completion_percentage: 0,
        },
        { onConflict: 'user_id,programme_code' }
      );
    }

    await admin.from('notifications').insert({
      user_id: payment.user_id,
      title:
        action === 'approved'
          ? `Payment Verified: ${payment.programme_code}`
          : `Payment Update (${action}): ${payment.programme_code}`,
      body:
        action === 'approved'
          ? `Your ${payment.method.toUpperCase()} payment (TrxID ${payment.transaction_id}) has been verified. Course access is now active. Receipt: ${receiptNumber}.`
          : `Your payment submission (TrxID ${payment.transaction_id}) was marked ${action}. ${adminNotes || ''}`.trim(),
      category: 'payment',
      link_url: '/dashboard/payments',
    });

    res.json({ payment: updatedPayment });
  });

  router.post('/admin/enrolments/bulk-approve', requireAdminUser, async (req: AuthedRequest, res: Response) => {
    const admin = getSupabaseAdmin()!;
    const { enrolmentIds, adminNotes } = req.body || {};

    if (!Array.isArray(enrolmentIds) || enrolmentIds.length === 0) {
      res.status(400).json({ error: 'Select at least one enrolment to bulk approve.' });
      return;
    }

    const now = new Date().toISOString();
    const { data: updatedEnrolments, error } = await admin
      .from('enrolments')
      .update({ status: 'active', activated_at: now })
      .in('id', enrolmentIds)
      .select('*');

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    const approvedCount = updatedEnrolments?.length || 0;
    for (const enr of updatedEnrolments || []) {
      const receiptNumber = `AAE-REC-${new Date().getFullYear()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
      await admin
        .from('payments')
        .update({
          status: 'approved',
          admin_notes: String(adminNotes || 'Bulk verified by Admin').trim(),
          receipt_number: receiptNumber,
          verified_by: req.auth!.userId,
          verified_at: now,
        })
        .eq('enrolment_id', enr.id)
        .eq('status', 'pending');

      await admin.from('learning_progress').upsert(
        {
          user_id: enr.user_id,
          programme_code: enr.programme_code,
          completion_percentage: 0,
        },
        { onConflict: 'user_id,programme_code' }
      );

      await admin.from('notifications').insert({
        user_id: enr.user_id,
        title: `Course Access Activated: ${enr.programme_code}`,
        body: `Your enrolment in ${enr.programme_title} has been verified and activated.`,
        category: 'enrolment',
        link_url: '/dashboard/courses',
      });
    }

    res.json({ ok: true, approvedCount, enrolments: updatedEnrolments || [] });
  });

  router.patch('/admin/scholarships/:id/review', requireAdminUser, async (req: AuthedRequest, res: Response) => {
    const admin = getSupabaseAdmin()!;
    const id = String(req.params.id || '');
    const { status, approvedWaiverPercent, adminNotes } = req.body || {};

    if (!['under_review', 'approved', 'partially_approved', 'rejected'].includes(status)) {
      res.status(400).json({ error: 'Invalid scholarship status.' });
      return;
    }

    const { data: existing } = await admin
      .from('scholarship_applications')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (!existing) {
      res.status(404).json({ error: 'Scholarship application not found.' });
      return;
    }

    const course = getCatalogueItem(existing.course_code);
    const baseFee = course?.discountedFeeBdt || 0;
    const pct =
      status === 'rejected' || status === 'under_review'
        ? 0
        : Math.max(0, Math.min(50, Math.round(Number(approvedWaiverPercent) || 0)));
    const remainingFee = Math.max(0, baseFee - Math.round((baseFee * pct) / 100));

    const { data: updated, error } = await admin
      .from('scholarship_applications')
      .update({
        status,
        approved_waiver_percent: pct,
        remaining_payable_bdt: remainingFee,
        admin_notes: String(adminNotes || '').trim(),
        reviewed_by: req.auth!.userId,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    if (existing.user_id) {
      if (['approved', 'partially_approved'].includes(status)) {
        await admin
          .from('enrolments')
          .update({
            scholarship_id: existing.id,
            scholarship_discount_bdt: baseFee - remainingFee,
            payable_fee_bdt: remainingFee,
          })
          .eq('user_id', existing.user_id)
          .eq('programme_code', existing.course_code)
          .eq('status', 'pending_payment');
      }

      await admin.from('notifications').insert({
        user_id: existing.user_id,
        title: `Scholarship Review Update (${existing.course_code})`,
        body:
          pct > 0
            ? `Approved for ${pct}% fee waiver on ${existing.course_title}. Remaining payable fee: BDT ${remainingFee.toLocaleString()}.`
            : `Your scholarship application status was updated to ${status}.`,
        category: 'scholarship',
        link_url: '/dashboard/scholarships',
      });
    }

    res.json({ application: updated });
  });

  router.post('/admin/certificates/issue', requireAdminUser, async (req: AuthedRequest, res: Response) => {
    const admin = getSupabaseAdmin()!;
    const { userId, programmeCode, certificateType, issueDate } = req.body || {};

    if (!userId || !programmeCode || !certificateType) {
      res.status(400).json({ error: 'userId, programmeCode, and certificateType are required.' });
      return;
    }

    const { data: profile } = await admin.from('profiles').select('full_name, email').eq('id', userId).maybeSingle();
    const item = getCatalogueItem(String(programmeCode));
    if (!profile || !item) {
      res.status(404).json({ error: 'Learner profile or programme not found.' });
      return;
    }

    const certCode = `AAE-${item.code.replace(/[^A-Z0-9]/g, '')}-${new Date().getFullYear()}-${crypto
      .randomBytes(3)
      .toString('hex')
      .toUpperCase()}`;

    const { data: cert, error } = await admin
      .from('certificates')
      .insert({
        user_id: userId,
        certificate_code: certCode,
        participant_name: profile.full_name || profile.email,
        programme_code: item.code,
        programme_title: item.title,
        certificate_type: certificateType,
        issue_date: issueDate || new Date().toISOString().slice(0, 10),
        status: 'valid',
        issued_by: req.auth!.userId,
      })
      .select('*')
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    await admin
      .from('enrolments')
      .update({ status: 'completed' })
      .eq('user_id', userId)
      .eq('programme_code', item.code);

    await admin.from('notifications').insert({
      user_id: userId,
      title: `Certificate Issued: ${item.code}`,
      body: `Your ${certificateType} (${certCode}) for ${item.title} has been issued and is verifiable publicly.`,
      category: 'certificate',
      link_url: '/dashboard/certificates',
    });

    res.status(201).json({ certificate: cert });
  });

  router.patch('/admin/certificates/:id/revoke', requireAdminUser, async (req: AuthedRequest, res: Response) => {
    const admin = getSupabaseAdmin()!;
    const id = String(req.params.id || '');
    const { status, revokedReason } = req.body || {};

    const nextStatus = status === 'valid' ? 'valid' : 'revoked';
    const { data, error } = await admin
      .from('certificates')
      .update({ status: nextStatus, revoked_reason: String(revokedReason || '').trim() })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.json({ certificate: data });
  });

  router.post('/admin/schedules', requireAdminUser, async (req: AuthedRequest, res: Response) => {
    const admin = getSupabaseAdmin()!;
    const { programmeCode, cohortName, sessionTitle, sessionDate, startTime, endTime, deliveryMode, meetingLink, instructorNotes } =
      req.body || {};

    if (!programmeCode || !sessionTitle || !sessionDate || !startTime || !endTime) {
      res.status(400).json({ error: 'All class schedule session fields are required.' });
      return;
    }

    const { data, error } = await admin
      .from('class_schedules')
      .insert({
        programme_code: String(programmeCode).trim().toUpperCase(),
        cohort_name: String(cohortName || 'Current Cohort').trim(),
        session_title: String(sessionTitle).trim(),
        session_date: sessionDate,
        start_time: String(startTime).trim(),
        end_time: String(endTime).trim(),
        delivery_mode: String(deliveryMode || 'Live Online').trim(),
        meeting_link: String(meetingLink || '').trim(),
        instructor_notes: String(instructorNotes || '').trim(),
        created_by: req.auth!.userId,
      })
      .select('*')
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(201).json({ schedule: data });
  });

  router.delete('/admin/schedules/:id', requireAdminUser, async (req: AuthedRequest, res: Response) => {
    const admin = getSupabaseAdmin()!;
    await admin.from('class_schedules').delete().eq('id', req.params.id);
    res.json({ ok: true });
  });

  router.post('/admin/assignments', requireAdminUser, async (req: AuthedRequest, res: Response) => {
    const admin = getSupabaseAdmin()!;
    const { programmeCode, title, description, instructions, dueDate } = req.body || {};
    if (!programmeCode || !title || !description) {
      res.status(400).json({ error: 'Programme code, title, and description are required.' });
      return;
    }
    const { data, error } = await admin
      .from('assignments')
      .insert({
        programme_code: String(programmeCode).trim().toUpperCase(),
        title: String(title).trim(),
        description: String(description).trim(),
        instructions: String(instructions || '').trim(),
        due_date: dueDate || null,
        created_by: req.auth!.userId,
      })
      .select('*')
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(201).json({ assignment: data });
  });

  router.patch('/admin/submissions/:id/review', requireAdminUser, async (req: AuthedRequest, res: Response) => {
    const admin = getSupabaseAdmin()!;
    const { status, feedback } = req.body || {};
    const { data, error } = await admin
      .from('assignment_submissions')
      .update({
        status: ['under_review', 'reviewed', 'revision_requested'].includes(status) ? status : 'reviewed',
        feedback: String(feedback || '').trim(),
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', req.params.id)
      .select('*')
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.json({ submission: data });
  });

  router.patch('/admin/users/:id/status', requireAdminUser, async (req: AuthedRequest, res: Response) => {
    const admin = getSupabaseAdmin()!;
    const targetId = String(req.params.id || '');
    const { accountStatus, role } = req.body || {};
    const patch: Record<string, string> = {};
    if (['pending_verification', 'active', 'suspended', 'deactivated'].includes(accountStatus)) {
      patch.account_status = accountStatus;
    }
    if (['user', 'admin'].includes(role) && targetId !== req.auth!.userId) {
      patch.role = role;
    }
    const { data, error } = await admin.from('profiles').update(patch).eq('id', targetId).select('*').single();
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.json({ user: data });
  });

  router.patch('/admin/tickets/:id', requireAdminUser, async (req: AuthedRequest, res: Response) => {
    const admin = getSupabaseAdmin()!;
    const { status, adminReply } = req.body || {};
    const { data, error } = await admin
      .from('support_tickets')
      .update({
        status: ['open', 'in_progress', 'resolved'].includes(status) ? status : 'in_progress',
        admin_reply: String(adminReply || '').trim(),
      })
      .eq('id', req.params.id)
      .select('*')
      .single();
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.json({ ticket: data });
  });

  router.patch('/admin/enquiries/:type/:id', requireAdminUser, async (req: AuthedRequest, res: Response) => {
    const admin = getSupabaseAdmin()!;
    const table = req.params.type === 'institutional' ? 'institutional_enquiries' : 'contact_enquiries';
    const { status, adminNotes } = req.body || {};
    const patch: Record<string, string> = { status: String(status || 'reviewed') };
    if (req.params.type === 'institutional' && adminNotes !== undefined) {
      patch.admin_notes = String(adminNotes);
    }
    const { data, error } = await admin.from(table).update(patch).eq('id', req.params.id).select('*').single();
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.json({ enquiry: data });
  });

  router.put('/admin/payment-settings', requireAdminUser, async (req: AuthedRequest, res: Response) => {
    const admin = getSupabaseAdmin()!;
    const { method, accountNumber, accountType, instructions, isEnabled } = req.body || {};
    if (!['bkash', 'nagad'].includes(method)) {
      res.status(400).json({ error: 'method must be bkash or nagad.' });
      return;
    }

    const cleanNum = String(accountNumber || '').trim();
    if (isEnabled && !/^(\+?88)?01[3-9]\d{8}$/.test(cleanNum.replace(/[\s-]/g, ''))) {
      res.status(400).json({ error: 'Please enter a valid 11-digit recipient number before enabling.' });
      return;
    }

    const { data, error } = await admin
      .from('payment_settings')
      .upsert(
        {
          method,
          account_number: cleanNum || null,
          account_type: String(accountType || 'Personal / Merchant').trim(),
          instructions: String(instructions || '').trim(),
          is_enabled: Boolean(isEnabled && cleanNum),
          updated_by: req.auth!.userId,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'method' }
      )
      .select('*')
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.json({ setting: data });
  });

  app.use('/api', router);
  return app;
}
