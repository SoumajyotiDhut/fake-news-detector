import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const MESSAGES = [
    'Initializing AI Detection Engine...',
    'Loading DistilBERT Model...',
    'Calibrating Neural Networks...',
    'Scanning Knowledge Base...',
    'System Ready.',
]

export default function Loader({ onDone }) {
    const [msgIdx, setMsgIdx] = useState(0)
    const [progress, setProgress] = useState(0)
    const [leaving, setLeaving] = useState(false)

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(p => {
                if (p >= 100) { clearInterval(interval); return 100 }
                return p + 1.2
            })
        }, 30)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        const idx = Math.floor(progress / 22)
        setMsgIdx(Math.min(idx, MESSAGES.length - 1))
        if (progress >= 100) {
            setTimeout(() => {
                setLeaving(true)
                setTimeout(onDone, 700)
            }, 400)
        }
    }, [progress])

    return (
        <motion.div exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: .7 }}
            style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                background: 'var(--bg)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: '32px'
            }}>

            {/* Neural network animation */}
            <div style={{ position: 'relative', width: '200px', height: '200px' }}>
                {[0, 1, 2, 3, 4].map(i => (
                    <motion.div key={i}
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 3 + i, ease: 'linear' }}
                        style={{
                            position: 'absolute',
                            inset: `${i * 16}px`,
                            border: `1px solid rgba(${i % 2 ? '6,182,212' : '37,99,235'},${.6 - i * .1})`,
                            borderTop: `2px solid ${['#2563EB', '#06B6D4', '#7C3AED', '#06B6D4', '#2563EB'][i]}`,
                            borderRadius: '50%',
                        }} />
                ))}
                {/* Center */}
                <div style={{
                    position: 'absolute', inset: '72px',
                    background: 'radial-gradient(circle, rgba(6,182,212,.8), rgba(37,99,235,.4))',
                    borderRadius: '50%', animation: 'pulse-glow 1.5s ease infinite'
                }} />
                {/* Orbiting nodes */}
                {[0, 1, 2].map(i => (
                    <div key={i} style={{
                        position: 'absolute', top: '50%', left: '50%',
                        width: '8px', height: '8px',
                        marginLeft: '-4px', marginTop: '-4px',
                        animation: `orbit ${2 + i}s linear infinite`,
                        animationDelay: `${i * .6}s`
                    }}>
                        <div style={{
                            width: '8px', height: '8px', borderRadius: '50%',
                            background: ['#06B6D4', '#2563EB', '#7C3AED'][i],
                            boxShadow: `0 0 12px ${['#06B6D4', '#2563EB', '#7C3AED'][i]}`
                        }} />
                    </div>
                ))}
            </div>

            {/* Logo */}
            <div style={{ textAlign: 'center' }}>
                <h1 style={{
                    fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: '28px',
                    background: 'linear-gradient(135deg, #2563EB, #06B6D4)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                }}>FakeGuard.ai</h1>
            </div>

            {/* Message */}
            <motion.p key={msgIdx}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                style={{
                    fontFamily: 'var(--font-b)', fontSize: '13px',
                    color: '#06B6D4', letterSpacing: '.06em',
                    minHeight: '20px'
                }}>
                {MESSAGES[msgIdx]}
            </motion.p>

            {/* Progress bar */}
            <div style={{ width: '280px' }}>
                <div style={{
                    height: '2px', background: 'rgba(255,255,255,0.05)',
                    borderRadius: '2px', overflow: 'hidden'
                }}>
                    <motion.div
                        animate={{ width: `${progress}%` }}
                        transition={{ ease: 'easeOut' }}
                        style={{
                            height: '100%',
                            background: 'linear-gradient(90deg, #2563EB, #06B6D4)',
                            boxShadow: '0 0 12px rgba(6,182,212,.8)',
                            borderRadius: '2px'
                        }} />
                </div>
                <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    marginTop: '8px', fontSize: '11px', color: '#334155'
                }}>
                    <span>SYSTEM BOOT</span>
                    <span style={{ fontFamily: 'var(--font-b)', color: '#06B6D4' }}>
                        {Math.min(100, Math.floor(progress))}%
                    </span>
                </div>
            </div>

            {/* Matrix rain effect */}
            <div style={{
                position: 'absolute', inset: 0, overflow: 'hidden',
                opacity: .04, pointerEvents: 'none'
            }}>
                {[...Array(20)].map((_, i) => (
                    <div key={i} style={{
                        position: 'absolute',
                        left: `${i * 5.2}%`,
                        top: '-20px',
                        fontFamily: 'var(--font-b)',
                        fontSize: '12px',
                        color: '#06B6D4',
                        animation: `matrixDrop ${2 + Math.random() * 3}s linear infinite`,
                        animationDelay: `${Math.random() * 2}s`,
                        writingMode: 'vertical-lr',
                        letterSpacing: '4px'
                    }}>
                        {Math.random().toString(36).substr(2, 12).toUpperCase()}
                    </div>
                ))}
            </div>
        </motion.div>
    )
}