import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

const locales = ['id', 'en'];

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !locales.includes(locale as any)) {
    locale = 'id';
  }

  const messages = (await import(`../messages/${locale}.json`)).default;
  console.log(`Loaded messages for ${locale}:`, Object.keys(messages));

  return {
    locale: locale,
    messages
  };
});
