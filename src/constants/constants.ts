export const EMAIL_RULE = /^\S+@\S+\.\S+$/
export const EMAIL_RULE_MESSAGE =
  'Email không hợp lệ (ví dụ: example@gmail.com)'

export const PASSWORD_RULE = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/
export const PASSWORD_RULE_MESSAGE =
  'Mật khẩu phải có tối thiểu 8 ký tự, bao gồm ít nhất 1 chữ cái và 1 chữ số'

export const OTP_RULE = /^\d{6}$/
export const OTP_RULE_MESSAGE = 'Mã OTP phải bao gồm đúng 6 chữ số'

export const REQUIRED_MESSAGE = 'Trường này là bắt buộc'

export const OBJECT_ID_RULE = /^[a-f\d]{24}$/i
export const OBJECT_ID_RULE_MESSAGE = 'ID không hợp lệ'

export const SPEAKING_SESSION_MODE = {
  PRACTICE: 'practice',
  MOCK: 'mock',
} as const

export const MOCK_TYPE = {
  PART: 'part',
  FULL: 'full',
} as const

export const ALLOWED_IMAGE_EXTENSIONS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.gif',
]
export const ALLOWED_AUDIO_EXTENSIONS = [
  '.mp3',
  '.wav',
  '.m4a',
  '.ogg',
  '.webm',
]
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]
export const ALLOWED_AUDIO_TYPES = [
  'audio/mpeg',
  'audio/wav',
  'audio/mp4',
  'audio/ogg',
  'audio/webm',
]
export const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
]

export const LIMIT_IMAGE_SIZE = 5 * 1024 * 1024
export const LIMIT_AUDIO_SIZE = 50 * 1024 * 1024
export const LIMIT_VIDEO_SIZE = 200 * 1024 * 1024

export const AUDIO_PURPOSE = {
  QUESTION_AUDIO: 'question/audio',
  PRACTICE: 'practice/recordings',
} as const

export const FILE_KIND = {
  AUDIO: 'audio',
  IMAGE: 'image',
} as const
