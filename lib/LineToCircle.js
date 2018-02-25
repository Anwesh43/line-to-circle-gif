const GifEncoder = require('gifencoder')
const Canvas = require('canvas')
const w = 500, h = 500, size = Math.min(w,h)
class LineToCircleGif {
    constructor() {
        this.initCanvas()
        this.initEncoder()
        this.initLineToCircle()
    }
    initCanvas() {
        this.canvas = new Canvas()
        this.canvas.width = w
        this.canvas.height = h
        this.context = this.canvas.getContext('2d')
    }
    initLineToCircle() {
        this.lineToCircle = new LineToCircle()
    }
    initEncoder() {
        this.encoder = new GifEncoder(w, h)
        this.encoder.setDelay(50)
        this.encoder.setQuality(100)
        this.encoder.setRepeat(0)
    }
    create(fileName) {
        this.encoder.createReadStream(require('fs').createWriteStream(fileName))
        this.encoder.start()
        const renderer = new Renderer()
        renderer.render(context, this.lineToCircle, (context) => {
            this.encoder.addFrame(context)
        }, () => {
            this.encoder.end()
        })
    }
}
class State {
    constructor() {
        this.scales = [0, 0]
        this.dir = 1
        this.prevScale = 0
        this.j = 0
    }
    update(stopcb) {
        this.scales[this.j] += 0.1 * this.dir
        if(Math.abs(this.scales[this.j] - this.prevScale) > 1) {
            this.scales[this.j] = this.prevScale + this.dir
            this.j += this.dir
            if(this.j == this.scales.length || this.j == -1) {
                this.dir *= -1
                this.j += this.dir
                this.prevScale = this.scales[this.j]
                if(this.dir == 0) {
                    stopcb()
                }

            }
        }
    }
}
class LineToCircle {
    constructor() {
        this.state = new State()
    }
    drawArc(context, start, end, r) {
        context.beginPath()
        for(var i = start; i < = end; i++) {
            const x = r * Math.cos(i * Math.PI/180), y = r * Math.sin(i * Math.PI/180)
            if(i == start) {
                context.moveTo(x, y)
            }
            else {
                context.lineTo(x, y)
            }
        }
        context.stroke()
    }
    drawLine(context, r, scales) {
        const getPoint = (scale) => ({x: (2 * Math.PI * r - 2 * r) * scale, y: 0})
        const point1 = getPoint(scales[1])
        const point2 = getPoint(scales[0])
        context.beginPath()
        context.moveTo(r + point1.x, point1.y)
        context.lineTo(r + point2.x, point2.y)
        context.stroke()
    }
    draw(context) {
        context.strokeStyle = "#3498db"
        context.lineWidth = size/60
        context.lineCap = 'round'
        const r = size/8
        context.save()
        context.translate(size/3,size/2)
        this.drawArc(context, 0, 360 * (1 - this.state.scales[0]), r)
        this.drawLine(context, r, this.state.scales)
        context.save()
        context.translate(2 * Math.PI * r, 0)
        this.drawArc(context, 90, 360 * (this.state.scales[1]), r)
        context.restore()
        context.restore()
    }
    update(stopcb) {
        this.state.update(stopcb)
    }
}
class Renderer {
    constructor() {
        this.running = true
    }
    render(context, lineToCircle, stopcb, updatecb) {
        while(this.running) {
            context.fillStyle = '#212121'
            context.fillRect(0, 0, w, h)
            lineToCircle.draw(context)
            lineToCircle.update(() => {
                stopcb()
            })
            updatecb(context)
        }
    }
}
const createLineToCircleGif = (fileName) => {
    const lineToCircleGif = new LineToCircleGif()
    lineToCircleGif.create(fileName)
}
module.exports = createLineToCircleGif
