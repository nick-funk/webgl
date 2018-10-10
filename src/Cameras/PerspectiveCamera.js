import m4 from '../contrib/m4';

class PerspectiveCamera {
    constructor(position, rotation, viewPortWidth, viewPortHeight, fieldOfView) {
        this.fieldOfView = fieldOfView;
        this.viewPortWidth = viewPortWidth;
        this.viewPortHeight = viewPortHeight;

        this.matrix = this.perspective();
        this.matrix = m4.xRotate(this.matrix, rotation.x);
        this.matrix = m4.yRotate(this.matrix, rotation.y);
        this.matrix = m4.zRotate(this.matrix, rotation.z);
        this.matrix = m4.translate(this.matrix, -position.x, -position.y, -position.z);
    }

    perspective() {
        return m4.perspective(
            this.fieldOfView,
            this.viewPortWidth / this.viewPortHeight,
            0.1,
            100
        );
    }

    apply(shader) {
        shader.setMatrix4('camera', this.matrix);
    }
}

export default PerspectiveCamera;