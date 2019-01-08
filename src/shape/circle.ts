import { Shape, shapeConfig } from './BaseShape';
import Broadcast from './../Broadcast/Broadcast';



class circleConfig extends shapeConfig {
    radius: number;
}


//绘制圆形
export class Circle extends Shape {
    private _radius: number; 

    constructor(config: circleConfig) {
        super(config, 'circle');

        this._radius = config.radius;
    }

    radius(r?: number): number | Shape {
        if(r !== undefined && typeof r === 'number') {
            this._radius = r;
            this._isMount && Broadcast.notify('update');
            return this;
        }
        else {
            return this._radius;
        }
    }

    config() {
        return {
            ...this.getBaseConfig(),
            radius: this._radius
        };
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this._x, this._y, this._radius, 0, 2*Math.PI, true);

        if(this._fill) {
            ctx.fillStyle = this._color;
            ctx.fill();
        }
        else {
            ctx.strokeStyle = this._color;
            ctx.stroke();
        }
    }
} 