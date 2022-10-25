import { CircleOperation, LineOperation } from "../operation";
import type { Vector2 } from "../utils";
import { OperationHandler } from "./operationHandler";

export class CircleHandler extends OperationHandler {

    startPoint: Vector2;
    operation: CircleOperation;

    onPress(e: MouseEvent) : void {
        super.onPress(e);
        
        this.startPoint = this.transformer.transform(e);
        this.operation = new CircleOperation(this.startPoint)
        this.operations.push(
            this.operation
        )
    }

    onMove(e: MouseEvent): void {
        if(!this.mousePressed) {
            return;
        }
        const pos = this.transformer.transform(e);
        const dis = this.startPoint.dis(pos);
        this.operation.radius = dis;
    }

    onRelease(e: MouseEvent) {
        super.onRelease(e);
        console.log(this.operation);
    }

}