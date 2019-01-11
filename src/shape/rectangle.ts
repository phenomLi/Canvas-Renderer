import { Shape, shapeConfig } from './BaseShape';
import Broadcast from './../Broadcast/Broadcast';


class rectangleConfig extends shapeConfig {
    edge: Array<number>;
}


//绘制矩形
export class Rectangle extends Shape {
    private _width: number;
    private _height: number;

    constructor(config: rectangleConfig) {
        super(config, 'rectangle');

        this._width = config.edge[0];
        this._height = config.edge[1];

        // 描绘路径,不渲染
        this.drawPath().generatePath();
    }

    config() {
        return {
            ...this.getBaseConfig(),
            edge: [this._width, this._height]
        };
    }

    width(width?: number): number | Shape {
        if(width !== undefined && typeof width === 'number') {
            this._width = width;
            this.drawPath();
            this._isMount && Broadcast.notify('update');
            return this;
        }
        else {
            return this._width;
        }
    }

    height(height?: number): number | Shape {
        if(height !== undefined && typeof height === 'number') {
            this._height = height;
            this.drawPath();
            this._isMount && Broadcast.notify('update');
            return this;
        }
        else {
            return this._height;
        }
    }

    drawPath(): Shape {
        this._center = [this._x + this._width/2, this._y + this._height/2];
        this._path.rect(this._x, this._y, this._width, this._height);

        return this;
    }
} 