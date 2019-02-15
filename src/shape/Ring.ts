import { Shape, shapeConfig } from './BaseShape';


class ringConfig extends shapeConfig {
    radius: number; //*
    width: number; //*
}


//绘制环形
export class Ring extends Shape {
    private _radius: number; 
    private _width: number;

    constructor(config: ringConfig) {
        super(config, 'Ring');

        this._center = [this._x, this._y];
        this._radius = config.radius;
        this._width = config.width;

        this.initSetter();
        this.drawPath().rotatePath().transFormPath();
    }

    config() {
        return {
            ...this.getBaseConfig(),
            radius: this._radius,
            width: this._width
        };
    }

    drawPath(): Shape {
        this.path = new Path2D();
     
        this.path.arc(this._x, this._y, this._radius + this._width, 0, Math.PI*2, false);
        this.path.arc(this._x, this._y, this._radius, 0, Math.PI*2, true);

        return this;
    }
} 