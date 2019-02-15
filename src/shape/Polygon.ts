import { Shape, shapeConfig } from './BaseShape';
import { line } from './Line';
import { calcCenter } from './../util/util';


class polygonConfig extends shapeConfig {
    path: Array<number[]>; //*
}


//绘制多边形
export class Polygon extends Shape {
    private _path: Array<number[]>;

    constructor(config: polygonConfig) {
        super(config, 'Polygon');

        this._path = config.path;
        this._center = calcCenter(this._path);

        this.initSetter();
        this.drawPath().rotatePath().transFormPath();
    }

    config() {
        return {
            ...this.getBaseConfig(),
            path: this._path
        };
    }


    drawPath(): Shape {
        this.path = new Path2D();

        if(this._path.length > 1) {
            line
            .init(this.path, [this._x, this._y])
            .bee(this._path)
            .end();
        }

        return this;
    }
} 