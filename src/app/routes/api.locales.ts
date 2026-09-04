import type { Route } from './+types/api.locales'
import resources from '../../shared/i18n/config/resources'
import { toLanguage } from '../../shared/i18n/model/language'

export function loader({ params }: Route.LoaderArgs) {
  const locale = toLanguage(params.lng)

  if (locale === null || params.ns !== 'translation') {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  return Response.json(resources[locale].translation, {
    headers: { 'Cache-Control': 'public, max-age=300' },
  })
}
