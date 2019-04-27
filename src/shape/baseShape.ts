import { event, keyBoardEvent } from '../event/core';
import { rotate, scale, rotateVex, translate } from '../util/util';
import Broadcast from '../Broadcast/Broadcast';
import Animation from '../animation/core';
import ShapePropertiesTable from '../render/shapePropertiesTable';
import Animator from '../animation/animator';



export class Base {
    protected _id: symbol;
    protected _type: string;
    protected _tag: string | number;
    protected _zIndex: number;
    protected _show: boolean;
    protected _mounted: Function;
    protected _removed: Function;

    protected isMount: boolean;

    protected count: number;

    constructor(config: any, type: string) {
        this._id = Symbol();
        this._type = type;
        this._show = (config && config.show !== undefined)? config.show: true;

        this._tag = (config && config.tag)? config.tag: '';
        this._zIndex = (config && config.zIndex)? config.zIndex: 0;

        this._mounted = (config && config.mounted)? config.mounted: () => {};
        this._removed = (config && config.removed)? config.removed: () => {};

        this.isMount = false;
        this.count = 1;
    }
    
    // 初始化属性设置函数
    initSetter() {
        ShapePropertiesTable[this._type].writableProperties.map(attr => {
            let upperCaseAttr = attr.substring(0, 1).toUpperCase() + attr.substring(1);

            if(this[`setter${upperCaseAttr}`] === undefined) {
                this[`setter${upperCaseAttr}`] = function(val) {
                    this[`_${attr}`] = val;
                    
                    if(!ShapePropertiesTable[this._type].notRePathProperties.includes(attr)) {
                        this.createPath(true);
                    }
                }
            }
        });
    }

    // 属性get、set(暴露api)
    public attr(attr: string, val?: any): any | Base {
        if(!ShapePropertiesTable[this._type].readableProperties.includes(attr)) {
            console.warn(`${attr}属性不存在`);
            return this;
        }

        if(val !== undefined) {
            if(ShapePropertiesTable[this._type].writableProperties.includes(attr)) {
                this[`setter${attr.substring(0, 1).toUpperCase() + attr.substring(1)}`](val);
                this.isMount && Broadcast.notify('update', this._zIndex);
                
            }
            else console.warn(`${attr}不能被修改`);

            return this;
        }
        else {
            return this[`_${attr}`];
        }
    }

    // 切换挂载状态
    toggleMount(isMount: boolean) {
        this.isMount = isMount;
        // 更改挂载状态后执行钩子函数
        isMount? this.mounted(): this.removed();

        if(this._type === 'Group' || this._type === 'Composite') {
            this.getShapeList().map(item => {
                item.toggleMount(isMount);
            });
        }
    }


    // 返回图形数量
    getCount(): number { return this.count; }

    getShapeList() { 
        throw "此方法必须由子类重写";
        return null; 
    };

    // 需重载函数: 返回配置项
    config(): any {
        throw "此方法必须由子类重写";
    };



    /**------------------------- 状态钩子----------------------- */

    mounted() {
        if(this._mounted && typeof this._mounted === 'function') {
            this._mounted();
        } 
    }

    removed() {
        if(this._removed && typeof this._removed === 'function') {
            this._removed();
        }
    }
}






/*********************************************************************************************/
/*********************************************SHAPE****************************************** */
/******************************************************************************************** */



export class shapeConfig {
    // 位置
    pin: Array<number>; //*
    // 标签
    tag?: string | number;
    // 层级
    zIndex?: number;
    // 颜色
    color?: string;
    // 是否填充
    fill?: boolean;
    //透明度
    opacity?: number;
    // 线条粗细
    lineWidth?: number
    // 旋转
    rotate?: number;
    // 缩放
    scale?: number[];

    // event
    onClick?: (e: event) => {};
    onMouseOver?: (e: event) => {};
    onMouseOut?: (e: event) => {};
    onMouseMove?: (e: event) => {};
    onMouseDown?: (e: event) => {};
    onMouseUp?: (e: event) => {};
    onKeyPress?: keyBoardEvent;

    // hook
    mounted?: Function;
    removed?: Function;
}



class eventInfo {
    eventName: string;
    fn: ((e: event) => {}) | keyBoardEvent;
}


class animationConfig {
    target: object;
    duration?: number;
    delay?: number; 
    timingFunction?: string;
    loop?: boolean = false; 
}


// 图形基类
export class Shape extends Base {
    protected _x: number;
    protected _y: number;
    protected _center: Array<number>;
    protected _color: string;
    protected _fill: boolean;
    protected _opacity: number;
    protected _lineWidth: number;
    protected _rotate: number;
    protected _scale: number[];

    // last性能优化：对比下一次更改的值和上一次是否一样，不一样再调用更改
    protected lastX: number;
    protected lastY: number;
    protected lastRotate: number;
    protected lastScale: number[];

