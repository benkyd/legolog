import { RendererPreInit, BrickRenderer } from './brick-renderer/index.mjs';

async function main() {
    await RendererPreInit();

    const canvas = document.querySelector('#webglviewer');
    const Renderer = new BrickRenderer(canvas);
}

window.onload = main;
