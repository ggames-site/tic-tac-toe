import Fetch from 'i18next-fetch-backend'
import BrowserLanguageDetector from 'i18next-browser-languagedetector'
import i18next from 'i18next'
import { StrictMode, startTransition } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import { HydratedRouter } from 'react-router/dom'

async function main() {
  await i18next.use(initReactI18next).use(Fetch).use(BrowserLanguageDetector).init({
    backend: { loadPath: '/_api/locales/{{lng}}/{{ns}}' },
    detection: {
      caches: [],
      convertDetectedLanguage: (language: string) => language.split('-')[0],
      lookupCookie: 'lng',
      lookupQuerystring: 'lng',
      order: ['htmlTag', 'cookie', 'querystring', 'navigator'],
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'ru'],
  })

  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <I18nextProvider i18n={i18next}>
          <HydratedRouter />
        </I18nextProvider>
      </StrictMode>,
    )
  })
}

void main()
