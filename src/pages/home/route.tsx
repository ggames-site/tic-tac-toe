import { useLoaderData } from 'react-router'
import type { Route } from './+types/route'
import App from '../../widgets/game/ui/App'
import { createRandomName } from '../../entities/game/model/names'
import { toLanguage } from '../../shared/i18n/model/language'
import { getLocale } from '../../shared/i18n/config/server'

export function loader({ context }: Route.LoaderArgs) {
  const locale = toLanguage(getLocale(context)) ?? 'en'

  return {
    initialPreferences: {
      difficulty: 'medium' as const,
      playerXName: createRandomName(locale),
      playerOName: createRandomName(locale),
    },
  }
}

export default function Home() {
  const { initialPreferences } = useLoaderData<typeof loader>()
  return <App initialPreferences={initialPreferences} />
}
