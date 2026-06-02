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
  QUESTION_AUDIO: 'question-audio',
  PRACTICE: 'practice',
  MOCK_TEST: 'mock',
} as const

export const IMAGE_PURPOSE = {
  AVATAR: 'user/avatar',
} as const

export const FILE_KIND = {
  AUDIO: 'audio',
  IMAGE: 'image',
} as const

export const BANK_BIN_MAP: Record<string, string> = {
  '970422': 'MB Bank',
  '970415': 'Vietinbank',
  '970436': 'Vietcombank',
  '970418': 'BIDV',
  '970407': 'Techcombank',
  '970432': 'VPBank',
  '970423': 'TPBank',
  '970431': 'Eximbank',
}

export const PAYMENT_METHOD = {
  BANK_TRANSFER: 'bank_transfer',
} as const

export type PaymentMethodType =
  (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD]

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
  CANCELED: 'canceled',
  EXPIRED: 'expired',
} as const

export type PaymentStatusType =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS]

export const PART_GROUP = {
  PART1: '1',
  PART23: '2,3',
} as const

export const PART2_CATEGORY_OPTIONS = {
  OBJECT: { label: 'Object', value: 'object' },
  PERSON: { label: 'Person', value: 'person' },
  EVENT: { label: 'Event', value: 'event' },
  ACTIVITY: { label: 'Activity', value: 'activity' },
  PLACE: { label: 'Place', value: 'place' },
  FAVOURITE: { label: 'Favourite', value: 'favourite' },
} as const

export const PART2_CATEGORY = {
  OBJECT: 'object',
  PERSON: 'person',
  EVENT: 'event',
  ACTIVITY: 'activity',
  PLACE: 'place',
  FAVOURITE: 'favourite',
} as const

export const QUARTER_OPTIONS = [
  { label: 'Quý 1', value: '1' },
  { label: 'Quý 2', value: '2' },
  { label: 'Quý 3', value: '3' },
]

export const SPEAKING_SESSION_TYPE = {
  MOCK_PART_1: 'mock_p1',
  MOCK_PART_2: 'mock_p2',
  MOCK_PART_3: 'mock_p3',
  FULL_TEST: 'full_test',
} as const

export type SpeakingSessionType =
  (typeof SPEAKING_SESSION_TYPE)[keyof typeof SPEAKING_SESSION_TYPE]

export const SPEAKING_TIME: Record<number, number> = {
  1: 30,
  2: 120,
  3: 45,
}

export const MIN_RECORDING_SECONDS = 10
export const REPLAY_WINDOW_SECONDS = 5

export function formatCountdown(s: number): string {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
}

export const VERIFY_TARGET = {
  REGISTER: 'verify-register',
  FORGOT_PASSWORD: 'verify-forgot-password',
} as const

export const ACCOUNT_TAB_KEYS = [
  'profile',
  'change-password',
  'set-password',
  'voice-setting',
] as const

export type AccountTabKey = (typeof ACCOUNT_TAB_KEYS)[number]
