import { useRouter } from 'next/router';
import { NextIntlClientProvider } from 'next-intl';
import React from 'react';

import HeightmapProvider from '@/components/providers/HeightmapProvider';
import locales, { config, resolveLocale } from '@/i18n';
import objectKeySearch from '@/utils/objectKeySearch';

import type { AppProps } from 'next/app';

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const locale = resolveLocale(router.locale);
  // static exports only have the default locale's messages prerendered
  const messages = router.locale ? pageProps.messages : locales[locale];

  return (
    <React.StrictMode>
      <NextIntlClientProvider
        getMessageFallback={(info) =>
          objectKeySearch(
            locales[config.defaultLocale] as Parameters<
              typeof objectKeySearch
            >[0],
            info.key,
          ) as string
        }
        locale={locale}
        messages={messages as typeof pageProps.messages}
        timeZone="Europe/Amsterdam"
        onError={(error) =>
          process.env.NODE_ENV === 'development'
            ? console.warn(error)
            : console.error(error)
        }
      >
        <HeightmapProvider>
          <Component {...pageProps} />
        </HeightmapProvider>
      </NextIntlClientProvider>
    </React.StrictMode>
  );
}

export default App;
