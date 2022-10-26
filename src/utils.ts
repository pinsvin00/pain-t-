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
