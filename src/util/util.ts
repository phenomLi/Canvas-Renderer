import { Group } from '../shape/Group';
import { ShapeType } from '../render/core';
import { Composite } from '../shape/Composite';
import { Shape } from '../shape/BaseShape';



// 集合类图形深度优先搜索
export function DFS(shapeList: Array<ShapeType>, fn: Function, flag: boolean = true) {
    shapeList.map(item => {
        if(item.attr('type') === 'Group' || item.attr('type') === 'Composite') {
            flag && fn(item);
            DFS((<Group | Composite>item).getShapeList(), fn);
        }
        else {
            fn(item);
        }
    }); 
}



// 计算图形几何中心(仅针对polygon类)
export function calcCenter(path: Array<Array<number>>): Array<number> {
    let xMax: number = path[0][0], 
        yMax: number = path[0][1], 
        xMin: number = path[0][0], 
        yMin: number = path[0][1];

    path.map(pos => {
        if(pos[0] < xMin) xMin = pos[0];
        if(pos[0] > xMax) xMax = pos[0];
        if(pos[1] < yMin) yMin = pos[1];
        if(pos[1] > yMax) yMax = pos[1];
    });

    return [(xMax - xMin)/2, (yMax - yMin)/2];
}



// 进行旋转操作
export function rotate(matrix: DOMMatrix, center: Array<number>, deg: number): DOMMatrix {
    let d = deg/180*Math.PI;

    matrix.a = Math.cos(d); matrix.c = -1*Math.sin(d);
    matrix.b = Math.sin(d); matrix.d = Math.cos(d);
    matrix.e = -center[0]*Math.cos(d) + center[1]*Math.sin(d) + center[0];
    matrix.f = -center[0]*Math.sin(d) - center[1]*Math.cos(d) + center[1];   

    return matrix;
}


// 进行形变操作
export function transform(matrix: DOMMatrix, center: Array<number>, matrixArray: Array<Array<number>>): DOMMatrix {
    if(matrixArray.length === 0) return null;

    matrix.a = matrixArray[0][0]; matrix.c = matrixArray[0][1]; 
    matrix.b = matrixArray[1][0]; matrix.d = matrixArray[1][1];   
    matrix.e = -center[0]*matrixArray[0][0] - center[1]*matrixArray[0][1] + center[0];
    matrix.f = -center[0]*matrixArray[1][0] - center[1]*matrixArray[1][1] + center[1];
    
    return matrix;
}






// 判断坐标是否在某个图形内
export function isInShape(ctx: CanvasRenderingContext2D, shape: Shape | Composite, x: number, y: number): boolean {
    if(shape instanceof Composite) {
        let flag = false;

        DFS(shape.getShapeList(), item => {
            if(ctx.isPointInPath(item.getPath(), x, y)) flag = true;
        }, false);

        return flag;
    }
    else {
        return ctx.isPointInPath(shape.getPath(), x, y);
    }
}

// 判断坐标是否在某个路径上
export function isInPath(ctx: CanvasRenderingContext2D, shape: Shape | Composite, x: number, y: number): boolean {
    if(shape instanceof Composite) {
        let flag = false;

        DFS(shape.getShapeList(), item => {
            if(ctx.isPointInStroke(item.getPath(), x, y)) flag = true;
        }, false);

        return flag;
    }
    else {
        return ctx.isPointInStroke(shape.getPath(), x, y);
    }
}
























































