import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Lock, Search, Eye, CheckCircle2, AlertCircle, X, Bookmark } from 'lucide-react';
import {
  RESOURCE_CATEGORIES,
  RESOURCES,
  UPCOMING_RESOURCE_COLLECTIONS,
  type ResourceCategoryId,
  type ResourceItem,
} from '../data/resources';
import { FeatureMediaCover } from '../components/BrandMark';
import { getResourceImage } from '../data/media';
import { useAuth } from '../context/AuthContext';
import { apiFetch, ApiError } from '../lib/api';

export function ResourcesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = (searchParams.get('category') as ResourceCategoryId) || 'ebooks';
  const [activeTab, setActiveTab] = useState<ResourceCategoryId>(
    RESOURCE_CATEGORIES.some((c) => c.id === initialCat) ? initialCat : 'ebooks'
  );
  const [query, setQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState('All');
  const [levelFilter, setLevelFilter] = useState('All');

  const { user } = useAuth();
  const [modalResource, setModalResource] = useState<ResourceItem | null>(null);
  const [modalMode, setModalMode] = useState<'preview' | 'member'>('preview');
  const [memberCheckLoading, setMemberCheckLoading] = useState(false);
  const [memberContent, setMemberContent] = useState<{
    authorized: boolean;
    reason?: string;
    memberAccessNote?: string;
    fullPromptTemplate?: string;
  } | null>(null);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  function selectTab(id: ResourceCategoryId) {
    setActiveTab(id);
    setSearchParams({ category: id });
  }

  const activeUpcoming = UPCOMING_RESOURCE_COLLECTIONS.find((u) => u.categoryId === activeTab);

  const filteredResources = useMemo(() => {
    if (activeTab !== 'ebooks' && activeTab !== 'prompt-library') return [];
    return RESOURCES.filter((item) => {
      if (item.categoryId !== activeTab) return false;
      if (languageFilter !== 'All' && item.language !== languageFilter) return false;
      if (levelFilter !== 'All' && item.level !== levelFilter) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        return `${item.title} ${item.topicCategory} ${item.description}`.toLowerCase().includes(q);
      }
      return true;
    });
  }, [activeTab, languageFilter, levelFilter, query]);

  async function openMemberAccess(item: ResourceItem) {
    setModalResource(item);
    setModalMode('member');
    setMemberContent(null);
    setMemberCheckLoading(true);
    try {
      const res = await apiFetch<{
        authorized: boolean;
        memberAccessNote?: string;
        fullPromptTemplate?: string;
      }>(`/api/resources/${item.id}/access`, { requireAuth: true });
      setMemberContent(res);
    } catch (err) {
      setMemberContent({
        authorized: false,
        reason:
          err instanceof ApiError
            ? err.message
            : 'Please sign in with an active enrolled learner account to verify Member Access.',
      });
    } finally {
      setMemberCheckLoading(false);
    }
  }

  function openPreview(item: ResourceItem) {
    setModalResource(item);
    setModalMode('preview');
    setMemberContent(null);
  }

  async function handleSaveResource(resourceId: string) {
    if (!user) {
      setSavedNotice('Sign in to save resources to My Resources.');
      return;
    }
    try {
      const res = await apiFetch<{ saved: boolean }>('/api/learner/saved-resources/toggle', {
        method: 'POST',
        requireAuth: true,
        body: JSON.stringify({ resourceId }),
      });
      setSavedNotice(res.saved ? 'Saved to Dashboard -> My Resources.' : 'Removed from My Resources.');
    } catch (err) {
      setSavedNotice(err instanceof ApiError ? err.message : 'Unable to save resource.');
    }
  }

  return (
    <div className="bg-white text-[#0F172A]">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div className="space-y-3 border-b border-[#E3E8EF] pb-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#1D4ED8]">
            Atlas AI Education · Learn. Explore. Apply Responsibly.
          </p>
          <h1 className="text-3xl sm:text-[40px] font-bold text-[#0F172A] tracking-[-0.02em]">
            Resources
          </h1>
          <p className="text-base text-[#334155] max-w-3xl leading-relaxed">
            Explore a curated collection of AI learning resources, eBooks, practical prompts, and educational materials developed to support AI literacy, applied learning, research, and responsible technology use.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-4 overflow-x-auto no-scrollbar border-b border-[#E3E8EF]">
          {RESOURCE_CATEGORIES.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => selectTab(tab.id)}
                className={`py-3 min-h-[44px] text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                  isActive
                    ? 'border-[#1D4ED8] text-[#1D4ED8]'
                    : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                {tab.label}{' '}
                <span className="text-xs font-normal text-[#64748B] ml-1">({tab.countLabel})</span>
              </button>
            );
          })}
        </div>

        {savedNotice && (
          <div className="py-2.5 border-b border-[#E3E8EF] text-sm text-[#1D4ED8] flex items-center justify-between gap-4">
            <span>{savedNotice}</span>
            <button type="button" onClick={() => setSavedNotice(null)} className="font-semibold underline">
              Dismiss
            </button>
          </div>
        )}

        {activeUpcoming ? (
          <div className="space-y-5 pt-2">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#B45309]">
                Coming Soon
              </p>
              <h2 className="text-2xl font-bold text-[#0F172A]">
                {activeUpcoming.categoryTitle}
              </h2>
            </div>
            <p className="text-sm text-[#334155] max-w-2xl">
              These materials are currently being prepared and reviewed for publication. Planned titles include:
            </p>
            <ul className="divide-y divide-[#E3E8EF] border-y border-[#E3E8EF] text-sm text-[#334155]">
              {activeUpcoming.items.map((item) => (
                <li
                  key={item}
                  className="py-3.5 flex items-center justify-between gap-4"
                >
                  <span>{item}</span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-[#64748B] shrink-0">
                    Coming Soon
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <>
            {/* Search & Filters */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-6 relative">
                <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" strokeWidth={1.5} />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search eBooks, prompts and learning resources..."
                  className="w-full min-h-[44px] pl-10 pr-4 py-2.5 text-sm bg-white border border-[#CBD5E1] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                />
              </div>
              <div className="md:col-span-3">
                <select
                  aria-label="Filter by language"
                  value={languageFilter}
                  onChange={(e) => setLanguageFilter(e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2.5 text-sm bg-white border border-[#CBD5E1] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                >
                  <option value="All">All Languages</option>
                  <option value="Bilingual (BN / EN)">Bilingual (BN / EN)</option>
                  <option value="English">English</option>
                </select>
              </div>
              <div className="md:col-span-3">
                <select
                  aria-label="Filter by learning level"
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2.5 text-sm bg-white border border-[#CBD5E1] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
                >
                  <option value="All">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Beginner to Intermediate">Beginner to Intermediate</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            {/* Resource Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((item) => {
                const media = getResourceImage(item.id, item.topicCategory, item.title);
                return (
                  <article
                    key={item.id}
                    className="group bg-white border border-[#E3E8EF] rounded-[12px] shadow-[0_1px_2px_rgba(16,24,40,0.05)] overflow-hidden flex flex-col hover:border-[#93C5FD] transition-colors"
                  >
                    <Link to={`/resources/${item.id}`} className="block focus:outline-none">
                      <FeatureMediaCover
                        imageSrc={media.src}
                        imageAlt={media.alt}
                        code={item.code}
                        label={item.topicCategory}
                        sublabel={item.type}
                      />
                    </Link>
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center justify-between gap-2 text-xs text-[#64748B] mb-2">
                        <span>{item.language} · {item.level}</span>
                        <span className="inline-flex items-center gap-1 font-medium text-[#B45309]">
                          <Lock className="w-3.5 h-3.5" strokeWidth={1.5} /> Locked
                        </span>
                      </div>

                      <h2 className="text-lg font-bold text-[#0F172A] leading-snug mb-2">
                        <Link to={`/resources/${item.id}`} className="hover:text-[#1D4ED8] transition-colors">
                          {item.title}
                        </Link>
                      </h2>

                      <p className="text-sm text-[#334155] leading-relaxed line-clamp-3 mb-5 flex-1">
                        {item.description}
                      </p>

                      <div className="pt-4 border-t border-[#E3E8EF] flex flex-wrap items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => openMemberAccess(item)}
                          className="inline-flex items-center gap-1.5 min-h-[44px] px-3 py-2 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-[8px] transition-colors"
                        >
                          <Lock className="w-3.5 h-3.5" strokeWidth={1.5} />
                          Member Access
                        </button>
                        <button
                          type="button"
                          onClick={() => openPreview(item)}
                          className="inline-flex items-center gap-1.5 min-h-[44px] px-3 py-2 text-xs font-semibold text-[#0F172A] bg-[#F7F9FC] hover:bg-[#E3E8EF] rounded-[8px] transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" strokeWidth={1.5} />
                          Unlock Preview
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveResource(item.id)}
                          aria-label={`Save ${item.title}`}
                          className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-[#64748B] hover:text-[#1D4ED8] rounded-[8px]"
                        >
                          <Bookmark className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}

        {modalResource && (
          <div
            className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
          >
            <div className="bg-white border border-[#E3E8EF] rounded-[12px] max-w-lg w-full shadow-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E3E8EF] flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#1D4ED8]">
                    {modalResource.code} · {modalResource.topicCategory}
                  </p>
                  <h3 className="text-lg font-bold text-[#0F172A]">{modalResource.title}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setModalResource(null)}
                  className="p-2 rounded-[8px] text-[#64748B] hover:bg-[#F7F9FC]"
                >
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>

              <div className="p-6 space-y-4 text-sm">
                {modalMode === 'preview' ? (
                  <>
                    <p className="text-[#334155] leading-relaxed">{modalResource.description}</p>
                    <div className="py-3 border-y border-[#E3E8EF] space-y-1.5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                        Approved Public Preview Excerpt
                      </p>
                      <p className="text-[#0F172A] leading-relaxed">{modalResource.previewExcerpt}</p>
                    </div>
                    <p className="text-xs text-[#64748B]">
                      Complete resource materials are restricted to verified active members.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => openMemberAccess(modalResource)}
                        className="min-h-[44px] px-4 py-2 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-[8px]"
                      >
                        Check Member Access
                      </button>
                      <Link
                        to={`/resources/${modalResource.id}`}
                        onClick={() => setModalResource(null)}
                        className="inline-flex items-center min-h-[44px] px-4 py-2 text-xs font-semibold text-[#0F172A] border border-[#CBD5E1] rounded-[8px] hover:bg-[#F7F9FC]"
                      >
                        View Resource Details
                      </Link>
                    </div>
                  </>
                ) : memberCheckLoading ? (
                  <p className="text-[#334155] py-4">Verifying authenticated member permissions...</p>
                ) : memberContent?.authorized ? (
                  <div className="space-y-4">
                    <div className="flex items-start gap-2.5 text-[#14532D] border-b border-[#E3E8EF] pb-3">
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#15803D]" strokeWidth={1.5} />
                      <p className="text-xs">{memberContent.memberAccessNote}</p>
                    </div>
                    <pre className="py-2 text-[#0F172A] text-xs whitespace-pre-wrap leading-relaxed font-sans">
                      {memberContent.fullPromptTemplate}
                    </pre>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start gap-2.5 text-[#92400E] border-b border-[#E3E8EF] pb-3">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#B45309]" strokeWidth={1.5} />
                      <div className="space-y-1">
                        <p className="font-semibold text-xs uppercase tracking-wide">Member Access Restricted</p>
                        <p className="text-xs leading-relaxed">
                          {memberContent?.reason ||
                            'Full access requires an authenticated Atlas AI Education account with an active programme enrolment.'}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {!user ? (
                        <Link
                          to={`/login?redirect=${encodeURIComponent('/resources')}`}
                          className="inline-flex items-center min-h-[44px] px-4 py-2 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-[8px]"
                        >
                          Sign In for Member Access
                        </Link>
                      ) : (
                        <Link
                          to="/programmes/specialized"
                          className="inline-flex items-center min-h-[44px] px-4 py-2 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-[8px]"
                        >
                          Enrol in a Free Programme
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
