import { DrawingMode } from "./drawingMode";
import { CircleHandler } from "./handlers/circleHandler";
import { DrawingHandler } from "./handlers/drawingHandler";
import { LineHandler } from "./handlers/lineHandler";
import type { OperationHandler } from "./handlers/operationHandler";
import { RectHandler } from "./handlers/rectHandler";
import type { Operation } from "./operation";
import { MouseTransformer, Vector2 } from "./utils";

export class Painter {
    ctx: CanvasRenderingContext2D;
    color = 'black';

    circle(pos: Vector2, radius: number, fill = true) {
        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = this.color;
        this.ctx.strokeStyle = this.color;
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

    rect(start: Vector2, end: Vector2, thickness: number, fill = false) {
        this.ctx.beginPath();

        const size = end.sub(start); 

        this.ctx.rect(start.x, start.y, size.x, size.y);
        this.ctx.stroke();
    }

}



export class Paint { 
    canvas  : HTMLCanvasElement;
    ctx : CanvasRenderingContext2D;
    mouseTransformer : MouseTransformer;
    painter: Painter;

    mode : DrawingMode;

    controlPressed = false;
    lastMouseEvent : MouseEvent;
    operations: Array<Operation> = [];
    handler: OperationHandler;


    moveHandler: (e: MouseEvent) => void;
    pressHandler: (e: MouseEvent) => void;
    releaseHandler: (e: MouseEvent) => void;



    render() {
        this.ctx.clearRect(
            0,0, this.canvas.width, this.canvas.height
        )
        this.operations.forEach(el => {
            el.draw(this.painter);
        });
    }


    provideHandler(mode: DrawingMode) {
        const map = new Map<DrawingMode, OperationHandler>();
        map[DrawingMode.BRUSH] = new DrawingHandler();
        map[DrawingMode.RECTANGLE] = new RectHandler();
        map[DrawingMode.LINE] = new LineHandler();
        map[DrawingMode.CIRLCE] = new CircleHandler();
        return map[mode];
    }


    setDrawingMode(mode: DrawingMode) {
        const thickness = this.handler.thickness;
        const fill = this.handler.fill;
        this.handler = this.provideHandler(mode);
        this.handler.operations = this.operations;
        this.handler.fill = fill;
        this.handler.thickness = thickness;

    }

    handleKeyDown(e: KeyboardEvent) {
        if(e.key === 'Control') {
            this.controlPressed = true;
        }
        if (e.key === 'Shift') {
            this.handler.proportional = true;
        }

        if(e.key.toUpperCase() === 'Z' && this.controlPressed) {
            this.operations.pop();
        }
    }

    handleKeyUp(e: KeyboardEvent) {
        if(e.key === 'Control') {
            this.controlPressed = false;
        }
        if(e.key === 'Shift') {
            this.handler.proportional = false;
        }
    }


    constructor() {
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d');
        this.mouseTransformer = new MouseTransformer("canvas");

        this.handler = new DrawingHandler();
        this.handler.operations = this.operations;


        this.releaseHandler = (e: MouseEvent) => {
            this.handler.onRelease(e);
        }
        this.moveHandler = (e: MouseEvent) => {
            this.handler.onMove(e);
        }
        this.pressHandler = (e: MouseEvent) => {
            this.handler.onPress(e);
        }
        
        this.canvas.addEventListener('mousemove', this.moveHandler );
        this.canvas.addEventListener("mousedown", this.pressHandler);
        this.canvas.addEventListener('mouseup', this.releaseHandler );
        window.addEventListener('keydown', this.handleKeyDown.bind(this));

        this.painter = new Painter();
        this.painter.ctx = this.ctx;
    }    
}


