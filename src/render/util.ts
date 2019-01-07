import { group } from '../shape/group';
import { ShapeType } from './core';
import { composite } from '../shape/composite';



// 广播器
export const broadcast = {
    notifyCount: Number,
    taskCount: Number,
    listener: Function,

    init(listener: Function) {
        this.notifyCount = 0;
        this.taskCount = 0;
        this.listener = listener;
    },

    notify() {
        this.notifyCount++;

        // 异步更新
        setTimeout(function() {
            this.taskCount++;

            if(this.taskCount === this.notifyCount) {
                console.log('申请更新次数：' + this.notifyCount);

                this.taskCount = this.notifyCount = 0;
                this.listener();
            }
        }.bind(this), 0);
    }
}


// group集合深度优先搜索
export function DFS(shapeList: Array<ShapeType>, fn: Function) {
    shapeList.map(item => {
        if(item.type() === 'group' || item.type() === 'composite') {
            fn(item);
            DFS((<group | composite>item).getShapeList(), fn);
        }
        else {
            fn(item);
        }
    }); 
}



// 计算图形几何中心(仅针对custom类)
export function calcCenter(path: Array<Array<number>>): Array<number> {
    return [];
}



// 进行旋转操作
export function rotate(ctx: CanvasRenderingContext2D, center: Array<number>, deg: number) {
    ctx.translate(center[0], center[1]);
    ctx.rotate(deg/180*Math.PI);
    ctx.translate(-center[0], -center[1]);
} 


























































