import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import LanguageSwitcher from '@/components/common/Header/LanguageSwitcher'
import { useAuth } from '@/hooks/auth'
import ResetPasswordForm from './components/ResetPasswordForm'
import InvalidOobCode from './components/InvalidOobCode'
import NoOobCode from './components/NoOobCode'

export default function ResetPasswordView() {
  const { t } = useTranslation()
  const [params] = useSearchParams()
  const oobCode = params.get('oobCode')
  const { verifyResetCode, isSuccess, isValidOobCode, loading, error } =
    useAuth()

  useEffect(() => {
    if (!oobCode) return
    verifyResetCode(oobCode)
  }, [oobCode, verifyResetCode])

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex justify-end mb-4">
          <LanguageSwitcher />
        </div>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {t('auth.resetPassword.title')}
          </h1>
          <p className="text-slate-400">
            {isSuccess
              ? t('auth.resetPassword.success')
              : t('auth.resetPassword.default')}
          </p>
        </div>

        {!oobCode ? (
          <NoOobCode />
        ) : loading ? (
          <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700">
            <div className="text-center py-8">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-400">
                {t('auth.resetPassword.verifying')}
              </p>
            </div>
          </div>
        ) : !isValidOobCode ? (
          <InvalidOobCode message={error} />
        ) : (
          <ResetPasswordForm oobCode={oobCode} />
        )}
      </div>
    </div>
  )
}
