import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'
import { LANG } from '@/utils'

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'vi' : 'en'
    i18n.changeLanguage(newLang)
    localStorage.setItem(LANG, newLang)
  }

  return (
    <button
      onClick={toggleLanguage}
      className="flex min-h-11 items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-sm font-medium text-slate-300 transition-colors duration-200 hover:bg-slate-800 hover:text-white"
    >
      <Globe className="w-4 h-4" aria-hidden="true" />
      {i18n.language === 'en'
        ? t('language.vietnamese')
        : t('language.english')}
    </button>
  )
}
