import { canvas, canvasBuffer as bufferCanvas, ctx, ctxBuffer } from "./bufferCanvasProvider";
import type { Operation } from "../operations/operation";
import { Painter as CanvasPainter } from "../Painter";
import type { Vector2 } from "../utils";


// so the problem is that, putImageData, doesn't blend alpha channel, and just replaces each pixel with pixel of next layer
export class Layer { 
    static count: number = 0;
    id: number;

    ctx : CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;

    bufferCtx: CanvasRenderingContext2D;
    bufferCanvas: HTMLCanvasElement;

    visible = true;

    painter: CanvasPainter;
    bufferPainter: CanvasPainter;

    origin: Vector2;
    size: Vector2;


    operations: Array<Operation> = [];
    currentOperation: Operation;

    name = "Warstwa obrazu";

    controlPressed = false;
    lastMouseEvent : MouseEvent;

    imageData: ImageData;


    constructor(size: Vector2, origin: Vector2) {
        this.id = Layer.count;
        Layer.count++;

        this.ctx = ctx;
        this.canvas = canvas;

        this.bufferCanvas = bufferCanvas;
        this.bufferCtx  = ctxBuffer;

        this.painter = new CanvasPainter(this.canvas);
        this.bufferPainter = new CanvasPainter(this.bufferCanvas);

        this.size = size;
        this.origin = origin;
    }


    drawCurrentOperation() {
        if(this.currentOperation) {
            this.currentOperation.draw(this.painter);
        }
    }

    saveGeneratedImage() {
        this.imageData = this.bufferCtx.getImageData(0,0, this.bufferCanvas.width, this.bufferCanvas.height);
    }


    lazyGenerateImage() {
        this.bufferCtx.clearRect(0,0, this.canvas.width, this.canvas.height);
        this.bufferCtx.putImageData(this.imageData, 0,0);
        this.saveGeneratedImage();
    }

    generateImage() {
        this.bufferCtx.clearRect(0,0, this.canvas.width, this.canvas.height);
        this.operations.forEach(el => {
            if(el) {
                el.draw(this.bufferPainter);
            }
        });

        this.saveGeneratedImage();
    }
}


