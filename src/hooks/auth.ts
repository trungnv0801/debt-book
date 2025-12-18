import { useCallback, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  confirmResetPassword,
  loginUser,
  logoutUser,
  resetPasswordUser,
  verifyResetPasswordCode,
} from '@/services/auth'
import { UID } from '@/utils'
import { AuthContext } from '@/contexts/AuthContext'

export const useAuth = () => {
  const { setUid } = useAuthContext()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isValidOobCode, setIsValidOobCode] = useState(false)

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      const data = await loginUser(email, password)

      localStorage.setItem(UID, data.uid)
      setUid(data.uid)

      return data
    } catch (err: any) {
      setError(err.message ?? 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      setError(null)

      await logoutUser()

      localStorage.removeItem(UID)
      setUid(null)
      navigate('/login')
    } catch (err: any) {
      setError(err.message ?? '')
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      setLoading(true)
      setError(null)

      await resetPasswordUser(email)
      setIsSuccess(true)
    } catch (err: any) {
      setError(err.message)
      setIsSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  const verifyResetCode = useCallback(async (oobCode: string) => {
    try {
      setLoading(true)
      setError(null)

      await verifyResetPasswordCode(oobCode)
      setIsValidOobCode(true)
    } catch (err: any) {
      setError(err.message)
      setIsValidOobCode(false)
    } finally {
      setLoading(false)
    }
  }, [])

  const resetPasswordConfirm = async (oobCode: string, newPassword: string) => {
    try {
      setLoading(true)
      setError(null)

      await confirmResetPassword(oobCode, newPassword)
      setIsSuccess(true)
    } catch (err: any) {
      setError(err.message)
      setIsSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  return {
    login,
    logout,
    resetPassword,
    verifyResetCode,
    resetPasswordConfirm,
    isValidOobCode,
    loading,
    error,
    isSuccess,
  }
}

export const useAuthContext = () => useContext(AuthContext)
