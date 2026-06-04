import { useEffect, useRef } from 'react'

export default function NeuralNet() {
    const canvasRef = useRef(null)

    useEffect(() => {
        const c = canvasRef.current
        const ctx = c.getContext('2d')
        c.width = 420; c.height = 420

        const layers = [
            [{ x: 80, y: 100 }, { x: 80, y: 170 }, { x: 80, y: 240 }, { x: 80, y: 310 }],
            [{ x: 180, y: 120 }, { x: 180, y: 190 }, { x: 180, y: 260 }, { x: 180, y: 330 }],
            [{ x: 280, y: 140 }, { x: 280, y: 210 }, { x: 280, y: 280 }],
            [{ x: 370, y: 185 }, { x: 370, y: 255 }],
        ]

        let t = 0
        let pulses = []

        function addPulse() {
            if (Math.random() > .3) {
                const li = Math.floor(Math.random() * (layers.length - 1))
                const ni = Math.floor(Math.random() * layers[li].length)
                const ti = Math.floor(Math.random() * layers[li + 1].length)
                pulses.push({ li, ni, ti, progress: 0 })
            }
        }

        function draw() {
            ctx.clearRect(0, 0, c.width, c.height)
            t++
            if (t % 15 === 0) addPulse()

            // Connections
            layers.forEach((layer, li) => {
                if (li >= layers.length - 1) return
                layer.forEach(n => {
                    layers[li + 1].forEach(m => {
                        ctx.beginPath()
                        ctx.strokeStyle = 'rgba(59,130,246,0.12)'
                        ctx.lineWidth = .8
                        ctx.moveTo(n.x, n.y)
                        ctx.lineTo(m.x, m.y)
                        ctx.stroke()
                    })
                })
            })

            // Pulses
            pulses = pulses.filter(p => p.progress <= 1)
            pulses.forEach(p => {
                const from = layers[p.li][p.ni]
                const to = layers[p.li + 1][p.ti]
                const x = from.x + (to.x - from.x) * p.progress
                const y = from.y + (to.y - from.y) * p.progress

                // Trail
                for (let i = 0; i < 8; i++) {
                    const tp = Math.max(0, p.progress - i * .04)
                    const tx = from.x + (to.x - from.x) * tp
                    const ty = from.y + (to.y - from.y) * tp
                    ctx.beginPath()
                    ctx.arc(tx, ty, 3 - i * .25, 0, Math.PI * 2)
                    ctx.fillStyle = `rgba(6,182,212,${.8 - i * .1})`
                    ctx.fill()
                }

                ctx.beginPath()
                ctx.arc(x, y, 4, 0, Math.PI * 2)
                ctx.fillStyle = '#06B6D4'
                ctx.shadowColor = '#06B6D4'
                ctx.shadowBlur = 12
                ctx.fill()
                ctx.shadowBlur = 0
                p.progress += .025
            })

            // Nodes
            layers.forEach((layer, li) => {
                layer.forEach((n, ni) => {
                    const pulse = Math.sin(t * .05 + li + ni) * .5 + .5
                    const isActive = pulses.some(p =>
                        (p.li === li && p.ni === ni) || (p.li === li - 1 && p.ti === ni)
                    )

                    // Outer ring
                    ctx.beginPath()
                    ctx.arc(n.x, n.y, 18, 0, Math.PI * 2)
                    ctx.strokeStyle = isActive
                        ? 'rgba(6,182,212,0.6)'
                        : `rgba(59,130,246,${.2 + pulse * .15})`
                    ctx.lineWidth = 1
                    ctx.stroke()

                    // Inner fill
                    const grad = ctx.createRadialGradient(n.x - 3, n.y - 3, 0, n.x, n.y, 12)
                    grad.addColorStop(0, isActive ? 'rgba(6,182,212,0.9)' : 'rgba(59,130,246,0.7)')
                    grad.addColorStop(1, isActive ? 'rgba(6,182,212,0.3)' : 'rgba(59,130,246,0.2)')
                    ctx.beginPath()
                    ctx.arc(n.x, n.y, 12, 0, Math.PI * 2)
                    ctx.fillStyle = grad
                    if (isActive) { ctx.shadowColor = '#06B6D4'; ctx.shadowBlur = 20 }
                    ctx.fill()
                    ctx.shadowBlur = 0
                })
            })

            // Labels
            ctx.font = '10px JetBrains Mono'
            ctx.fillStyle = 'rgba(100,116,139,0.8)'
            ctx.textAlign = 'center'
            const labels = ['INPUT', 'HIDDEN', 'HIDDEN', 'OUTPUT']
            layers.forEach((layer, li) => {
                ctx.fillText(labels[li], layer[0].x, 60)
            })

            requestAnimationFrame(draw)
        }
        draw()
    }, [])

    return (
        <div style={{
            position: 'relative', width: '420px', height: '420px'
        }}>
            {/* Outer glow */}
            <div style={{
                position: 'absolute', inset: '-20px',
                background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)',
                borderRadius: '50%', filter: 'blur(20px)'
            }} />
            <div className="glass" style={{
                position: 'relative', overflow: 'hidden',
                boxShadow: '0 0 60px rgba(59,130,246,0.15)'
            }}>
                {/* Scan line */}
                <div style={{
                    position: 'absolute', left: 0, right: 0, height: '2px',
                    background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.6), transparent)',
                    animation: 'scanDown 3s linear infinite', zIndex: 2
                }} />
                <canvas ref={canvasRef} style={{ display: 'block', width: '420px', height: '420px' }} />
            </div>
        </div>
    )
}