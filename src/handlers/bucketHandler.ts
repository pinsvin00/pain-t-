import { Bucket, EllipseOperation, LineOperation } from "../operation";
import type { Vector2 } from "../utils";
import { OperationHandler } from "./operationHandler";

export class BucketHandler extends OperationHandler {
    startPoint: Vector2;

    onPress(e: MouseEvent) : void {
        super.onPress(e);
        
        this.startPoint = this.transformer.transform(e);
        const bucket = new Bucket()
        bucket.origin = this.startPoint;
        bucket.color = this.color;

        this.operations.push(
            bucket    
        )
    }

}