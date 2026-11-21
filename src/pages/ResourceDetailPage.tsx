import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Lock, Eye, CheckCircle2, AlertCircle } from 'lucide-react';
import { getResourceById } from '../data/resources';
import { getResourceImage } from '../data/media';
import { useAuth } from '../context/AuthContext';
import { apiFetch, ApiError } from '../lib/api';

export function ResourceDetailPage() {
  const { id } = useParams();
  const resource = getResourceById(id);
  const { user } = useAuth();
  const [showPreview, setShowPreview] = useState(false);
  const [memberResult, setMemberResult] = useState<{
    authorized: boolean;
    reason?: string;
    memberAccessNote?: string;
    fullPromptTemplate?: string;
  } | null>(null);
  const [checking, setChecking] = useState(false);

  if (!resource) {
    return (
      <div className="bg-white max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-[#0F172A]">Resource Not Found</h1>
        <Link to="/resources" className="text-[#1D4ED8] font-semibold underline">
          Return to Resources Library
        </Link>
      </div>
    );
  }

  async function verifyAccess() {
    setChecking(true);
    try {
      const res = await apiFetch<{
        authorized: boolean;
        memberAccessNote?: string;
        fullPromptTemplate?: string;
      }>(`/api/resources/${resource!.id}/access`, { requireAuth: true });
      setMemberResult(res);
    } catch (err) {
      setMemberResult({
        authorized: false,
        reason:
          err instanceof ApiError
            ? err.message
            : 'Authentication and active enrolment are required for Member Access.',
      });
    } finally {
      setChecking(false);
    }
  }

  const media = getResourceImage(resource.id, resource.topicCategory, resource.title);

  return (
    <div className="bg-white text-[#0F172A]">
      <div className="max-w-[960px] mx-auto px-4 sm:px-6 py-12 space-y-8">
        <nav aria-label="Breadcrumb" className="text-xs text-[#64748B] flex items-center gap-2">
          <Link to="/" className="hover:text-[#0F172A]">Home</Link>
          <span aria-hidden="true">/</span>
          <Link to="/resources" className="hover:text-[#0F172A]">Resources</Link>
          <span aria-hidden="true">/</span>
          <span className="text-[#0F172A] font-medium">{resource.code}</span>
        </nav>

        <div className="aspect-[16/9] w-full rounded-[16px] overflow-hidden border border-[#E3E8EF] bg-[#F7F9FC]">
          <img
            src={media.src}
            alt={media.alt}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748B]">
            <span className="font-semibold text-[#1D4ED8]">{resource.code}</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-[#0F172A]">{resource.topicCategory}</span>
            <span aria-hidden="true">·</span>
            <span>{resource.language}</span>
            <span aria-hidden="true">·</span>
            <span>{resource.level}</span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1 font-medium text-[#B45309]">
              <Lock className="w-3.5 h-3.5" strokeWidth={1.5} /> Locked (Member Access)
            </span>
          </div>

          <h1 className="text-2xl sm:text-[36px] font-bold text-[#0F172A] tracking-[-0.02em] leading-tight">
            {resource.title}
          </h1>

          <div className="space-y-2 max-w-[68ch]">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-[#1D4ED8]">
              Resource Overview
            </h2>
            <p className="text-base text-[#334155] leading-relaxed">{resource.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-[#E3E8EF]">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-[#1D4ED8] mb-3">
                What You Will Learn
              </h2>
              <ul className="divide-y divide-[#E3E8EF] border-y border-[#E3E8EF] text-sm text-[#334155]">
                {resource.whatYouWillLearn.map((point) => (
                  <li key={point} className="py-2.5">{point}</li>
                ))}
              </ul>
            </div>

            <dl className="divide-y divide-[#E3E8EF] border-y border-[#E3E8EF] text-sm">
              <div className="py-3">
                <dt className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                  Intended Audience
                </dt>
                <dd className="text-[#0F172A] mt-1">{resource.intendedAudience}</dd>
              </div>
              <div className="py-3">
                <dt className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                  Resource Format
                </dt>
                <dd className="text-[#0F172A] mt-1">{resource.format}</dd>
              </div>
              <div className="py-3">
                <dt className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                  Access Status
                </dt>
                <dd className="text-[#B45309] font-medium mt-1">
                  Restricted — Active Verified Member Access Required
                </dd>
              </div>
            </dl>
          </div>

          <div className="flex flex-wrap gap-3 pt-4 border-t border-[#E3E8EF]">
            <button
              type="button"
              onClick={verifyAccess}
              disabled={checking}
              className="inline-flex items-center gap-2 min-h-[48px] px-5 py-2.5 text-sm font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-[8px] transition-colors"
            >
              <Lock className="w-4 h-4" strokeWidth={1.5} />
              {checking ? 'Verifying Access...' : 'Member Access'}
            </button>
            <button
              type="button"
              onClick={() => setShowPreview((p) => !p)}
              className="inline-flex items-center gap-2 min-h-[48px] px-5 py-2.5 text-sm font-semibold text-[#0F172A] bg-white border border-[#CBD5E1] hover:bg-[#F7F9FC] rounded-[8px] transition-colors"
            >
              <Eye className="w-4 h-4" strokeWidth={1.5} />
              {showPreview ? 'Hide Preview' : 'Unlock Preview'}
            </button>
          </div>

          {showPreview && (
            <div className="pt-4 border-t border-[#E3E8EF] space-y-1.5 max-w-[68ch]">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#1D4ED8]">
                Approved Public Preview
              </p>
              <p className="text-sm text-[#334155] leading-relaxed">{resource.previewExcerpt}</p>
            </div>
          )}

          {memberResult && (
            memberResult.authorized ? (
              <div className="pt-4 border-t border-[#E3E8EF] space-y-3">
                <div className="flex items-start gap-2.5 text-[#14532D] text-sm">
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-[#15803D]" strokeWidth={1.5} />
                  <p>{memberResult.memberAccessNote}</p>
                </div>
                <pre className="p-4 bg-[#F7F9FC] border border-[#E3E8EF] rounded-[8px] text-[#0F172A] text-xs whitespace-pre-wrap leading-relaxed font-sans">
                  {memberResult.fullPromptTemplate}
                </pre>
              </div>
            ) : (
              <div className="pt-4 border-t border-[#E3E8EF] text-sm text-[#92400E] space-y-3">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-[#B45309]" strokeWidth={1.5} />
                  <p>{memberResult.reason}</p>
                </div>
                {!user && (
                  <Link
                    to={`/login?redirect=${encodeURIComponent(`/resources/${resource.id}`)}`}
                    className="inline-flex items-center min-h-[44px] px-4 py-2 text-xs font-semibold text-white bg-[#1D4ED8] rounded-[8px]"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
