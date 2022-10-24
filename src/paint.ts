import { DrawingMode } from "./drawingMode";
import { DrawingHandler } from "./handlers/drawingHandler";
import type { OperationHandler } from "./handlers/operationHandler";
import type { Operation } from "./operation";
import { MouseTransformer, Vector2 } from "./utils";

export class Painter {
    ctx: CanvasRenderingContext2D;
    color = 'black';

    circle(pos: Vector2, radius: number, fill = true) {
        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        this.ctx.stroke();
    }

    line(start: Vector2, end: Vector2, thickness: number) {
        this.ctx.beginPath();
        this.ctx.moveTo(start.x, start.y);
        this.ctx.fillStyle = this.color;
        this.ctx.lineTo(end.x, end.y);
        this.ctx.stroke();
    }

}



export class Paint { 
    canvas  : HTMLCanvasElement;
    ctx : CanvasRenderingContext2D;
    mouseTransformer : MouseTransformer;
    paint: Painter;

    mode : DrawingMode;

    controlPressed = false;


    lastMouseEvent : MouseEvent;
    operations: Array<Operation> = [];

    handler: OperationHandler;



    render() {
        this.operations.forEach(el => {
            el.draw(this.paint);
        });
    }


    getDrawingMode(mode: DrawingMode) {
        if(mode === DrawingMode.BRUSH) {
            return new DrawingHandler();
        }
    }


    setDrawingMode(mode: DrawingMode) {
        this.handler = this.getDrawingMode(mode);
    }

    handleKeyDown(e: KeyboardEvent) {
        if(e.key === 'Control') {
            this.controlPressed = true;
        }

        if(e.key.toUpperCase() === 'Z' && this.controlPressed) {
            console.log("lolz!")
            this.operations.pop();
        }
    }
    handleKeyUp(e: KeyboardEvent) {
        if(e.key === 'Control') {
            this.controlPressed = false;
        }
    }


    constructor() {
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d');
        this.mouseTransformer = new MouseTransformer("canvas");

        this.handler = new DrawingHandler();
        this.handler.operations = this.operations;

        this.canvas.addEventListener('mousemove', this.handler.onMove.bind(this.handler) );
        this.canvas.addEventListener("mousedown", this.handler.onPress.bind(this.handler));
        this.canvas.addEventListener('mouseup', this.handler.onRelease.bind(this.handler));

        window.addEventListener('keydown', this.handleKeyDown.bind(this));

        this.paint = new Painter();
        this.paint.ctx = this.ctx;
    }    
}


