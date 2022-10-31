import type { Operation } from "./operation";
import { Painter } from "./Painter";
import type { Vector2 } from "./utils";

export class Layer { 
    ctx : CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    painter: Painter;

    name = "Warstwa obrazu";

    controlPressed = false;
    lastMouseEvent : MouseEvent;
    operations: Array<Operation> = [];
    currentOperation: Operation;

    origin: Vector2;
    size: Vector2;

    imageData: ImageData;


    constructor(size: Vector2, origin: Vector2, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.size = size;
        this.origin = origin;

        this.painter = new Painter();
        this.painter.ctx = this.ctx;
        this.painter.canvas = this.canvas;
    }


    drawCurrentOperation() {
        this.loadGeneratedImage();
        if(this.currentOperation) {
            this.currentOperation.draw(this.painter);
        }
    }

    loadGeneratedImage() {
        this.ctx.putImageData(this.imageData, 0, 0);
    }

    saveGeneratedImage() {
        this.imageData = this.ctx.getImageData(0,0, this.canvas.width, this.canvas.height);
    }

    generateImage() {
        this.ctx.clearRect(
            0,0, this.canvas.width, this.canvas.height
        )

        this.operations.forEach(el => {
            el.draw(this.painter);
        });
        
        this.saveGeneratedImage();
        
    }
}


