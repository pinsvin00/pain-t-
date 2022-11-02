import type { Operation } from "../operations/operation";
import type { Layer } from "../paint/layer";
import type { Painter } from "../Painter";
import { MouseTransformer } from "../utils";


export class OperationHandler {
    
    transformer: MouseTransformer;
    mousePressed = false;

    thickness: number = 2.0;
    fill : boolean = false;
    color: string = 'black';
    proportional  = false;

    lastMouseEvent : MouseEvent;
    paint: Painter;
    
    layer: Layer;

    saveState: () => void;

    constructor() {
        this.transformer = new MouseTransformer("canvas");
    }

    onPress(e: MouseEvent) {
        this.mousePressed = true;
        this.lastMouseEvent = e;
    }

    onRelease(e: MouseEvent) {
        this.mousePressed = false;
        this.lastMouseEvent = null;
    }

    onMove(e: MouseEvent) {

    }
}