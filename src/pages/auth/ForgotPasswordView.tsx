import { useState } from 'react'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import LanguageSwitcher from '@/components/common/Header/LanguageSwitcher'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/hooks/auth'
import { useNavigate } from 'react-router-dom'

export default function ForgotPasswordView() {
  const [t] = useTranslation()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const { resetPassword, loading, isSuccess, error } = useAuth()

  const handleSubmit = async () => {
    if (!email) return
    await resetPassword(email)
  }

  const handleBackToLogin = () => navigate('/login')

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex justify-end mb-4">
          <LanguageSwitcher />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {t('auth.forgotPassword.title')}
          </h1>
          <p className="text-slate-400">
            {isSuccess
              ? t('auth.forgotPassword.emailHint.success')
              : t('auth.forgotPassword.emailHint.default')}
          </p>
        </div>

        <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700">
          {!isSuccess ? (
            <>
              <h2 className="text-2xl font-bold text-white mb-6">
                {t('auth.forgotPassword.subtitle')}
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="text-slate-400 text-sm block mb-2">
                    {t('auth.email')}
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('auth.forgotPassword.emailPlaceholder')}
                      className="w-full bg-slate-700 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="bg-slate-700 border border-slate-600 rounded-xl p-4">
                  <p className="text-slate-300 text-sm">
                    {t('auth.forgotPassword.description')}
                  </p>
                </div>
                {error && (
                  <p className="text-red-300 text-sm mt-0 text-center">
                    {error}
                  </p>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={loading || !email}
                  className={`w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg ${
                    loading || !email ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {t('auth.forgotPassword.sending')}
                    </span>
                  ) : (
                    t('auth.forgotPassword.submit')
                  )}
                </button>
              </div>

              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-slate-700"></div>
                <span className="text-slate-500 text-sm">{t('auth.or')}</span>
                <div className="flex-1 h-px bg-slate-700"></div>
              </div>

              <button
                onClick={handleBackToLogin}
                className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('auth.forgotPassword.backToLogin')}
              </button>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 bg-opacity-20 rounded-full mb-4">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {t('auth.forgotPassword.emailSentTitle')}
              </h3>
              <p className="text-slate-400 mb-2">
                {t('auth.forgotPassword.emailSentDescription')}
              </p>
              <p className="text-blue-400 font-semibold mb-6">{email}</p>
              <div className="bg-slate-700 border border-slate-600 rounded-xl p-4 mb-6">
                <p className="text-slate-300 text-sm">
                  {t('auth.forgotPassword.emailSentHint')}
                </p>
              </div>
              <button
                onClick={handleBackToLogin}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg"
              >
                {t('auth.forgotPassword.backToLogin')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
