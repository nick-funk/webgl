import WaveShaderSource from '../Shaders/WaveShaderSource';
import Shader from '../Shaders/Shader';
import TriangleRenderer from '../Renderers/TriangleRenderer';
import PerspectiveCamera from '../Cameras/PerspectiveCamera';

class SineShaderExample
{
    constructor(canvas, refreshRateMs) {
        this.canvas = canvas;
        this.refreshRateMs = refreshRateMs;

        this.running = false;
        this.timer = 0;
    }

    initialize() {
        this.shader = new Shader(this.canvas.gl, new WaveShaderSource());
        this.shader.activate();

        var fieldOfView = 60.0 * Math.PI / 180.0;
        this.camera = new PerspectiveCamera(
            { x: 0, y: 0, z: 2 },
            this.canvas.width,
            this.canvas.height,
            fieldOfView
        );

        this.vertices = [];

        var step = 0.05;
        for (var x = 0; x <= 1; x += step) {
            for (var z = 0; z <= 1; z += step) {
                this.vertices.push(x);
                this.vertices.push(0);
                this.vertices.push(z);

                this.vertices.push(x);
                this.vertices.push(0);
                this.vertices.push(z + step);

                this.vertices.push(x + step);
                this.vertices.push(0);
                this.vertices.push(z);

                this.vertices.push(x + step);
                this.vertices.push(0);
                this.vertices.push(z);

                this.vertices.push(x + step);
                this.vertices.push(0);
                this.vertices.push(z + step);

                this.vertices.push(x);
                this.vertices.push(0);
                this.vertices.push(z + step);
            }
        }

        this.noiseTextureUrl = 'textures/PerlinNoise.png';
        var texture = this.shader.loadTexture(this.noiseTextureUrl, false);
        this.shader.setTexture2D(0, 'noiseSampler', texture);

        this.renderer = new TriangleRenderer();
    }

    run() {
        this.running = true;
        this.update();
    }

    stop() {
        this.running = false;
    }

    update() {
        if (!this.running) {
            return;
        }

        this.canvas.clear();
        this.camera.apply(this.shader);

        this.timer += 30;

        this.shader.setFloat('elapsedMs', this.timer);
        this.shader.setFloat('bigWaveSpeed', 0.75);
        this.shader.setFloat('bigWaveAmplitude', 0.15);
        this.shader.setFloat('smallWaveSpeed', 0.05);
        this.shader.setFloat('smallWaveAmplitude', 0.05);
        this.shader.setFloat('width', 1);

        this.shader.setColor('lowColor', 1, 17, 26, 255);
        this.shader.setColor('highColor', 67, 215, 237, 255);

        this.renderer.run(
            this.shader,
            this.vertices,
            null,
            null,
            null,
            null,
            { x: -0.75, y: -0.5, z: 0 },
            { x: 0, y: 0.78, z: 0 }
        );

        setTimeout(() => this.update(), this.refreshRateMs);
    }
}

export default SineShaderExample;