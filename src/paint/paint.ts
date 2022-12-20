import { DrawingMode } from "../drawingMode";
import { BucketHandler } from "../handlers/bucketHandler";
import { CircleHandler } from "../handlers/circleHandler";
import { DrawingHandler } from "../handlers/drawingHandler";
import { LineHandler } from "../handlers/lineHandler";
import type { OperationHandler } from "../handlers/operationHandler";
import { RectHandler } from "../handlers/rectHandler";
import { Layer } from "../paint/layer";
import { MouseTransformer, Vector2 } from "../utils";
import {
	canvas,
	canvasBuffer,
	ctx,
	ctxBuffer,
	guiLayer,
} from "./bufferCanvasProvider";
import { SelectorHandler } from "../handlers/selectorHandler";

export class ToolBox {
	thickness = 2.0;
	fill = false;
	color = "black";
}

export class Paint {
	layers: Array<Layer> = [];
	selectedLayer: Layer;

	lastMousePos: Vector2;

	ctx: CanvasRenderingContext2D;
	canvas: HTMLCanvasElement;
	handler: OperationHandler;

	localCopiedImage: ImageData;

	moveHandler: (e: MouseEvent) => void;
	pressHandler: (e: MouseEvent) => void;
	releaseHandler: (e: MouseEvent) => void;

	controlPressed = false;
	shiftPressed = false;
	preferLocalOverExternal = true;

	async onPaste(e: ClipboardEvent) {
		let items = e.clipboardData.items;

		if (this.localCopiedImage && this.preferLocalOverExternal) {
            console.log(this.localCopiedImage);
			this.selectedLayer.pasteImg(this.localCopiedImage);
			return;
		}
		for (let index in items) {
			if (items[index].kind === "file") {
				let blob = items[index].getAsFile();
				let bitmap = await createImageBitmap(blob);

				let canvas = document.createElement("canvas");
				canvas.setAttribute("width", bitmap.width + "px");
				canvas.setAttribute("height", bitmap.height + "px");
				canvas.setAttribute("style", "visibility: none");

				let context = canvas.getContext("2d");
				context.drawImage(bitmap, 0, 0);

				let imageData = context.getImageData(0, 0, bitmap.width, bitmap.height);

				canvas.remove();

				if (this.selectedLayer) {
					this.selectedLayer.pasteImg(imageData);
				}
			}
		}
	}

	constructor() {
		this.canvas = canvas;
		this.ctx = ctx;

		this.selectedLayer = new Layer(
			new Vector2(this.canvas.width, this.canvas.height),
			new Vector2(0, 0)
		);

		this.handler = new DrawingHandler(this);
		this.handler.layer = this.selectedLayer;
		this.layers.push(this.selectedLayer);

		this.releaseHandler = (e: MouseEvent) => {
			this.handler.onRelease(e);
		};

		this.moveHandler = (e: MouseEvent) => {
			const transformer = new MouseTransformer("canvas");
			this.selectedLayer.lastMouseEvent = transformer.transform(e);
			this.handler.onMove(e);
		};
		this.pressHandler = (e: MouseEvent) => {
			this.handler.onPress(e);
		};

		guiLayer.addEventListener("mousemove", this.moveHandler);
		guiLayer.addEventListener("mousedown", this.pressHandler);
		guiLayer.addEventListener("mouseup", this.releaseHandler);
		window.addEventListener("keydown", this.handleKeyDown.bind(this));
		window.addEventListener("keyup", this.handleKeyUp.bind(this));
	}

	provideHandler(mode: DrawingMode) {
		const map = new Map<DrawingMode, OperationHandler>();
		map[DrawingMode.BRUSH] = new DrawingHandler(this);
		map[DrawingMode.RECTANGLE] = new RectHandler(this);
		map[DrawingMode.LINE] = new LineHandler(this);
		map[DrawingMode.CIRLCE] = new CircleHandler(this);
		map[DrawingMode.BUCKET] = new BucketHandler(this);
		map[DrawingMode.SELECT] = new SelectorHandler(this, false);
		map[DrawingMode.CUTTER] = new SelectorHandler(this, true);

		return map[mode];
	}

	setDrawingMode(mode: DrawingMode) {
		const thickness = this.handler.thickness;
		const fill = this.handler.fill;
		const color = this.handler.color;

        this.onToolChange();
		this.handler = this.provideHandler(mode);
		this.handler.paint = this;
		this.handler.fill = fill;
		this.handler.color = color;
		this.handler.layer = this.selectedLayer;
		this.handler.thickness = thickness;
	}

	async handleKeyDown(e: KeyboardEvent) {
		if (e.key === "Control") {
			this.controlPressed = true;
		} else if (e.key === "Shift") {
			this.handler.proportional = true;
		} else if (e.key.toUpperCase() === "Z" && this.controlPressed) {
			this.selectedLayer.operations.pop();
			this.selectedLayer.generateImage();
			this.createCanvas();
		} else if (e.key.toUpperCase() === "S" && this.controlPressed) {
			e.preventDefault();
			const dummy = document.getElementById("dummy");
			const data = this.canvas
				.toDataURL("image/png")
				.replace("image/png", "image/octet-stream");
			dummy.setAttribute("href", data);
			dummy.setAttribute("download", "image.png");
			dummy.click();
		} else if(e.key.toUpperCase() === "C" && this.controlPressed) {
            if(this.selectedLayer.selectionStart) {
                this.selectedLayer.loadOntoBuffer();
                let bufferCtx : CanvasRenderingContext2D = ctxBuffer;
                
                let diff = this.selectedLayer.selectionEnd.sub(this.selectedLayer.selectionStart);
                this.localCopiedImage = bufferCtx.getImageData(
                    this.selectedLayer.selectionStart.x, this.selectedLayer.selectionStart.y,
                    diff.x, diff.y
                )
            } 
        }
	}

    onToolChange() {
        if(this.selectedLayer) {
            this.selectedLayer.selectionStart = null;
            this.selectedLayer.selectionEnd = null;
        }
    }

	handleKeyUp(e: KeyboardEvent) {
		console.log(e.key, "Key released");
		if (e.key === "Control") {
			this.controlPressed = false;
		}
		if (e.key === "Shift") {
			this.handler.proportional = false;
		}
	}

	blendImageData(imageData: ImageData) {
		const ctxImageData = this.ctx.getImageData(
			0,
			0,
			this.canvas.width,
			this.canvas.height
		);

		for (let i = 0; i < ctxImageData.data.length; i += 4) {
			if (ctxImageData.data[i + 3] === 0) {
				ctxImageData.data[i] = imageData.data[i];
				ctxImageData.data[i + 1] = imageData.data[i + 1];
				ctxImageData.data[i + 2] = imageData.data[i + 2];
				ctxImageData.data[i + 3] = imageData.data[i + 3];
			}
		}

		this.ctx.putImageData(ctxImageData, 0, 0);
	}

	createCanvas() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		for (let layer of this.layers) {
			if (layer === this.selectedLayer) {
				let data = ctxBuffer.getImageData(
					0,
					0,
					canvasBuffer.width,
					canvasBuffer.height
				);
				this.blendImageData(data);
			} else if (layer.imageData) {
				this.blendImageData(layer.imageData);
			}
		}
	}
}
