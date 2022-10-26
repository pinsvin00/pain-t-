import { EllipseOperation, LineOperation } from "../operation";
import { Vector2 } from "../utils";
import { OperationHandler } from "./operationHandler";

export class BucketHandler extends OperationHandler {
    startPoint: Vector2;

    onPress(e: MouseEvent) : void {
        super.onPress(e);
        
        this.startPoint = this.transformer.transform(e);
    }

}