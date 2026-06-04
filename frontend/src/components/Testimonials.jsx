import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const t = [
    { name: 'Dr. Sarah Chen', role: 'Head of Fact-Checking, Reuters', avatar: '👩‍💻', quote: 'FakeGuard has transformed our verification workflow. The confidence scores and AI explanations are incredibly precise and trustworthy.', rating: 5, org: 'Reuters' },
    { name: 'Marcus Williams', role: 'Senior Cybersecurity Analyst', avatar: '👨‍🔬', quote: "We've integrated FakeGuard into our threat intelligence pipeline. It catches 99% of misinformation in our test datasets — remarkable accuracy.", rating: 5, org: 'Cyber Corp' },
    { name: 'Prof. Priya Sharma', role: 'AI Research, MIT', avatar: '👩‍🏫', quote: 'The explainable AI panel is groundbreaking. Students can see exactly how the model identifies manipulation patterns in real news.', rating: 5, org: 'MIT' },
]

export default function Testimonials() {
    const [active, setActive] = useState(0)

    useEffect(() => {
        const iv = setInterval(() => setActive(a => (a + 1) % t.length), 5000)
        return () => clearInterval(iv)
    }, [])

    return (
        <section style={{ padding: '100px 60px', position: 'relative', zIndex: 1 }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>

                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '56px' }}>
                    <p style={{ fontSize: '11px', color: '#06B6D4', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '14px' }}>
                        TRUSTED BY EXPERTS
                    </p>
                    <h2 style={{
                        fontFamily: 'var(--font-h)', fontWeight: 700,
                        fontSize: 'clamp(28px,4vw,44px)', letterSpacing: '-0.03em'
                    }}>What professionals say</h2>
                </motion.div>

                <AnimatePresence mode="wait">
                    <motion.div key={active}
                        initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }} transition={{ duration: .35 }}
                        className="glass grad-border" style={{ padding: '48px', textAlign: 'center' }}>
                        <div style={{ fontSize: '44px', marginBottom: '16px' }}>{t[active].avatar}</div>
                        <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: '100px', background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,.25)', fontSize: '11px', color: '#60A5FA', marginBottom: '20px', letterSpacing: '.06em' }}>
                            {t[active].org}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '24px' }}>
                            {[...Array(t[active].rating)].map((_, i) => (
                                <span key={i} style={{ color: '#F59E0B', fontSize: '18px' }}>★</span>
                            ))}
                        </div>
                        <p style={{ fontSize: '17px', lineHeight: 1.8, color: '#94A3B8', fontStyle: 'italic', marginBottom: '28px', maxWidth: '600px', margin: '0 auto 28px' }}>
                            "{t[active].quote}"
                        </p>
                        <p style={{ fontFamily: 'var(--font-h)', fontWeight: 600, fontSize: '16px' }}>{t[active].name}</p>
                        <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>{t[active].role}</p>
                    </motion.div>
                </AnimatePresence>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '28px' }}>
                    {t.map((_, i) => (
                        <motion.button key={i} whileHover={{ scale: 1.3 }} onClick={() => setActive(i)}
                            style={{
                                width: i === active ? '32px' : '8px', height: '8px', borderRadius: '100px', border: 'none',
                                background: i === active ? 'linear-gradient(135deg,#2563EB,#06B6D4)' : 'rgba(255,255,255,.12)',
                                cursor: 'pointer', transition: 'all .3s',
                                boxShadow: i === active ? '0 0 12px rgba(37,99,235,.6)' : 'none'
                            }} />
                    ))}
                </div>
            </div>
        </section>
    )
}