class Shader {
    constructor(gl, source) {
        this.gl = gl;
        this.source = source;

        this.createShaders();
        this.program = this.createProgram();
    }

    createShaders() {
        this.vertexShader = this.createShader(this.gl.VERTEX_SHADER, this.source.vertex);
        this.fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, this.source.fragment);
    }

    createShader(type, source) {
        var shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        var result = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
        if (result) {
            return shader;
        }

        console.warn(this.gl.getShaderInfoLog(shader));
        this.gl.deleteShader(shader);
    }

    createProgram() {
        var program = this.gl.createProgram();
        
        this.gl.attachShader(program, this.vertexShader);
        this.gl.attachShader(program, this.fragmentShader);
        this.gl.linkProgram(program);

        var result = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);
        if (result) {
            return program;
        }

        console.warn(this.gl.getProgramInfoLog(program));
        this.gl.deleteProgram(program);
    }

    activate() {
        this.gl.useProgram(this.program);
    }

    getLocation(name) {
        return this.gl.getUniformLocation(this.program, name);
    }

    setFloat(name, value) {
        var location = this.getLocation(name);
        this.gl.uniform1f(location, value);
    }

    setFloat4(name, value) {
        var location = this.getLocation(name);
        this.gl.uniform4fv(location, value);
    }

    setMatrix4(name, value) {
        var location = this.getLocation(name);
        this.gl.uniformMatrix4fv(location, false, value);
    }

    setFloatVertexAttribute(name, values, size) {
        var attributeLocation = this.gl.getAttribLocation(this.program, name);
        var buffer = this.gl.createBuffer();

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(values), this.gl.STATIC_DRAW);
        this.gl.enableVertexAttribArray(attributeLocation);

        var type = this.gl.FLOAT;
        var normalize = false;
        var stride = 0;
        var offset = 0;
        
        this.gl.vertexAttribPointer(
            attributeLocation, size, type, normalize, stride, offset
        );
    }
}

export default Shader;