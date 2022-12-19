import type { Paint } from "src/paint/paint";
import type { Operation } from "../operations/operation";
import type { Layer } from "../paint/layer";
import type { Painter } from "../Painter";
import { MouseTransformer } from "../utils";


export class OperationHandler {
    
    transformer: MouseTransformer;
    mousePressed = false;

    thickness: number = 2.0;
    fill : boolean = false;
    color: string = '#000000';
    proportional  = false;

    lastMouseEvent : MouseEvent;
    painter: Painter;
    paint: Paint;    
    layer: Layer;

    saveState: () => void;

    constructor(paint: Paint) {
        this.paint = paint;
        this.transformer = new MouseTransformer("canvas");
    }

    onPress(e: MouseEvent) {
        this.mousePressed = true;
        this.lastMouseEvent = e;
    }

    onRelease(e: MouseEvent) {
        this.mousePressed = false;
        this.lastMouseEvent = null;

        //this.layer.generateImage();
    }

    onMove(e: MouseEvent) {

    }
}