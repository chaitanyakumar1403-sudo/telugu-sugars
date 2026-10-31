import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import VoicesPage from '../src/pages/VoicesPage';
import ThemeToggle from '../src/components/common/ThemeToggle';
import { LanguageProvider } from '../src/context/LanguageContext';

const page = () => render(<LanguageProvider><VoicesPage /></LanguageProvider>);

describe('Inclusive Voices', () => {
  it('invites every voice and offers a question to start from', () => {
    page();
    expect(screen.getByRole('heading', { level: 1, name: 'Every Telugu voice belongs here.' })).toBeInTheDocument();
    ['Elders', 'Village kitchens', 'Every dialect', 'Signing and disabled creators', 'First-timers'].forEach((n) =>
      expect(screen.getByRole('heading', { name: n })).toBeInTheDocument(),
    );
    expect(screen.getByRole('button', { name: /another question/i })).toBeInTheDocument();
  });

  it('says plainly when the browser cannot record (jsdom has no microphone)', () => {
    page();
    expect(screen.getByRole('alert')).toHaveTextContent(/record with your phone’s voice recorder/i);
  });

  it('sends a written story to the team inbox, with consent', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: 'true' }) });
    vi.stubGlobal('fetch', fetchMock);
    page();
    fireEvent.change(screen.getByLabelText(/your village or town/i), { target: { value: 'Araku' } });
    fireEvent.change(screen.getByLabelText(/your food story/i), { target: { value: 'My grandmother made ragi java when we were sick.' } });
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.submit(screen.getByRole('button', { name: /send my story/i }).closest('form')!);
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/your story has reached us/i));
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toContain('telugusugars@gmail.com');
    expect(JSON.parse(opts.body)).toMatchObject({ place: 'Araku', consent: 'yes' });
    vi.unstubAllGlobals();
  });
});

describe('Accessibility switches', () => {
  it('turns contrast, easy reading and calm motion on the page, and remembers them', () => {
    render(<LanguageProvider><ThemeToggle /></LanguageProvider>);
    fireEvent.click(screen.getByRole('button', { name: /display settings/i }));
    fireEvent.click(screen.getByRole('button', { name: /higher contrast/i }));
    fireEvent.click(screen.getByRole('button', { name: /easy reading/i }));
    fireEvent.click(screen.getByRole('button', { name: /stop animations/i }));
    const d = document.documentElement.dataset;
    expect([d.contrast, d.read, d.motion]).toEqual(['more', 'easy', 'off']);
    expect(localStorage.getItem('telugusugars_motion')).toBe('1');
  });
});
