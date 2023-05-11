import type { RectOperation } from "../operations/operation";
import { generateUUID, Vector2, vectorsByModule, getRectVertices } from "../utils";
import { OperationHandler } from "./operationHandler";
import { ctxBuffer, guiLayer } from "../paint/bufferCanvasProvider";
import type { Paint } from "../paint/paint";
import { addDragger, HTMLRect } from "../ui/HTMLRect";

export class SelectorHandler extends OperationHandler {
  rectangle: RectOperation;
  selectionDiv: HTMLElement;
  draggerDiv: HTMLElement;

  currentPoint: Vector2;
  startPoint: Vector2;

  cut = false;

  constructor(paint: Paint, cut: boolean) {
    super(paint);
    this.cut = cut;
  }

  onPress(e: MouseEvent): void {
    super.onPress(e);

    this.layer.selectionStart = null;
    this.layer.selectionEnd = null;

    if (this.selectionDiv) {
      this.selectionDiv.remove();
      this.selectionDiv = null;
      return;
    }

    this.startPoint = this.transformer.transform(e);
    const selectionDivReference = new HTMLRect();

    this.selectionDiv = selectionDivReference.getRect(this.startPoint, this.startPoint);

    let pressPoint = new Vector2(this.startPoint.x, this.startPoint.y);
    this.selectionDiv.onmousedown = (e) => {
      pressPoint = new Vector2(this.startPoint.x, this.startPoint.y);
    };

    guiLayer.appendChild(this.selectionDiv);
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
    this.currentPoint = this.transformer.transform(e);
    let verts = getRectVertices(this.currentPoint, this.startPoint);
    this.startPoint = vectorsByModule(verts)[0];
    this.currentPoint = vectorsByModule(verts)[3];

    this.layer.selectionStart = this.startPoint;
    this.layer.selectionEnd = this.currentPoint;

    //this.draggerDiv = addDragger(this.selectionDiv, this.currentPoint);
    super.onRelease(e);
  }
}
