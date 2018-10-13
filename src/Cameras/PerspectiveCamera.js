import m4 from '../contrib/m4';

class PerspectiveCamera {
    constructor(position, rotation, viewPortWidth, viewPortHeight, fieldOfView) {
        this.fieldOfView = fieldOfView;
        this.position = position;
        this.rotation = rotation;

        this.resize(viewPortWidth, viewPortHeight);
    }

    resize(viewPortWidth, viewPortHeight) {
        this.viewPortWidth = viewPortWidth;
        this.viewPortHeight = viewPortHeight;

        this._recalculate();
    }

    apply(shader) {
        shader.setMatrix4('camera', this.matrix);
    }

    _perspective() {
        return m4.perspective(
            this.fieldOfView,
            this.viewPortWidth / this.viewPortHeight,
            0.1,
            100
        );
    }

    _recalculate() {
        this.matrix = this._perspective();
        this.matrix = m4.xRotate(this.matrix, this.rotation.x);
        this.matrix = m4.yRotate(this.matrix, this.rotation.y);
        this.matrix = m4.zRotate(this.matrix, this.rotation.z);
        this.matrix = m4.translate(this.matrix, this.position.x, this.position.y, this.position.z);
    }
}

export default PerspectiveCamera;