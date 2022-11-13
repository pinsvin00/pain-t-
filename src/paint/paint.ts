import { DrawingMode } from "../drawingMode";
import { BucketHandler } from "../handlers/bucketHandler";
import { CircleHandler } from "../handlers/circleHandler";
import { DrawingHandler } from "../handlers/drawingHandler";
import { LineHandler } from "../handlers/lineHandler";
import type { OperationHandler } from "../handlers/operationHandler";
import { RectHandler } from "../handlers/rectHandler";
import { Layer } from "../paint/layer";
import { Vector2 } from "../utils";
import { canvas, ctx } from "./bufferCanvasProvider";



export class ToolBox { 
    thickness = 2.0;
    fill = false;
    color = "black";

}

export class Paint {
    layers: Array<Layer> = [];
    selectedLayer: Layer;

    ctx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    handler: OperationHandler;

    moveHandler: (e: MouseEvent) => void;
    pressHandler: (e: MouseEvent) => void;
    releaseHandler: (e: MouseEvent) => void;

    controlPressed = false;
    shiftPressed = false;


    constructor() {
        this.canvas = canvas;
        this.ctx = ctx;

        this.selectedLayer = new Layer(
            new Vector2(this.canvas.width, this.canvas.height),
            new Vector2(0,0),
        );


        this.handler = new DrawingHandler(this);
        this.handler.layer = this.selectedLayer;
        this.layers.push(this.selectedLayer);

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
    }

    provideHandler(mode: DrawingMode) {
        const map = new Map<DrawingMode, OperationHandler>();
        map[DrawingMode.BRUSH] = new DrawingHandler(this);
        map[DrawingMode.RECTANGLE] = new RectHandler(this);
        map[DrawingMode.LINE] = new LineHandler(this);
        map[DrawingMode.CIRLCE] = new CircleHandler(this);
        map[DrawingMode.BUCKET] = new BucketHandler(this);
        return map[mode];
    }


    setDrawingMode(mode: DrawingMode) {
        const thickness = this.handler.thickness;
        const fill = this.handler.fill;
        const color = this.handler.color;
        
        this.handler = this.provideHandler(mode);
        this.handler.paint = this;
        this.handler.fill = fill;
        this.handler.color = color;
        this.handler.layer = this.selectedLayer;
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
            this.selectedLayer.operations.pop();
            this.selectedLayer.generateImage();
            this.drawCanvas();
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

    blendImageData(imageData: ImageData) {
        const ctxImageData = this.ctx.getImageData(0,0, this.canvas.width, this.canvas.height);

        for(let i = 0 ; i < ctxImageData.data.length; i += 4) {
            if(ctxImageData.data[i+3] === 0) {
                ctxImageData.data[i]   = imageData.data[i] 
                ctxImageData.data[i+1] = imageData.data[i+1]
                ctxImageData.data[i+2] = imageData.data[i+2]
                ctxImageData.data[i+3] = imageData.data[i+3]
            }
        }

        this.ctx.putImageData(ctxImageData, 0, 0);


    }


    drawCanvas() {
        this.ctx.clearRect(
            0, 0 , this.canvas.width, this.canvas.height
        )

        for(let layer of this.layers) {
            if(layer.imageData) this.blendImageData(layer.imageData);
        }
    }
}