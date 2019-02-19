import { Shape, shapeConfig } from './BaseShape';
import { line } from './Line';
import { closePolyVex, rotate, rotateVex, isConcavePoly, divideConcavePoly } from './../util/util';
import BoundRect from './boundRect/boundRect';


export type polygonVex = Array<number[]>;
// 多边形的类型（凹，凸）
export enum polygonType {
    convex = 'convex',
    concave = 'concave'
};

class polygonConfig extends shapeConfig {
    vex?: polygonVex; //*
}


//绘制多边形
export class Polygon extends Shape {
    private _vex: polygonVex; 
    protected _absVex: polygonVex;

    // 多边形类型
    protected polygonType: string;
    // 若是凹多边形，该变量保存凹多边形分割后的多个凸多边形
    private convexPolyList: Array<polygonVex>;

    // 包围盒
    protected boundRect: BoundRect;

    constructor(config: polygonConfig, type?: string) {
        super(config, type? type: 'Polygon');

        this._vex = config.vex;

        if(this._type !== 'Polygon') return;

        if(this._vex.length < 3) {
            throw '多边形定点数必须大于3.';
        }

        // 闭合顶点
        closePolyVex(this._vex);

        this._absVex = this._vex.map(v => [this._x + v[0], this._y + v[1]]);
        this.updateBoundRect();
        // 计算图形几何中心
        this._center = [
            (this.boundRect.horizontalRange[1] - this.boundRect.horizontalRange[0])/2, 
            (this.boundRect.verticalRange[1] + this.boundRect.verticalRange[0])/2
        ];

        // 判断多边形类型
        this.polygonType = isConcavePoly(this._absVex)? polygonType.concave: polygonType.convex;
        
        // 若是凹多边形，将多边形分割为多个凸多边形
        if(this.polygonType === polygonType.concave) {
            this.convexPolyList = divideConcavePoly(this._absVex);
        }
        else {
            this.convexPolyList = [];
        }

        this.initSetter();
        this.createPath();
    }
    
    config(): any {
        return {
            ...this.getBaseConfig(),
            vex: this._vex
        };
    }

    // 获取多边形类型
    getPolyType(): string {
        return this.polygonType;
    }

    // 若是凹多边形，获取分割后的凸多边形列表
    getConvexPolyList(): Array<polygonVex> {
        return this.convexPolyList;
    }

    // 获取多边形信息(检测碰撞用)
    getPolygonInfo(): polygonVex {
        return this._absVex;
    }

    // 获取包围盒
    getBoundRect(): BoundRect {
        return this.boundRect;
    }

    // 更新包围盒
    updateBoundRect() {
        this.boundRect.update(this._absVex);
    }

    /**--------------------------------重载setter-------------------------- */

    // 重载setter（x）
    protected setterX(x: number) {
        let d = x - this._x;
        this._x = x;
        this._center[0] = this._center[0] + d;

        // 位移顶点的坐标
        this._absVex = this._vex.map(v => [this._x + v[0], this._y + v[1]]);
        // 更新包围盒
        this.updateBoundRect();

        this.createPath();
    }

    // 重载setter（y）
    protected setterY(y: number) {
        let d = y - this._y;
        this._y = y;
        this._center[1] = this._center[1] + d;

        // 位移顶点的坐标
        this._absVex = this._vex.map(v => [this._x + v[0], this._y + v[1]]);
        // 更新包围盒
        this.updateBoundRect();

        this.createPath();
    }

    // 重载setter（rotate）
    protected setterRotate(rotate: number) {
        if(this.lastRotate !== rotate) {
            this._rotate = rotate;
            this.lastRotate = this._rotate;

            // 旋转顶点的坐标
            this._absVex = rotateVex(this._absVex, this._center, this._rotate - this.lastRotate);
            // 更新包围盒
            this.updateBoundRect();

            this.createPath();
        }
    }

    /**------------------------------------------------------------------- */

    drawPath(): Shape {
        this.path = new Path2D();

        line
        .init(this.path, [this._x, this._y])
        .bee(this._vex)
        .end();

        return this;
    }
} 