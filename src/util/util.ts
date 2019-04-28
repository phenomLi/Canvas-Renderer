import { Group } from '../shape/Group';
import { ShapeType } from '../render/LayerManager';
import { Composite } from '../shape/composite';
import { Shape } from '../shape/BaseShape';
import { Matrix, RotateMatrix, TranslateMatrix, ResultMatrix, ScaleMatrix } from '../math/matrix';
import { Vector, vector } from '../math/vector';
import { polygonVex } from '../dynamic/body/PolygonBody';



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

// 旋转多边形的顶点
export function rotateVex(vex: Array<number[]>, center:number[], deg: number): Array<number[]> {
    let d = deg/180*Math.PI;

    return vex.map(v => [
        (v[0] - center[0])*Math.cos(d) - (v[1] - center[1])*Math.sin(d) + center[0],
        (v[1] - center[1])*Math.cos(d) + (v[0] - center[0])*Math.sin(d) + center[1]
    ]);
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




// 判断是否为凹多边形
export function isConcavePoly(vex: Array<number[]>): boolean {
    let flag: boolean = false,
        prev: number, cur: number;

    for(let i = 1, len = vex.length; i < len - 1; i++) {
        let v1 = [vex[i][0] - vex[i - 1][0], vex[i][1] - vex[i - 1][1]],
            v2 = [vex[i + 1][0] - vex[i][0], vex[i + 1][1] - vex[i][1]];

        // 计算向量叉积
        cur = Vector.cor(v1, v2) >= 0? 1: -1;

        if(prev !== undefined && prev !== cur) {
            flag = true;
            break; 
        }
        
        prev = cur;
    }

    return flag;
}   


// 将凹多边形分割为多个凸多边形(旋转分割法)
export function divideConcavePoly(vex: Array<number[]>): Array<Array<number[]>> {
    // 将拆分出来的多边形保存到这个数组
    let polygonList: Array<Array<number[]>> = [];

    let i, j, len = vex.length,
        flag = false;

    let polygon1 = <Array<number[]>>arrayDeepCopy(vex), polygon2 = [];

    for(i = 0, len = vex.length; i < len - 2; i++) {
        let vAxis = [vex[i + 1][0] - vex[i][0], vex[i + 1][1]- vex[i][1]], 
            v = [vex[i + 2][0] - vex[i][0], vex[i + 2][1] - vex[i][1]];

        if(Vector.cor(vAxis, v) < 0) {
            for(j = i + 3; j < len; j++) {
                v = [vex[j][0] - vex[i][0], vex[j][1]- vex[i][1]];
                if(Vector.cor(vAxis, v) > 0) {
                    flag = true;
                    break;
                }
            }

            if(flag) break;
        }
    }

    // 拆分为两个多边形polygon1和polygon2
    let dp1 = polygon1[i + 1],
        dp2 = polygon1[j];

    polygon2 = polygon1.splice(i + 2, j - (i + 2));
    polygon2.unshift(dp1);
    polygon2.push(dp2);

    // 闭合拆分出来的多边形
    closePolyVex(polygon2);

    polygonList.push(polygon1);
    polygonList.push(polygon2);

    // 检测拆分出来的两个多边形是否是凹多边形，若果是，继续递归拆分
    if(isConcavePoly(polygon1)) {
        polygonList = polygonList.concat(divideConcavePoly(polygon1));
    }
    if(isConcavePoly(polygon2)) {
        polygonList = polygonList.concat(divideConcavePoly(polygon2));
    }

    return polygonList;
}


// 判断两条共线线段是否有重叠
export function isOverlaps(line1: number[], line2: number[]): boolean {
    return (line1[1] > line2[0] && line1[0] < line2[1]) || (line2[1] > line1[0] && line2[0] < line1[1]);

    
}


// 若两条共线线段重叠了，返回重叠长度
export function getOverlapsLength(line1: number[], line2: number[]): number {
    // 若l1在前
    if(line1[1] > line2[1]) {
        return line2[1] - line1[0];
    }
    // l2在前
    else {
        return line1[1] - line2[0];
    }
}



// 获取随机颜色
export function getRandomColor() {
    return "rgb(" + Math.round(Math.random() * 255) + "," + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 10) + ')';
}


// 判断点是否在多边形内
export function isPointInPoly(vex: polygonVex, p: vector): boolean {
    let i, j, len, flag = false;

    for(i = 0, len = vex.length, j = len - 1; i < len; j = i++) {
        if(((vex[i][1] > p[1]) != (vex[j][1] > p[1])) 
        && (p[0] < (vex[j][0] - vex[i][0])*(p[1] - vex[i][1])/(vex[j][1] - vex[i][1]) + vex[i][0]))
            flag = !flag;
    }

    return flag;
};



// 找出一点在直线的投影点
export function findProjectionPoint(line: vector[], p: vector): vector {
    let pro = [],
        ref = line[0],
        k = line[0][0] === line[1][0]? NaN: (line[0][1] - line[1][1])/(line[0][0] - line[1][0]);

    if (k == 0) {
        pro[0] = p[0];
        pro[1] = ref[1];
    }
    else if(isNaN(k)) {
        pro[0] = ref[0];
        pro[1] = p[1];
    }
    else{
        pro[0] = ((k*ref[0] + p[0]/k + p[1] - ref[1])/(1/k + k));
        pro[1] = -1/k*(pro[0] - p[0]) + p[1];
    }

    return pro;
}

// 找出多个点的中点坐标
export function findMidPoint(points: vector[]): vector {
    if(points.length === 0) return null;
    if(points.length === 1) return points[0];

    let p1 = points[0],
        p2 = points[1];

    return [(p1[0] + p2[0])*0.5, (p1[1] + p2[1])*0.5];
}


// 计算平均数
export function calcAverage(data: number[]): number {
    let n = data.length,
        sum = 0;

    for(let i = 0; i < n; i ++) {
        sum += data[i];
    }

    return sum/n;
}


// 计算标准差
export function calcStandardDeviation(data: number[]): number {
    let sum = 0,
        n = data.length,
        x = calcAverage(data);

    for(let i = 0; i < n; i++) {
        sum += Math.pow(data[i] - x, 2);
    }

    return Math.sqrt(sum/n);
}

































