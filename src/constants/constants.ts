export const EMAIL_RULE = /^\S+@\S+\.\S+$/
export const EMAIL_RULE_MESSAGE =
  'Email không hợp lệ (ví dụ: example@gmail.com)'

export const PASSWORD_RULE = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/
export const PASSWORD_RULE_MESSAGE =
  'Mật khẩu phải có tối thiểu 8 ký tự, bao gồm ít nhất 1 chữ cái và 1 chữ số'

export const OTP_RULE = /^\d{6}$/
export const OTP_RULE_MESSAGE = 'Mã OTP phải bao gồm đúng 6 chữ số'

export const REQUIRED_MESSAGE = 'Trường này là bắt buộc'
