const API_ORIGIN = (import.meta.env.VITE_API_URL || 'https://rentrack.site/api').replace(/\/api\/?$/, '');

export function resolveImageUrl(value?: string | null): string {
  if (!value) return '';
  if (/^https?:\/\//.test(value)) return value;
  if (value.startsWith('/storage/')) return `${API_ORIGIN}${value}`;
  return value;
}