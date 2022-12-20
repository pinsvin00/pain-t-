import { ColorSample } from "./operations/operation";

export class MouseTransformer {
	relativeTo: HTMLElement;
	constructor(relativeElementId: string) {
		this.relativeTo = document.getElementById(relativeElementId);
	}

	transform(e: MouseEvent): Vector2 {
		const rect = this.relativeTo.getBoundingClientRect();
		return new Vector2(
			Math.floor(e.clientX - rect.left),
			Math.floor(e.clientY - rect.top)
		);
	}
}

export function pxToInt(str: string) {
	return parseInt(str.split("px")[0]);
}

export function _2dArray(w: number, h: number): Array<Array<boolean>> {
	const ret = [];
	for (let j = 0; j < w; j++) {
		const a = [];
		for (let i = 0; i < h; i++) {
			a.push(false);
		}
		ret.push(a);
	}

	return ret;
}

export function componentToHex(c) {
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}

export function hexToRgb(hex: string) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return new ColorSample(
		parseInt(result[1], 16),
		parseInt(result[2], 16),
		parseInt(result[3], 16),
		0
	);
}

export class Vector2 {
	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	add(v: Vector2): Vector2 {
		return new Vector2(this.x + v.x, this.y + v.y);
	}

	cpy() {
		return new Vector2(this.x, this.y);
	}

	divFac(fac: number) {
		return new Vector2(this.x / fac, this.y / fac);
	}

	sub(v: Vector2): Vector2 {
		return new Vector2(this.x - v.x, this.y - v.y);
	}

	dis(v: Vector2): number {
		return Math.sqrt((this.x - v.x) ** 2 + (this.y - v.y) ** 2);
	}
}

export function generateUUID() {
	var d = new Date().getTime(); //Timestamp
	var d2 =
		(typeof performance !== "undefined" &&
			performance.now &&
			performance.now() * 1000) ||
		0; //Time in microseconds since page-load or 0 if unsupported
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
		var r = Math.random() * 16; //random number between 0 and 16
		if (d > 0) {
			//Use timestamp until depleted
			r = (d + r) % 16 | 0;
			d = Math.floor(d / 16);
		} else {
			//Use microseconds since page-load if supported
			r = (d2 + r) % 16 | 0;
			d2 = Math.floor(d2 / 16);
		}
		return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
	});
}

export function vectorsByModule(v1: Vector2, v2: Vector2) {
	const root = new Vector2(0, 0);
	if (v1.dis(root) > v2.dis(root)) {
		return [v1, v2];
	} else {
		return [v2, v1];
	}
}
