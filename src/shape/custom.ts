import { Shape, shapeConfig } from './BaseShape';
import { line } from './Line';
import { rotate } from '../render/util';

class customConfig extends shapeConfig {
    center: Array<number>;

    // 在config中重写draw函数，实现用户定制图形
    draw(ctx: CanvasRenderingContext2D) {};
}


//绘制定制图形
export class Custom extends Shape {
    private _draw: Function;

    constructor(config: customConfig) {
        super(config, 'custom');

        this._center = config.center;
        this._draw = config.draw;

        this.drawPath().generatePath();
    }

    config() {
        return {
            ...this.getBaseConfig(),
            draw: this._draw
        };
    }

    drawPath(): Shape {
        this._draw(this._path, line.init(this._path, [this._x, this._y]));
        return this;
    }
}