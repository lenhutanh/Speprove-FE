export const validateAudioFile = (
  file: File,
  LIMIT_AUDIO_SIZE: number,
  ALLOWED_AUDIO_EXTENSIONS: string[],
  ALLOWED_AUDIO_TYPES: string[],
): { isValid: boolean; error?: string } => {
  if (file.size > LIMIT_AUDIO_SIZE) {
    return {
      isValid: false,
      error: `File quá lớn (${(file.size / 1024 / 1024).toFixed(1)}MB). Giới hạn là ${LIMIT_AUDIO_SIZE / 1024 / 1024}MB`,
    }
  }

  if (!ALLOWED_AUDIO_TYPES.includes(file.type)) {
    return { isValid: false, error: 'Định dạng file không được hỗ trợ.' }
  }

  const ext = `.${file.name.split('.').pop()?.toLowerCase()}`
  if (!ALLOWED_AUDIO_EXTENSIONS.includes(ext)) {
    return {
      isValid: false,
      error: 'Phần mở rộng file (extension) không hợp lệ.',
    }
  }

  return { isValid: true }
}
