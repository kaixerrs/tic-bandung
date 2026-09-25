import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHtml(content: string | null | undefined): string | null {
  if (!content) return null;
  return DOMPurify.sanitize(content, {
    USE_PROFILES: { html: true }
  });
}
