import { createCookie } from 'react-router'

export const localeCookie = createCookie('lng', {
  httpOnly: true,
  path: '/',
  sameSite: 'lax',
  secure: import.meta.env.PROD,
})
