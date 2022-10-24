import type { DrawingMode } from "./drawingMode";
import type { Painter } from "./paint";
import type { Vector2 } from "./utils";



export class Operation { 
    constructor() {

    }
    draw(painter: Painter) {}
}



export class Circle { 
    position: Vector2;
    radius: number;
    color: string;
    isFilled = true;

    constructor(pos: Vector2, radius: number, color = 'black') {
        this.position = pos;
        this.radius = radius;
        this.color = color;
    }
}

export class DrawOperation extends Operation { 
    circles : Array<Circle> = [];

    draw(painter: Painter) {
        console.log("sus!")
        this.circles.forEach(el => {
            painter.color = el.color;
            painter.circle(el.position, el.radius, el.isFilled);
        })
    }
}