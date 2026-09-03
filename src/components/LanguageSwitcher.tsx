import { useTranslation } from 'react-i18next'
import { changeAppLanguage } from '../i18n'
import { supportedLanguages } from '../i18n/language'

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation()

  return (
    <div className="language-switch" role="group" aria-label={t('language.label')}>
      {supportedLanguages.map((language) => (
        <button
          type="button"
          key={language}
          className={`language-switch__button ${i18n.resolvedLanguage === language ? 'language-switch__button--active' : ''}`}
          aria-pressed={i18n.resolvedLanguage === language}
          onClick={() => changeAppLanguage(language)}
        >
          {language.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
