// import { RendererPreInit, BrickRenderer } from './brick-renderer/index.mjs';

import { InitAuth0 } from './auth.mjs';
import * as StorageListener from './localStorage-listener.mjs';

function main() {
    InitAuth0();
    StorageListener.Init();

    // clear basket
    // localStorage.removeItem('basket');

//     await RendererPreInit();

//     const canvas = document.querySelectorAll('#webglviewer');
//     for (let i = 0; i < canvas.length; i++) {
//         const Renderer = new BrickRenderer(canvas[i]);
//     }
}

window.onload = main;