    protected path: Path2D;
    protected camelCaseEventName: object;
    protected eventList: eventInfo[];

    // 鼠标是否在当前图形里面
    protected mouseIn: boolean;

    // 异步路径重绘请求计数器
    protected aSyncRePathRequestCount: number;
    // 路径重绘请求次数
    protected rePathRequestCount: number;

    constructor(config: shapeConfig, type: string) {
        super(config, type);
        
        // 必填属性检测
        ShapePropertiesTable[type].requiredProperties.map(item => {
            if(config[item] === undefined) {
                throw `${item}为${type}的必填属性`;
            }
        });

        this._x = config.pin? config.pin[0]: 0;
        this._y = config.pin? config.pin[1]: 0;
        this._color = config.color || '#000';
        this._fill = (config.fill === undefined)? true: config.fill;
        this._lineWidth = config.lineWidth || 1;
        this._opacity = config.opacity || 1;
        this._rotate = config.rotate || 0;
        this._scale = config.scale || [1, 1];

        if (this._rotate >= 360) this._rotate %= 360;

        this.lastX = this._x;
        this.lastY = this._y;
        this.lastRotate = 0;
        this.lastScale = [1, 1];

        this.mouseIn = false;
        this.eventList = [];
        this.camelCaseEventName = {};

        this.rePathRequestCount = 0;
        this.aSyncRePathRequestCount = 0;

        // 保存config中声明的事件
        for(let prop in config) {
            if(/^on./g.test(prop)) {
                this.camelCaseEventName[prop] = config[prop];
                this.bind(prop.toLowerCase().substring(2), config[prop]);
            }
        }
    }

    // 获取基本属性
    protected getBaseConfig() {
        return {
            pin: [this._x, this._y],
            center: this._center,
            color: this._color,
            fill: this._fill,
            rotate: this._rotate,
            scale: this._scale,
            zIndex: this._zIndex,
            tag: this._tag,
            ...this.camelCaseEventName,

            // hook
            mounted: this._mounted,
            removed: this._removed
        };
    }

    isMouseIn(mouseIn?: boolean) {
        if(mouseIn === undefined) {
            return this.mouseIn;
        }
        else {
            this.mouseIn = mouseIn;
        }
    }

    /** ------------------------path---------------------- */

    getPath(): Path2D {
        return this.path;
    }

    setPath(path: Path2D) {
        this.path = path;
    }


    /**--------------------重载的setter-------------------- */

    // 重载setter（x）
    protected setterX(x: number) {
        let d = x - this._x;
        this._x = x;
        this._center[0] = this._center[0] + d;

        this.transformPath();
    }

    // 重载setter（y）
    protected setterY(y: number) {
        let d = y - this._y;
        this._y = y;
        this._center[1] = this._center[1] + d;

        this.transformPath();
    }

    // 重载setter（rotate）
    protected setterRotate(deg: number) {
        if (deg >= 360) deg %= 360;

        this._rotate = deg;
        this.transformPath();
    }

    // 重载setter（scale）
    protected setterScale(scale: number[]) {
        this._scale = scale;
        this.transformPath();
    }

    // 重载setter（zIndex）
    protected setterZIndex(zIndex: number) {
        if(zIndex === this._zIndex) return;

        // 在旧的layer移除该图层
        Broadcast.notify('remove', {
            shape: this,
            zIndex: this._zIndex
        });

        // 在新的layer添加该图形
        Broadcast.notify('append', {
            shape: this,
            zIndex: zIndex
        });

        this._zIndex = zIndex;
    }

    /** -------------------事件---------------------------- */

    // 将事件绑定到canvas
    private addEvent(eventInfo: eventInfo[]) {
        eventInfo.map(item => {
            // 若是键盘事件数组
            if(item.fn instanceof Array) {
                item.fn.map(i => {
                    Broadcast.notify('add_event', {
                        shape: this,
                        eventName: item.eventName,
                        fn: i,
                        zIndex: this._zIndex
                    });
                });
            }
            else {
                Broadcast.notify('add_event', {
                    shape: this,
                    eventName: item.eventName,
                    fn: item.fn,
                    zIndex: this._zIndex
                });
            }
        });
    }

    // 将事件从canvas解绑
    private delEvent(eventInfo) {
        eventInfo.map(item => {
            if(item.eventName === 'keypress') {
                Broadcast.notify('del_event', {
                    shape: this,
                    eventName: item.eventName,
                    keyCode: item.keyCode
                });
            }
            else {
                Broadcast.notify('del_event', {
                    shape: this,
                    eventName: item.eventName
                });
            }
        });
    }

