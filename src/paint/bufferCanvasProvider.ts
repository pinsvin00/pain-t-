export let canvasBuffer: HTMLCanvasElement;
export let ctxBuffer;
export let canvas: HTMLCanvasElement;
export let ctx;
export let guiLayer: HTMLElement;

export const loadCanvasData = () => {
	canvasBuffer = document.getElementById("buffer-canvas") as HTMLCanvasElement;
	ctxBuffer = canvasBuffer.getContext("2d");
	canvas = document.getElementById("canvas") as HTMLCanvasElement;
	ctx = canvas.getContext("2d");
	guiLayer = document.getElementById("gui-layer");
};
