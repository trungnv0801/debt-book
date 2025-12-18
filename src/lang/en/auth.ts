const auth = {
  title: 'Login',
  email: 'Email',
  emailPlaceholder: 'you@example.com',
  password: 'Password',
  passwordPlaceholder: '••••••••',
  submit: 'Login',
  login: {
    button: 'Login',
    loading: 'Logging in...',
    forgotPassword: 'Forgot Password?',
  },
  or: 'or',
  noAccount: "Don't have an account?",
  signUp: 'Sign up now',
  forgotPassword: {
    title: 'Forgot Password',
    subtitle: 'Reset Your Password',
    description: 'We will send a password reset link to your email address.',
    emailHint: {
      success: 'Check your email',
      default: 'Enter your email to reset your password',
    },
    emailPlaceholder: 'Enter your email address',
    sending: 'Sending...',
    submit: 'Send password reset email',
    backToLogin: 'Back to login',
    emailSentTitle: 'Email Sent!',
    emailSentDescription: 'We have sent a password reset link to:',
    emailSentHint:
      'Please check your inbox and click the link to reset your password. The link will expire after 1 hours.',
  },
  resetPassword: {
    title: 'Reset Password',
    success: 'Password has been changed',
    default: 'Create a new password for your account',
    form: {
      title: 'Create New Password',
      newPassword: 'New password',
      confirmPassword: 'Confirm password',
      placeholderPassword: 'Enter new password',
      placeholderConfirm: 'Re-enter new password',
      strength: 'Password strength',
      requirements: 'Password requirements:',
      submit: 'Reset Password',
      processing: 'Processing...',
      successTitle: 'Success!',
      successMessage:
        'Your password has been reset successfully. You can now log in with your new password.',
      backToLogin: 'Login Now',
    },
    verifying: 'Verifying...',
    backToLogin: 'Back to Login',
    noCode: {
      title: 'Missing Link',
      description:
        'Password reset link was not provided. Please use the link from your email.',
      requestNew: 'Request New Link',
    },
    invalidCode: {
      title: 'Invalid Link',
      description: 'The password reset link is invalid or has expired.',
      reasons: 'This could be because:',
      expired: 'Link has expired (after 1 hours)',
      used: 'Link has already been used',
      invalid: 'Link format is incorrect',
      requestNew: 'Request New Link',
    },
  },
}

export default auth
