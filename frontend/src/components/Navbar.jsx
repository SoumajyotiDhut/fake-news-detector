import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function Navbar({ page, setPage }) {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 40)
        window.addEventListener('scroll', fn)
        return () => window.removeEventListener('scroll', fn)
    }, [])

    return (
        <motion.nav
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: .6, ease: [.16, 1, .3, 1] }}
            style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                padding: '0 40px', height: '72px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: scrolled ? 'rgba(10,15,30,0.95)' : 'transparent',
                backdropFilter: scrolled ? 'blur(20px)' : 'none',
                borderBottom: scrolled ? '1px solid var(--border)' : 'none',
                transition: 'all .3s'
            }}>

            {/* Logo */}
            <motion.div whileHover={{ scale: 1.03 }}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                onClick={() => setPage('home')}>
                <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: 'linear-gradient(135deg, #3B82F6, #06B6D4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 20px rgba(59,130,246,0.5)', fontSize: '16px'
                }}>🛡</div>
                <span style={{
                    fontFamily: 'var(--font)', fontWeight: 800, fontSize: '18px',
                    background: 'linear-gradient(135deg, #fff, #94A3B8)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                }}>FakeGuard<span style={{ color: '#06B6D4', WebkitTextFillColor: '#06B6D4' }}>.ai</span></span>
            </motion.div>

            {/* Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {[['home', 'Home'], ['detector', 'Analyze']].map(([p, label]) => (
                    <motion.button key={p} whileHover={{ scale: 1.05 }} whileTap={{ scale: .97 }}
                        onClick={() => setPage(p)}
                        style={{
                            padding: '8px 20px', borderRadius: '10px', border: 'none',
                            cursor: 'pointer', fontSize: '14px', fontWeight: 500,
                            fontFamily: 'var(--font)', transition: 'all .2s',
                            background: page === p
                                ? 'linear-gradient(135deg, #3B82F6, #06B6D4)'
                                : 'rgba(255,255,255,0.05)',
                            color: '#fff',
                            boxShadow: page === p ? '0 0 20px rgba(59,130,246,0.4)' : 'none'
                        }}>
                        {label}
                    </motion.button>
                ))}
            </div>
        </motion.nav>
    )
}