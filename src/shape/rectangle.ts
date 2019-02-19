import { Shape, shapeConfig } from './BaseShape';
import { line } from './Line';
import BoundRect from './boundRect/boundRect';
import { Polygon, polygonType } from './Polygon';


class rectangleConfig extends shapeConfig {
    edge: Array<number>; //*
}


//绘制矩形
export class Rectangle extends Polygon {
    private _width: number;
    private _height: number;

    constructor(config: rectangleConfig) {
        super({
            ...config,
            vex: []
        }, 'Rectangle');

        // 矩形是凸多边形
        this.polygonType = polygonType.convex;

        this._width = config.edge[0];
        this._height = config.edge[1];
        this._center = [this._x + this._width/2, this._y + this._height/2];
        // 设置矩形的顶点
        this._absVex = [
            [this._x, this._y],
            [this._x + this._width, this._y],
            [this._x + this._width, this._y + this._height],
            [this._x, this._y + this._height],
            [this._x, this._y]
        ];

        this.boundRect = new BoundRect(this._absVex);

        this.initSetter();
        this.createPath();
    }

    config() {
        return {
            ...this.getBaseConfig(),
            edge: [this._width, this._height]
        };
    }

    drawPath(): Shape {
        this.path = new Path2D();
        line
        .init(this.path, [this._x, this._y])
        .bee([[this._width, 0], [this._width, this._height], [0, this._height], [0, 0]])
        .end();
        return this;
    }
} 