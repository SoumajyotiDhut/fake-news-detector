import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { explainText, predictURL, predictRealtime } from '../api/client'
import ResultCard from './ResultCard'

const STAGES = [
    { icon: '🔍', label: 'Scanning Content', sub: 'Preprocessing text input...' },
    { icon: '🧬', label: 'Extracting Linguistic Features', sub: 'Analyzing syntax and semantics...' },
    { icon: '🧠', label: 'Running ML Model', sub: 'DistilBERT inference in progress...' },
    { icon: '📊', label: 'Generating Verdict', sub: 'Calculating confidence scores...' },
]

function AnalysisLoader() {
    const [stage, setStage] = useState(0)

    useEffect(() => {
        const timers = STAGES.map((_, i) => setTimeout(() => setStage(i), i * 700))
        return () => timers.forEach(clearTimeout)
    }, [])

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }} className="glass"
            style={{ padding: '40px', marginTop: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
                <div style={{ position: 'relative', width: '100px', height: '100px' }}>
                    {[0, 1, 2].map(i => (
                        <motion.div key={i}
                            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                            transition={{ repeat: Infinity, duration: 2 + i, ease: 'linear' }}
                            style={{
                                position: 'absolute', inset: `${i * 14}px`,
                                border: `1px solid rgba(${i === 1 ? '6,182,212' : '37,99,235'},${.7 - i * .2})`,
                                borderTop: `2px solid ${['#2563EB', '#06B6D4', '#7C3AED'][i]}`,
                                borderRadius: '50%'
                            }} />
                    ))}
                    <div style={{
                        position: 'absolute', inset: '36px', borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(6,182,212,.6), rgba(37,99,235,.3))',
                        animation: 'pulse-glow 1s ease infinite'
                    }} />
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {STAGES.map((s, i) => (
                    <motion.div key={i}
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: i <= stage ? 1 : .3, x: 0 }}
                        transition={{ delay: i * .08 }}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px',
                            borderRadius: '12px',
                            background: i === stage ? 'rgba(37,99,235,0.12)' : 'rgba(255,255,255,0.02)',
                            border: `1px solid ${i === stage ? 'rgba(37,99,235,.3)' : 'var(--border)'}`,
                            transition: 'all .3s'
                        }}>
                        <span style={{ fontSize: '18px' }}>{s.icon}</span>
                        <div style={{ flex: 1 }}>
                            <p style={{
                                fontFamily: 'var(--font-h)', fontWeight: 600, fontSize: '13px',
                                color: i === stage ? '#60A5FA' : '#64748B'
                            }}>{s.label}</p>
                            {i === stage && (
                                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>
                                    {s.sub}
                                </motion.p>
                            )}
                        </div>
                        {i < stage && <span style={{ color: '#10B981' }}>✓</span>}
                        {i === stage && (
                            <motion.div animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: .8, ease: 'linear' }}
                                style={{
                                    width: '14px', height: '14px',
                                    border: '2px solid rgba(37,99,235,.3)',
                                    borderTop: '2px solid #06B6D4', borderRadius: '50%'
                                }} />
                        )}
                    </motion.div>
                ))}
            </div>
            <div style={{ marginTop: '20px', height: '3px', background: 'rgba(255,255,255,0.04)', borderRadius: '2px', overflow: 'hidden' }}>
                <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                    style={{
                        height: '100%', width: '40%',
                        background: 'linear-gradient(90deg, transparent, #06B6D4, transparent)',
                        borderRadius: '2px'
                    }} />
            </div>
        </motion.div>
    )
}

