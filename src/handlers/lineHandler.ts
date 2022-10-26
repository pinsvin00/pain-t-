import { LineOperation } from "../operation";
import { Vector2 } from "../utils";
import { DrawingHandler } from "./drawingHandler";
import { OperationHandler } from "./operationHandler";



export class LineHandler extends OperationHandler {

    startPoint: Vector2;
    operation: LineOperation;

    onPress(e: MouseEvent) : void {
        super.onPress(e);
        
        this.startPoint = this.transformer.transform(e);
        this.operation = new LineOperation(this.startPoint)
        this.operation.color = this.color;
        this.operation.thickness = this.thickness;

        this.operations.push(
            this.operation
        )
    }

    onMove(e: MouseEvent): void {
        if(!this.mousePressed) {
            return;
        }

        let pos = this.transformer.transform(e);
        if(this.proportional) {
            const dif = this.startPoint.sub(pos);
            if(Math.abs(dif.x) > Math.abs(dif.y)) {
                this.operation.endPoint = new Vector2(pos.x, this.startPoint.y);
            } else { 
                this.operation.endPoint = new Vector2(this.startPoint.x, pos.y);    
            }
        }
        else {
            this.operation.endPoint = pos;
        }


    }

    onRelease(e: MouseEvent) {
        super.onRelease(e);
    }

}