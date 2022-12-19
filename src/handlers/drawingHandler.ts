import { Circle, DrawOperation, Operation } from "../operations/operation";
import { OperationHandler } from "./operationHandler";



export class DrawingHandler extends OperationHandler {
    generatedOperation: DrawOperation;


    onPress(e: MouseEvent) : void {
        super.onPress(e);
        this.generatedOperation = new DrawOperation();
        this.layer.currentOperation = this.generatedOperation;
    }

    onRelease(e: MouseEvent): void {
        this.layer.operations.push(this.generatedOperation);
        super.onRelease(e);
    }

    onMove(e: MouseEvent) {
        
        if(!this.mousePressed) return; 

        if (!this.lastMouseEvent) {
            this.lastMouseEvent = e;
        }


        const pos = this.transformer.transform(e);
        const lastPos = this.transformer.transform(this.lastMouseEvent);
        const STEPS = 50;

        const step = pos.sub(lastPos).divFac(STEPS); 
        let currPos = lastPos.cpy();

        for (let i = 0 ; i < STEPS ; i++) {
            let circle = new Circle(currPos, this.thickness, this.color);
            this.generatedOperation.circles.push(circle);

            this.layer.bufferPainter.color = circle.color;
            this.layer.bufferPainter.circle(circle.position, circle.radius, false);

            currPos = currPos.add(step); 
        }

        this.layer.saveFromBuffer();
        this.lastMouseEvent = e;

    }


}