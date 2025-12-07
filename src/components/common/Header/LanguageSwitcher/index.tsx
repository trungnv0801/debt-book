import { useTranslation } from 'react-i18next'

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation()

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'vi' : 'en')
  }

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-1 rounded-md bg-slate-100 text-slate-900 font-medium hover:bg-slate-200 transition-colors"
    >
      {i18n.language === 'en' ? 'Vietnamese' : 'Tiếng Anh'}
    </button>
  )
}

export default LanguageSwitcher
