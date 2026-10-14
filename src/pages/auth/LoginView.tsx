import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import {
  Lock,
  User,
  Eye,
  EyeOff,
  BookOpen,
  Wallet,
  Users,
  Search,
  ArrowRight,
  Loader2,
} from 'lucide-react'
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
    <div className="app-background flex min-h-[100dvh] flex-col">
      <header className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-5 sm:px-8">
        <div className="flex items-center gap-3 text-lg font-semibold text-white">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600">
            <BookOpen className="h-5 w-5" aria-hidden="true" />
          </span>
          {t('debt.title')}
        </div>
        <LanguageSwitcher />
      </header>
      <main className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 items-center gap-12 px-4 py-8 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:py-16">
        <section className="hidden lg:block">
          <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-blue-300">
            {t('debt.subtitle')}
          </p>
          <h2 className="max-w-lg text-5xl font-semibold leading-tight tracking-tight text-white">
            {t('ui.loginHeadline')}
          </h2>
          <p className="mt-6 max-w-md text-lg leading-8 text-slate-400">
            {t('ui.loginDescription')}
          </p>
          <div className="mt-10 space-y-6">
            {[
              {
                icon: Wallet,
                title: 'ui.featureBalance',
                hint: 'ui.featureBalanceHint',
              },
              {
                icon: Users,
                title: 'ui.featurePeople',
                hint: 'ui.featurePeopleHint',
              },
              {
                icon: Search,
                title: 'ui.featureSearch',
                hint: 'ui.featureSearchHint',
              },
            ].map((feature) => (
              <div key={feature.title} className="flex items-center gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-slate-700 bg-slate-800/70 text-blue-300">
                  <feature.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-medium text-slate-100">
                    {t(feature.title)}
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    {t(feature.hint)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="ui-panel mx-auto min-w-0 w-full max-w-md p-6 shadow-2xl shadow-black/20 sm:p-8 lg:p-10">
          <p className="mb-2 text-sm font-medium text-blue-300">
            {t('ui.welcome')}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            {t('auth.title')}
          </h1>
          <p className="mb-8 mt-3 text-sm leading-6 text-slate-400">
            {t('ui.loginHint')}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="login-email"
                className="text-slate-300 text-sm font-medium block mb-2"
              >
                {t('auth.email')}
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  id="login-email"
                  autoComplete="email"
                  type="email"
                  className="ui-input pl-12 pr-4"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('auth.emailPlaceholder')}
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="text-slate-300 text-sm font-medium block mb-2"
              >
                {t('auth.password')}
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="login-password"
                  autoComplete="current-password"
                  type={showPassword ? 'text' : 'password'}
                  className="ui-input pl-12 pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('auth.passwordPlaceholder')}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="ui-icon-button absolute right-1 top-1/2 -translate-y-1/2"
                  aria-label={t(
                    showPassword ? 'ui.hidePassword' : 'ui.showPassword',
                  )}
                  aria-pressed={showPassword}
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
                className="ml-auto min-h-11 text-blue-300 hover:text-blue-200 transition-colors"
              >
                {t('auth.login.forgotPassword')}
              </button>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-red-300 text-sm"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="ui-primary w-full"
              aria-busy={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2
                    className="h-5 w-5 animate-spin"
                    aria-hidden="true"
                  />
                  {t('auth.login.loading')}
                </span>
              ) : (
                <>
                  {t('auth.login.button')}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </>
              )}
            </button>
          </form>
        </section>
      </main>
    </div>
  )
}
