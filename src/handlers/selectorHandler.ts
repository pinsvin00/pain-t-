import { generateUUID, pxToInt, Vector2, vectorsByModule } from "../utils";
import { OperationHandler } from "./operationHandler";
import { ctxBuffer, guiLayer } from "../paint/bufferCanvasProvider";
import type { Paint } from "../paint/paint";
import { HTMLDragger } from "../Dragger";

const addDragger = (rect: HTMLElement, pos: Vector2) => {
	const draggerUUID = generateUUID();
	const draggerIco = document.createElement("button");
	draggerIco.id = draggerUUID;
	draggerIco.style.borderRadius = "100%";
	draggerIco.style.position = "relative";

    
	draggerIco.style.top = pxToInt(rect.style.height) - 10 + "px";
	draggerIco.style.left = pxToInt(rect.style.width) - 5 + "px ";

	draggerIco.style.width = "10px";
	draggerIco.style.height = "10px";

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
	selectionDiv: HTMLElement;
	draggerDiv: HTMLElement;

	startPoint: Vector2;
	lastPosition: Vector2;
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
		guiLayer.appendChild(this.selectionDiv);
	}

	onMove(e: MouseEvent): void {
		if (!this.mousePressed) {
			return;
		}

		this.lastPosition = this.transformer.transform(e);
		const diff = this.lastPosition.sub(this.startPoint);

		this.selectionDiv.style.top = this.lastPosition.y + "px";
		this.selectionDiv.style.left = this.lastPosition.x + "px";

		this.selectionDiv.style.width = diff.x + "px";
		this.selectionDiv.style.height = diff.y + "px";

	}

	onRelease(e: MouseEvent) {
		this.layer.selectionStart = this.startPoint;
		this.layer.selectionEnd = this.lastPosition;
		super.onRelease(e);
	}
}
