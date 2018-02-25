const GifEncoder = require('gifencoder')
const Canvas = require('canvas')
const w = 500, h = 500
class LineToCircleGif {
    constructor() {
        this.initCanvas()
        this.initEncoder()
    }
    initCanvas() {
        this.canvas = new Canvas()
        this.canvas.width = w
        this.canvas.height = h
        this.context = this.canvas.getContext('2d')
    }
    initEncoder() {
        this.encoder = new GifEncoder(w, h)
        this.encoder.setDelay(50)
        this.encoder.setQuality(100)
        this.encoder.setRepeat(0)
    }
    create(fileName) {
        this.encoder.createReadStream(require('fs').createWriteStream(fileName))
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
