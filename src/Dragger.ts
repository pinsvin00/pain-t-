

export class Dragger {

    element: HTMLElement;
    subject: HTMLElement;

    active = false;

    constructor(id: string, subjectId: string) {
        this.element = document.getElementById(id);
        this.subject = document.getElementById(subjectId);
        if(this.element === null || this.subject === null){
            console.error(`Couldnt find element or subject\n element ${this.element} subject ${this.subject}`);
            return;
        }

        this.element.addEventListener('mousedown', ()=> {
            this.active = true;
        });

        document.addEventListener('mousemove',  (e: MouseEvent) => {
            if(!this.active) return;

            this.subject.setAttribute("width", e.clientX - 20 + "px");
            this.subject.setAttribute("height", e.clientY  - 20 + "px");

            this.element.style.setProperty("left", e.clientX + "px");
            this.element.style.setProperty("top", e.clientY + "px");
        })

        this.element.onmouseup = () => {
            this.active = false;
        }
    }


    detach() {

    }
}