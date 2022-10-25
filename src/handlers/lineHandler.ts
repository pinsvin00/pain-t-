import { LineOperation } from "../operation";
import type { Vector2 } from "../utils";
import { DrawingHandler } from "./drawingHandler";
import { OperationHandler } from "./operationHandler";



export class LineHandler extends OperationHandler {

    startPoint: Vector2;
    operation: LineOperation;

    onPress(e: MouseEvent) : void {
        super.onPress(e);
        
        this.startPoint = this.transformer.transform(e);
        this.operation = new LineOperation(this.startPoint)
        this.operations.push(
            this.operation
        )
    }

    onMove(e: MouseEvent): void {
        if(!this.mousePressed) {
            return;
        }
        const pos = this.transformer.transform(e);
        this.operation.endPoint = pos;
    }

    onRelease(e: MouseEvent) {
        super.onRelease(e);
        console.log(this.operation);
    }

}