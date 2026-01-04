export function normalizeUrl(input: string): string {
  try {
    const u = new URL(input);

    // Normalize hostname (lowercase), remove default ports
    const hostname = u.hostname.toLowerCase();
    const port = u.port ? `:${u.port}` : '';

    // Remove hash
    u.hash = '';

    // Remove common tracking query parameters
    const params = u.searchParams;
    const blacklist = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'];
    for (const p of blacklist) params.delete(p);

    // Remove trailing slash from pathname except when it's the only character
    u.pathname = u.pathname.replace(/\/+$|^\/$/, (match) => (match === '/' ? '' : ''));

    // Reconstruct URL without username/password
    const protocol = u.protocol;
    const pathname = u.pathname || '';
    const search = params.toString() ? `?${params.toString()}` : '';

    return `${protocol}//${hostname}${port}${pathname}${search}`;
  } catch (e) {
    // If parsing fails, return original input trimmed
    return input.trim();
  }
}
