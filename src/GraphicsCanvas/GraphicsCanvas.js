import './GraphicsCanvas.less';

class GraphicsCanvas {
    constructor(width, height, clearColor) {
        this.clearColor = clearColor !== null && clearColor !== undefined 
            ? clearColor
            : { r: 0.0, g: 0.0, b: 0.0, a: 1.0 };

        this.width = width;
        this.height = height;

        this.root = document.createElement('canvas');
        this.root.classList.add('graphics-canvas');
        this.root.width = this.width;
        this.root.height = this.height;

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

    clear() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }
}

export default GraphicsCanvas;