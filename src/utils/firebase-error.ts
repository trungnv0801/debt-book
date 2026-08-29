import type { TFunction } from 'i18next'

const FIREBASE_AUTH_ERROR_KEYS: Record<string, string> = {
  'auth/invalid-email': 'auth.errors.invalidEmail',
  'auth/missing-email': 'auth.errors.missingEmail',
  'auth/missing-password': 'auth.errors.missingPassword',
  'auth/invalid-credential': 'auth.errors.invalidCredential',
  'auth/invalid-login-credentials': 'auth.errors.invalidCredential',
  'auth/user-not-found': 'auth.errors.invalidCredential',
  'auth/wrong-password': 'auth.errors.invalidCredential',
  'auth/user-disabled': 'auth.errors.userDisabled',
  'auth/email-already-in-use': 'auth.errors.emailAlreadyInUse',
  'auth/weak-password': 'auth.errors.weakPassword',
  'auth/operation-not-allowed': 'auth.errors.operationNotAllowed',
  'auth/too-many-requests': 'auth.errors.tooManyRequests',
  'auth/network-request-failed': 'auth.errors.networkRequestFailed',
  'auth/invalid-action-code': 'auth.errors.invalidActionCode',
  'auth/expired-action-code': 'auth.errors.expiredActionCode',
  'auth/requires-recent-login': 'auth.errors.requiresRecentLogin',
  'auth/user-token-expired': 'auth.errors.sessionExpired',
  'auth/invalid-user-token': 'auth.errors.sessionExpired',
  'auth/quota-exceeded': 'auth.errors.quotaExceeded',
  'auth/unauthorized-domain': 'auth.errors.unauthorizedDomain',
  'auth/internal-error': 'auth.errors.internalError',
}

const getErrorCode = (error: unknown) => {
  if (typeof error !== 'object' || error === null || !('code' in error)) {
    return null
  }

  return typeof error.code === 'string' ? error.code : null
}

export const getFirebaseAuthErrorMessage = (error: unknown, t: TFunction) => {
  const code = getErrorCode(error)
  const translationKey = code ? FIREBASE_AUTH_ERROR_KEYS[code] : undefined

  return t(translationKey ?? 'auth.errors.default')
}
