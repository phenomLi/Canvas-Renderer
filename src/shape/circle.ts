import { shape, shapeConfig } from './baseShape';
import { broadcast } from './../render/core';



class circleConfig extends shapeConfig {
    radius: number;
}


//绘制圆形
export class circle extends shape {
    private _radius: number; 

    constructor(config: circleConfig) {
        super(config);

        this._type = 'circle';
        this._radius = config.radius;
    }

    radius(r?: number): number | shape {
        if(r !== undefined && typeof r === 'number') {
            this._radius = r;
            this._isMount && broadcast.notify();
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