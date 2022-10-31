import type { Vector2 } from "./utils";


export class Painter {
    ctx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    color = 'black';
    fill = false;
    draw = false;
    thickness = 2.0;


    reloadCanvasData() {
        this.ctx.fillStyle = this.color;
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = this.thickness;
    }

    show() {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data;
        console.log(imageData);
    }

    circle(pos: Vector2, radius: number, fill = true) {
        this.reloadCanvasData();

        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
        this.ctx.fill();

        this.ctx.stroke();
    }

    ellipse(pos: Vector2, radius: Vector2, fill = false) {

        this.reloadCanvasData();

        this.ctx.beginPath();
        this.ctx.ellipse(pos.x, pos.y, radius.x, radius.y, 0, 0, 2 * Math.PI);
        if (this.fill) {
            this.ctx.fill();
        }
        this.ctx.stroke();
    }

    line(start: Vector2, end: Vector2, thickness: number) {

        this.reloadCanvasData();

        this.ctx.beginPath();
        this.ctx.moveTo(start.x, start.y);
        this.ctx.lineTo(end.x, end.y);
        this.ctx.stroke();
    }

    rect(start: Vector2, end: Vector2, thickness: number, fill = false) {

        this.reloadCanvasData();

        this.ctx.beginPath();
        const size = end.sub(start);

        this.ctx.rect(start.x, start.y, size.x, size.y);
        if (this.fill) {
            this.ctx.fill();
        }
        this.ctx.stroke();
    }

    async dot(start: Vector2) {

        this.reloadCanvasData();
        this.ctx.fillRect(start.x, start.y, 1, 1);
    }

}
