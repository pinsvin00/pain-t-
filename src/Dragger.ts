import type { Paint } from "./paint/paint";
import { pxToInt } from "./utils";

export class HTMLDragger {
	element: HTMLElement;
	paint: Paint;
	subjects: Array<HTMLElement> = [];

	active = false;

	boundMouseMove: any;
	boundMouseUp: any;

	onMouseMove(e: MouseEvent) {


		this.subjects.forEach((subject) => {			
			subject.style.width =  e.clientX + "px";
			subject.style.height = e.clientY + "px";
		});

		this.element.style.setProperty("left", e.clientX + "px");
		this.element.style.setProperty("top", e.clientY + "px");
		e.preventDefault();
	}

	onMouseUp(e: MouseEvent) {
		document.removeEventListener("mousemove", this.boundMouseMove);
		document.removeEventListener("mouseup", this.boundMouseUp);
		e.preventDefault();
	}

	onMouseDown(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		this.boundMouseUp = this.onMouseUp.bind(this);
		this.boundMouseMove = this.onMouseMove.bind(this);
		document.addEventListener("mousemove", this.boundMouseMove);
		document.addEventListener("mouseup", this.boundMouseUp);
	}

	constructor(id: string, subjectIds: Array<string>) {
		this.element = document.getElementById(id);

		subjectIds.forEach((subjectId) => {
			const domEl = document.getElementById(subjectId);
			this.subjects.push(domEl);
		});
		if (this.element === null) {
			console.error(
				`Couldnt find element or subject\n element ${this.element} subjects ${this.subjects}`
			);
			return;
		}

		this.element.addEventListener("mousedown", (e) => {
			this.onMouseDown(e);
		});
	}

	detach() {}
}
