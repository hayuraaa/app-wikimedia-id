const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dashboard.wikimedia.or.id';

// Generate atau ambil session_id dari localStorage
function getSessionId(): string {
  const key = 'wmid_session_id';
  let sessionId = localStorage.getItem(key);

  if (!sessionId) {
    // Generate random session ID
    sessionId = crypto.randomUUID();
    localStorage.setItem(key, sessionId);
  }

  return sessionId;
}

export async function trackPageView(path: string, title?: string): Promise<void> {
  try {
    const sessionId = getSessionId();
    const referrer = document.referrer || '';

    await fetch(`${API_URL}/api/v1/analytics/pageview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page_path: path,
        page_title: title || document.title,
        referrer: referrer,
        session_id: sessionId,
      }),
    });
  } catch {
    // Silent fail — jangan ganggu user kalau analytics gagal
  }
}