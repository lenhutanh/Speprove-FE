const defineRoute = <T>(routes: T): T => routes

const route = defineRoute({
  home: '/',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  verifyOtp: '/verify-otp',
  changePassword: '/change-password',
  forecast: '/forecast',
  payment: '/payment',
})

export default route