// Mini live indicator shown in textarea while typing
function LiveIndicator({ status, result }) {
    if (status === 'idle') return null

    const colors = {
        typing: { bg: 'rgba(37,99,235,0.12)', border: 'rgba(37,99,235,.3)', text: '#60A5FA', icon: '⌨' },
        analyzing: { bg: 'rgba(6,182,212,0.12)', border: 'rgba(6,182,212,.3)', text: '#06B6D4', icon: '⚡' },
        fake: { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,.3)', text: '#EF4444', icon: '⚠' },
        real: { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,.3)', text: '#10B981', icon: '✓' },
    }

    const c = colors[status] || colors.idle

    return (
        <motion.div
            initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: .9 }}
            style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '5px 12px', borderRadius: '100px',
                background: c.bg, border: `1px solid ${c.border}`,
                fontSize: '12px', color: c.text, fontFamily: 'var(--font-b)'
            }}>
            {status === 'analyzing' ? (
                <motion.span animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: .8, ease: 'linear' }}
                    style={{ display: 'inline-block' }}>⚙</motion.span>
            ) : (
                <span>{c.icon}</span>
            )}
            {status === 'typing' && 'Preparing analysis...'}
            {status === 'analyzing' && 'AI analyzing...'}
            {status === 'fake' && result && `${(result.fake_prob * 100).toFixed(0)}% Fake`}
            {status === 'real' && result && `${(result.real_prob * 100).toFixed(0)}% Real`}
        </motion.div>
    )
}

