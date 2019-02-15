import { Shape, shapeConfig } from './BaseShape';


class sectorConfig extends shapeConfig {
    radius: number; //*
    range: number[]; //*
}


//绘制扇形
export class Sector extends Shape {
    private _radius: number; 
    private _range: number[];

    constructor(config: sectorConfig) {
        super(config, 'Sector');

        this._center = [this._x, this._y];
        this._radius = config.radius;
        this._range = config.range;

        this.initSetter();
        this.drawPath().rotatePath().transFormPath();
    }

    config() {
        return {
            ...this.getBaseConfig(),
            radius: this._radius,
            range: this._range
        };
    }

    drawPath(): Shape {
        this.path = new Path2D();
        this.path.arc(this._x, this._y, this._radius, this._range[0]/180*Math.PI, this._range[1]/180*Math.PI, true);
        return this;
    }
} 