import {RectOperation, TextOperation} from "../operations/operation";
import {generateUUID, getRectVertices, Vector2, vectorsByModule} from "../utils";
import { OperationHandler } from "./operationHandler";
import { ctxBuffer, guiLayer } from "../paint/bufferCanvasProvider";
import type { Paint } from "../paint/paint";
import { HTMLDragger } from "../Dragger";
import {addDragger, HTMLRect} from "../ui/HTMLRect";






export class TextHandler extends OperationHandler {
    rectangle: RectOperation;
    selectionDiv: HTMLElement;

    currentPoint: Vector2;
    startPoint: Vector2;
    cut = false;
    constructor(paint: Paint) {
        super(paint);
    }

    onPress(e: MouseEvent): void {
        super.onPress(e);

        if (this.selectionDiv) {
            this.selectionDiv.remove();
            this.selectionDiv = null;
            return;
        }

        this.startPoint = this.transformer.transform(e);
        const selectionDivReference = new HTMLRect();

        this.selectionDiv = selectionDivReference.getRect(
            this.startPoint,
            this.startPoint
        );

        let pressPoint = new Vector2(this.startPoint.x, this.startPoint.y);
        this.selectionDiv.onmousedown = (e) => {
            pressPoint = new Vector2(this.startPoint.x, this.startPoint.y);
        }

        guiLayer.appendChild(this.selectionDiv);

        this.rectangle = new RectOperation(this.startPoint);
        this.rectangle.color = "rgba(0, 0, 173, 0.5)";
        this.rectangle.fill = true;
        this.rectangle.thickness = this.thickness;
        this.layer.currentOperation = this.rectangle;
    }

    onMove(e: MouseEvent): void {
        if (!this.mousePressed) {
            return;
        }

        this.currentPoint = this.transformer.transform(e);
        let verts = getRectVertices(this.currentPoint, this.startPoint);
        let lt = vectorsByModule(verts)[0];
        let rb = vectorsByModule(verts)[3];

        this.selectionDiv.style.left = lt.x + "px";
        this.selectionDiv.style.top = lt.y + "px";

        const rectSize = rb.sub(lt);

        this.selectionDiv.style.width = rectSize.x + "px";
        this.selectionDiv.style.height = rectSize.y + "px";
    }

    onRelease(e: MouseEvent) {
        if(!this.selectionDiv) {
            return;
        }
        this.currentPoint = this.transformer.transform(e);
        let verts = getRectVertices(this.currentPoint, this.startPoint);
        this.startPoint = vectorsByModule(verts)[0];
        this.currentPoint = vectorsByModule(verts)[3];



        const text = window.prompt();

        const operation = new TextOperation(text, this.paint.font, this.startPoint, this.currentPoint);

        operation.drawWith(this.layer.bufferPainter);


        this.layer.operations.push(operation);
        this.layer.saveFromBuffer();

        super.onRelease(e);
    }
}
