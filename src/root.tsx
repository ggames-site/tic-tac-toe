import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  data,
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from 'react-router'
import type { Route } from './+types/root'
import { localeCookie } from './shared/i18n/config/locale-cookie'
import { getInstance, getLocale, i18nextMiddleware } from './shared/i18n/config/server'
import { toLanguage } from './shared/i18n/model/language'
import './app/styles/index.css'

export function Layout({ children }: { children: React.ReactNode }) {
  const { locale } = useLoaderData<typeof loader>()

  return (
    <html lang={locale}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export function meta({ loaderData }: Route.MetaArgs) {
  return [{ title: loaderData?.title ?? 'GGames — Tic-Tac-Toe' }]
}

export default function Root() {
  const { locale } = useLoaderData<typeof loader>()
  const { i18n } = useTranslation()

  useEffect(() => {
    if (i18n.language !== locale) void i18n.changeLanguage(locale)
  }, [i18n, locale])

  return <Outlet />
}

export async function loader({ context }: Route.LoaderArgs) {
  const locale = toLanguage(getLocale(context)) ?? 'en'
  const i18next = getInstance(context)

  return data(
    { locale, title: i18next.t('document.title') },
    {
      headers: {
        'Set-Cookie': await localeCookie.serialize(locale, { maxAge: 60 * 60 * 24 * 365 }),
      },
    },
  )
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'Unexpected error'

  return (
    <main className="app-shell">
      <section className="dialog">
        <p className="eyebrow">GGames</p>
        <h1>Application error</h1>
        <p>{message}</p>
      </section>
    </main>
  )
}

export const middleware = [i18nextMiddleware]
