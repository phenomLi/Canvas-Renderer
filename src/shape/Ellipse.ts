import { Shape, shapeConfig } from './BaseShape';



class ellipseConfig extends shapeConfig {
    radius: Array<number>; //*
}


export class Ellipse extends Shape {
    private _radiusX: number;
    private _radiusY: number;

    constructor(config: ellipseConfig) {
        super(config, 'Ellipse');

        this._center = [this._x, this._y];
        this._radiusX = config.radius[0];
        this._radiusY = config.radius[1];

        this.initSetter();
        this.createPath();
    }

    config() {
        return {
            ...this.getBaseConfig(),
            radius: [this._radiusX, this._radiusY]
        };
    }

    drawPath(): Shape {
        this.path = new Path2D();
        this.path.ellipse(this._x, this._y, this._radiusX, this._radiusY, 0, 0, 2*Math.PI, true);
        return this;
    }
}
































