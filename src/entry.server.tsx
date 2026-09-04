import { renderToReadableStream } from 'react-dom/server'
import { ServerRouter, type EntryContext, type RouterContextProvider } from 'react-router'
import { I18nextProvider } from 'react-i18next'
import { getInstance } from './shared/i18n/config/server'

export const streamTimeout = 5_000

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  entryContext: EntryContext,
  context: RouterContextProvider,
) {
  const body = await renderToReadableStream(
    <I18nextProvider i18n={getInstance(context)}>
      <ServerRouter context={entryContext} url={request.url} />
    </I18nextProvider>,
    {
      signal: request.signal,
      onError(error) {
        console.error(error)
        responseStatusCode = 500
      },
    },
  )

  responseHeaders.set('Content-Type', 'text/html')
  return new Response(body, { headers: responseHeaders, status: responseStatusCode })
}
