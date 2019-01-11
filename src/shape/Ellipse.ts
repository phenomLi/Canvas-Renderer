import { Shape, shapeConfig } from './BaseShape';
import Broadcast from './../Broadcast/Broadcast'; 


class ellipseConfig extends shapeConfig {
    radius: Array<number>;
}


export class Ellipse extends Shape {
    private radiusX: number;
    private radiusY: number;

    constructor(config: ellipseConfig) {
        super(config, 'ellipse');

        this._center = [this._x, this._y];
        this.radiusX = config.radius[0];
        this.radiusY = config.radius[1];

        // 描绘路径,不渲染
        this.drawPath().generatePath();
    }

    config() {
        return {
            ...this.getBaseConfig(),
            radius: [this.radiusX, this.radiusY]
        };
    }

    rX(rx?: number): number | Shape {
        if(rx !== undefined && typeof rx === 'number') {
            this.radiusX = rx;
            this.drawPath();
            this._isMount && Broadcast.notify('update');
            return this;
        }
        else {
            return this.radiusX;
        }
    }

    rY(ry?: number): number | Shape {
        if(ry !== undefined && typeof ry === 'number') {
            this.radiusY = ry;
            this.drawPath();
            this._isMount && Broadcast.notify('update');
            return this;
        }
        else {
            return this.radiusY;
        }
    }

    drawPath(): Shape {
        this._path.ellipse(this._x, this._y, this.radiusX, this.radiusY, this._rotate/180*Math.PI, 0, 2*Math.PI, true);
        return this;
    }
}
































