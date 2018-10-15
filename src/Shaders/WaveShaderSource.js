class SineShaderSource {
    constructor() {
        this.vertex = `
            precision highp float;

            attribute vec4 position;
            attribute vec4 color;

            uniform mat4 camera;
            uniform mat4 modelMatrix;
            uniform float spacing;
            uniform float elapsedMs;
            uniform float waveSpeed;
            uniform float waveScale;

            varying vec3 normal;
            varying vec3 viewPosition;
            varying float depth;

            float noiseHash(vec2 pos, vec2 seed) {
                float hash = dot(pos, seed);	
                return fract(sin(hash) * 988776.655443);
            }

            float noise(vec2 p, vec2 seed) {
                vec2 i = floor(p);
                vec2 f = fract(p);	
                vec2 u = f * f * (3.0 - 2.0 * f);
                return -1.0 + 2.0 * 
                    mix(
                        mix(noiseHash(i + vec2(0.0, 0.0), seed), 
                            noiseHash(i + vec2(1.0, 0.0), seed), 
                            u.x),
                        mix(noiseHash(i + vec2(0.0, 1.0), seed), 
                            noiseHash(i + vec2(1.0, 1.0), seed), 
                            u.x), 
                    u.y);
            }

            float computeNoise(vec3 pos, vec2 dir, vec2 seed, float time, float speed, float sampleScale, float heightScale) {
                vec2 coords = vec2(
                    dir.x * sampleScale * (pos.x + time * speed),
                    dir.y * sampleScale * (pos.z + time * speed)
                );

                float sample = noise(coords, seed);
                return heightScale * sample;
            }

            float layerNoise8(vec3 pos, vec2 dir, vec2 seed, float scale, float speed) {
                float time = elapsedMs / 1000.0;
                float height = 0.0;
                float sampleScale = 1.0;
                float heightScale = 1.0;

                for (int i = 0; i < 8; i++) {
                    float sample = computeNoise(pos, dir, seed, time, speed, sampleScale, heightScale);
                    height += sample;

                    sampleScale *= scale;
                    heightScale /= scale;
                }

                return height;
            }

            float layerNoise3(vec3 pos, vec2 dir, vec2 seed, float scale, float speed) {
                float time = elapsedMs / 1000.0;
                float height = 0.0;
                float sampleScale = 1.0;
                float heightScale = 1.0;

                for (int i = 0; i < 3; i++) {
                    float sample = computeNoise(pos, dir, seed, time, speed, sampleScale, heightScale);
                    height += sample;

                    sampleScale *= scale;
                    heightScale /= scale;
                }

                return height;
            }

            float getHeight(vec3 pos) {
                vec2 detailSeed = vec2(74.2, 431.2);
                float detailHeight = 0.5 * layerNoise8(pos, vec2(-1.0, -1.0), detailSeed, 2.0, waveSpeed / 4.0);

                vec2 grossSeed = vec2(191.5, 1337.0);
                float grossHeight = 0.5 * layerNoise3(pos, vec2(-1.0, -1.0), grossSeed, 1.5, waveSpeed);

                return grossHeight + detailHeight;
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
                depth = height - position.y;

                gl_Position = camera * adjustedPosition;
            }
        `;

        this.fragment = `
            precision highp float;

            varying vec3 normal;
            varying vec3 viewPosition;
            varying float depth;

            uniform vec4 depthColor;
            uniform vec4 surfaceColor;
            uniform vec3 cameraPosition;
            uniform vec3 lightDirection;
            uniform float specularCoeff;
            uniform float specularPower;

            float specular(float specularCoeff, float shininess, vec3 normal, vec3 light) {
                vec3 viewRay = normalize(cameraPosition - viewPosition);
                vec3 reflectedRay = 2.0 * dot(light, normal) * normal - light;

                float specular = specularCoeff * pow(dot(reflectedRay, viewRay), shininess);

                return clamp(specular, 0.0, 9999.9);
            }

            float diffuse(vec3 norm, vec3 light, float power) {
                return pow(dot(light, norm), power);
            }

            vec3 reflection(vec3 cameraPos, vec3 norm) {
                float refl = max(reflect(cameraPos, norm).y, 0.0);
                float intensity = pow(1.0 - refl, 3.0);

                return vec3(intensity, intensity, intensity);
            }

            float fresnel(vec3 pos, vec3 camera, vec3 norm) {
                vec3 viewRay = camera - pos;
                float fresnel = clamp(1.0 - dot(norm, viewRay), 0.0, 1.0);
                fresnel = pow(fresnel, 3.0) * 0.5;

                return fresnel;
            }

            vec4 computeColor(vec3 pos, vec3 norm, vec3 light, vec3 cameraPos) {
                float fresnel = fresnel(pos, cameraPos, norm);

                vec3 reflected = reflection(cameraPos, norm);
                vec3 diff = depthColor.rgb + diffuse(norm, light, 5.0) * surfaceColor.rgb * 0.4;

                vec3 color = mix(diff, reflected, fresnel);

                float specularAmount = specular(specularCoeff, specularPower, norm, light);
                vec3 specular = 0.75 * specularAmount * vec3(1.0, 1.0, 1.0);

                float alpha = 1.0;

                return vec4(color.r, color.g, color.b, alpha) + vec4(specular.r, specular.g, specular.b, alpha);
            }

            void main() {
                vec3 light = normalize(lightDirection);
                gl_FragColor = computeColor(viewPosition, normal, light, cameraPosition);
            }
        `;
    }
}

export default SineShaderSource;