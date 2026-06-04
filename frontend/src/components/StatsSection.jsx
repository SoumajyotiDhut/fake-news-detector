import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

function Counter({ target, suffix = '', prefix = '' }) {
    const [val, setVal] = useState(0)
    const ref = useRef(null)
    const inView = useInView(ref, { once: true })

    useEffect(() => {
        if (!inView) return
        const steps = 70, inc = target / steps
        let cur = 0
        const iv = setInterval(() => {
            cur = Math.min(cur + inc, target)
            setVal(Math.floor(cur))
            if (cur >= target) clearInterval(iv)
        }, 2000 / steps)
        return () => clearInterval(iv)
    }, [inView, target])

    return (
        <span ref={ref} style={{ fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: 'clamp(36px,4vw,54px)' }}>
            {prefix}{val.toLocaleString()}{suffix}
        </span>
    )
}

const stats = [
    { target: 1200000, suffix: '+', label: 'Articles Analyzed', icon: '📰', color: '#2563EB' },
    { target: 98, suffix: '.7%', label: 'Accuracy Rate', icon: '🎯', color: '#06B6D4' },
    { target: 350000, suffix: '+', label: 'Fake News Detected', icon: '⚠', color: '#EF4444' },
    { target: 50000, suffix: '+', label: 'Active Users', icon: '👥', color: '#7C3AED' },
]

export default function StatsSection() {
    return (
        <section style={{
            padding: '80px 60px', position: 'relative', zIndex: 1,
            borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
            background: 'rgba(5,8,22,0.5)'
        }}>
            <div style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(ellipse at center, rgba(37,99,235,0.06) 0%, transparent 70%)'
            }} />
            <div style={{
                maxWidth: '1100px', margin: '0 auto',
                display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
                gap: '40px', position: 'relative', zIndex: 1
            }}>
                {stats.map((s, i) => (
                    <motion.div key={s.label}
                        initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }} transition={{ delay: i * .1 }}
                        style={{ textAlign: 'center' }}>
                        <motion.div whileHover={{ scale: 1.1 }}
                            style={{
                                width: '52px', height: '52px', borderRadius: '14px', margin: '0 auto 16px',
                                background: `${s.color}18`, border: `1px solid ${s.color}30`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px'
                            }}>{s.icon}</motion.div>
                        <div style={{ color: s.color }}>
                            <Counter target={s.target} suffix={s.suffix} />
                        </div>
                        <p style={{ color: '#64748B', fontSize: '13px', marginTop: '8px', letterSpacing: '.02em' }}>
                            {s.label}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}