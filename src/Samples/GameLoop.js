class GameLoop {
    constructor(canvas, refreshRateMs) {
        this.canvas = canvas;
        this.refreshRateMs = refreshRateMs;

        this.running = false;
        this.camera = null;

        this.onResizeDelegate = this.onResize.bind(this);
        window.addEventListener('resize', this.onResizeDelegate);
    }

    run() {
        this.running = true;
        this.update();
    }

    stop() {
        this.running = false;
    }

    onResize() {
        if (this.camera !== null && this.camera !== undefined) {
            this.camera.resize(this.canvas.width, this.canvas.height);
        }
    }
}

export default GameLoop;