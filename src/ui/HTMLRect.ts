import {generateUUID, Vector2, vectorsByModule} from "../utils";
import {HTMLDragger} from "../Dragger";

export const addDragger = (rect: HTMLElement, pos: Vector2) => {
    const draggerUUID = generateUUID();
    const draggerIco = document.createElement("div");
    draggerIco.id = draggerUUID;
    draggerIco.style.borderRadius = "100%";
    draggerIco.style.position = "relative";

    draggerIco.style.top = pos.y + "px";
    draggerIco.style.left = pos.x + "px";

    draggerIco.style.backgroundColor = "gray";

    draggerIco.style.width = "25px";
    draggerIco.style.height = "25px";

    rect.appendChild(draggerIco);

    draggerIco.setAttribute("class", "dragger");

    const dragger = new HTMLDragger(draggerUUID, [rect.id]);
    console.log(draggerIco);
    rect.appendChild(draggerIco);

    return draggerIco;
};

export class HTMLRect {
    isResizable = false;
    staticCSS = "";

    constructor(is_resizible = false, style = "") {
        this.staticCSS = style;
        this.isResizable = is_resizible;
    }

    getRect(v1: Vector2, v2: Vector2) {
        const rect = document.createElement("div");
        rect.style.position = "relative";
        const rectUUID = generateUUID();
        rect.id = rectUUID;
        let start, end;
        [start, end] = vectorsByModule([v1, v2]);

        let diff = end.sub(start);

        rect.style.top = start.y + "px";
        rect.style.left = start.x + "px";

        rect.style.width = diff.x + "px";
        rect.style.height = diff.y + "px";

        rect.style.border = "3px solid blue";
        rect.style.backgroundColor = "rgba(1,34,255,0.44)";
        rect.style.borderStyle = "dashed";

        return rect;
    }
}