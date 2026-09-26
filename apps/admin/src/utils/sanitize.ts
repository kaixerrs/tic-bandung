import sanitize from 'sanitize-html';

export function sanitizeHtml(content: string | null | undefined): string | null {
  if (!content) return null;
  return sanitize(content, {
    allowedTags: sanitize.defaults.allowedTags.concat([
      'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr',
      'table', 'thead', 'tbody', 'tr', 'th', 'td', 'style', 'u', 's', 'span'
    ]),
    allowedAttributes: {
      ...sanitize.defaults.allowedAttributes,
      '*': ['class', 'style', 'id'],
      'img': ['src', 'alt', 'width', 'height'],
      'a': ['href', 'target', 'rel']
    },
    allowedSchemes: ['http', 'https', 'data', 'blob']
  });
}
