import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Loader from './components/Loader'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Detector from './components/Detector'
import Features from './components/Features'
import StatsSection from './components/StatsSection'
import HowItWorks from './components/HowItWorks'
import Testimonials from './components/Testimonials'
import Footer from './components/Footer'
import AuroraBg from './components/AuroraBg'

export default function App() {
  const [page, setPage] = useState('home')
  const [loaded, setLoaded] = useState(false)
  const cursorRef = useRef(null)
  const ringRef = useRef(null)

  // Custom cursor
  useEffect(() => {
    const move = e => {
      const x = e.clientX, y = e.clientY
      if (cursorRef.current) {
        cursorRef.current.style.left = x - 5 + 'px'
        cursorRef.current.style.top = y - 5 + 'px'
      }
      if (ringRef.current) {
        ringRef.current.style.left = x - 16 + 'px'
        ringRef.current.style.top = y - 16 + 'px'
      }
    }
    const hover = () => {
      cursorRef.current?.classList.add('hover')
      ringRef.current?.classList.add('hover')
    }
    const unhover = () => {
      cursorRef.current?.classList.remove('hover')
      ringRef.current?.classList.remove('hover')
    }
    window.addEventListener('mousemove', move)
    document.querySelectorAll('button, a, [data-hover]').forEach(el => {
      el.addEventListener('mouseenter', hover)
      el.addEventListener('mouseleave', unhover)
    })
    return () => window.removeEventListener('mousemove', move)
  }, [loaded])

  return (
    <>
      <div id="cursor" ref={cursorRef} />
      <div id="cursor-ring" ref={ringRef} />

      <AnimatePresence>
        {!loaded && <Loader onDone={() => setLoaded(true)} />}
      </AnimatePresence>

      {loaded && (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', position: 'relative' }}>
          <AuroraBg />
          <Navbar page={page} setPage={setPage} />

          <AnimatePresence mode="wait">
            {page === 'home' ? (
              <motion.div key="home"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }} transition={{ duration: .4 }}>
                <Hero setPage={setPage} />
                <Detector />
                <Features />
                <StatsSection />
                <HowItWorks />
                <Testimonials />
                <Footer setPage={setPage} />
              </motion.div>
            ) : (
              <motion.div key="analyze"
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }} transition={{ duration: .4 }}
                style={{ paddingTop: '90px', minHeight: '100vh' }}>
                <Detector standalone />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  )
}