import React, { useEffect, useRef, useState } from 'react';
import { Share2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { drawCard, shareImage, type CardData } from '../../lib/scan';

interface ShareButtonProps {
  /** Builds the card when tapped (so it always shows the current language and age verdicts) */
  card: () => Omit<CardData, 'brand' | 'foot' | 'url' | 'te'>;
  /** Link added to the shared message, e.g. "/atlas" */
  path: string;
  /** File name slug */
  slug: string;
  className?: string;
}

const host = () => (/^(localhost|127\.|\[::1\])/.test(location.hostname) ? 'telugusugars.in' : location.hostname.replace(/^www\./, ''));

/**
 * Share on WhatsApp: draws the verdict card and opens the phone's share sheet. Where a phone can't share
 * files, it shows the image with Save and Open WhatsApp (link) instead.
 */
export const ShareButton: React.FC<ShareButtonProps> = ({ card, path, slug, className }) => {
  const { t, language } = useLanguage();
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<{ url: string; text: string; name: string } | null>(null);
  const dlg = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (preview && dlg.current && !dlg.current.open) dlg.current.showModal();
    return () => { if (preview) URL.revokeObjectURL(preview.url); };
  }, [preview]);

  const share = async () => {
    setBusy(true);
    try {
      const c = card();
      const blob = await drawCard({ ...c, brand: t('card_brand'), foot: t('card_foot'), url: host() + path, te: language === 'te' });
      const text = `${t('card_text', { name: c.title })} ${location.origin}${path}`;
      const name = `telugu-sugars-${slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'label'}.png`;
      const how = await shareImage(blob, text, name);
      if (how === 'unsupported') setPreview({ url: URL.createObjectURL(blob), text, name });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={share}
        disabled={busy}
        className={className ?? 'inline-flex items-center gap-2 rounded-full bg-[#1f8f4e] px-5 py-2.5 text-sm font-bold text-[#fff] shadow-lg shadow-[#1f8f4e]/25 transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60'}
      >
        <Share2 className="h-4 w-4" /> {t('share_wa')}
      </button>
      {preview && (
        <dialog
          ref={dlg}
          onClose={() => setPreview(null)}
          onClick={(e) => { if (e.target === e.currentTarget) dlg.current?.close(); }}
          className="m-auto w-[min(440px,calc(100vw-24px))] rounded-3xl bg-(--bg-panel) p-5 text-white backdrop:bg-black/70"
        >
          <h3 className="text-lg font-bold">{t('sh_title')}</h3>
          <img src={preview.url} alt="" className="mt-3 w-full rounded-xl border border-white/10" />
          <p className="mt-3 text-sm leading-relaxed text-slate-400">{t('sh_hint')}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a download={preview.name} href={preview.url} className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-white/15 px-4 text-sm font-bold">{t('sh_save')}</a>
            <a target="_blank" rel="noopener noreferrer" href={`https://wa.me/?text=${encodeURIComponent(preview.text)}`} className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-[#1f8f4e] px-4 text-sm font-bold text-[#fff]">{t('sh_wa')}</a>
            <button type="button" onClick={() => dlg.current?.close()} className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-white/15 px-4 text-sm font-bold">{t('sc_close')}</button>
          </div>
        </dialog>
      )}
    </>
  );
};

export default ShareButton;
