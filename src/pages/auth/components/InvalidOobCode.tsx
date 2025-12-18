import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { XCircle } from 'lucide-react'

export default function InvalidOobCode() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700">
      <div className="text-center py-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500 bg-opacity-20 rounded-full mb-4">
          <XCircle className="w-10 h-10 text-red-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">
          {t('auth.resetPassword.invalidCode.title')}
        </h3>
        <p className="text-slate-400 mb-2">
          {t('auth.resetPassword.invalidCode.description')}
        </p>
        <div className="bg-slate-700 border border-slate-600 rounded-xl p-4 my-6">
          <p className="text-slate-300 text-sm">
            {t('auth.resetPassword.invalidCode.reasons')}
          </p>
          <ul className="text-slate-400 text-sm mt-2 space-y-1 text-left">
            <li>• {t('auth.resetPassword.invalidCode.expired')}</li>
            <li>• {t('auth.resetPassword.invalidCode.used')}</li>
            <li>• {t('auth.resetPassword.invalidCode.invalid')}</li>
          </ul>
        </div>
        <div className="space-y-3">
          <button
            onClick={() => navigate('/forgot-password')}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg"
          >
            {t('auth.resetPassword.invalidCode.requestNew')}
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
