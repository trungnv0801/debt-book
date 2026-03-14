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
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
    >
      <Globe className="w-4 h-4" />
      {i18n.language === 'en'
        ? t('language.vietnamese')
        : t('language.english')}
    </button>
  )
}
