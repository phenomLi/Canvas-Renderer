import { Group } from '../shape/Group';
import { ShapeType } from '../render/LayerManager';
import { Composite } from '../shape/composite';
import { Shape } from '../shape/BaseShape';
import { Matrix, RotateMatrix, TranslateMatrix, ResultMatrix, ScaleMatrix } from '../math/matrix';



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



// 闭合多边形顶点，使其构成闭合图形 
export function closePolyVex(vex: Array<number[]>) {
    if(vex[vex.length - 1] && vex[0].toString() !== vex[vex.length - 1].toString()) {
        vex.push(vex[0]);
    }
}

// 计算多边形范围
export function calcPolyRange(vex: Array<number[]>, x: number, y: number): Array<number[]> {
    let xMax: number = vex[0][0], 
        yMax: number = vex[0][1], 
        xMin: number = vex[0][0], 
        yMin: number = vex[0][1];

    vex.map(pos => {
        if(pos[0] < xMin) xMin = pos[0];
        if(pos[0] > xMax) xMax = pos[0];
        if(pos[1] < yMin) yMin = pos[1];
        if(pos[1] > yMax) yMax = pos[1];
    });

    return [[x + xMin, x + xMax], [y + yMin, y + yMax]];
}


// 进行位移操作
export function translate(pos: number[]): DOMMatrix {
    Matrix.set(TranslateMatrix, [[1, 0, pos[0]], [0, 1, pos[1]]]);
    return TranslateMatrix;
}


// 进行旋转操作
export function rotate(center: Array<number>, deg: number): DOMMatrix {
    let d = deg/180*Math.PI;

    Matrix.init(ResultMatrix);

    Matrix.set(TranslateMatrix, [[1, 0, center[0]], [0, 1, center[1]]]);
    Matrix.set(RotateMatrix, [[Math.cos(d), -1*Math.sin(d), 0], [Math.sin(d), Math.cos(d), 0]]);
    
    Matrix.mul(TranslateMatrix, RotateMatrix, ResultMatrix);
    Matrix.set(TranslateMatrix, [[1, 0, -center[0]], [0, 1, -center[1]]]);

    Matrix.mul(ResultMatrix, TranslateMatrix, ResultMatrix);

    return ResultMatrix;
}



// 进行缩放操作
export function scale(center: Array<number>, scaleArray: number[]): DOMMatrix {
    Matrix.init(ResultMatrix);

    Matrix.set(TranslateMatrix, [[1, 0, center[0]], [0, 1, center[1]]]);
    Matrix.set(ScaleMatrix, [[scaleArray[0], 0, 0], [0, scaleArray[1], 0]]);

    Matrix.mul(TranslateMatrix, ScaleMatrix, ResultMatrix);
    Matrix.set(TranslateMatrix, [[1, 0, -center[0]], [0, 1, -center[1]]]);

    Matrix.mul(ResultMatrix, TranslateMatrix, ResultMatrix);

    return ResultMatrix;
}




/**------------------------------------------util-------------------------------------------------- */

// 数组深拷贝
export function arrayDeepCopy<T>(arr): T {
    return arr.map(item => Array.isArray(item)? arrayDeepCopy(item): item);
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









// 获取随机颜色
export function getRandomColor() {
    return "rgb(" + Math.round(Math.random() * 255) + "," + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 10) + ')';
}



































