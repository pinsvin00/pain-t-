import { RectOperation } from "../operations/operation";
import { generateUUID, Vector2, vectorsByModule } from "../utils";
import { OperationHandler } from "./operationHandler";
import { ctxBuffer, guiLayer } from "../paint/bufferCanvasProvider";
import type { Paint } from "../paint/paint";
import { HTMLDragger } from "../Dragger";

const addDragger = (rect: HTMLElement, pos: Vector2) => {
	const draggerUUID = generateUUID();
	const draggerIco = document.createElement("div");
	draggerIco.id = draggerUUID;
	draggerIco.style.borderRadius = "100%";
	draggerIco.style.position = "relative";

	draggerIco.style.top = pos.y + "px";
	draggerIco.style.left = pos.x + "px";

	draggerIco.style.backgroundColor = "gray";

	draggerIco.style.width = "25px";
	draggerIco.style.height = "25px";

	rect.appendChild(draggerIco);

	draggerIco.setAttribute("class", "dragger");

	const dragger = new HTMLDragger(draggerUUID, [rect.id]);
	console.log(draggerIco);
	rect.appendChild(draggerIco);

	return draggerIco;
};

class HTMLDivRect {
	isResizible = false;
	staticCSS = "";

	constructor(is_resizible = false, style = "") {
		this.staticCSS = style;
		this.isResizible = is_resizible;
	}

	getRect(v1: Vector2, v2: Vector2) {
		const rect = document.createElement("div");
		rect.style.position = "relative";
		const rectUUID = generateUUID();
		rect.id = rectUUID;
		let start, end;
		[start, end] = vectorsByModule(v1, v2);

		let diff = end.sub(start);

		rect.style.top = start.y + "px";
		rect.style.left = start.x + "px";

		rect.style.width = diff.x + "px";
		rect.style.height = diff.y + "px";

		rect.style.border = "3px solid blue";
		rect.style.backgroundColor = "rgba(1,34,255,0.44)";
		rect.style.borderStyle = "dashed";

		return rect;
	}
}

export class SelectorHandler extends OperationHandler {
	startPoint: Vector2;
	rectangle: RectOperation;
	selectionDiv: HTMLElement;
	draggerDiv: HTMLElement;
	lastPosition: Vector2;
	cut = false;

	constructor(paint: Paint, cut: boolean) {
		super(paint);
		this.cut = cut;
	}

	onPress(e: MouseEvent): void {
		super.onPress(e);

		if (this.selectionDiv) {
			this.selectionDiv.remove();
			this.draggerDiv.remove();
		}

		this.startPoint = this.transformer.transform(e);
		console.log(this.startPoint);
		const selectionDivReference = new HTMLDivRect(
			true,
			"border: 1px solid blue"
		);

		this.selectionDiv = selectionDivReference.getRect(
			this.startPoint,
			this.startPoint
		);
		console.log(this.selectionDiv);
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

		this.lastPosition = this.transformer.transform(e);
		let start, end;
		[start, end] = vectorsByModule(this.lastPosition, this.startPoint);
		const diff = start.sub(end);

		//this.selectionDiv.style.top = start.y + "px";
		//this.selectionDiv.style.left = start.x + "px";

		this.selectionDiv.style.width = diff.x + "px";
		this.selectionDiv.style.height = diff.y + "px";
		// this.layer.loadOntoBuffer();

		// const pos = this.transformer.transform(e);

		// if (this.proportional) {
		// 	const deltaX = this.startPoint.x - pos.x;
		// 	this.rectangle.endPoint = this.startPoint.sub(
		// 		new Vector2(deltaX, deltaX)
		// 	);
		// } else {
		// 	this.rectangle.endPoint = pos;
		// }

		// this.layer.currentOperation.drawWith(this.layer.bufferPainter);
	}

	onRelease(e: MouseEvent) {
		//this.layer.loadOntoBuffer();

		// const start = this.rectangle.startPoint;
		// const end = this.rectangle.endPoint;
		// const diff = start.sub(end);

		// this.paint.localCopiedImage = ctxBuffer.getImageData(
		// 	start.x,
		// 	start.y,
		// 	Math.abs(diff.x),
		// 	Math.abs(diff.y)
		// );
		// if (this.cut) {
		// 	console.log("chuj");
		// 	ctxBuffer.clearRect(start.x, start.y, Math.abs(diff.x), Math.abs(diff.y));
		// 	this.layer.saveFromBuffer();
		// }

		this.draggerDiv = addDragger(this.selectionDiv, this.lastPosition);

		super.onRelease(e);
	}
}
