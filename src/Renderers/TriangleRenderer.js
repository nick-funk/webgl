import m4 from '../contrib/m4';

class TriangleRenderer {
    run(shader, vertices, colors, baseColor, translation, rotation) {
        var gl = shader.gl;

        this.applyRotation(shader, translation, rotation);

        // color
        shader.setFloat4("baseColor", [ baseColor.r, baseColor.g, baseColor.b, baseColor.a ]);
        shader.setFloat('baseColorRatio', 0.5);

        shader.setFloatVertexAttribute('position', vertices, 3);
        shader.setFloatVertexAttribute('color', colors, 4);

        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = vertices.length / 3;

        gl.drawArrays(primitiveType, offset, count);
    }

    applyRotation(shader, translation, rotation) {
        var identityMatrix = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];

        var rotationMatrix = m4.zRotate(m4.yRotate(m4.xRotate(identityMatrix, rotation.x), rotation.y), rotation.z);
        var translateMatrix = m4.translate(identityMatrix, translation.x, translation.y, translation.z);
        var modelMatrix = m4.multiply(translateMatrix, rotationMatrix);

        shader.setMatrix4('modelMatrix', modelMatrix);
    }
}

export default TriangleRenderer;