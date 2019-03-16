import { Shape, shapeConfig } from './BaseShape';
import { drawTool } from './DrawTool';

class customConfig extends shapeConfig {
    // 在config中重写draw函数，实现用户定制图形
    draw(drawTool) {};
}


//绘制定制图形
export class Custom extends Shape {
    private _draw: Function;

    constructor(config: customConfig) {
        super(config, 'Custom');

        this._draw = config.draw;

        this.initSetter();
        this.createPath();
    }

    config() {
        return {
            ...this.getBaseConfig(),
            draw: this._draw
        };
    }

    drawPath(): Shape {
        this.path = new Path2D();
        this._draw(drawTool.init(this.path, [this._x, this._y]));
        return this;
    }
}