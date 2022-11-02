import { LineOperation, RectOperation } from "../operations/operation";
import { Vector2 } from "../utils";
import { DrawingHandler } from "./drawingHandler";
import { OperationHandler } from "./operationHandler";



export class SelectorHandler extends OperationHandler {

    startPoint: Vector2;
    rectangle: RectOperation;

    onPress(e: MouseEvent) : void {
        super.onPress(e);
        
        this.startPoint = this.transformer.transform(e);
        this.rectangle = new RectOperation(this.startPoint)
        this.rectangle.color = this.color;
        this.rectangle.fill = this.fill;
        this.rectangle.thickness = this.thickness;

        this.layer.currentOperation = this.rectangle
    }

    onMove(e: MouseEvent): void {
        if(!this.mousePressed) {
            return;
        }
        const pos = this.transformer.transform(e);

        if(this.proportional) {
            const deltaX = this.startPoint.x - pos.x;
            const newPos = this.startPoint.sub(new Vector2(deltaX, deltaX));
            this.rectangle.endPoint = newPos;
        }
        else {
            this.rectangle.endPoint = pos;
        }

        this.layer.drawCurrentOperation();
    }

    onRelease(e: MouseEvent) {
        super.onRelease(e);
        this.layer.operations.push(this.rectangle);
        this.layer.saveGeneratedImage();
    }

}