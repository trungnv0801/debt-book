import { useEffect, useState } from 'react'
import { validatePassword } from 'firebase/auth'
import { auth } from '@/firebase/config'
import { useTranslation } from 'react-i18next'
import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX } from '@/utils'

type PasswordRule = {
  key: string
  label: string
  valid: boolean
}

export const usePasswordRules = (password: string) => {
  const [rules, setRules] = useState<PasswordRule[]>([])
  const { t } = useTranslation()

  useEffect(() => {
    let mounted = true

    const validate = async () => {
      const result = await validatePassword(auth, password)
      if (!mounted) return

      const policy = result.passwordPolicy as any
      const options = policy.customStrengthOptions ?? {}
      const allowedChars = policy.allowedNonAlphanumericCharacters

      const hasAllowedSpecialChar =
        !allowedChars ||
        password.split('').some((char) => allowedChars.includes(char))

      const nextRules: PasswordRule[] = [
        {
          key: 'minLength',
          label: t('validation.password.minLength', {
            length: options.minPasswordLength ?? PASSWORD_MIN_LENGTH,
          }),
          valid:
            password.length >=
            (options.minPasswordLength ?? PASSWORD_MIN_LENGTH),
        },
        {
          key: 'uppercase',
          label: t('validation.password.uppercase'),
          valid:
            !options.containsUppercaseLetter ||
            PASSWORD_REGEX.UPPERCASE.test(password),
        },
        {
          key: 'lowercase',
          label: t('validation.password.lowercase'),
          valid:
            !options.containsLowercaseLetter ||
            PASSWORD_REGEX.LOWERCASE.test(password),
        },
        {
          key: 'number',
          label: t('validation.password.number'),
          valid:
            !options.containsNumericCharacter ||
            PASSWORD_REGEX.NUMBER.test(password),
        },
        {
          key: 'special',
          label: t('validation.password.specialChar'),
          valid: hasAllowedSpecialChar,
        },
      ]

      setRules(nextRules)
    }

    validate()
    return () => {
      mounted = false
    }
  }, [password, t])

  const firstError = rules.find((rule) => !rule.valid)

  return {
    isValid: rules.length > 0 && rules.every((r) => r.valid),
    firstError,
  }
}
