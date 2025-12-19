import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Lock, User, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/hooks/auth'
import LanguageSwitcher from '@/components/common/Header/LanguageSwitcher'

export default function LoginView() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { login, loading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    const data = await login(email, password)
    if (data) navigate('/')
  }

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex justify-end mb-4">
          <LanguageSwitcher />
        </div>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {t('debt.title')}
          </h1>
          <p className="text-slate-400">{t('debt.subtitle')}</p>
        </div>

        <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-6">
            {t('auth.title')}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-slate-400 text-sm block mb-2">
                {t('auth.email')}
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  className="w-full bg-slate-700 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('auth.emailPlaceholder')}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 text-sm block mb-2">
                {t('auth.password')}
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full bg-slate-700 text-white pl-12 pr-12 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('auth.passwordPlaceholder')}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex text-sm">
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="ml-auto text-blue-400 hover:text-blue-300 transition-colors"
              >
                {t('auth.login.forgotPassword')}
              </button>
            </div>

            {error && (
              <p className="text-red-300 text-sm mt-0 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              className={`w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg ${
                loading || !email || !password
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t('auth.login.loading')}
                </span>
              ) : (
                t('auth.login.button')
              )}
            </button>
          </form>

          {/* <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-slate-700"></div>
            <span className="text-slate-500 text-sm">{t('auth.or')}</span>
            <div className="flex-1 h-px bg-slate-700"></div>
          </div>

          <p className="text-center text-slate-400 text-sm">
            {t('auth.noAccount')}{' '}
            <button className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              {t('auth.signUp')}
            </button>
          </p> */}
        </div>
      </div>
    </div>
  )
}
