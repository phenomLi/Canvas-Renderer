import { Shape, shapeConfig } from './BaseShape';
import BoundRect from './boundRect/boundRect';


export class circleInfo {
    x: number;
    y: number;
    radius: number;
}


class circleConfig extends shapeConfig {
    radius: number; //*
}


//绘制圆形
export class Circle extends Shape {
    private _radius: number; 
    private boundRect: BoundRect;

    constructor(config: circleConfig) {
        super(config, 'Circle');

        this._center = [this._x, this._y];
        this._radius = config.radius;

        this.boundRect = new BoundRect({
            x: this._x,
            y: this._y,
            radius: this._radius
        });

        this.initSetter();
        this.createPath();
    }

    config() {
        return {
            ...this.getBaseConfig(),
            radius: this._radius
        };
    }

    // 获取圆形信息(检测碰撞用)
    getCircleInfo(): circleInfo {
        return {
            x: this._x,
            y: this._y,
            radius: this._radius
        };
    }

    // 获取包围盒
    getBoundRect(): BoundRect {
        return this.boundRect;
    }


    // 更新包围盒
    updateBoundRect() {
        this.boundRect.update({
            x: this._x,
            y: this._y,
            radius: this._radius
        });
    }

    /**--------------------------------重载setter-------------------------- */

    // 重载setter（x）
    protected setterX(x: number) {
        let d = x - this._x;
        this._x = x;
        this._center[0] = this._center[0] + d;

        // 更新包围盒
        this.updateBoundRect();

        this.createPath();
    }

    // 重载setter（y）
    protected setterY(y: number) {
        let d = y - this._y;
        this._y = y;
        this._center[1] = this._center[1] + d;

        // 更新包围盒
        this.updateBoundRect();

        this.createPath();
    }


    drawPath(): Shape {
        this.path = new Path2D();
        this.path.arc(this._x, this._y, this._radius, 0, 2*Math.PI, true);
        return this;
    }
} 