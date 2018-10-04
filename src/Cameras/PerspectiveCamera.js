import m4 from '../contrib/m4';

class PerspectiveCamera {
    constructor(position, viewPortWidth, viewPortHeight, fieldOfView) {
        this.matrix = m4.perspective(
            fieldOfView,
            viewPortWidth / viewPortHeight,
            1,
            100
        );

        this.matrix = m4.translate(this.matrix, -position.x, -position.y, -position.z);
    }

    apply(shader) {
        shader.setMatrix4('camera', this.matrix);
    }
}

export default PerspectiveCamera;