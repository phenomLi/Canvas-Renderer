import { event } from './../event/event';
import { broadcast } from './../render/core';

export class shapeConfig {
    // 位置
    pin: Array<number>;
    // 颜色
    color: string;
    // 是否填充
    fill: boolean;
    // 旋转
    rotate: number;

    // event
    onClick: (e: event) => {};
    onMouseOver: (e: event) => {};
    onMouseMove: (e: event) => {};
    onMouseDown: (e: event) => {};
    onMouseUp: (e: event) => {};
    onKeyDown: Array<(key: number, e: event)=>{}>;

    // hook
    mounted: (o: shape) => {};
    removed: () => {};
}



// 图形基类
export class shape {
    protected _id: symbol;
    protected _type: string;
    protected _isMount: boolean;
    protected _x: number;
    protected _y: number;
    protected _color: string;
    protected _fill: boolean;
    protected _rotate: number;

    protected _mounted: Function;
    protected _removed: Function;

    protected ctx: CanvasRenderingContext2D;

    constructor(config: shapeConfig) {
        this._id = Symbol();
        this._isMount = false;
        this._x = config.pin[0];
        this._y = config.pin[1];
        this._color = config.color;
        this._fill = (config.fill === undefined)? true: config.fill;
        this._rotate = config.rotate || 0;

        this._mounted = config.mounted;
        this._removed = config.removed;
    }

    /** 基本属性 */

    id() {
        return this._id;
    }

    type(): string {
        return this._type;
    }

    isMount(isMount?: boolean): boolean {
        if(isMount !== undefined && typeof isMount === 'boolean') {
            this._isMount = isMount;
        }
        else {
            return this._isMount;
        }
    }

    x(x?: number): number | shape {
        if(x !== undefined && typeof x === 'number') {
            this._x = x;
            this._isMount && broadcast.notify();
            return this;
        }
        else {
            return this._x;
        }
    }

    y(y?: number): number | shape {
        if(y !== undefined && typeof y === 'number') {
            this._y = y;
            this._isMount && broadcast.notify();
            return this;
        }
        else {
            return this._y;
        }
    }

    color(color?: string): string | shape {
        if(color !== undefined && typeof color === 'string') {
            this._color = color;
            this._isMount && broadcast.notify();
            return this;
        }
        else {
            return this._color;
        }
    }

    fill(fill?: boolean): boolean | shape {
        if(fill !== undefined && typeof fill === 'boolean') {
            this._fill = fill;
            this._isMount && broadcast.notify();
            return this;
        }
        else {
            return this._fill;
        }
    }

    rotate(deg?: number): number | shape {
        if(deg !== undefined && typeof deg === 'number') {
            this._rotate = deg;
            this._isMount && broadcast.notify();
            return this;
        }
        else {
            return this._rotate;
        }
    }

    // 需重载函数
    config() {};

    // 获取基本属性
    protected getBaseConfig() {
        return {
            pin: [this._x, this._y],
            color: this._color,
            fill: this._fill,
            rotate: this._rotate
        };
    }




    /** 事件 */

    bind() {

    }


    /** 动画 */

    animate(o: shape) {

    }

    start(fn: Function) {

    }

    end(fn: Function) {

    }


    /** 钩子 */

    mounted() {
        this._mounted && typeof this._mounted === 'function' && this._mounted();
    }

    removed() {
        this._removed && typeof this._removed === 'function' && this._removed();
    }


    /** 渲染(需重载) */
    draw(ctx: CanvasRenderingContext2D) {}
}