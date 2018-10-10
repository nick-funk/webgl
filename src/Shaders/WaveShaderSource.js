class SineShaderSource {
    constructor() {
        this.vertex = `
            attribute vec4 position;
            attribute vec4 color;

            uniform mat4 camera;
            uniform mat4 modelMatrix;
            uniform float width;
            uniform mediump float elapsedMs;
            uniform mediump float bigWaveSpeed;
            uniform mediump float bigWaveAmplitude;
            uniform mediump float smallWaveSpeed;
            uniform mediump float smallWaveAmplitude;
            uniform sampler2D noiseSampler;

            varying mediump float colorIntensity;

            void main() {
                float bigWaveOffset = bigWaveAmplitude * cos(position.x + bigWaveSpeed * (elapsedMs / 1000.0));

                float smallWaveStep = smallWaveSpeed * (elapsedMs / 1000.0);
                vec4 smallWaveSample = texture2D(noiseSampler, vec2(smallWaveStep + position.x / width, smallWaveStep + position.z) / width);

                colorIntensity = smallWaveSample.r;
                vec4 offset = vec4(0, bigWaveOffset, 0, 0) + vec4(0, smallWaveAmplitude * smallWaveSample.r, 0, 0);

                gl_Position = camera * modelMatrix * (position + offset);
            }
        `;

        this.fragment = `
            precision mediump float;

            varying mediump float colorIntensity;

            uniform vec4 lowColor;
            uniform vec4 highColor;

            void main() {
                gl_FragColor = colorIntensity * highColor + (1.0 - colorIntensity) * lowColor;
            }
        `;
    }
}

export default SineShaderSource;