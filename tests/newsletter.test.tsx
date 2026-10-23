import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NewsletterModal from '../src/components/common/NewsletterModal';
import { LanguageProvider } from '../src/context/LanguageContext';

const open = () =>
  render(
    <LanguageProvider>
      <NewsletterModal isOpen onClose={() => {}} />
    </LanguageProvider>,
  );

const fill = () => {
  fireEvent.change(screen.getByLabelText(/your email/i), { target: { value: 'amma@example.com' } });
  fireEvent.click(screen.getByRole('checkbox'));
  fireEvent.submit(screen.getByRole('button', { name: /subscribe/i }).closest('form')!);
};

describe('Monthly email sign-up', () => {
  it('sends the email to the team inbox and confirms', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: 'true' }) });
    vi.stubGlobal('fetch', fetchMock);
    open();
    fill();
    await waitFor(() => expect(screen.getByText(/you are on the list/i)).toBeInTheDocument());
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toContain('telugusugars@gmail.com');
    expect(JSON.parse(opts.body)).toMatchObject({ email: 'amma@example.com', consent: 'yes' });
    vi.unstubAllGlobals();
  });

  it('says so when sending fails, instead of pretending', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    open();
    fill();
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent(/could not send/i));
    expect(screen.queryByText(/you are on the list/i)).not.toBeInTheDocument();
    vi.unstubAllGlobals();
  });
});
