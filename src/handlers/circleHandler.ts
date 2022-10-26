import { EllipseOperation, LineOperation } from "../operation";
import { Vector2 } from "../utils";
import { OperationHandler } from "./operationHandler";

export class CircleHandler extends OperationHandler {

    startPoint: Vector2;
    ellipse: EllipseOperation;

    onPress(e: MouseEvent) : void {
        super.onPress(e);
        
        this.startPoint = this.transformer.transform(e);
        this.ellipse = new EllipseOperation(this.startPoint)
        
        this.ellipse.color = this.color;
        this.ellipse.fill = this.fill;
        this.ellipse.thickness = this.thickness;

        this.operations.push(
            this.ellipse
        )
    }

    onMove(e: MouseEvent): void {
        if(!this.mousePressed) {
            return;
        }

        const pos = this.transformer.transform(e);

        if(this.proportional) {
            const distance = this.startPoint.dis(pos);
            this.ellipse.radius = new Vector2(distance, distance);
        }
        else { 
            const dif = this.startPoint.sub(pos);
            this.ellipse.radius.x = Math.abs(dif.x);
            this.ellipse.radius.y = Math.abs(dif.y);
        }


    }

    onRelease(e: MouseEvent) {
        super.onRelease(e);
    }

}