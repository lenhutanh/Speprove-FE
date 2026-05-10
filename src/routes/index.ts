const defineRoute = <T>(routes: T): T => routes

const route = defineRoute({
  home: '/',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  verifyOtp: '/verify-otp',
  resetPassword: '/reset-password',
  forecast: '/forecast',
  payment: '/payment',
  mockTest: '/mock-test',
})

export default route
