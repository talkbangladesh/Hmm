import React from 'react';
import { Link } from 'react-router-dom';
import { OFFICIAL_CONTACT } from '../data/pagesContent';

export function Footer() {
  return (
    <footer className="bg-[#0F172A] text-[#CBD5E1] border-t border-[#1E293B] pb-24 md:pb-10">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 pt-14 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-[#1E293B]">
          <div className="lg:col-span-4 space-y-3">
            <p className="text-lg font-bold text-white tracking-tight">
              Atlas AI Education
            </p>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#93C5FD]">
              An Education Initiative of Atlas AI Institute
            </p>
            <p className="bangla-text text-sm text-[#94A3B8]">
              Atlas AI Education-এর structured learning initiative — AI Education · Skills · Responsible Innovation-এর মাধ্যমে বাস্তবসম্মত AI শিক্ষা ও দক্ষতা উন্নয়নে কাজ করে।
            </p>
            <div className="pt-2 space-y-1.5 text-xs text-[#94A3B8]">
              <p>
                Email:{' '}
                <a
                  href={`mailto:${OFFICIAL_CONTACT.email}`}
                  className="text-white hover:underline underline-offset-2"
                >
                  {OFFICIAL_CONTACT.email}
                </a>
              </p>
              <p>
                WhatsApp Only:{' '}
                <a
                  href={OFFICIAL_CONTACT.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:underline underline-offset-2 font-medium"
                >
                  {OFFICIAL_CONTACT.whatsappDisplay}
                </a>{' '}
                (Messaging only)
              </p>
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-white mb-4">Explore</h3>
              <ul className="space-y-2.5 text-sm">
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="/programmes" className="hover:text-white transition-colors">All Programmes</Link></li>
                <li><Link to="/programmes/specialized" className="hover:text-white transition-colors">Specialized Programmes</Link></li>
                <li><Link to="/resources" className="hover:text-white transition-colors">Resources</Link></li>
                <li><Link to="/resources?category=ebooks" className="hover:text-white transition-colors">eBooks</Link></li>
                <li><Link to="/resources?category=prompt-library" className="hover:text-white transition-colors">Prompt Library</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-white mb-4">Programmes</h3>
              <ul className="space-y-2.5 text-sm">
                <li><Link to="/programmes/foundation" className="hover:text-white transition-colors">AI Literacy &amp; Foundation</Link></li>
                <li><Link to="/programmes/applied-ai" className="hover:text-white transition-colors">Applied AI</Link></li>
                <li><Link to="/programmes/professional-development" className="hover:text-white transition-colors">Professional Development</Link></li>
                <li><Link to="/institutional-training" className="hover:text-white transition-colors">Institutional &amp; Corporate Training</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-white mb-4">Information</h3>
              <ul className="space-y-2.5 text-sm">
                <li><Link to="/scholarships" className="hover:text-white transition-colors">Scholarships</Link></li>
                <li><Link to="/free-session" className="hover:text-white transition-colors">Free Session</Link></li>
                <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/verify-certificate" className="hover:text-white transition-colors">Verify Certificate</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-white mb-4">Policies</h3>
              <ul className="space-y-2.5 text-sm">
                <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms-and-conditions" className="hover:text-white transition-colors">Terms &amp; Conditions</Link></li>
                <li><Link to="/certificate-policy" className="hover:text-white transition-colors">Certificate Policy</Link></li>
                <li><Link to="/accessibility-statement" className="hover:text-white transition-colors">Accessibility Statement</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#94A3B8]">
          <p>{OFFICIAL_CONTACT.copyright}</p>
          <p className="max-w-xl sm:text-right">{OFFICIAL_CONTACT.disclaimer}</p>
        </div>
      </div>
    </footer>
  );
}
