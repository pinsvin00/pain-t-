import type { DrawingMode } from "./drawingMode";
import type { Painter } from "./paint";
import { Vector2 } from "./utils";



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

export class Bucket extends Operation {
    origin: Vector2;
    imageData: ImageData;
    colorSample: ColorSample = null;
    imageSize: Vector2;
    painter: Painter;

    visited: Array<Array<boolean>>;


    getAbsoluteIndex(pos: Vector2) {
        let x = pos.x;
        let y = pos.y;
        return y * 4 * this.imageSize.x + x * 4;
    }

    _2dArray(w: number, h: number): Array<Array<boolean>> {
        const ret = []
        for(let j = 0 ; j < h; j++) {
            const a = []
            for(let i = 0 ; i < w; i ++) {
                a.push(false);
            }
            ret.push(a);
        }

        return ret;

    }

    getPixel(pos: Vector2): ColorSample {
        const start = this.getAbsoluteIndex(pos);
        return new ColorSample(this.imageData.data[start],
                        this.imageData.data[start + 1],
                        this.imageData.data[start + 2],
                        this.imageData.data[start + 3]);
    }

    validCoords(pos: Vector2) {
        return pos.x < this.imageSize.x - 1 && pos.y < this.imageSize.y - 1 && pos.y >= 0 && pos.x >= 0
    }

    setColor(pos: Vector2, sample: ColorSample) {
        const index = this.getAbsoluteIndex(pos);
        this.imageData.data[index] = 255;
        this.imageData.data[index + 1] = 255;
        this.imageData.data[index + 2] = 0;
        this.imageData.data[index + 3] = 255;
        
    }

    drawPixels(origin: Vector2) {

        let queue = [origin];
        const dirs = [
            new Vector2(0,1),
            new Vector2(1,0),
            new Vector2(-1,0),
            new Vector2(0,-1),
        ]

        this.painter.color = 'green';

        while(queue.length != 0) {
            const pos = queue.pop();

            this.visited[pos.x][pos.y] = true;

            if (this.getPixel(pos).compare(this.colorSample)) {
                for(let el of dirs) {
                    const curr = el.add(pos);
                    if(this.validCoords(curr) && !this.visited[curr.x][curr.y]) {
                        queue.push(curr);
                    }
                }
            }

            this.setColor(
                pos, this.colorSample
            )
        }
        this.painter.ctx.putImageData(
            this.imageData, 0, 0
        )


    }

    draw(painter: Painter) {
        this.painter = painter;
        this.imageSize = new Vector2(painter.canvas.width, painter.canvas.height);
        this.imageData = painter.ctx.getImageData(0, 0, this.imageSize.x, this.imageSize.y);

        this.visited = this._2dArray(this.imageSize.x, this.imageSize.y);
        this.colorSample = this.getPixel(this.origin)
        this.painter.draw = true;

        this.drawPixels(this.origin);
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