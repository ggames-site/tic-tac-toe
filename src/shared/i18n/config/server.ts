import { initReactI18next } from 'react-i18next'
import { createI18nextMiddleware } from 'remix-i18next/middleware'
import resources from './resources'
import { localeCookie } from './locale-cookie'

const supportedLanguages = Object.keys(resources)

export const [i18nextMiddleware, getLocale, getInstance] = createI18nextMiddleware({
  detection: {
    supportedLanguages,
    fallbackLanguage: 'en',
    order: ['searchParams', 'cookie', 'header'],
    searchParamKey: 'lng',
    sessionKey: 'lng',
    cookie: localeCookie,
  },
  i18next: { fallbackLng: 'en', resources },
  plugins: [initReactI18next],
})
