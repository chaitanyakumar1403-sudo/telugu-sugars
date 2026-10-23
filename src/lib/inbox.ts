// FormSubmit relays each submission to the team inbox; no backend needed.
// The first ever submission sends a one-time activation email that must be confirmed.
export const INBOX_ENDPOINT = 'https://formsubmit.co/ajax/telugusugars@gmail.com';

/** Sends one form to the inbox as a table email. True only when FormSubmit confirms it. */
export async function sendToInbox(subject: string, fields: Record<string, unknown>): Promise<boolean> {
  try {
    const res = await fetch(INBOX_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ ...fields, _subject: subject, _template: 'table' }),
    });
    const json = await res.json().catch(() => ({}));
    return res.ok && String(json.success) === 'true';
  } catch {
    return false;
  }
}
