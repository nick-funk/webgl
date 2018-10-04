class TexturedShaderSource {
    constructor() {
        this.vertex = `
            attribute vec4 position;
            attribute vec2 uvs;

            uniform mat4 camera;
            uniform mat4 modelMatrix;

            varying mediump vec2 textureCoord;

            void main() {
                textureCoord = uvs;

                gl_Position = camera * modelMatrix * position;
            }
        `;

        this.fragment = `
            precision mediump float;

            varying mediump vec2 textureCoord;

            uniform sampler2D textureSampler;

            void main() {
                vec4 samplerColor = texture2D(textureSampler, textureCoord);

                gl_FragColor = samplerColor;
            }
        `;
    }
}

export default TexturedShaderSource;