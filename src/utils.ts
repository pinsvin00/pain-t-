import { ColorSample } from "./operations/operation";

export class MouseTransformer {
    relativeTo: HTMLElement;
    constructor(relativeElementId: string) {
        this.relativeTo = document.getElementById(relativeElementId);
    }

    transform(e: MouseEvent) : Vector2 {
        const rect = this.relativeTo.getBoundingClientRect();
        return new Vector2(Math.floor(e.clientX - rect.left), Math.floor(e.clientY -  rect.top));

    }
}


export function _2dArray(w: number, h: number): Array<Array<boolean>> {
    const ret = [];
    for (let j = 0; j < h; j++) {
        const a = [];
        for (let i = 0; i < w; i++) {
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

    add(v: Vector2) : Vector2 {
        return new Vector2(this.x + v.x, this.y + v.y);
    }

    cpy() {
        return new Vector2(this.x, this.y);
    }
    
    divFac(fac: number) {
        return new Vector2(this.x/fac, this.y/fac);
    }

    sub(v: Vector2) : Vector2 {
        return new Vector2(this.x - v.x, this.y - v.y);
    }

    dis(v: Vector2) : number {
        return Math.sqrt(
            (this.x - v.x) ** 2 + (this.y - v.y) ** 2
        );
    }
}
