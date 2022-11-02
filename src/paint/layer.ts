import { canvas, canvasBuffer as bufferCanvas, ctx, ctxBuffer } from "./bufferCanvasProvider";
import type { Operation } from "../operations/operation";
import { Painter as CanvasPainter } from "../Painter";
import type { Vector2 } from "../utils";

//TODO JEST BARDZO DUZY PROBLEM Z WARSTAWMI, JESLI DAJEMY PUTIMAGE, I SKURWIEL MA PUSTE PIKSELE TO ONE NADPISZA WSZYSTKO CO JEST NA DOLNEJ WARSTWIE
//TRZEBA JAKAS FUNKCJE NAPISAC OD RAZU DO BLENDOWANIA WARSTW, CZY KI CHUJ


export class Layer { 
    static count: number = 0;
    id: number;

    ctx : CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;

    bufferCtx: CanvasRenderingContext2D;
    bufferCanvas: HTMLCanvasElement;

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
        console.log("saving current layer content...");
        this.imageData = this.bufferCtx.getImageData(0,0, this.bufferCanvas.width, this.bufferCanvas.height);
    }

    generateImage() {
        this.bufferCtx.clearRect(0,0, this.canvas.width, this.canvas.height);
        this.operations.forEach(el => {
            el.draw(this.bufferPainter);
        });
        this.saveGeneratedImage();
    }
}


