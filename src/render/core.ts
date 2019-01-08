import { DFS, isInShape } from './util';
import Broadcast from './../Broadcast/Broadcast';
import { Shape } from '../shape/BaseShape';
import { Custom } from '../shape/Custom';
import { Triangle } from '../shape/Triangle';
import { Circle } from '../shape/Circle';
import { Rectangle } from '../shape/Rectangle';
import { Group } from '../shape/Group';
import { Composite } from '../shape/Composite';

 
// 图形类
export type ShapeType = Shape | Group | Composite;


class canvasInfo {
    width: number;
    height: number;
}


// 画布元素堆
export class shapeHeap {
    // 图形个数
    private count: number;
    // canvas信息（长宽）
    private canvasInfo: canvasInfo; 
    // canvas上下文对象
    private ctx: CanvasRenderingContext2D;
    // 图形堆数组
    private shapeHeapArray: Array<ShapeType> = new Array();
    // 异步更新请求次数
    private aSyncUpdateRequestCount: number;
    // 更新请求次数
    private updateRequestCount: number;

    constructor(ctx: CanvasRenderingContext2D, canvasInfo: canvasInfo) {
        this.count = 0;
        this.ctx = ctx;
        this.canvasInfo = canvasInfo;
        this.aSyncUpdateRequestCount = 0;
        this.updateRequestCount = 0;
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

        Broadcast.notify('update');
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

        Broadcast.notify('update');
    }

    public clone(shape: ShapeType): ShapeType {
        if(shape.type() === 'group') {
            let tempGroup = new shapes.Group((<Group>shape).config());

            DFS((<Group>shape).getShapeList(), item => {
                tempGroup.append(this.clone(item));
            });

            return tempGroup;
        }
        else if(shape.type() === 'composite') {
            let tempComposite = new shapes.Composite((<Composite>shape).config());

            DFS((<Composite>shape).getShapeList(), item => {
                tempComposite.join(<Shape | Composite>this.clone(item));
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

    /** 更新画布 */
    public update() {
        this.updateRequestCount++;

        // 异步更新
        setTimeout(function() {
            this.aSyncUpdateRequestCount++;

            if(this.aSyncUpdateRequestCount === this.updateRequestCount) {
                console.log('申请更新次数：' + this.notifyCount);

                this.updateRequestCount = this.aSyncUpdateRequestCount = 0;
                this.reRender();
            }
        }.bind(this), 0);
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
    Custom,
    Circle,
    Rectangle,
    Triangle,
    Group,
    Composite
}

// 实用函数集合
export const utils = {
    isInShape,
}









