import GameLoop from './GameLoop';
import TexturedShaderSource from '../Shaders/TexturedShaderSource';
import Shader from '../Shaders/Shader';
import TriangleRenderer from '../Renderers/TriangleRenderer';
import PerspectiveCamera from '../Cameras/PerspectiveCamera';

class TexturedShaderExample extends GameLoop
{
    constructor(canvas, refreshRateMs) {
        super(canvas, refreshRateMs);

        this.rotationAngle = 0;
    }

    initialize() {
        this.shader = new Shader(this.canvas.gl, new TexturedShaderSource());
        this.shader.activate();

        var fieldOfView = 60.0 * Math.PI / 180.0;
        this.camera = new PerspectiveCamera(
            { x: 0, y: 0, z: -2 },
            { x: 0, y: 0, z: 0 },
            this.canvas.width,
            this.canvas.height,
            fieldOfView
        );

        this.vertices = [
            -0.5, 0, 0,
            -0.5, 1, 0,
            0.5, 0, 0,
            0.5, 0, 0,
            0.5, 1, 0,
            -0.5, 1, 0
        ];

        this.colors = [
            1, 0, 0, 1,
            0, 1, 0, 1,
            0, 0, 1, 1,
            1, 0, 0, 1,
            0, 0, 0, 1,
            0, 0, 1, 1
        ];

        this.uvs = [
            0, 1,
            0, 0,
            1, 1,
            1, 1,
            1, 0,
            0, 0
        ];

        this.textureUrl = 'textures/Profile.png';
        var texture = this.shader.loadTexture(this.textureUrl);
        this.shader.setTexture2D(0, 'textureSampler', texture);

        this.renderer = new TriangleRenderer();
    }

    update() {
        if (!this.running) {
            return;
        }

        this.canvas.clear();
        this.camera.apply(this.shader);
        this.renderer.run(
            this.shader, 
            this.vertices,
            this.uvs,
            null,
            null,
            null,
            { x: 0, y: -0.5, z: 0 },
            { x: 0, y: this.rotationAngle, z: 0 }
        );

        this.rotationAngle += 0.01;

        setTimeout(() => this.update(), this.refreshRateMs);
    }
}

export default TexturedShaderExample;