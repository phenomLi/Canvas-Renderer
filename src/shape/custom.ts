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
    private center: Array<number>;

    constructor(config: customConfig) {
        super(config, 'custom');

        this.center = config.center;
        this._draw = config.draw;
    }

    config() {
        return {
            ...this.getBaseConfig(),
            center: this.center,
            draw: this._draw
        };
    }

    draw(ctx: CanvasRenderingContext2D) {
        rotate(ctx, [this.center[0], this.center[1]], this._rotate);
        this._draw(ctx, line.init(ctx, this));
    }
}