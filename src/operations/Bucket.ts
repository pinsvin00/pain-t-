import { canvas } from "../paint/bufferCanvasProvider";
import type { Painter } from "../Painter";
import { hexToRgb, Vector2, _2dArray } from "../utils";
import { Operation, ColorSample } from "./operation";

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

    getPixel(pos: Vector2): ColorSample {
        const start = this.getAbsoluteIndex(pos);
        return new ColorSample(this.imageData.data[start],
            this.imageData.data[start + 1],
            this.imageData.data[start + 2],
            this.imageData.data[start + 3]);
    }

    validCoords(pos: Vector2) {
        return pos.x < this.imageSize.x && pos.y < this.imageSize.y && pos.y >= 0 && pos.x >= 0;
    }

    setColor(pos: Vector2, sample: ColorSample) {
        const index = this.getAbsoluteIndex(pos);
        this.imageData.data[index] = sample.r;
        this.imageData.data[index + 1] = sample.g;
        this.imageData.data[index + 2] = sample.b;
        this.imageData.data[index + 3] = 255;
    }

    drawPixels(origin: Vector2) {

        let queue = [origin];
        const dirs = [
            new Vector2(0, 1),
            new Vector2(1, 0),
            new Vector2(-1, 0),
            new Vector2(0, -1),
        ];

        this.painter.color = 'green';
        const desiredColor = hexToRgb(this.color);

        while (queue.length != 0) {
            const pos = queue.pop();

            this.visited[pos.x][pos.y] = true;

            if (this.getPixel(pos).compare(this.colorSample)) {
                for (let el of dirs) {
                    const curr = el.add(pos);
                    if (this.validCoords(curr) && !this.visited[curr.x][curr.y]) {
                        queue.push(curr);
                    }
                }
            }

            this.setColor(
                pos, desiredColor
            );
        }

        this.painter.ctx.putImageData(
            this.imageData, 0, 0
        );


    }

    draw(painter: Painter) {
        this.painter = painter;
        this.imageSize = new Vector2(canvas.width, canvas.height);
        this.imageData = painter.ctx.getImageData(0, 0, this.imageSize.x, this.imageSize.y);

        this.visited = _2dArray(this.imageSize.x, this.imageSize.y);
        this.colorSample = this.getPixel(this.origin);
        this.painter.draw = true;

        this.drawPixels(this.origin);
    }
}