export default function Detector({ standalone }) {
    const [text, setText] = useState('')
    const [url, setUrl] = useState('')
    const [mode, setMode] = useState('text')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [error, setError] = useState(null)
    const [focused, setFocused] = useState(false)

    // Real-time state
    const [liveStatus, setLiveStatus] = useState('idle')   // idle | typing | analyzing | fake | real
    const [liveResult, setLiveResult] = useState(null)
    const [realtimeOn, setRealtimeOn] = useState(true)

    const debounceRef = useRef(null)
    const abortRef = useRef(null)

    const charCount = text.length
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length
    const canSubmit = mode === 'text' ? charCount >= 20 : url.startsWith('http')

    // ── Real-time debounced analysis ──────────────────────────
    const runRealtime = useCallback(async (value) => {
        if (abortRef.current) abortRef.current.abort()
        abortRef.current = new AbortController()

        setLiveStatus('analyzing')
        try {
            const res = await predictRealtime(value)
            const data = res.data
            setLiveResult(data)
            setLiveStatus(data.label === 'FAKE' ? 'fake' : 'real')
        } catch (e) {
            if (e.name !== 'CanceledError') setLiveStatus('idle')
        }
    }, [])

    useEffect(() => {
        if (!realtimeOn || mode !== 'text') return

        if (charCount < 20) {
            setLiveStatus('idle')
            setLiveResult(null)
            if (debounceRef.current) clearTimeout(debounceRef.current)
            return
        }

        setLiveStatus('typing')
        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => runRealtime(text), 1500)

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current)
        }
    }, [text, realtimeOn, mode])

    // ── Full analysis (button click) ─────────────────────────
    async function handleAnalyze() {
        setLoading(true); setError(null); setResult(null)
        try {
            const res = mode === 'text' ? await explainText(text) : await predictURL(url)
            setResult(res.data)
            // Sync live status with full result
            setLiveStatus(res.data.label === 'FAKE' ? 'fake' : 'real')
            setLiveResult(res.data)
        } catch (err) {
            setError(err.response?.data?.detail || 'Analysis failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <section id="detector-section" style={{
            padding: standalone ? '60px 40px' : '120px 60px',
            position: 'relative', zIndex: 1
        }}>
            <div style={{ maxWidth: '860px', margin: '0 auto' }}>

                {!standalone && (
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '56px' }}>
                        <p style={{ fontSize: '11px', color: '#06B6D4', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '14px' }}>
                            LIVE DETECTION
                        </p>
                        <h2 style={{
                            fontFamily: 'var(--font-h)', fontWeight: 700,
                            fontSize: 'clamp(30px,4vw,48px)', letterSpacing: '-0.03em'
                        }}>
                            Try it{' '}
                            <span style={{
                                background: 'linear-gradient(135deg, #2563EB, #06B6D4)',
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                            }}>right now</span>
                        </h2>
                    </motion.div>
                )}

                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} className="grad-border">
                    <div className="glass" style={{ padding: '36px', borderRadius: '20px' }}>

                        {/* Header row: tabs + realtime toggle */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
                            <div style={{
                                display: 'flex', gap: '6px',
                                background: 'rgba(0,0,0,0.4)', padding: '6px', borderRadius: '14px'
                            }}>
                                {[['text', '📝  Text'], ['url', '🔗  URL']].map(([m, label]) => (
                                    <motion.button key={m} whileHover={{ scale: 1.03 }} whileTap={{ scale: .97 }}
                                        onClick={() => { setMode(m); setLiveStatus('idle'); setLiveResult(null) }}
                                        style={{
                                            padding: '8px 20px', borderRadius: '10px', border: 'none',
                                            fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-h)',
                                            cursor: 'pointer', transition: 'all .25s',
                                            background: mode === m ? 'linear-gradient(135deg,#2563EB,#06B6D4)' : 'transparent',
                                            color: mode === m ? '#fff' : '#64748B',
                                            boxShadow: mode === m ? '0 0 24px rgba(37,99,235,.5)' : 'none'
                                        }}>{label}</motion.button>
                                ))}
                            </div>

                            {/* Realtime toggle */}
                            {mode === 'text' && (
                                <motion.div
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ fontSize: '12px', color: '#475569' }}>Live Analysis</span>
                                    <motion.div
                                        onClick={() => setRealtimeOn(r => !r)}
                                        style={{
                                            width: '44px', height: '24px', borderRadius: '100px', cursor: 'pointer',
                                            background: realtimeOn
                                                ? 'linear-gradient(135deg,#2563EB,#06B6D4)'
                                                : 'rgba(255,255,255,0.08)',
                                            border: `1px solid ${realtimeOn ? 'rgba(37,99,235,.5)' : 'var(--border)'}`,
                                            position: 'relative', transition: 'all .3s',
                                            boxShadow: realtimeOn ? '0 0 16px rgba(37,99,235,.4)' : 'none'
                                        }}>
                                        <motion.div
                                            animate={{ x: realtimeOn ? 22 : 2 }}
                                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                            style={{
                                                position: 'absolute', top: '3px',
                                                width: '16px', height: '16px', borderRadius: '50%',
                                                background: '#fff',
                                                boxShadow: '0 1px 4px rgba(0,0,0,.4)'
                                            }} />
                                    </motion.div>
                                    <AnimatePresence>
                                        {realtimeOn && (
                                            <LiveIndicator status={liveStatus} result={liveResult} />
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            )}
                        </div>

                        {/* Input */}
                        {mode === 'text' ? (
                            <div style={{
                                border: `1px solid ${focused
                                    ? liveStatus === 'fake' ? 'rgba(239,68,68,.5)'
                                        : liveStatus === 'real' ? 'rgba(16,185,129,.5)'
                                            : 'rgba(6,182,212,.5)'
                                    : liveStatus === 'fake' ? 'rgba(239,68,68,.2)'
                                        : liveStatus === 'real' ? 'rgba(16,185,129,.2)'
                                            : 'var(--border)'}`,
                                borderRadius: '16px', transition: 'all .4s', position: 'relative',
                                boxShadow: focused ? `0 0 0 4px ${liveStatus === 'fake' ? 'rgba(239,68,68,.06)'
                                        : liveStatus === 'real' ? 'rgba(16,185,129,.06)'
                                            : 'rgba(6,182,212,.08)'
                                    }` : 'none'
                            }}>
                                <textarea value={text}
                                    onChange={e => setText(e.target.value)}
                                    onFocus={() => setFocused(true)}
                                    onBlur={() => setFocused(false)}
                                    placeholder="Start typing a news article or headline... AI will analyze in real-time."
                                    style={{
                                        width: '100%', height: '200px', padding: '20px',
                                        background: 'rgba(0,0,0,0.25)', border: 'none', outline: 'none',
                                        resize: 'none', fontFamily: 'var(--font-b)',
                                        fontSize: '14px', color: 'var(--text)', lineHeight: 1.7,
                                        borderRadius: '16px'
                                    }} />

                                {/* Live status overlay in corner */}
                                <AnimatePresence>
                                    {realtimeOn && liveStatus !== 'idle' && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: .9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: .9 }}
                                            style={{
                                                position: 'absolute', top: '12px', right: '12px',
                                                display: 'flex', alignItems: 'center', gap: '6px',
                                                padding: '4px 10px', borderRadius: '100px',
                                                background: liveStatus === 'fake' ? 'rgba(239,68,68,0.15)'
                                                    : liveStatus === 'real' ? 'rgba(16,185,129,0.15)'
                                                        : 'rgba(37,99,235,0.15)',
                                                border: `1px solid ${liveStatus === 'fake' ? 'rgba(239,68,68,.4)'
                                                        : liveStatus === 'real' ? 'rgba(16,185,129,.4)'
                                                            : 'rgba(37,99,235,.4)'}`,
                                                fontSize: '11px', fontWeight: 600,
                                                color: liveStatus === 'fake' ? '#EF4444'
                                                    : liveStatus === 'real' ? '#10B981'
                                                        : '#60A5FA',
                                                backdropFilter: 'blur(8px)'
                                            }}>
                                            {liveStatus === 'typing' && <><motion.span animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 1 }}>●</motion.span> Preparing...</>}
                                            {liveStatus === 'analyzing' && <><motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: .8, ease: 'linear' }} style={{ display: 'inline-block' }}>⚙</motion.span> Analyzing...</>}
                                            {liveStatus === 'fake' && liveResult && <>⚠ {(liveResult.fake_prob * 100).toFixed(0)}% Fake</>}
                                            {liveStatus === 'real' && liveResult && <>✓ {(liveResult.real_prob * 100).toFixed(0)}% Real</>}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Progress bar */}
                                <div style={{
                                    position: 'absolute', bottom: 0, left: 0, right: 0,
                                    height: '3px', background: 'rgba(255,255,255,0.04)',
                                    borderRadius: '0 0 16px 16px', overflow: 'hidden'
                                }}>
                                    <motion.div
                                        animate={{ width: `${Math.min(charCount / 10000 * 100, 100)}%` }}
                                        transition={{ type: 'spring', damping: 20 }}
                                        style={{
                                            height: '100%',
                                            background: liveStatus === 'fake' ? '#EF4444'
                                                : liveStatus === 'real' ? '#10B981'
                                                    : 'linear-gradient(90deg,#2563EB,#06B6D4)',
                                            boxShadow: `0 0 8px ${liveStatus === 'fake' ? 'rgba(239,68,68,.8)'
                                                    : liveStatus === 'real' ? 'rgba(16,185,129,.8)'
                                                        : 'rgba(6,182,212,.8)'}`
                                        }} />
                                </div>
                            </div>
                        ) : (
                            <input type="url" value={url} onChange={e => setUrl(e.target.value)}
                                onFocus={e => e.target.style.borderColor = 'rgba(6,182,212,.5)'}
                                onBlur={e => e.target.style.borderColor = 'var(--border)'}
                                placeholder="https://news-website.com/article-to-verify"
                                style={{
                                    width: '100%', padding: '18px 20px',
                                    background: 'rgba(0,0,0,0.25)',
                                    border: '1px solid var(--border)', borderRadius: '16px',
                                    outline: 'none', fontFamily: 'var(--font-b)',
                                    fontSize: '14px', color: 'var(--text)', transition: 'border-color .2s'
                                }} />
                        )}

                        {/* Meta row */}
                        <div style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            marginTop: '10px', fontSize: '12px', color: '#334155'
                        }}>
                            <span style={{ color: charCount > 0 && charCount < 20 ? '#EF4444' : '#334155' }}>
                                {charCount > 0 && charCount < 20
                                    ? `${20 - charCount} more chars needed`
                                    : `${wordCount} words · ${charCount} chars`}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                {/* Mini live score */}
                                <AnimatePresence>
                                    {realtimeOn && liveResult && (liveStatus === 'fake' || liveStatus === 'real') && (
                                        <motion.span
                                            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                                            style={{
                                                fontSize: '12px', fontWeight: 600,
                                                color: liveStatus === 'fake' ? '#EF4444' : '#10B981'
                                            }}>
                                            Live: {(liveResult.confidence * 100).toFixed(1)}% {liveResult.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                                <span style={{ color: charCount > 9000 ? '#EF4444' : '#334155' }}>
                                    {charCount}/10000
                                </span>
                            </div>
                        </div>

                        {/* Analyze button */}
                        <motion.button
                            whileHover={canSubmit && !loading ? { scale: 1.02, boxShadow: '0 0 60px rgba(37,99,235,.8)' } : {}}
                            whileTap={canSubmit && !loading ? { scale: .98 } : {}}
                            onClick={handleAnalyze} disabled={!canSubmit || loading}
                            style={{
                                marginTop: '20px', width: '100%', padding: '16px',
                                borderRadius: '14px', border: 'none',
                                fontFamily: 'var(--font-h)', fontSize: '16px', fontWeight: 700,
                                cursor: canSubmit && !loading ? 'pointer' : 'not-allowed',
                                background: canSubmit && !loading
                                    ? 'linear-gradient(135deg,#2563EB,#06B6D4)'
                                    : 'rgba(255,255,255,0.04)',
                                color: canSubmit && !loading ? '#fff' : '#334155',
                                boxShadow: canSubmit && !loading ? '0 0 50px rgba(37,99,235,.6)' : 'none',
                                transition: 'all .2s', letterSpacing: '.02em'
                            }}>
                            {loading ? '⚙ AI Processing...' : '⚡ Full Analysis + Explanation'}
                        </motion.button>

                        {/* Realtime hint */}
                        <AnimatePresence>
                            {realtimeOn && charCount >= 20 && !result && !loading && (
                                <motion.p
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    style={{
                                        marginTop: '10px', textAlign: 'center',
                                        fontSize: '12px', color: '#334155'
                                    }}>
                                    ↑ Live analysis active · Click for full explanation + word signals
                                </motion.p>
                            )}
                        </AnimatePresence>

                        <AnimatePresence>
                            {error && (
                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                    style={{
                                        marginTop: '14px', padding: '14px 18px',
                                        background: 'rgba(239,68,68,0.1)',
                                        border: '1px solid rgba(239,68,68,.3)',
                                        borderRadius: '12px', color: '#FCA5A5', fontSize: '13px'
                                    }}>⚠ {error}</motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Live mini result — shows while typing, before full analysis */}
                <AnimatePresence>
                    {realtimeOn && liveResult && !loading && !result && (liveStatus === 'fake' || liveStatus === 'real') && (
                        <motion.div
                            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="glass"
                            style={{
                                marginTop: '16px', padding: '20px 24px',
                                border: `1px solid ${liveStatus === 'fake' ? 'rgba(239,68,68,.25)' : 'rgba(16,185,129,.25)'}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                flexWrap: 'wrap', gap: '12px'
                            }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ fontSize: '22px' }}>{liveStatus === 'fake' ? '⚠' : '✓'}</span>
                                <div>
                                    <p style={{
                                        fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: '16px',
                                        color: liveStatus === 'fake' ? '#EF4444' : '#10B981'
                                    }}>
                                        {liveStatus === 'fake' ? 'Likely Fake News' : 'Likely Credible'}
                                    </p>
                                    <p style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>
                                        Live preview · Click "Full Analysis" for detailed breakdown
                                    </p>
                                </div>
                            </div>

                            {/* Mini confidence bars */}
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                {[
                                    { label: 'Fake', val: liveResult.fake_prob, c: '#EF4444' },
                                    { label: 'Real', val: liveResult.real_prob, c: '#10B981' }
                                ].map(({ label, val, c }) => (
                                    <div key={label} style={{ textAlign: 'center', minWidth: '60px' }}>
                                        <p style={{ fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: '18px', color: c }}>
                                            {(val * 100).toFixed(0)}%
                                        </p>
                                        <p style={{ fontSize: '11px', color: '#475569' }}>{label}</p>
                                    </div>
                                ))}
                                <div style={{ width: '1px', height: '40px', background: 'var(--border)' }} />
                                <div style={{ textAlign: 'center', minWidth: '80px' }}>
                                    <p style={{
                                        fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: '18px',
                                        color: liveStatus === 'fake' ? '#EF4444' : '#10B981'
                                    }}>
                                        {(liveResult.confidence * 100).toFixed(1)}%
                                    </p>
                                    <p style={{ fontSize: '11px', color: '#475569' }}>Confidence</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>{loading && <AnalysisLoader />}</AnimatePresence>
                <AnimatePresence>{result && <ResultCard result={result} />}</AnimatePresence>
            </div>
        </section>
    )
}