import { lazy, Suspense, useEffect, useState } from 'react'

const BackgroundSpiral = lazy(async () => {
  const module = await import('./BackgroundSpiral')
  return { default: module.BackgroundSpiral }
})

export function ClientBackground() {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  if (!isHydrated) return null

  return (
    <Suspense fallback={null}>
      <BackgroundSpiral />
    </Suspense>
  )
}
