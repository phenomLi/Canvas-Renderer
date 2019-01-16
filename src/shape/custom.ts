import { Shape, shapeConfig } from './BaseShape';
import { line } from './Line';

class customConfig extends shapeConfig {
    center: Array<number>; //*
    fillRule: boolean;

    // 在config中重写draw函数，实现用户定制图形
    draw(ctx: CanvasRenderingContext2D) {};
}


//绘制定制图形
export class Custom extends Shape {
    private _draw: Function;

    constructor(config: customConfig) {
        super(config, 'Custom');

        this._center = config.center;
        this._fillRule = config.fillRule || true;
        this._draw = config.draw;

        this.initSetter();
        this.drawPath().rotatePath().transFormPath();
    }

    config() {
        return {
            ...this.getBaseConfig(),
            draw: this._draw
        };
    }

    drawPath(): Shape {
        this.path = new Path2D();
        this._draw(this.path, line.init(this.path, [this._x, this._y]));
        return this;
    }
}