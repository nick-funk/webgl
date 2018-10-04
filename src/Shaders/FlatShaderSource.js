class FlatShaderSource {
    constructor() {
        this.vertex = `
            attribute vec4 position;
            attribute vec4 color;

            uniform mat4 camera;
            uniform mat4 modelMatrix;

            varying mediump vec4 vertexColor;

            void main() {
                vertexColor = color;

                gl_Position = camera * modelMatrix * position;
            }
        `;

        this.fragment = `
            precision mediump float;

            varying mediump vec4 vertexColor;

            uniform vec4 baseColor;
            uniform float baseColorRatio;

            void main() {
                gl_FragColor = baseColorRatio * baseColor + (1.0 - baseColorRatio) * vertexColor;
            }
        `;
    }
}

export default FlatShaderSource;