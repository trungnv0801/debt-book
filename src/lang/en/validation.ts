const validation = {
  password: {
    minLength: 'Password must be at least {{length}} characters',
    lowercase: 'Password must contain at least one lowercase letter',
    uppercase: 'Password must contain at least one uppercase letter',
    number: 'Password must contain at least one number',
    specialChar: 'Password must contain at least one special character',
    mismatch: 'Password and confirm password must match',
  },
  firebase: {
    expired: 'This reset link has expired',
    invalid: 'Invalid reset password link',
    userDisabled: 'This account has been disabled',
  },
}

export default validation
