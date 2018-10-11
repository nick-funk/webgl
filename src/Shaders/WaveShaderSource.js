class SineShaderSource {
    constructor() {
        this.vertex = `
            attribute vec4 position;
            attribute vec4 color;

            uniform mat4 camera;
            uniform mat4 modelMatrix;
            uniform float width;
            uniform float spacing;
            uniform mediump float elapsedMs;
            uniform mediump float bigWaveSpeed;
            uniform mediump float bigWaveAmplitude;
            uniform mediump float smallWaveSpeed;
            uniform mediump float smallWaveAmplitude;
            uniform mediump float foamSpeed;
            uniform mediump float foamScale;
            uniform sampler2D noiseSampler;

            varying mediump float colorIntensity;
            varying mediump vec3 normal;
            varying mediump vec3 viewPosition;
            varying mediump vec2 foamUV;
            varying mediump vec2 foamNoiseUV;

            float getBigWaveOffset(vec3 pos) {
                return bigWaveAmplitude * cos(pos.x + bigWaveSpeed * (elapsedMs / 1000.0));
            }

            vec4 getBigWave(vec3 pos) {
                float bigWaveOffset = getBigWaveOffset(pos);

                return vec4(0, bigWaveOffset, 0, 0);
            }

            vec4 getSmallWaveSample(vec3 pos) {
                float smallWaveStep = smallWaveSpeed * (elapsedMs / 1000.0);
                vec4 smallWaveSample = texture2D(noiseSampler, vec2(smallWaveStep + pos.x / width, pos.z / width));

                return smallWaveSample;
            }

            vec4 getSmallWave(vec3 pos) {
                vec4 smallWaveSample = getSmallWaveSample(pos);

                return vec4(0, smallWaveAmplitude * smallWaveSample.r, 0, 0);
            }

            vec4 getPosition(vec3 pos) {
                vec4 bigWave = getBigWave(pos);
                vec4 smallWave = getSmallWave(pos);

                return bigWave + smallWave;
            }

            vec3 getNormal(vec3 pos, float spacing) {
                vec4 center = getPosition(pos);
                vec4 left = getPosition(vec3(pos.x, pos.y, pos.z + spacing));
                vec4 right = getPosition(vec3(pos.x + spacing, pos.y, pos.z));

                vec3 normal = normalize(cross(left.xyz - pos, right.xyz - pos));

                return normal;
            }

            void main() {
                vec4 bigWave = getBigWave(position.xyz);
                vec4 smallWave = getSmallWave(position.xyz);

                vec4 offset = bigWave + smallWave;
                vec4 transformPosition = modelMatrix * (position + offset);

                colorIntensity = smallWave.y / smallWaveAmplitude;
                normal = getNormal(position.xyz, spacing);
                viewPosition = transformPosition.xyz;
                foamUV = vec2(position.x / width, position.z / width);
                foamNoiseUV = vec2(foamSpeed * (elapsedMs / 1000.0) + (foamScale * position.x / width), foamScale * position.z / width);

                gl_Position = camera * transformPosition;
            }
        `;

        this.fragment = `
            precision mediump float;

            varying mediump float colorIntensity;
            varying mediump vec3 normal;
            varying mediump vec3 viewPosition;
            varying mediump vec2 foamUV;
            varying mediump vec2 foamNoiseUV;

            uniform vec4 lowColor;
            uniform vec4 highColor;
            uniform mediump vec3 cameraPosition;
            uniform sampler2D foamSampler;
            uniform sampler2D foamNoiseSampler;
            uniform mediump float foamAmount;

            void main() {
                float lightAngle = dot(normalize(cameraPosition - viewPosition), normal);

                vec4 foamSample = texture2D(foamSampler, foamUV);
                vec4 foamNoiseSample = texture2D(foamNoiseSampler, foamNoiseUV);

                float cutOff = 0.01;
                bool sparkle = lightAngle <= 0.0 && lightAngle >= -cutOff;

                float baseColorRatio = sparkle ? 0.1 : 1.0;
                float lightRatio = sparkle ? 1.0: 0.0;

                gl_FragColor = 
                    baseColorRatio * (colorIntensity * highColor + (1.0 - colorIntensity) * lowColor) + 
                    foamNoiseSample.r * foamAmount * foamSample +
                    lightRatio * vec4(1, 1, 1, 1);
            }
        `;
    }
}

export default SineShaderSource;