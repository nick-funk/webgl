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

    loadTexture(url, clamped = true) {
        var gl = this.gl;

        var texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

        var level = 0;
        var internalFormat = this.gl.RGBA;
        var width = 1;
        var height = 1;
        var border = 0;
        var sourceFormat = this.gl.RGBA;
        var sourceType = this.gl.UNSIGNED_BYTE;
        var pixel = new Uint8Array([ 0, 0, 255, 255 ]);

        this.gl.texImage2D(this.gl.TEXTURE_2D, level, internalFormat, width, height, border, sourceFormat, sourceType, pixel);

        var image = new Image();
        image.onload = () => {
            this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
            this.gl.texImage2D(this.gl.TEXTURE_2D, level, internalFormat, sourceFormat, sourceType, image);

            if (clamped) {
                if (this.isPowerOf2(image.width) && this.isPowerOf2(image.height)) {
                    this.gl.generateMipmap(this.gl.TEXTURE_2D);
                }
                else {
                    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
                    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
                    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
                }
            }
            else {
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.MIRRORED_REPEAT);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.MIRRORED_REPEAT);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
            }
        };
        image.src = url;

        return texture;
    }

    isPowerOf2(value) {
        return (value & (value - 1) == 0);
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

    setFloat2(name, value) {
        var location = this.getLocation(name);
        this.gl.uniform2fv(location, value);
    }

    setFloat3(name, value) {
        var location = this.getLocation(name);
        this.gl.uniform3fv(location, value);
    }

    setFloat4(name, value) {
        var location = this.getLocation(name);
        this.gl.uniform4fv(location, value);
    }

    setColor(name, r, g, b, a) {
        this.setFloat4(name, [ r / 255, g / 255, b / 255, a / 255 ]);
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

    setTexture2D(textureUnit, samplerName, texture) {
        var target = this.getTextureTarget(textureUnit);

        var sampler = this.gl.getUniformLocation(this.program, samplerName);

        this.gl.activeTexture(target);
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.uniform1i(sampler, textureUnit);
    }

    getTextureTarget(textureUnit) {
        switch(textureUnit) {
            case 0:
                return this.gl.TEXTURE0;
            case 1:
                return this.gl.TEXTURE1;
            case 2:
                return this.gl.TEXTURE2;
            case 3:
                return this.gl.TEXTURE3;
            case 4:
                return this.gl.TEXTURE4;
            default:
                return null;
        }
    }
}

export default Shader;