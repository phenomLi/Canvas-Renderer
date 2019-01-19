import { Shape, shapeConfig } from './BaseShape';
import { line } from './Line';


class triangleConfig extends shapeConfig {
    edge: number; //*
}


//绘制三角形
export class Triangle extends Shape {
    private _edge: number;
    private midEdge: number;
    private height: number;

    constructor(config: triangleConfig) {
        super(config, 'Triangle');

        this._edge = config.edge;
        this.midEdge = this._edge/2;
        this.height = Math.sqrt(this._edge*this._edge - this.midEdge*this.midEdge);
        this._center = [this._x, this._y + this.height/2];

        this.initSetter();
        this.drawPath().rotatePath().transFormPath();
    }

    config() {
        return {
            ...this.getBaseConfig(),
            edge: this._edge
        };
    }
    
    drawPath(): Shape {
        this.path = new Path2D();
        line
        .init(this.path, [this._x, this._y])
        .bee([[-this.midEdge, this.height], [this.midEdge, this.height], [0, 0]])
        .end();
        return this;
    }
} 