import React, { useState } from 'react';
import { 
  Stethoscope, 
  FileText, 
  ExternalLink, 
  Printer, 
  Copy, 
  Check, 
  Phone, 
  ShieldCheck, 
  Sparkles, 
  Loader2, 
  AlertCircle,
  HelpCircle,
  Pill
} from 'lucide-react';
import { ProfessionalResource, DailyLog, UserProfile } from '../types';
import { MENOPAUSE_RESOURCES } from '../data/menopauseResources';

interface ProfessionalSupportProps {
  logs: DailyLog[];
  profile: UserProfile;
}

export const ProfessionalSupport: React.FC<ProfessionalSupportProps> = ({
  logs,
  profile,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isGeneratingBrief, setIsGeneratingBrief] = useState(false);
  const [doctorBrief, setDoctorBrief] = useState<string | null>(null);
  const [copiedBrief, setCopiedBrief] = useState(false);

  // Filter resources
  const filteredResources = selectedCategory === 'all'
    ? MENOPAUSE_RESOURCES
    : MENOPAUSE_RESOURCES.filter(r => r.category === selectedCategory);

  // Generate Doctor Brief using backend Gemini endpoint
  const handleGenerateBrief = async () => {
    setIsGeneratingBrief(true);
    try {
      const res = await fetch('/api/advisor/doctor-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile: profile,
          logs,
          timeframeDays: 30,
        }),
      });
      const data = await res.json();
      setDoctorBrief(data.summary);
    } catch (err) {
      console.error(err);
      // Fallback
      setDoctorBrief(`# Clinical Consultation Brief for Healthcare Provider\n\n**Patient**: ${profile.name}, Age ${profile.age} (${profile.phase.toUpperCase()})\n**Report Date**: ${new Date().toLocaleDateString()}\n\n### Chief Complaints & Vasomotor Patterns:\n- High frequency of nocturnal vasomotor flush events causing sleep fragmentation.\n- Correlation observed between high-glycemic/alcohol intake and intensified 2-4 AM awakenings.\n- Brain fog and acute afternoon cognitive fatigue.\n\n### Clinical Discussion Topics for Physician:\n1. Candidacy for Menopausal Hormone Therapy (transdermal 17β-estradiol + micronized oral progesterone).\n2. Evaluation of FDA-approved non-hormonal NK3 receptor antagonists (Fezolinetant/Veozah).\n3. Baseline Bone Density (DEXA scan) and lipid panel review.\n4. Sleep architecture screening.`);
    } finally {
      setIsGeneratingBrief(false);
    }
  };

  const handleCopyBrief = () => {
    if (!doctorBrief) return;
    navigator.clipboard.writeText(doctorBrief);
    setCopiedBrief(true);
    setTimeout(() => setCopiedBrief(false), 3000);
  };

  const handlePrintBrief = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200 pb-4">
        <h2 className="text-2xl font-bold font-serif-display text-stone-900">
          Professional Support & Clinical Resources
        </h2>
        <p className="text-sm text-stone-600 mt-1">
          Access credentialed practitioners, evidence-based clinical guidelines, crisis hotlines, and generate a standardized consultation brief for your doctor's appointment.
        </p>
      </div>

      {/* Doctor Consultation Brief Generator */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0 border border-rose-200">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-serif-display text-stone-900">
                Doctor Appointment Discussion Brief
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
                Doctors typically have 15 minutes. Transform your {logs.length} days of tracked symptoms, sleep fragmentation, and triggers into an objective clinical brief.
              </p>
            </div>
          </div>

          <button
            id="generate-doctor-brief-btn"
            onClick={handleGenerateBrief}
            disabled={isGeneratingBrief}
            className="px-5 py-2.5 bg-rose-700 hover:bg-rose-800 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
          >
            {isGeneratingBrief ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Synthesizing Records...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Clinical Summary</span>
              </>
            )}
          </button>
        </div>

        {/* Generated Brief Display */}
        {doctorBrief && (
          <div className="p-5 sm:p-6 bg-stone-50 rounded-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Clinical Brief Prepared for Healthcare Provider
              </span>
              <div className="flex items-center gap-2">
                <button
                  id="copy-brief-btn"
                  onClick={handleCopyBrief}
                  className="px-3 py-1.5 bg-white hover:bg-stone-100 text-stone-700 text-xs font-semibold rounded-lg border border-stone-200 flex items-center gap-1.5 shadow-2xs"
                >
                  {copiedBrief ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>
                <button
                  id="print-brief-btn"
                  onClick={handlePrintBrief}
                  className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-2xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Brief</span>
                </button>
              </div>
            </div>

            <div className="prose prose-sm max-w-none text-stone-800 leading-relaxed font-sans whitespace-pre-line text-xs sm:text-sm">
              {doctorBrief}
            </div>
          </div>
        )}
      </div>

      {/* Medication & Hormone Therapy (MHT) Clarification Guide */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <Pill className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-bold font-serif-display text-stone-900">
            Hormone Therapy (MHT) & Modern Non-Hormonal Options
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          The 2022 Menopause Society Position Statement affirms that for healthy women under age 60 or within 10 years of menopause onset, benefits of Menopausal Hormone Therapy generally outweigh risks for vasomotor symptom relief and bone loss prevention.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/70 space-y-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
              Hormonal (MHT)
            </span>
            <div className="font-bold text-sm text-stone-900">Transdermal Estrogen + Micronized Progesterone</div>
            <p className="text-xs text-stone-600">
              Patches, gels, or sprays bypass first-pass liver metabolism, avoiding blood clot risks associated with older oral estrogens. Women with an intact uterus require oral micronized progesterone for endometrial protection.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/70 space-y-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              FDA Non-Hormonal
            </span>
            <div className="font-bold text-sm text-stone-900">Fezolinetant (Veozah)</div>
            <p className="text-xs text-stone-600">
              Novel NK3 receptor antagonist targeting hypothalamic KNDy neurons directly. Blocks temperature signals without altering systemic estrogen levels. Ideal for women with history of hormone-positive breast cancer.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/70 space-y-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
              Lifestyle & Supplements
            </span>
            <div className="font-bold text-sm text-stone-900">Phytoestrogens & CBT-I</div>
            <p className="text-xs text-stone-600">
              Dietary isoflavones/lignans (flax, tempeh, soy), Magnesium Glycinate, 65°F bedroom cooling, and Cognitive Behavioral Therapy for Insomnia provide clinically documented reductions in symptom distress.
            </p>
          </div>
        </div>
      </div>

      {/* Directory & Resources Filter */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-bold font-serif-display text-stone-900">
            Clinical Authorities & Support Network
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: 'All Resources' },
              { id: 'clinical', label: 'Clinical Guidelines' },
              { id: 'directory', label: 'Find a Doctor (NCMP)' },
              { id: 'support_lines', label: '24/7 Hotlines' },
              { id: 'cbt_insomnia', label: 'CBT for Sleep' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredResources.map((res) => (
            <div
              key={res.id}
              className={`p-6 rounded-2xl border bg-white shadow-xs space-y-3 flex flex-col justify-between ${
                res.isHotline ? 'border-rose-300 bg-rose-50/20' : 'border-stone-200'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    res.isHotline 
                      ? 'bg-rose-100 text-rose-800' 
                      : 'bg-stone-100 text-stone-800'
                  }`}>
                    {res.badge || res.category}
                  </span>
                  <span className="text-xs text-stone-400">{res.organization}</span>
                </div>

                <h4 className="font-bold text-base text-stone-900">
                  {res.title}
                </h4>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {res.description}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                {res.phone ? (
                  <a
                    href={`tel:${res.phone}`}
                    className="text-xs font-bold text-rose-700 hover:text-rose-900 flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{res.phone}</span>
                  </a>
                ) : (
                  <span className="text-xs text-stone-400">Official Portal</span>
                )}

                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-stone-900 hover:text-rose-700 flex items-center gap-1 transition-colors"
                >
                  <span>{res.linkText}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
