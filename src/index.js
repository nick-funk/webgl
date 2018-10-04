import GraphicsCanvas from './GraphicsCanvas/GraphicsCanvas';

import './index.less';
import FlatShaderExample from './Samples/FlatShaderExample';

function main() {
    var width = 640;
    var height = 480;
    var canvas = new GraphicsCanvas(width, height);

    document.body.appendChild(canvas.root);

    var flatShaderButton = document.createElement('div');
    flatShaderButton.classList.add('button');
    flatShaderButton.innerHTML = "Flat Shader";

    document.body.appendChild(flatShaderButton);

    flatShaderButton.addEventListener('click', () => {
        var task = new FlatShaderExample(canvas, 30);
        task.initialize();
        task.run();
    });
}

window.addEventListener('load', () => {
    main();
});