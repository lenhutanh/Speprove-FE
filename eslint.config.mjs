import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

export default defineConfig([
  // 1. Kế thừa cấu hình mặc định của Next.js
  ...nextVitals,
  ...nextTs,

  // 2. Cấu hình các Rules tùy chỉnh (lấy từ Option 2 của bạn)
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      // Code Quality
      'no-unused-vars': 'off', // Tắt rule gốc của JS
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'warn',

      // React & Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Formatting (Nếu không dùng Prettier thì nên để ở đây)
      'object-curly-spacing': ['warn', 'always'],
      'comma-dangle': ['warn', 'always-multiline'],
      'arrow-spacing': ['warn', { before: true, after: true }],

      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  // 3. Loại bỏ các file không cần lint
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'public/**',
    'next-env.d.ts',
  ]),
])
