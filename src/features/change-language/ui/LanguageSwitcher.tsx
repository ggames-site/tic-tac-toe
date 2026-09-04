import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router'
import { supportedLanguages } from '../../../shared/i18n/model/language'

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation()
  const location = useLocation()

  return (
    <div className="language-switch" role="group" aria-label={t('language.label')}>
      {supportedLanguages.map((language) => {
        const search = new URLSearchParams(location.search)
        search.set('lng', language)

        return (
          <Link
            key={language}
            className={`language-switch__button ${i18n.resolvedLanguage === language ? 'language-switch__button--active' : ''}`}
            aria-current={i18n.resolvedLanguage === language ? 'true' : undefined}
            preventScrollReset
            to={`${location.pathname}?${search.toString()}`}
          >
            {language.toUpperCase()}
          </Link>
        )
      })}
    </div>
  )
}
