import type { DrawingMode } from "../drawingMode";
import type { Painter } from "../Painter";
import { Vector2 } from "../utils";




export class Operation {
    color: string;
    fill: boolean;
    thickness : number;

    constructor() {
        
    }
    
    draw(painter: Painter) {
        painter.color = this.color;
        painter.fill = this.fill;
        painter.thickness = this.thickness;
    }
}



export class Circle { 
    position: Vector2;
    radius: number;
    color: string;

    constructor(pos: Vector2, radius: number, color = 'black') {
        this.position = pos;
        this.radius = radius;
        this.color = color;
    }
}


export class ColorSample {
    r: number;
    g: number;
    b: number;
    a: number;

    constructor(r: number, g: number, b: number, a: number) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    compare(sample: ColorSample) {
        return (
            this.r === sample.r &&
            this.g === sample.g &&
            this.b === sample.b &&
            this.a === sample.a
        )
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
        super.draw(painter);
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
        super.draw(painter);
        painter.rect(this.startPoint, this.endPoint, 2.0);
    }
}

export class EllipseOperation extends Operation {
    startPoint: Vector2;
    radius: Vector2;

    constructor(start: Vector2) {
        super();
        this.startPoint = start;
        this.radius = new Vector2(0,0);
    }

    draw(painter: Painter) {
        painter.color = this.color;
        super.draw(painter);
        painter.ellipse(this.startPoint, this.radius);
    }
}

export class DrawOperation extends Operation { 
    circles : Array<Circle> = [];

    draw(painter: Painter) {
        this.circles.forEach(el => {
            painter.color = el.color;
            painter.circle(el.position, el.radius, false);
        })
    }
}