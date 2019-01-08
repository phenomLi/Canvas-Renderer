import { event, keyBoardEvent } from '../event/core';
import { DFS } from '../render/util';
import { ShapeType } from '../render/core';
import Broadcast from './../Broadcast/Broadcast';

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
    onMouseOut: (e: event) => {};
    onMouseMove: (e: event) => {};
    onMouseDown: (e: event) => {};
    onMouseUp: (e: event) => {};
    onKeyPress: keyBoardEvent;

    // hook
    mounted: () => {};
    removed: () => {};
}



export class Base {
    protected _id: symbol;
    protected _type: string;
    protected _isShow: boolean;
    protected _isMount: boolean;
    protected event;

    protected _mounted: Function;
    protected _removed: Function;

    protected count;

    constructor(config: any, type: string) {
        this._id = Symbol();
        this._type = type;
        this._isShow = true;
        this._isMount = false;
        this.event = {};
        this.count = 1;

        this._mounted = config !== undefined? config.mounted: () => {};
        this._removed = config !== undefined? config.removed: () => {};

        // 保存config中声明的事件
        for(let prop in config) {
            if(/^on./g.test(prop)) {
                let eventName = prop.toLowerCase().substring(2);
                this.bind(eventName, config[prop]);
            }
        }
    }
    
    // 元素id
    id() {
        return this._id;
    }
    
    // 元素类型
    type(): string {
        return this._type;
    }

    // 是否挂载到画布上
    isMount(isMount?: boolean): boolean {
        if(isMount !== undefined && typeof isMount === 'boolean') {
            this._isMount = isMount;
            // 更改挂载状态后执行钩子函数
            isMount? this.mounted(): this.removed();

            if(this.type() === 'group' || this.type() === 'composite') {
                DFS(this.getShapeList(), item => {
                    item.isMount(isMount);
                    // 从画布中移除后执行钩子函数
                    isMount? item.mounted(): item.removed();
                });
            }
        }
        else {
            return this._isMount;
        }
    }

    // 显示、不显示
    show(isShow?: boolean): boolean | Base {
        if(isShow !== undefined && typeof isShow === 'boolean') {
            this._isShow = isShow;

            if(this.type() === 'group' || this.type() === 'composite') {
                DFS(this.getShapeList(), item => {
                    item.show(isShow);
                });
            }

            this._isMount && Broadcast.notify('update');
            return this;
        }
        else {
            return this._isShow;
        }
    }
    
    // 需重载函数: 返回图形数组(只有group和composite有该方法)
    getShapeList(): Array<ShapeType> { return null; }

    // 需重载函数: 返回配置项
    config() {};

    // 返回图形数量
    getCount(): number {
        return this.count;
    }

    /** 事件 */
    // 只有shape和composite类型有该方法
    bind(event: string, fn: (e: event) => {} | keyBoardEvent) {
        this.event[event] = fn;;
    }


    /** 状态钩子 */
    mounted() {
        
        // 当图形挂载到画布上时，绑定事件
        for(let prop in this.event) {
            Broadcast.notify('event', {
                shape: this,
                eventName: prop,
                fn: this.event[prop]
            });
        }

        this._mounted && typeof this._mounted === 'function' && this._mounted();
    }

    removed() {
        this._removed && typeof this._removed === 'function' && this._removed();
    }

    /** 渲染(需重载) */
    draw(ctx: CanvasRenderingContext2D) {}
}



// 图形基类
export class Shape extends Base {
    protected _x: number;
    protected _y: number;
    protected _color: string;
    protected _fill: boolean;
    protected _rotate: number;

    protected ctx: CanvasRenderingContext2D;

    constructor(config: shapeConfig, type: string) {
        super(config, type);

        this._x = config.pin[0];
        this._y = config.pin[1];
        this._color = config.color;
        this._fill = (config.fill === undefined)? true: config.fill;
        this._rotate = config.rotate || 0;
    }


    /** 基本属性 */

    x(x?: number): number | Shape {
        if(x !== undefined && typeof x === 'number') {
            this._x = x;
            this._isMount && Broadcast.notify('update');
            return this;
        }
        else {
            return this._x;
        }
    }

    y(y?: number): number | Shape {
        if(y !== undefined && typeof y === 'number') {
            this._y = y;
            this._isMount && Broadcast.notify('update');
            return this;
        }
        else {
            return this._y;
        }
    }

    color(color?: string): string | Shape {
        if(color !== undefined && typeof color === 'string') {
            this._color = color;
            this._isMount && Broadcast.notify('update');
            return this;
        }
        else {
            return this._color;
        }
    }

    fill(fill?: boolean): boolean | Shape {
        if(fill !== undefined && typeof fill === 'boolean') {
            this._fill = fill;
            this._isMount && Broadcast.notify('update');
            return this;
        }
        else {
            return this._fill;
        }
    }

    rotate(deg?: number): number | Shape {
        if(deg !== undefined && typeof deg === 'number') {
            this._rotate = deg;
            this._isMount && Broadcast.notify('update');
            return this;
        }
        else {
            return this._rotate;
        }
    }

    // 获取基本属性
    protected getBaseConfig() {
        return {
            pin: [this._x, this._y],
            color: this._color,
            fill: this._fill,
            rotate: this._rotate
        };
    }

    /** 动画 */

    animate(o: Shape) {

    }

    start(fn: Function) {

    }

    end(fn: Function) {

    }
}