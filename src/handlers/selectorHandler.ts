import {RectOperation} from "../operations/operation";
import {Vector2} from "../utils";
import {OperationHandler} from "./operationHandler";
import {ctxBuffer} from "../paint/bufferCanvasProvider";
import type {Paint} from "../paint/paint";


export class SelectorHandler extends OperationHandler {

    startPoint: Vector2;
    rectangle: RectOperation;
    cut = false;

    constructor(paint: Paint, cut: boolean) {
        super(paint);
        this.cut = cut;
    }


    onPress(e: MouseEvent) : void {
        super.onPress(e);

        this.startPoint = this.transformer.transform(e);
        this.rectangle = new RectOperation(this.startPoint)
        this.rectangle.color = 'rgba(0, 0, 173, 0.5)';
        this.rectangle.fill = true;
        this.rectangle.thickness = this.thickness;

        this.layer.currentOperation = this.rectangle
    }

    onMove(e: MouseEvent): void {
        if(!this.mousePressed) {
            return;
        }

        this.layer.loadOntoBuffer();

        const pos = this.transformer.transform(e);

        if(this.proportional) {
            const deltaX = this.startPoint.x - pos.x;
            this.rectangle.endPoint = this.startPoint.sub(new Vector2(deltaX, deltaX));
        }
        else {
            this.rectangle.endPoint = pos;
        }

        this.layer.currentOperation.drawWith(this.layer.bufferPainter);
    }

    onRelease(e: MouseEvent) {
        this.layer.loadOntoBuffer();

        const start = this.rectangle.startPoint;
        const end = this.rectangle.endPoint;
        const diff = start.sub(end);

        this.paint.localCopiedImage = ctxBuffer.getImageData(start.x, start.y, Math.abs(diff.x), Math.abs(diff.y));
        if(this.cut) {
            console.log("chuj")
            ctxBuffer.clearRect(start.x, start.y, Math.abs(diff.x), Math.abs(diff.y));
            this.layer.saveFromBuffer();
        }



        super.onRelease(e);
    }

}