import { normalizeUrl } from './url';

describe('normalizeUrl', () => {
  it('lowercases hostname and removes tracking params and hash', () => {
    const input = 'https://EXAMPLE.com:443/path/?utm_source=google&ref=abc#section';
    const out = normalizeUrl(input);
    expect(out).toContain('https://example.com');
    expect(out).not.toContain('utm_source');
    expect(out).not.toContain('#section');
  });

  it('removes trailing slash', () => {
    const input = 'https://example.com/path/';
    const out = normalizeUrl(input);
    expect(out).toBe('https://example.com/path');
  });

  it('returns trimmed input on invalid URL', () => {
    const input = ' not a url ';
    const out = normalizeUrl(input);
    expect(out).toBe('not a url');
  });
});
