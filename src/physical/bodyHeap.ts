import { Body } from "./body/body";



export default class BodyHeap {
    private heap: Array<Body>;

    constructor() {
        this.heap = [];
    }


    getHeap(): Array<Body> {
        return this.heap;
    }

    append(body: Body) {
        this.heap.push(body);
    }

    remove(id: Symbol) {
        this.heap.map((item, index) => {
            if(item.getId() === id) {
                this.heap.splice(index, 1);
            }
        });
    }

    clear() {
        this.heap = [];
    }
}