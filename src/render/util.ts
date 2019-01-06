import { shape } from '../shape/baseShape';
import { group } from '../shape/group';



// 广播器
export const broadcast = {
    listener: Function,

    init(listener: Function) {
        this.listener = listener;
    },

    notify() {
        this.listener();
    }
}


// group集合深度优先搜索
export function DFS(shapeList: Array<shape | group>, fn: Function) {
    shapeList.map(item => {
        if(item instanceof group) {
            fn(item);
            DFS(item.getShapeList(), fn);
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


























































