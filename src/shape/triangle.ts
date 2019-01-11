import { Shape, shapeConfig } from './BaseShape';
import Broadcast from './../Broadcast/Broadcast';


class triangleConfig extends shapeConfig {
    edge: number;
}


//绘制三角形
export class Triangle extends Shape {
    private _edge: number;
    private midEdge: number;
    private height: number;

    constructor(config: triangleConfig) {
        super(config, 'triangle');

        this._edge = config.edge;
        this.midEdge = this._edge/2;
        this.height = Math.sqrt(this._edge*this._edge - this.midEdge*this.midEdge);
        this._center = [this._x, this._y + this.height/2];

        this.drawPath().generatePath();
    }

    config() {
        return {
            ...this.getBaseConfig(),
            edge: this._edge
        };
    }

    edge(edge?: number): number | Shape {
        if(edge !== undefined && typeof edge === 'number') {
            this._edge = edge;
            this.drawPath();
            this._isMount && Broadcast.notify('update');
            return this;
        }
        else {
            return this._edge;
        }
    }
    
    drawPath(): Shape {
        this._path.moveTo(this._x, this._y);
        this._path.lineTo(this._x - this.midEdge, this._y + this.height);
        this._path.lineTo(this._x + this.midEdge, this._y + this.height);

        return this;
    }
} 