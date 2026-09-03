import { Particles, ParticlesProvider } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import { useReducedMotion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import type { Engine, ISourceOptions } from '@tsparticles/engine'

const MINT_GREEN = '#0c8c5e'

async function loadParticleEngine(engine: Engine) {
  await loadSlim(engine)
}

function useDarkColorScheme() {
  const [isDark, setIsDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const updateColorScheme = () => setIsDark(mediaQuery.matches)

    mediaQuery.addEventListener('change', updateColorScheme)
    return () => mediaQuery.removeEventListener('change', updateColorScheme)
  }, [])

  return isDark
}

function createOptions(autoPlay: boolean, isDark: boolean): ISourceOptions {
  const visibility = isDark
    ? { linkOpacity: 0.16, particleOpacity: { min: 0.16, max: 0.32 } }
    : { linkOpacity: 0.3, particleOpacity: { min: 0.36, max: 0.56 } }

  return {
    autoPlay,
    detectRetina: false,
    fpsLimit: 30,
    fullScreen: { enable: false },
    interactivity: {
      events: {
        onClick: { enable: false },
        onHover: { enable: false },
        resize: { enable: true },
      },
    },
    particles: {
      color: { value: MINT_GREEN },
      links: {
        color: MINT_GREEN,
        distance: 185,
        enable: true,
        opacity: visibility.linkOpacity,
        width: 1,
      },
      move: {
        enable: autoPlay,
        outModes: { default: 'out' },
        speed: 0.2,
      },
      number: {
        density: { enable: true, height: 900, width: 1400 },
        value: 26,
      },
      opacity: { value: visibility.particleOpacity },
      shape: { type: 'circle' },
      size: { value: { min: 1, max: 1.7 } },
    },
    pauseOnBlur: true,
    pauseOnOutsideViewport: true,
  }
}

export function BackgroundSpiral() {
  const reducedMotion = useReducedMotion()
  const isDark = useDarkColorScheme()
  const options = useMemo(() => createOptions(!reducedMotion, isDark), [isDark, reducedMotion])

  return (
    <div aria-hidden="true" className="background-spiral">
      <ParticlesProvider init={loadParticleEngine}>
        <Particles id="game-background-particles" options={options} />
      </ParticlesProvider>
    </div>
  )
}
