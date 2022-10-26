import { DrawingMode } from "./drawingMode";
import { BucketHandler } from "./handlers/bucketHandler";
import { CircleHandler } from "./handlers/circleHandler";
import { DrawingHandler } from "./handlers/drawingHandler";
import { LineHandler } from "./handlers/lineHandler";
import type { OperationHandler } from "./handlers/operationHandler";
import { RectHandler } from "./handlers/rectHandler";
import type { Operation } from "./operation";
import { MouseTransformer, Vector2 } from "./utils";

export class Painter {
    ctx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    color = 'black';
    fill = false;
    draw = false;
    thickness  = 2.0;


    reloadCanvasData() {
        this.ctx.fillStyle = this.color;
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = this.thickness;
    }

    show() {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data;
        console.log(imageData);
    }

    circle(pos: Vector2, radius: number, fill = true) {
        this.reloadCanvasData();

        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
        this.ctx.fill();

        this.ctx.stroke();
    }

    ellipse(pos: Vector2, radius: Vector2, fill = false) {

        this.reloadCanvasData();

        this.ctx.beginPath();
        this.ctx.ellipse(pos.x, pos.y, radius.x, radius.y, 0, 0, 2 * Math.PI);
        if(this.fill) {
            this.ctx.fill();
        }
        this.ctx.stroke();
    }   

    line(start: Vector2, end: Vector2, thickness: number) {

        this.reloadCanvasData();
        
        this.ctx.beginPath();
        this.ctx.moveTo(start.x, start.y);
        this.ctx.lineTo(end.x, end.y);
        this.ctx.stroke();
    }

    rect(start: Vector2, end: Vector2, thickness: number, fill = false) {

        this.reloadCanvasData();

        this.ctx.beginPath();
        const size = end.sub(start); 

        this.ctx.rect(start.x, start.y, size.x, size.y);
        if(this.fill) {
            this.ctx.fill();
        }
        this.ctx.stroke();
    }

    async dot(start: Vector2) {

        this.reloadCanvasData();
        this.ctx.fillRect(start.x, start.y, 1, 1);
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
        if(this.painter.draw) return;

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
        map[DrawingMode.BUCKET] = new BucketHandler();
        return map[mode];
    }


    setDrawingMode(mode: DrawingMode) {
        const thickness = this.handler.thickness;
        const fill = this.handler.fill;
        const color = this.handler.color;
        
        this.handler = this.provideHandler(mode);
        this.handler.operations = this.operations;
        this.handler.fill = fill;
        this.handler.color = color;
        this.handler.thickness = thickness;

    }


    //TODO linia pozioma
    //dynamiczna ilosc krokow interpolacji

    handleKeyDown(e: KeyboardEvent) {


        if(e.key === 'Control') {
            this.controlPressed = true;
        }
        if (e.key === 'Shift') {
            console.log("shift pressed")
            this.handler.proportional = true;
        }

        if(e.key.toUpperCase() === 'Z' && this.controlPressed) {
            this.operations.pop();
        }
        if(e.key.toUpperCase() === 'S' && this.controlPressed) {
            e.preventDefault();
            const dummy = document.getElementById("dummy");
            const data = this.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
            dummy.setAttribute("href", data);
            dummy.setAttribute("download", "image.png")
            dummy.click();
        }
    }

    handleKeyUp(e: KeyboardEvent) {
        console.log(e.key, "Key released")
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
        window.addEventListener('keyup', this.handleKeyUp.bind(this));

        this.painter = new Painter();
        this.painter.ctx = this.ctx;
        this.painter.canvas = this.canvas;
    }    
}


