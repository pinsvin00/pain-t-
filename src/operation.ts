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

export class LineOperation extends Operation {
    startPoint: Vector2;
    endPoint: Vector2;

    constructor(start: Vector2) {
        super();
        this.startPoint = start;
        this.endPoint = null;
    }

    draw(painter: Painter) {
        if(!this.startPoint || !this.endPoint) return;
        painter.line(this.startPoint, this.endPoint, 2.0);
    }
}

export class RectOperation extends Operation {
    startPoint: Vector2;
    endPoint: Vector2;

    constructor(start: Vector2) {
        super();
        this.startPoint = start;
        this.endPoint = null;
    }

    draw(painter: Painter) {
        if(!this.startPoint || !this.endPoint) return;
        painter.rect(this.startPoint, this.endPoint, 2.0);
    }
}

export class CircleOperation extends Operation {
    startPoint: Vector2;
    radius: number;

    fill: boolean;
    thickness : number;

    constructor(start: Vector2) {
        super();
        this.startPoint = start;
        this.radius = 1;
    }

    draw(painter: Painter) {
        painter.circle(this.startPoint, this.radius, this.fill);
    }
}

export class DrawOperation extends Operation { 
    circles : Array<Circle> = [];

    draw(painter: Painter) {
        this.circles.forEach(el => {
            painter.color = el.color;
            painter.circle(el.position, el.radius, el.isFilled);
        })
    }
}