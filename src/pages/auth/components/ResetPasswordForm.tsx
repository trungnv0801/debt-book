import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '@/hooks/auth'
import { usePasswordRules } from '@/hooks/passwordRule'

interface Props {
  oobCode: string
}

export default function ResetPasswordForm(props: Props) {
  const [t] = useTranslation()
  const navigate = useNavigate()
  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
  })
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { resetPasswordConfirm, loading, isSuccess } = useAuth()
  const { firstError, isValid } = usePasswordRules(formData.password)

  const handleSubmit = () => {
    const newErrors = {
      password: !isValid && firstError ? firstError.label : '',
      confirmPassword:
        formData.password !== formData.confirmPassword
          ? t('validation.password.mismatch')
          : '',
    }

    setErrors(newErrors)

    if (!newErrors.password && !newErrors.confirmPassword) {
      resetPasswordConfirm(props.oobCode, formData.password)
    }
  }

  return (
    <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700">
      {!isSuccess ? (
        <>
          <h2 className="text-2xl font-bold text-white mb-6">
            {t('auth.resetPassword.form.title')}
          </h2>

          <div className="space-y-5">
            <div>
              <label className="text-slate-400 text-sm block mb-2">
                {t('auth.resetPassword.form.newPassword')}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder={t('auth.resetPassword.form.placeholderPassword')}
                  className={`w-full bg-slate-700 text-white pl-12 pr-12 py-3 rounded-xl focus:outline-none focus:ring-2 ${
                    errors.password
                      ? 'ring-2 ring-red-500'
                      : 'focus:ring-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {errors.password && (
                <div className="flex items-center gap-1 mt-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </div>
              )}
            </div>

            <div>
              <label className="text-slate-400 text-sm block mb-2">
                {t('auth.resetPassword.form.confirmPassword')}
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder={t('auth.resetPassword.form.placeholderConfirm')}
                  className={`w-full bg-slate-700 text-white pl-12 pr-12 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.confirmPassword
                      ? 'ring-2 ring-red-500'
                      : 'focus:ring-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="flex items-center gap-1 mt-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.confirmPassword}
                </div>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl"
            >
              {loading
                ? t('auth.resetPassword.form.processing')
                : t('auth.resetPassword.form.submit')}
            </button>
          </div>
        </>
      ) : (
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-3">
            {t('auth.resetPassword.form.successTitle')}
          </h3>
          <p className="text-slate-400 mb-6">
            {t('auth.resetPassword.form.successMessage')}
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-blue-600 text-white py-3 rounded-xl"
          >
            {t('auth.resetPassword.form.backToLogin')}
          </button>
        </div>
      )}
    </div>
  )
}
