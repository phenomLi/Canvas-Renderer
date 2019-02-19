import { Shape, shapeConfig } from './BaseShape';
import { line } from './Line';


class roundRectConfig extends shapeConfig {
    edge: Array<number>; //*
    round: number; //*
}


//绘制矩形
export class RoundRect extends Shape {
    private _width: number;
    private _height: number;
    private _round: number;

    constructor(config: roundRectConfig) {
        super(config, 'RoundRect');

        this._width = config.edge[0];
        this._height = config.edge[1];
        this._round = config.round;
        this._center = [this._x + this._width/2, this._y + this._height/2 + this._round];

        this.initSetter();
        this.createPath();
    }

    config() {
        return {
            ...this.getBaseConfig(),
            edge: [this._width, this._height],
            round: this._round
        };
    }

    drawPath(): Shape {
        this.path = new Path2D();
        line
        .init(this.path, [this._x, this._y + this._round])
        .bee([[0, this._height - this._round]])
        .arc(this._round, 180, 90)
        .bee([[this._width - this._round, this._height]])
        .arc(this._round, 90, 0)
        .bee([[this._width, this._round]])
        .arc(this._round, 0, -90)
        .bee([[this._round, 0]])
        .arc(this._round, -90, -180)
        .end();
        return this;
    }
} 