import { Shape, shapeConfig } from './BaseShape';



class ellipseConfig extends shapeConfig {
    radius: Array<number>;
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
        this.drawPath().transFormPath();
    }

    config() {
        return {
            ...this.getBaseConfig(),
            radius: [this._radiusX, this._radiusY]
        };
    }

    // 新增setter（radiusX）
    setRadiusX(rx: number) {
        this._radiusX = rx;
        this.drawPath().transFormPath();
    }

    // 新增setter（radiusY）
    setRadiusY(ry: number) {
        this._radiusY = ry;
        this.drawPath().transFormPath();
    }

    // 重载setter（rotate）
    setRotate(deg: number) {
        this._rotate = deg;
        this.drawPath().transFormPath();
    }

    drawPath(): Shape {
        this.path = new Path2D();
        this.path.ellipse(this._x, this._y, this._radiusX, this._radiusY, this._rotate/180*Math.PI, 0, 2*Math.PI, true);
        return this;
    }
}
































