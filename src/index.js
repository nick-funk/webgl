import GraphicsCanvas from './GraphicsCanvas/GraphicsCanvas';

import './index.less';
import FlatShaderExample from './Samples/FlatShaderExample';

var currentProgram = null;

function killProgram() {
    if (currentProgram !== null && currentProgram !== undefined) {
        currentProgram.stop();
    }
}

function main() {
    var width = 640;
    var height = 480;
    var canvas = new GraphicsCanvas(width, height);

    var canvasContainer = document.createElement('div');
    canvasContainer.classList.add('canvas-container');
    canvasContainer.appendChild(canvas.root);
    canvasContainer.style.height = `${height}px`;

    document.body.appendChild(canvasContainer);

    var flatShaderButton = document.createElement('div');
    flatShaderButton.classList.add('button');
    flatShaderButton.innerHTML = "Flat Shader";

    flatShaderButton.addEventListener('click', () => {
        killProgram();

        currentProgram = new FlatShaderExample(canvas, 30);
        currentProgram.initialize();
        currentProgram.run();
    });

    var controlPanel = document.createElement('div');
    controlPanel.classList.add('control-panel');
    controlPanel.style.width = `${width}px`;
    controlPanel.style.left = `calc(50% - ${width / 2}px)`;

    controlPanel.appendChild(flatShaderButton);

    var controlContainer = document.createElement('div');
    controlContainer.classList.add('control-container');
    controlContainer.appendChild(controlPanel);

    document.body.appendChild(controlContainer);
}

window.addEventListener('load', () => {
    main();
});