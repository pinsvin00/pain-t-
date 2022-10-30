import { EllipseOperation, LineOperation } from "../operation";
import { Bucket } from "../Bucket";
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

        this.base.currentOperation = bucket
        this.base.operations.push(bucket);

        this.base.drawCurrentOperation();

        this.base.saveGeneratedImage();
        
    }

}