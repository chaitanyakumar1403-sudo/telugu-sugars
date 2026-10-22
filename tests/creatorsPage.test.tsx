import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LanguageProvider } from '../src/context/LanguageContext';
import CreatorsPage from '../src/pages/CreatorsPage';

describe('CreatorsPage', () => {
  it('posts the registration to the Telugu Sugars inbox', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: 'true' }) });
    vi.stubGlobal('fetch', fetchMock);
    render(<LanguageProvider><CreatorsPage /></LanguageProvider>);
    fireEvent.change(screen.getByLabelText(/full name|పూర్తి పేరు/i), { target: { value: 'Ravi' } });
    fireEvent.change(screen.getByLabelText(/contact number|ఫోన్/i), { target: { value: '9876543210' } });
    fireEvent.change(screen.getByLabelText(/instagram|ఇన్‌స్టాగ్రామ్/i), { target: { value: '@ravi' } });
    fireEvent.change(screen.getByLabelText(/address|చిరునామా/i), { target: { value: 'Vijayawada' } });
    fireEvent.submit(screen.getByRole('button', { name: /register|నమోదు/i }).closest('form')!);
    await waitFor(() => expect(screen.getByRole('status')).toBeInTheDocument());
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toContain('telugusugars@gmail.com');
    expect(JSON.parse(opts.body)).toMatchObject({ name: 'Ravi', phone: '9876543210', instagram: '@ravi', address: 'Vijayawada' });
    vi.unstubAllGlobals();
  });
});
