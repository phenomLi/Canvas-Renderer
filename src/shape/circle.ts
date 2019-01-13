import { Shape, shapeConfig } from './BaseShape';


class circleConfig extends shapeConfig {
    radius: number;
}


//绘制圆形
export class Circle extends Shape {
    private _radius: number; 

    constructor(config: circleConfig) {
        super(config, 'circle');

        this._center = [this._x, this._y];
        this._radius = config.radius;

        this.writableProperties.push('radius');

        this.initSetter();
        this.drawPath().transFormPath();
    }

    config() {
        return {
            ...this.getBaseConfig(),
            radius: this._radius
        };
    }

    drawPath(): Shape {
        this.path = new Path2D();
        this.path.arc(this._x, this._y, this._radius, 0, 2*Math.PI, true);
        return this;
    }
} 