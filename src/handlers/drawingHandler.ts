import { Circle, DrawOperation, Operation } from "../operation";
import type { Painter } from "../paint";
import { Vector2 } from "../utils";
import { OperationHandler } from "./operationHandler";



export class DrawingHandler extends OperationHandler {
    generatedOperation: DrawOperation;


    onPress(e: MouseEvent) : void {
        super.onPress(e);
        this.generatedOperation = new DrawOperation();
        this.operations.push(this.generatedOperation);
    }

    onRelease(e: MouseEvent): void {
        super.onRelease(e);
        this.operations[this.operations.length - 1] = this.generatedOperation;
        console.log(this.operations)
    }

    onMove(e: MouseEvent) {
        
        if(!this.mousePressed) return; 

        if (!this.lastMouseEvent) {
            this.lastMouseEvent = e;
        }

        const pos = this.transformer.transform(e);
        const lastPos = this.transformer.transform(this.lastMouseEvent);

        const STEPS = 20;

        const step = pos.sub(lastPos).divFac(STEPS); 
        let currPos = lastPos.cpy();

        for (let i = 0 ; i < STEPS ; i++) {
            let circle = new Circle(currPos, 2.0, 'black');
            this.generatedOperation.circles.push(circle);
            currPos = currPos.add(step); 
        }
        this.lastMouseEvent = e;
        this.operations[this.operations.length - 1] = this.generatedOperation;

    }


}