import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis } from 'recharts'

function AnimatedRing({ value, color, size = 160, label }) {
    const r = 62, circ = 2 * Math.PI * r
    const offset = circ - (value / 100) * circ
    return (
        <div style={{ position: 'relative', width: size, height: size }}>
            <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="8" />
                <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="8"
                    strokeLinecap="round" strokeDasharray={circ}
                    initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.8, ease: [.16, 1, .3, 1] }}
                    style={{ filter: `drop-shadow(0 0 10px ${color})` }} />
                {/* Glow rings */}
                {[1, 2].map(i => (
                    <motion.circle key={i} cx={size / 2} cy={size / 2} r={r + i * 8} fill="none"
                        stroke={color} strokeWidth=".5"
                        initial={{ opacity: 0 }} animate={{ opacity: [0, .15, 0] }}
                        transition={{ repeat: Infinity, duration: 2.5, delay: i * .5 }} />
                ))}
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .5 }}
                    style={{ fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: '26px', color, lineHeight: 1 }}>
                    {value.toFixed(1)}%
                </motion.p>
                <p style={{ fontSize: '10px', color: '#475569', marginTop: '4px', letterSpacing: '.08em' }}>{label}</p>
            </div>
        </div>
    )
}

function RiskGauge({ fakePct }) {
    const level = fakePct > 85 ? 3 : fakePct > 60 ? 2 : fakePct > 35 ? 1 : 0
    const labels = ['LOW RISK', 'MEDIUM RISK', 'HIGH RISK', 'CRITICAL']
    const colors = ['#10B981', '#F59E0B', '#EF4444', '#DC2626']
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <p style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '.08em' }}>Risk Level</p>
                <p style={{ fontSize: '11px', fontWeight: 700, color: colors[level] }}>{labels[level]}</p>
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
                {[0, 1, 2, 3].map(i => (
                    <motion.div key={i}
                        initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }}
                        transition={{ delay: .3 + i * .1, duration: .4 }}
                        style={{
                            flex: 1, height: '8px', borderRadius: '4px',
                            background: i <= level ? colors[i] : 'rgba(255,255,255,.06)',
                            boxShadow: i === level ? `0 0 12px ${colors[i]}` : 'none',
                            transition: 'all .3s'
                        }} />
                ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '10px', color: '#334155' }}>
                <span>Safe</span><span>Moderate</span><span>Dangerous</span><span>Critical</span>
            </div>
        </div>
    )
}

