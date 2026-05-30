import { API_BASE_URLS } from '@/config/apiConfig';

const buildUrl = (id: number, action: 'view' | 'click') =>
  `${API_BASE_URLS.portfolio}/points/sponsored-posts/${id}/${action}`;

export async function reportSponsoredView(id: number, accessToken?: string) {
  try {
    const url = buildUrl(id, 'view');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
    const res = await fetch(url, { method: 'POST', headers });
    if (!res.ok) {
      console.warn('reportSponsoredView failed', res.status);
    }
  } catch (err) {
    console.warn('reportSponsoredView error', err);
  }
}

export async function reportSponsoredClick(id: number, accessToken?: string) {
  try {
    const url = buildUrl(id, 'click');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
    const res = await fetch(url, { method: 'POST', headers });
    if (!res.ok) {
      console.warn('reportSponsoredClick failed', res.status);
    }
  } catch (err) {
    console.warn('reportSponsoredClick error', err);
  }
}