    // 绑定事件，只有shape和composite类型有该方法(暴露api)
    public bind(event: string, fn: ((e: event) => {}) | keyBoardEvent) {
        // 改变事件回调函数的上下文为该图形（this = shape）
        if(event === 'keypress') {
            fn instanceof Array? 
            fn.map(item => item.fn = item.fn.bind(this)):
            (<keyBoardEvent>fn).fn = (<keyBoardEvent>fn).fn.bind(this)
        }
        else {
            fn = (<Function>fn).bind(this);
        } 
        
        // 若图形已经挂载在canvas上，则直接绑定事件
        if(this.isMount) {
            this.addEvent([{
                eventName: event,
                fn: fn
            }]);
        }
        
        // 将事件保存起来
        this.eventList.push({
            eventName: event,
            fn: fn
        });
    }

    // 解绑事件
    public unbind(event: string, keyCode?: number) {
        if(event === 'keypress') {
            this.delEvent([{
                eventName: event,
                keyCode: keyCode
            }]);
        }
        else {
            this.delEvent([{
                eventName: event
            }]);
        }
    }

    // 获取该图形拥有的事件列表
    public getEventList(): eventInfo[] {
        return this.eventList;
    }

    /** -------------------动画---------------------------- */

    /**
     * 
     * @param config 
     * 如：{
     *      target: {
     *          x: 200,
     *          y: 400
     *      },
     *      duration: 1000,
     *      delay: 2000,
     *      timingFunction: 'easeOut'
     * } 
     */

    animateTo(config: animationConfig, fn?: Function) {
        let values = [], that = this;

        for(let prop in config.target) {
            if(ShapePropertiesTable[that._type].animateProperties.includes(prop)) {
                values.push([that['_' + prop], config.target[prop]]);
            }
            else {
                delete config.target[prop];
            }
        }

        let animation = (new Animator({
            value: values,
            duration: config.duration,
            delay: config.delay,
            timingFunction: config.timingFunction,
            render: function() {
                let index = 0;

                for(let prop in config.target) {
                    that.attr(prop, arguments[index++]);
                }
            }
        })).final(fn);

        config.loop? animation.loop(): animation.start();
    }

    /**------------------------- 状态钩子----------------------- */

    mounted() {
        // 图形挂载到canvas时，绑定事件
        this.addEvent(this.eventList);

        if(this._mounted && typeof this._mounted === 'function') {
            this._mounted();
        } 
    }

    removed() {
        // 图形从canvas移出时，解绑事件
        this.delEvent(this.eventList);

        if(this._removed && typeof this._removed === 'function') {
            this._removed();
        }
    }


    /** -------------------PATH2D路径---------------------------- */


    // 创建path2D路径
    createPath(async: boolean = false) {
        this.drawPath().transformPath(async);
    }

    // 形变path2D路径（位移，旋转，缩放）
    transformPath(async: boolean = false) {
        //异步路径形变
        if(async) {
            this.rePathRequestCount++;

            requestAnimationFrame(() => {
                this.aSyncRePathRequestCount++;

                if(this.aSyncRePathRequestCount === this.rePathRequestCount) {
                    this.rePathRequestCount = this.aSyncRePathRequestCount = 0;
                    this.translatePath().rotatePath().scalePath();
                }
            });
        }
        // 形变路径
        else {
            this.translatePath().rotatePath().scalePath();
        }
    }


    // 定义path2D路径(需重载)
    drawPath(): Shape { return this; }


    // 位移path2D路径
    translatePath(): Shape {
        if(this.lastX === this._x && this.lastY === this._y) return this;
        
        let tPath = new Path2D();
        tPath.addPath(this.path, translate([this._x - this.lastX, this._y - this.lastY]));
        this.path = tPath;

        this.lastX = this._x;
        this.lastY = this._y;

        return this;
    }

    // 旋转path2D路径
    rotatePath(): Shape {
        if(this._rotate === this.lastRotate) return this;

        let tPath = new Path2D();

        tPath.addPath(this.path, rotate(this._center, this._rotate - this.lastRotate));
        this.path = tPath;

        this.lastRotate = this._rotate;

        return this;
    }

    // 缩放path2D路径
    scalePath(): Shape {
        if(this._scale.toString() === this.lastScale.toString()) return this;

        let tPath = new Path2D(),
            dScale = [this._scale[0]/this.lastScale[0], this._scale[1]/this.lastScale[1]];
            
        tPath.addPath(this.path, scale(this._center, dScale));
        this.path = tPath;

        this.lastScale = this._scale;

        return this;
    }

    // 渲染图形到canvas
    render(ctx: CanvasRenderingContext2D) {
        if(!this._show) return; 

        ctx.globalAlpha = this._opacity;

        if(this._fill) {
            ctx.fillStyle = this._color;
            ctx.fill(this.path);
        }
        else {
            ctx.lineWidth = this._lineWidth;
            ctx.strokeStyle = this._color;
            ctx.stroke(this.path);
        }
    }
}