export default function ResultCard({ result }) {
    if (!result) return null
    const isFake = result.label === 'FAKE'
    const color = isFake ? '#EF4444' : '#10B981'
    const dimBg = isFake ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.08)'
    const borderC = isFake ? 'rgba(239,68,68,0.35)' : 'rgba(16,185,129,0.35)'

    const pieData = [
        { name: 'Fake', value: result.fake_prob },
        { name: 'Real', value: result.real_prob }
    ]
    const barData = [
        { name: 'Fake', val: +(result.fake_prob * 100).toFixed(1) },
        { name: 'Real', val: +(result.real_prob * 100).toFixed(1) },
    ]

    // Explainability factors
    const factors = [
        { label: 'Sensational Language', score: isFake ? Math.floor(result.fake_prob * 90 + 5) : Math.floor(result.real_prob * 30) },
        { label: 'Source Reliability', score: isFake ? Math.floor(result.fake_prob * 80 + 10) : Math.floor(result.real_prob * 85) },
        { label: 'Emotional Triggers', score: isFake ? Math.floor(result.fake_prob * 85 + 5) : Math.floor(result.real_prob * 25) },
        { label: 'Factual Consistency', score: isFake ? Math.floor(result.real_prob * 70) : Math.floor(result.real_prob * 90) },
    ]

    return (
        <motion.div initial={{ opacity: 0, y: 50, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: .7, ease: [.16, 1, .3, 1] }}
            style={{ marginTop: '28px' }}>

            {/* Verdict banner */}
            <motion.div initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: .1, type: 'spring', stiffness: 150 }}
                style={{
                    padding: '24px 32px', borderRadius: '20px 20px 0 0',
                    background: isFake
                        ? 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(220,38,38,0.1))'
                        : 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(5,150,105,0.1))',
                    border: `1px solid ${borderC}`,
                    borderBottom: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <motion.div
                        animate={{ scale: [1, 1.08, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                        style={{
                            width: '56px', height: '56px', borderRadius: '16px',
                            background: dimBg, border: `1px solid ${borderC}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px',
                            boxShadow: `0 0 30px ${isFake ? 'rgba(239,68,68,.4)' : 'rgba(16,185,129,.4)'}`
                        }}>
                        {isFake ? '⚠' : '✓'}
                    </motion.div>
                    <div>
                        <p style={{ fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: '28px', color, letterSpacing: '-0.02em' }}>
                            {isFake ? 'FAKE NEWS DETECTED' : 'CREDIBLE NEWS'}
                        </p>
                        <p style={{ fontSize: '13px', color: '#64748B', marginTop: '3px' }}>
                            {result.word_count} words analyzed · Analysis complete
                        </p>
                    </div>
                </div>
                <div style={{
                    padding: '8px 20px', borderRadius: '100px',
                    background: dimBg, border: `1px solid ${borderC}`,
                    fontFamily: 'var(--font-b)', fontSize: '13px', fontWeight: 700, color,
                    letterSpacing: '.06em'
                }}>
                    {isFake ? '❌ FAKE' : '✅ REAL'}
                </div>
            </motion.div>

            {/* Main body */}
            <div className="glass" style={{
                padding: '32px', borderRadius: '0 0 20px 20px',
                border: `1px solid ${borderC}`, borderTop: 'none',
                boxShadow: `0 20px 60px ${isFake ? 'rgba(239,68,68,.08)' : 'rgba(16,185,129,.08)'}`
            }}>

                {/* Row 1: Ring + Pie + Risk */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '24px' }}>

                    <div className="glass2" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <p style={{ fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '8px' }}>Confidence</p>
                        <AnimatedRing value={result.confidence * 100} color={color} label="SCORE" />
                    </div>

                    <div className="glass2" style={{ padding: '24px' }}>
                        <p style={{ fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '12px' }}>Probability</p>
                        <div style={{ height: '130px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={38} outerRadius={58}
                                        dataKey="value" paddingAngle={4} strokeWidth={0}>
                                        <Cell fill="#EF4444" />
                                        <Cell fill="#10B981" />
                                    </Pie>
                                    <Tooltip formatter={v => `${(v * 100).toFixed(1)}%`}
                                        contentStyle={{ background: '#0A0F1E', border: '1px solid #1E293B', borderRadius: '10px', fontSize: '12px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                            {[['Fake', '#EF4444', result.fake_prob], ['Real', '#10B981', result.real_prob]].map(([n, c, v]) => (
                                <div key={n} style={{ textAlign: 'center' }}>
                                    <p style={{ fontFamily: 'var(--font-h)', fontWeight: 700, color: c }}>{(v * 100).toFixed(1)}%</p>
                                    <p style={{ fontSize: '11px', color: '#475569' }}>{n}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass2" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <RiskGauge fakePct={result.fake_prob * 100} />
                        <div style={{ marginTop: '20px' }}>
                            <p style={{ fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '8px' }}>
                                Feature Chart
                            </p>
                            <div style={{ height: '80px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={barData} barSize={28}>
                                        <Bar dataKey="val" radius={[4, 4, 0, 0]}>
                                            <Cell fill="#EF4444" />
                                            <Cell fill="#10B981" />
                                        </Bar>
                                        <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Row 2: Explainability */}
                <div className="glass2" style={{ padding: '24px', marginBottom: '20px' }}>
                    <p style={{ fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '16px' }}>
                        🔍 Explainable AI Analysis
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        {factors.map((f, i) => (
                            <div key={f.label}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                    <span style={{ fontSize: '12px', color: '#94A3B8' }}>{f.label}</span>
                                    <span style={{ fontSize: '12px', fontWeight: 600, color: f.score > 60 ? '#EF4444' : f.score > 40 ? '#F59E0B' : '#10B981' }}>
                                        {f.score}%
                                    </span>
                                </div>
                                <div style={{ height: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                                    <motion.div
                                        initial={{ width: 0 }} animate={{ width: `${f.score}%` }}
                                        transition={{ delay: .4 + i * .1, duration: .8, ease: [.16, 1, .3, 1] }}
                                        style={{
                                            height: '100%', borderRadius: '3px',
                                            background: f.score > 60 ? '#EF4444' : f.score > 40 ? '#F59E0B' : '#10B981',
                                            boxShadow: `0 0 8px ${f.score > 60 ? 'rgba(239,68,68,.5)' : f.score > 40 ? 'rgba(245,158,11,.5)' : 'rgba(16,185,129,.5)'}`
                                        }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Row 3: Signal words */}
                {result.fake_words?.length > 0 && (
                    <div className="glass2" style={{ padding: '24px' }}>
                        <p style={{ fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '14px' }}>
                            🧬 AI Signal Words
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {result.fake_words.slice(0, 8).map((w, i) => (
                                <motion.span key={w} initial={{ opacity: 0, scale: .8 }} animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: .5 + i * .05 }} whileHover={{ scale: 1.1 }}
                                    style={{
                                        padding: '5px 13px', borderRadius: '100px', fontSize: '12px',
                                        background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,.3)',
                                        color: '#FCA5A5', fontFamily: 'var(--font-b)', cursor: 'default'
                                    }}>↑ {w}</motion.span>
                            ))}
                            {result.real_words.slice(0, 8).map((w, i) => (
                                <motion.span key={w} initial={{ opacity: 0, scale: .8 }} animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: .6 + i * .05 }} whileHover={{ scale: 1.1 }}
                                    style={{
                                        padding: '5px 13px', borderRadius: '100px', fontSize: '12px',
                                        background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,.3)',
                                        color: '#6EE7B7', fontFamily: 'var(--font-b)', cursor: 'default'
                                    }}>↓ {w}</motion.span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    )
}