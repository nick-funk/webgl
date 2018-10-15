import GameLoop from './GameLoop';
import FlatShaderSource from '../Shaders/FlatShaderSource';
import WaveShaderSource from '../Shaders/WaveShaderSource';
import Shader from '../Shaders/Shader';
import TriangleRenderer from '../Renderers/TriangleRenderer';
import PerspectiveCamera from '../Cameras/PerspectiveCamera';

class SineShaderExample extends GameLoop
{
    constructor(canvas, refreshRateMs) {
        super(canvas, refreshRateMs);

        this.timer = 0;
        this.camera = null;
    }

    initialize() {
        var fieldOfView = 60.0 * Math.PI / 180.0;
        var cameraPosition = { x: 0, y: -1, z: -1.75 };
        this.camera = new PerspectiveCamera(
            cameraPosition,
            { x: 0.78, y: 0, z: 0 },
            this.canvas.width,
            this.canvas.height,
            fieldOfView
        );

        this.shader = new Shader(this.canvas.gl, new WaveShaderSource());

        this.vertices = [];

        var width = 2.0;
        var numVerts = 384;
        this.vertStep = width / numVerts;

        for (var x = -(width / 2); x <= (width / 2); x += this.vertStep) {
            for (var z = -(width / 2); z <= (width / 2); z += this.vertStep) {
                this.vertices.push(x);
                this.vertices.push(0);
                this.vertices.push(z);

                this.vertices.push(x);
                this.vertices.push(0);
                this.vertices.push(z + this.vertStep);

                this.vertices.push(x + this.vertStep);
                this.vertices.push(0);
                this.vertices.push(z);

                this.vertices.push(x + this.vertStep);
                this.vertices.push(0);
                this.vertices.push(z);

                this.vertices.push(x + this.vertStep);
                this.vertices.push(0);
                this.vertices.push(z + this.vertStep);

                this.vertices.push(x);
                this.vertices.push(0);
                this.vertices.push(z + this.vertStep);
            }
        }

        this.renderer = new TriangleRenderer();
    }

    update() {
        if (!this.running) {
            return;
        }

        this.canvas.clear();
        this.timer += this.refreshRateMs;
        
        this.drawWaves();

        setTimeout(() => this.update(), this.refreshRateMs);
    }

    drawWaves() {
        this.shader.activate();

        this.camera.apply(this.shader);

        this.shader.setFloat3(
            'cameraPosition', 
            [ this.camera.position.x, this.camera.position.y, this.camera.position.z ]
        );

        this.shader.setFloat3(
            'lightDirection',
            [ 0.5, -0.5, 0 ]
        );

        this.shader.setFloat('elapsedMs', this.timer);
        this.shader.setFloat('waveSpeed', 0.5);
        this.shader.setFloat('waveScale', 0.2);

        this.shader.setColor('depthColor', 20, 49, 67, 255);
        this.shader.setColor('surfaceColor', 83, 110, 107, 255);

        this.shader.setFloat('specularCoeff', 0.75);
        this.shader.setFloat('specularPower', 5.0);

        this.shader.setFloat('spacing', this.vertStep);

        this.renderer.run(
            this.shader,
            this.vertices,
            null,
            null,
            null,
            null,
            { x: 0, y: -0.5, z: 0 },
            { x: 0, y: 0.78, z: 0 }
        );
    }
}

export default SineShaderExample;