import { LineOperation, RectOperation } from "../operation";
import { Vector2 } from "../utils";
import { DrawingHandler } from "./drawingHandler";
import { OperationHandler } from "./operationHandler";



export class RectHandler extends OperationHandler {

    startPoint: Vector2;
    rectangle: RectOperation;

    onPress(e: MouseEvent) : void {
        super.onPress(e);
        
        this.startPoint = this.transformer.transform(e);
        this.rectangle = new RectOperation(this.startPoint)
        this.rectangle.color = this.color;
        this.rectangle.fill = this.fill;
        this.rectangle.thickness = this.thickness;

        this.base.currentOperation = this.rectangle
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

        this.base.drawCurrentOperation();
    }

    onRelease(e: MouseEvent) {
        super.onRelease(e);
        this.base.operations.push(this.rectangle);
        this.base.saveGeneratedImage();
    }

}