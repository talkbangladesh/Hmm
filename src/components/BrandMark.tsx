import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';

export function AtlasLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="inline-flex items-center gap-2.5 shrink-0">
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect width="32" height="32" rx="8" fill="#1D4ED8" />
        <circle cx="16" cy="16" r="9.5" stroke="#DBEAFE" strokeWidth="1.5" />
        <ellipse cx="16" cy="16" rx="4.5" ry="9.5" stroke="#93C5FD" strokeWidth="1.25" />
        <line x1="6.5" y1="16" x2="25.5" y2="16" stroke="#93C5FD" strokeWidth="1.25" />
        <path d="M16 6.5L19 16L16 25.5L13 16L16 6.5Z" fill="#FFFFFF" fillOpacity="0.22" />
        <circle cx="16" cy="16" r="2.1" fill="#FFFFFF" />
      </svg>
      <div className="flex flex-col leading-none">
        <span className="text-[15px] sm:text-base font-bold tracking-tight text-[#0F172A] whitespace-nowrap">
          Atlas AI Education
        </span>
        {!compact && (
          <span className="text-[10px] font-medium tracking-wider uppercase text-[#64748B] mt-0.5 whitespace-nowrap">
            Atlas AI Institute
          </span>
        )}
      </div>
    </div>
  );
}

export function FeatureMediaCover({
  imageSrc,
  imageAlt,
  code,
  label,
  sublabel,
  className = '',
}: {
  imageSrc: string;
  imageAlt: string;
  code: string;
  label: string;
  sublabel?: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`w-full overflow-hidden border-b border-[#E3E8EF] select-none ${className}`}>
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#F7F9FC]">
        {!failed ? (
          <img
            src={imageSrc}
            alt={imageAlt}
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={() => setFailed(true)}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#F7F9FC]">
            <BookOpen className="w-7 h-7 text-[#1D4ED8] mb-2" strokeWidth={1.5} aria-hidden="true" />
            <p className="text-sm font-bold text-[#0F172A]">{code}</p>
            <p className="text-xs text-[#64748B] mt-0.5">{label}</p>
          </div>
        )}
      </div>
      <div className="px-5 py-2.5 border-t border-[#E3E8EF] flex items-center justify-between gap-3 text-xs text-[#64748B]">
        <span className="truncate">
          <span className="font-semibold text-[#1D4ED8]">{code}</span>
          <span className="text-[#CBD5E1] mx-1.5" aria-hidden="true">·</span>
          <span className="font-medium text-[#334155]">{label}</span>
        </span>
        {sublabel && (
          <span className="font-medium text-[#64748B] whitespace-nowrap shrink-0">{sublabel}</span>
        )}
      </div>
    </div>
  );
}
