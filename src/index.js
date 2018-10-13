import GraphicsCanvas from './GraphicsCanvas/GraphicsCanvas';

import FlatShaderExample from './Samples/FlatShaderExample';
import TexturedShaderExample from './Samples/TexturedShaderExample';
import WaveShaderExample from './Samples/WaveShaderExample';

import './index.less';

var currentProgram = null;

function killProgram() {
    if (currentProgram !== null && currentProgram !== undefined) {
        currentProgram.stop();
    }
}

function main() {
    var canvas = new GraphicsCanvas();

    document.body.appendChild(canvas.root);

    var flatShaderButton = document.createElement('div');
    flatShaderButton.classList.add('button');
    flatShaderButton.innerHTML = "Flat";
    flatShaderButton.addEventListener('click', () => {
        killProgram();

        currentProgram = new FlatShaderExample(canvas, 30);
        currentProgram.initialize();
        currentProgram.run();
    });

    var texturedShaderButton = document.createElement('div');
    texturedShaderButton.classList.add('button');
    texturedShaderButton.innerHTML = "Textured";
    texturedShaderButton.addEventListener('click', () => {
        killProgram();

        currentProgram = new TexturedShaderExample(canvas, 30);
        currentProgram.initialize();
        currentProgram.run();
    });

    var waveShaderButton = document.createElement('div');
    waveShaderButton.classList.add('button');
    waveShaderButton.innerHTML = "Wave";
    waveShaderButton.addEventListener('click', () => {
        killProgram();

        currentProgram = new WaveShaderExample(canvas, 24);
        currentProgram.initialize();
        currentProgram.run();
    });

    var controlPanel = document.createElement('div');
    controlPanel.classList.add('control-panel');

    controlPanel.appendChild(flatShaderButton);
    controlPanel.appendChild(texturedShaderButton);
    controlPanel.appendChild(waveShaderButton);

    document.body.appendChild(controlPanel);
}

window.addEventListener('load', () => {
    main();
});