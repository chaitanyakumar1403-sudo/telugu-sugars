/*
 * ─── DAILY VIDEO INPUT ────────────────────────────────────────────────
 * To publish today's video, add ONE line at the TOP of `GOING`:
 *
 *   { youtube: 'https://youtu.be/XXXXXXXXXXX', title: 'Today’s title', date: '2026-10-16' },
 *
 * Optional fields:
 *   te:    'తెలుగు శీర్షిక'                    → shown when the site is in Telugu
 *   links: [{ label: 'Brand jaggery powder', url: 'https://…' }]
 *          → affiliate / brand-promotion links, shown under the video and
 *            marked "Affiliate" with rel="sponsored".
 *
 * `STARTED` holds the first videos — the "How it started" shelf.
 * ──────────────────────────────────────────────────────────────────────
 */

export interface AffiliateLink {
  label: string;
  url: string;
}

export interface Video {
  /** Full YouTube URL (watch, youtu.be or shorts) or the bare 11-character video ID. */
  youtube: string;
  title: string;
  te?: string;
  /** YYYY-MM-DD */
  date: string;
  links?: AffiliateLink[];
}

export const STARTED: Video[] = [];

export const GOING: Video[] = [];

/** Pulls the 11-character video ID out of any common YouTube link shape. */
export const youtubeId = (src: string): string =>
  src.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{11})/)?.[1] ?? src.trim();
