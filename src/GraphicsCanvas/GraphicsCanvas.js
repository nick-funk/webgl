import './GraphicsCanvas.less';

class GraphicsCanvas {
    constructor(clearColor) {
        this.clearColor = clearColor !== null && clearColor !== undefined 
            ? clearColor
            : { r: 0.0, g: 0.0, b: 0.0, a: 1.0 };

        this.root = document.createElement('canvas');
        this.root.classList.add('graphics-canvas');
        
        
        this.onResizeDelegate = this.onResize.bind(this);
        window.addEventListener('resize', this.onResizeDelegate);
        this.onResize();

        this.gl = this.root.getContext('webgl');

        if (this.gl === null || this.gl === undefined) {
            console.warn('Unable to initialize WebGL. Your browser or machine may not support it.');
        }
        else {
            this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
            this.gl.clearColor(this.clearColor.r, this.clearColor.g, this.clearColor.b, this.clearColor.a);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        }
    }

    onResize() {
        var size = Math.min(window.innerHeight, window.innerWidth) - 80;

        if (size < 100) {
            size = 100;
        }

        this.width = size;
        this.height = size;

        this.root.width = size;
        this.root.height = size;

        this.root.style.left = (window.innerWidth / 2.0) - (size / 2.0);

        if (this.gl !== null && this.gl !== undefined) {
            this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        }
    }

    clear() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }
}

export default GraphicsCanvas;