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
