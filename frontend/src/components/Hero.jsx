import { motion } from 'framer-motion'
import NeuralNet from './NeuralNet'

export default function Hero({ setPage }) {
    return (
        <section className="grid-bg" style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center',
            justifyContent: 'center', position: 'relative',
            padding: '100px 40px 60px', overflow: 'hidden'
        }}>
            {/* Glow orbs */}
            <div style={{
                position: 'absolute', top: '20%', left: '10%',
                width: '500px', height: '500px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
                filter: 'blur(40px)', pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute', bottom: '10%', right: '5%',
                width: '400px', height: '400px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
                filter: 'blur(40px)', pointerEvents: 'none'
            }} />

            <div style={{
                maxWidth: '1200px', width: '100%', margin: '0 auto',
                display: 'grid', gridTemplateColumns: '1fr 1fr',
                gap: '60px', alignItems: 'center',
                position: 'relative', zIndex: 1
            }}>
                {/* Left */}
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: .6 }}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            padding: '6px 16px', borderRadius: '100px',
                            background: 'rgba(59,130,246,0.1)',
                            border: '1px solid rgba(59,130,246,0.3)',
                            fontSize: '12px', color: '#60A5FA',
                            letterSpacing: '.08em', marginBottom: '24px'
                        }}>
                        <span style={{
                            width: '6px', height: '6px', borderRadius: '50%',
                            background: '#06B6D4', display: 'inline-block',
                            animation: 'pulse-glow 2s ease infinite'
                        }} />
                        POWERED BY DISTILBERT · 99.9% ACCURACY
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: .7, delay: .1 }}
                        style={{
                            fontFamily: 'var(--font)', fontWeight: 900,
                            fontSize: 'clamp(36px, 4.5vw, 56px)',
                            lineHeight: 1.05, letterSpacing: '-0.03em',
                            marginBottom: '20px'
                        }}>
                        AI-Powered<br />
                        <span style={{
                            background: 'linear-gradient(135deg, #3B82F6, #06B6D4, #8B5CF6)',
                            backgroundSize: '200% 200%',
                            animation: 'gradMove 4s ease infinite',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>Fake News</span><br />
                        Detection System
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: .6, delay: .2 }}
                        style={{
                            color: '#94A3B8', fontSize: '16px', lineHeight: 1.7,
                            marginBottom: '36px', maxWidth: '480px'
                        }}>
                        Analyze news articles instantly using Machine Learning and identify
                        misinformation with confidence scores and detailed AI explanations.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: .6, delay: .3 }}
                        style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                        <motion.button
                            whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(59,130,246,0.6)' }}
                            whileTap={{ scale: .97 }}
                            onClick={() => setPage('detector')}
                            style={{
                                padding: '14px 32px', borderRadius: '12px', border: 'none',
                                background: 'linear-gradient(135deg, #3B82F6, #06B6D4)',
                                color: '#fff', fontSize: '15px', fontWeight: 700,
                                fontFamily: 'var(--font)', cursor: 'pointer',
                                boxShadow: '0 0 30px rgba(59,130,246,0.4)'
                            }}>
                            → Analyze News
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.04, borderColor: '#06B6D4' }}
                            whileTap={{ scale: .97 }}
                            onClick={() => document.getElementById('detector-section')?.scrollIntoView({ behavior: 'smooth' })}
                            style={{
                                padding: '14px 32px', borderRadius: '12px',
                                background: 'transparent', color: '#94A3B8',
                                fontSize: '15px', fontWeight: 600,
                                fontFamily: 'var(--font)', cursor: 'pointer',
                                border: '1px solid rgba(255,255,255,0.1)',
                                transition: 'border-color .2s, color .2s'
                            }}>
                            View Demo ↓
                        </motion.button>
                    </motion.div>

                    {/* Trust badges */}
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ delay: .6 }}
                        style={{
                            display: 'flex', gap: '24px', marginTop: '40px',
                            flexWrap: 'wrap'
                        }}>
                        {[
                            ['99.9%', 'Accuracy'],
                            ['39K+', 'Articles trained'],
                            ['<1s', 'Analysis time'],
                        ].map(([val, label]) => (
                            <div key={label}>
                                <p style={{
                                    fontFamily: 'var(--font)', fontWeight: 800, fontSize: '22px',
                                    background: 'linear-gradient(135deg, #fff, #94A3B8)',
                                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                                }}>{val}</p>
                                <p style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>{label}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Right — Neural Net */}
                <motion.div
                    initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: .8, delay: .2 }}
                    style={{ display: 'flex', justifyContent: 'center' }}>
                    <NeuralNet />
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                style={{
                    position: 'absolute', bottom: '32px', left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'
                }}>
                <p style={{ fontSize: '11px', color: '#475569', letterSpacing: '.1em' }}>SCROLL</p>
                <motion.div
                    animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}
                    style={{
                        width: '1px', height: '40px',
                        background: 'linear-gradient(180deg, #3B82F6, transparent)'
                    }} />
            </motion.div>
        </section>
    )
}