import { shape, shapeConfig } from './baseShape';
import { broadcast, rotate } from '../render/util';


class triangleConfig extends shapeConfig {
    edge: number;
}


//绘制三角形
export class triangle extends shape {
    private _edge: number;

    constructor(config: triangleConfig) {
        super(config, 'triangle');

        this._edge = config.edge;
    }

    config() {
        return {
            ...this.getBaseConfig(),
            edge: this._edge
        };
    }

    edge(edge?: number): number | shape {
        if(edge !== undefined && typeof edge === 'number') {
            this._edge = edge;
            this._isMount && broadcast.notify();
            return this;
        }
        else {
            return this._edge;
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        let midEdge = this._edge/2;
        let height = Math.sqrt(this._edge*this._edge - midEdge*midEdge);

        rotate(ctx, [this._x, this._y + height/2], this._rotate);

        ctx.beginPath();
        ctx.moveTo(this._x, this._y);
        ctx.lineTo(this._x - midEdge, this._y + height);
        ctx.lineTo(this._x + midEdge, this._y + height);

        if(this._fill) {
            ctx.fillStyle = this._color;
            ctx.fill();
        }
        else {
            ctx.strokeStyle = this._color;
            ctx.closePath();
            ctx.stroke();
        }
    }
} 