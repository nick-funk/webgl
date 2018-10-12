class SineShaderSource {
    constructor() {
        this.vertex = `
            attribute vec4 position;
            attribute vec4 color;

            uniform mat4 camera;
            uniform mat4 modelMatrix;
            uniform float spacing;
            uniform mediump float elapsedMs;
            uniform mediump float waveSpeed;
            uniform mediump float waveScale;

            varying mediump vec3 normal;
            varying mediump vec3 viewPosition;
            varying mediump float depth;

            float noiseHash(vec2 pos) {
                float hash = dot(pos, vec2(127.1, 311.7));	
                return fract(sin(hash) * 43758.5453123);
            }

            float noise(vec2 p) {
                vec2 i = floor(p);
                vec2 f = fract(p);	
                vec2 u = f * f * (3.0 - 2.0 * f);
                return -1.0 + 2.0 * 
                    mix(
                        mix(noiseHash(i + vec2(0.0, 0.0)), 
                            noiseHash(i + vec2(1.0, 0.0)), 
                            u.x),
                        mix(noiseHash(i + vec2(0.0, 1.0)), 
                            noiseHash(i + vec2(1.0, 1.0)), 
                            u.x), 
                    u.y);
            }

            float getHeight(vec3 pos) {
                float time = elapsedMs / 1000.0;
                float height = 0.0;
                float sampleScale = 1.0;
                float heightScale = 1.0;

                for (int i = 0; i < 8; i++) {
                    vec2 coords = vec2(
                        sampleScale * (pos.x + time * waveSpeed),
                        sampleScale * (pos.z + time * waveSpeed)
                    );
                    float sample = noise(coords);
                    height += heightScale * sample;

                    sampleScale *= 2.0;
                    heightScale /= 2.0;
                }

                return height;
            }

            void main() {
                float rawHeight = getHeight(position.xyz);
                float height = waveScale * rawHeight;
                float leftHeight = waveScale * getHeight(vec3(position.x + spacing, position.y, position.z));
                float rightHeight = waveScale * getHeight(vec3(position.x, position.y, position.z + spacing));

                vec4 adjustedPosition = modelMatrix * vec4(position.x, position.y + height, position.z, position.w);
                vec4 leftPosition = modelMatrix * vec4(position.x + spacing, position.y + leftHeight, position.z, position.w);
                vec4 rightPosition = modelMatrix * vec4(position.x, position.y + rightHeight, position.z + spacing, position.w);
                
                vec3 rawNormal = cross(
                    leftPosition.xyz - adjustedPosition.xyz,
                    rightPosition.xyz - adjustedPosition.xyz
                );

                normal = normalize(rawNormal);
                viewPosition = adjustedPosition.xyz;
                depth = rawHeight / 2.0;

                gl_Position = camera * adjustedPosition;
            }
        `;

        this.fragment = `
            precision mediump float;

            varying mediump vec3 normal;
            varying mediump vec3 viewPosition;
            varying mediump float depth;

            uniform vec4 depthColor;
            uniform vec4 surfaceColor;
            uniform mediump vec3 cameraPosition;
            uniform vec3 lightPosition;

            float specularAmount(float specularCoeff, float shininess) {
                vec3 viewRay = normalize(cameraPosition - viewPosition);
                vec3 lightRay = normalize(lightPosition - viewPosition);
                vec3 reflectedRay = (2.0 * dot(lightRay, viewRay) * normal) - lightRay;

                float specular = specularCoeff * pow(dot(reflectedRay, viewRay), shininess);

                return clamp(specular, 0.0, 9999.9);
            }

            void main() {
                float specularAmount = specularAmount(0.6, 0.99);

                gl_FragColor =
                    (depth * surfaceColor + (1.0 - depth) * depthColor) +
                    specularAmount * vec4(1, 1, 1, 1);
            }
        `;
    }
}

export default SineShaderSource;