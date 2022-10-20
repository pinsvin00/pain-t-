import type { DrawingModes } from "./drawing_modes";


class Vector2 { 
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

class Painter {
    ctx: CanvasRenderingContext2D;
    color = 'black';

    circle(pos: Vector2, radius: number, fill = true) {
        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = 'black';
        this.ctx.fill();
        this.ctx.stroke();
    }

    line(start: Vector2, end: Vector2, thickness: number) {

    }
}

class CirclePainter {
    
}

export class Paint { 
    canvas  : HTMLCanvasElement;
    ctx : CanvasRenderingContext2D;
    paint: Painter;
    mode : DrawingModes;

    mousePressed = false;

    lastMouseEvent : MouseEvent;
    
    mouseHandler(e: MouseEvent) {

        if(!this.mousePressed) return; 

        if (!this.lastMouseEvent) {
            this.lastMouseEvent = e;
        }

        const pos = new Vector2(e.clientX, e.clientY);
        const lastPos = new Vector2(this.lastMouseEvent.clientX, this.lastMouseEvent.clientY);

        const STEPS = 20;

        const step = pos.sub(lastPos).divFac(STEPS); 
        let currPos = lastPos.cpy();

        for (let i = 0 ; i < STEPS ; i++) {
            this.paint.circle(currPos, 2.0);
            currPos = currPos.add(step); 
        }

        this.lastMouseEvent = e;
    }

    constructor() {
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d');

        this.canvas.addEventListener('mousemove', this.mouseHandler.bind(this));
        this.canvas.addEventListener("mousedown", () => {
            this.mousePressed = true;
        })
        this.canvas.addEventListener('mouseup', () => {
            this.lastMouseEvent = null;
            this.mousePressed = false;
        })

        this.canvas.addEventListener

        this.paint = new Painter();
        this.paint.ctx = this.ctx;

    }    
}