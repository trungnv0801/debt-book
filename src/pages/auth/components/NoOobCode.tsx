import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'

export default function NoOobCode() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700">
      <div className="text-center py-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500 bg-opacity-20 rounded-full mb-4">
          <AlertCircle className="w-10 h-10 text-yellow-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">
          {t('auth.resetPassword.noCode.title')}
        </h3>
        <p className="text-slate-400 mb-6">
          {t('auth.resetPassword.noCode.description')}
        </p>
        <div className="space-y-3">
          <button
            onClick={() => navigate('/forgot-password')}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg"
          >
            {t('auth.resetPassword.noCode.requestNew')}
          </button>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-xl transition-all"
          >
            {t('auth.forgotPassword.backToLogin')}
          </button>
        </div>
      </div>
    </div>
  )
}
