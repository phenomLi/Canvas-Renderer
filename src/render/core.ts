import { broadcast, DFS } from './util';
import { shape } from '../shape/baseShape';
import { custom } from '../shape/custom';
import { triangle } from '../shape/triangle';
import { circle } from '../shape/circle';
import { rectangle } from '../shape/rectangle';
import { group } from '../shape/group';
import { composite } from '../shape/composite';
import { line } from '../shape/line';

 
class canvasInfo {
    width: number;
    height: number;
}


// 画布元素堆
export class shapeHeap {
    // 图形个数
    private count: number;
    private canvasInfo: canvasInfo; 
    private ctx: CanvasRenderingContext2D;
    private shapeHeapArray: Array<shape | group> = new Array();

    constructor(ctx: CanvasRenderingContext2D, canvasInfo: canvasInfo) {
        this.count = 0;
        this.ctx = ctx;
        this.canvasInfo = canvasInfo;
    }

    public getCount(): number {
        return this.count;
    }

    public append(shape: shape | group) {
        this.shapeHeapArray.push(shape);
        shape.isMount(true);

        // 渲染到画布后执行钩子函数
        shape.mounted();

        if(shape instanceof group) {
            DFS(shape.getShapeList(), item => {
                item.isMount(true);
                // 渲染到画布后执行钩子函数
                item.mounted();
            });

            this.count += shape.getCount();
        }
        else {
            this.count += 1;
        }

        broadcast.notify();
    }

    public remove(shape: shape | group) {
        let id = shape.id();

        this.shapeHeapArray.map((item, index) => {
            if(item.id() === id) {
                this.shapeHeapArray.splice(index, 1);
            }
        });

        shape.isMount(false);
        // 从画布中移除后执行钩子函数
        shape.removed();

        if(shape instanceof group) {
            DFS(shape.getShapeList(), item => {
                item.isMount(false);
                // 从画布中移除后执行钩子函数
                item.removed();
            });

            this.count -= shape.getCount();
        }
        else {
            this.count -= 1;
        }

        broadcast.notify();
    }

    public clone(shape: shape | group): shape | group {
        if(shape instanceof group) {
            let g = new shapes.group(shape.config());

            DFS(shape.getShapeList(), item => {
                g.append(this.clone(item));
            });

            return g;
        }
        else {
            return new shapes[shape.type()](shape.config());
        }
    }

    public clear() {
        DFS(this.shapeHeapArray, item => {
            item.isMount(false);
        });

        this.shapeHeapArray = [];
        this.count = 0;
        this.ctx.clearRect(0, 0, this.canvasInfo.width, this.canvasInfo.height);
    }

    public reRender() {
        this.ctx.clearRect(0, 0, this.canvasInfo.width, this.canvasInfo.height);
        this.render(this.shapeHeapArray);
    }

    protected render(shapeList: Array<shape | group>) {
        shapeList.map(item => {
            if(!item.show()) return; 

            if(item instanceof group) {
                this.render(item.getShapeList());
            }
            else {
                this.ctx.save();
                item.draw(this.ctx);
                this.ctx.restore();
            }
        });
    }
}




// 图形元素集合
export const shapes = {
    custom,
    circle,
    rectangle,
    triangle,
    group,
    composite
}









