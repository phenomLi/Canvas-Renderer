import { broadcast, DFS } from './util';
import { shape } from '../shape/baseShape';
import { custom } from '../shape/custom';
import { triangle } from '../shape/triangle';
import { circle } from '../shape/circle';
import { rectangle } from '../shape/rectangle';
import { group } from '../shape/group';
import { composite } from '../shape/composite';

 
// 图形类
export type ShapeType = shape | group | composite;


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
    private shapeHeapArray: Array<ShapeType> = new Array();

    constructor(ctx: CanvasRenderingContext2D, canvasInfo: canvasInfo) {
        this.count = 0;
        this.ctx = ctx;
        this.canvasInfo = canvasInfo;
    }

    public getCount(): number {
        return this.count;
    }

    public append(shape: ShapeType) {
        this.shapeHeapArray.push(shape);

        // 更改图形isMounted状态
        shape.isMount(true);
        // 更新画布中图形数量
        this.count += shape.getCount();
       
        broadcast.notify();
    }

    public remove(shape: ShapeType) {
        let id = shape.id();
        // 将要remove的图形在shapeHeapArray中去除
        this.shapeHeapArray.map((item, index) => {
            if(item.id() === id) {
                this.shapeHeapArray.splice(index, 1);
            }
        });

        // 更改图形isMounted状态
        shape.isMount(false);
        // 更新画布中图形数量
        this.count -= shape.getCount();
        
        broadcast.notify();
    }

    public clone(shape: ShapeType): ShapeType {
        if(shape.type() === 'group') {
            let tempGroup = new shapes.group((<group>shape).config());

            DFS((<group>shape).getShapeList(), item => {
                tempGroup.append(this.clone(item));
            });

            return tempGroup;
        }
        else if(shape.type() === 'composite') {
            let tempComposite = new shapes.composite((<composite>shape).config());

            DFS((<composite>shape).getShapeList(), item => {
                tempComposite.join(<shape | composite>this.clone(item));
            });

            return tempComposite;
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

        this.shapeHeapArray.map(item => {
            if(!item.show()) return; 

            this.ctx.save();
            item.draw(this.ctx);
            this.ctx.restore();
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









