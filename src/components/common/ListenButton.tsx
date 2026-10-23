import React from 'react';
import { Square, Volume2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useVoice } from '../../lib/useVoice';

interface ListenButtonProps {
  /** Recording name, e.g. "what" or "atlas/sugar" → public/audio/<lang>/<rec>.mp3 */
  rec?: string;
  /** What the device voice reads when there is no recording */
  text: string | (() => string);
  className?: string;
}

const BASE =
  'relative inline-flex w-fit items-center gap-2 overflow-hidden rounded-full bg-amber-500 px-6 py-3 text-sm font-bold text-[#fff] transition hover:bg-amber-600';

/**
 * Listen / వినండి. Plays Dheeraj's recording for this language when it exists (with a progress line
 * and "Dheeraj's voice"), else reads the text with the device voice. Hidden when neither is available.
 */
export const ListenButton: React.FC<ListenButtonProps> = ({ rec, text, className = BASE }) => {
  const { t } = useLanguage();
  const { available, state, pct, toggle } = useVoice(rec, text);
  if (!available) return null;

  const on = state !== 'idle';
  return (
    <button type="button" onClick={toggle} aria-pressed={on} className={className}>
      {on ? <Square className="h-4 w-4 fill-current" /> : <Volume2 className="h-4 w-4" />}
      <span>{t(on ? 'listen_stop' : 'listen')}</span>
      {state === 'rec' && <span className="text-xs font-semibold opacity-90">· {t('voice_mine')}</span>}
      {state === 'rec' && (
        <span aria-hidden="true" className="absolute inset-x-4 bottom-1 h-0.5 rounded-full bg-white/30">
          <span className="block h-full rounded-full bg-white motion-safe:transition-[width]" style={{ width: `${Math.round(pct * 100)}%` }} />
        </span>
      )}
    </button>
  );
};

export default ListenButton;
