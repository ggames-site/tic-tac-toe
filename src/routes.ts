import { index, route, type RouteConfig } from '@react-router/dev/routes'

export default [
  index('pages/home/route.tsx'),
  route('api/healthcheck', 'app/routes/api.healthcheck.ts'),
  route('api/stats/save', 'app/routes/api.stats.save.ts'),
  route('_api/locales/:lng/:ns', 'app/routes/api.locales.ts'),
] satisfies RouteConfig
