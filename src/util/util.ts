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



// 计算图形几何中心(仅针对custom类)
export function calcCenter(path: Array<Array<number>>): Array<number> {
    return [];
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


// 矩阵相乘 
export function matrixMulti(m1: DOMMatrix, m2: DOMMatrix, m: DOMMatrix): DOMMatrix {
    if(m1 === null && m2 === null) return null;
    else if(m1 === null && m2 !== null) return m2;
    else if(m1 !== null && m2 === null) return m1;
    else {
        m.a = m1.a*m2.a + m1.c*m2.b;
        m.b = m1.b*m2.a + m1.d*m2.b;
        m.c = m1.a*m2.c + m1.c*m2.d;
        m.d = m1.b*m2.c + m1.d*m2.d;
        m.e = m1.a*m2.e + m1.c*m2.f + m1.e;
        m.f = m1.b*m2.e + m1.d*m2.f + m1.f;

        return m;
    }
}


// 判断坐标是否在某个图形内
export function isInShape(ctx: CanvasRenderingContext2D, shape: Shape | Composite, x: number, y: number): boolean {
    if(shape.attr('type') === 'Composite') {
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
export function isInPath(ctx: CanvasRenderingContext2D, path: Path2D, x: number, y: number): boolean {
    return ctx.isPointInStroke(path, x, y);
}
























































