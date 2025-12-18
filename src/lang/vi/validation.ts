const validation = {
  password: {
    minLength: 'Mật khẩu phải có ít nhất {{length}} ký tự',
    lowercase: 'Mật khẩu phải có ít nhất 1 chữ thường',
    uppercase: 'Mật khẩu phải có ít nhất 1 chữ hoa',
    number: 'Mật khẩu phải có ít nhất 1 chữ số',
    specialChar: 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt',
    mismatch: 'Mật khẩu và xác nhận mật khẩu phải giống nhau',
  },
  firebase: {
    expired: 'Liên kết đã hết hạn',
    invalid: 'Liên kết không hợp lệ',
    userDisabled: 'Tài khoản đã bị vô hiệu hóa',
  },
}

export default validation
