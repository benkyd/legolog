import { RendererPreInit, BrickRenderer } from './brick-renderer/index.mjs';

async function main() {
    await RendererPreInit();

    const canvas = document.querySelectorAll('#webglviewer');
    for (let i = 0; i < canvas.length; i++) {
        const Renderer = new BrickRenderer(canvas[i]);
    }
}

window.onload = main;
