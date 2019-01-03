import { shape, shapeConfig } from './baseShape';
import { broadcast } from './../render/core';

class customConfig extends shapeConfig {
    // 在config中重写draw函数，实现用户定制图形
    draw(ctx: CanvasRenderingContext2D) {};
}


//绘制定制图形
export class custom extends shape {
    private _draw: Function;

    constructor(config: customConfig) {
        super(config);

        this._type = 'custom';
        this._draw = config.draw;
    }

    config() {
        return {
            ...this.getBaseConfig(),
            draw: this._draw
        };
    }

    draw(ctx: CanvasRenderingContext2D) {
        this._draw(ctx);
    }
}