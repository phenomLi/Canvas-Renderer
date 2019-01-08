import { Group } from '../shape/Group';
import { ShapeType } from './core';
import { Composite } from '../shape/Composite';
import { Shape } from '../shape/BaseShape';



// 集合类图形深度优先搜索
export function DFS(shapeList: Array<ShapeType>, fn: Function) {
    shapeList.map(item => {
        if(item.type() === 'group' || item.type() === 'composite') {
            fn(item);
            DFS((<Group | Composite>item).getShapeList(), fn);
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

// 判断鼠标是否在某个图形内
export function isInShape(shape: Shape | Composite, x: number, y: number) {

}


























































