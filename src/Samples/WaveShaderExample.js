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
        var cameraPosition = { x: 0, y: -1, z: -2 };
        this.camera = new PerspectiveCamera(
            cameraPosition,
            { x: 0.78, y: 0, z: 0 },
            this.canvas.width,
            this.canvas.height,
            fieldOfView
        );

        this.shader.setFloat3(
            'cameraPosition', 
            [ cameraPosition.x, cameraPosition.y, cameraPosition.z ]
        );

        this.shader.setFloat3(
            'lightPosition',
            [ 0, 2, -1 ]
        );

        this.vertices = [];

        var step = 0.05;
        for (var x = -1; x <= 2; x += step) {
            for (var z = -1; z <= 2; z += step) {
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

        this.shader.setFloat('spacing', step);

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
        this.shader.setFloat('waveSpeed', 0.25);
        this.shader.setFloat('waveScale', 0.2);

        this.shader.setColor('depthColor', 33, 93, 129, 255);
        this.shader.setColor('surfaceColor', 95, 158, 160, 255);

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