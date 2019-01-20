import { shapes, utils, ShapeType } from './render/core';
import { shapeHeap } from './render/core';
import Broadcast from './Broadcast/Broadcast';
import { EventSystem } from './event/core';
import Animation from './animation/core';
import Motion from './motion/core';


/* ------------------------------------------------------------------------------------------ */

export default (function(window, document) {

class canvasConfig {
    backgroundColor?: string;
    width: number | string;
    height: number | string;
}

/** 初始化canvas样式 */
class initCanvasStyle {
    ele: HTMLCanvasElement = null;
    height: number;
    width: number;
    config: canvasConfig = {
        width: 400,
        height: 400,
        backgroundColor: '#eee'
    };
    
    constructor(canvasEle: HTMLCanvasElement, config: canvasConfig) {
        this.ele = canvasEle;
        this.config = config || this.config;

        this.setWidth().setHeight().setBackgroundColor();
    }

    setWidth(): initCanvasStyle {
        let width = this.config.width === 'fullWidth'? document.body.clientWidth: this.config.width;

        this.ele.setAttribute('width', width.toString());
        this.width = parseInt(width.toString());

        return this;
    }

    setHeight(): initCanvasStyle {
        let height = this.config.height === 'fullHeight'? document.body.clientHeight: this.config.height;

        this.ele.setAttribute('height', height.toString());
        this.height = parseInt(height.toString());

        return this;
    }

    setBackgroundColor(): initCanvasStyle {
        this.ele.style.backgroundColor = this.config.backgroundColor;;

        return this;
    }
}


class init {
    private canvasEle: HTMLCanvasElement;
    private canvasStyle: initCanvasStyle;
    private ctx: CanvasRenderingContext2D;
    private shapeHeap: shapeHeap;
    private eventSystem: EventSystem;

    // 开放的api
    public shapes;
    public utils;
    public animation: Function;
    public motion: Function;

    constructor(canvasEle: HTMLCanvasElement, config: canvasConfig) {
        this.canvasEle = canvasEle;
        this.ctx = canvasEle.getContext('2d');

        // 设置canvas基本样式
        this.canvasStyle = new initCanvasStyle(this.canvasEle, config);

        //初始化图形对象堆
        this.shapeHeap = new shapeHeap(this.ctx, {
            width: this.getWidth(),
            height: this.getHeight()
        });

        //初始化事件系统
        this.eventSystem = new EventSystem(this.canvasEle, this.ctx);

        //初始化广播器(监听者：图形对象堆的界面重刷方法)
        Broadcast.addListener('update', this.shapeHeap.update.bind(this.shapeHeap));
        //初始化广播器(监听者：图形对象堆的界面克隆方法)
        Broadcast.addListener('clone', this.shapeHeap.clone.bind(this.shapeHeap));
        //初始化广播器(监听者：事件系统的事件添加方法)
        Broadcast.addListener('add_event', this.eventSystem.addEvent.bind(this.eventSystem));
        //初始化广播器(监听者：事件系统的事件删除方法)
        Broadcast.addListener('del_event', this.eventSystem.delEvent.bind(this.eventSystem));

        // 暴露图形api
        this.shapes = shapes;
        // 暴露实用函数api
        this.utils = utils;
        // 暴露动画api
        this.animation = Animation;
        // 暴露运动api
        this.motion = Motion;
    }


    public getHeight(): number {
        return this.canvasStyle.height;
    }

    public getWidth(): number {
        return this.canvasStyle.width;
    }

    public getShapesCount(): number {
        return this.shapeHeap.getCount();
    }

    public append(shape: ShapeType| Array<ShapeType>): void {
        if(shape instanceof Array) {
            shape.map(item => this.shapeHeap.append(item));
        }
        else {
            this.shapeHeap.append(shape);
        }
    }

    public remove(shape: ShapeType): void {
        this.shapeHeap.remove(shape);
    }

    public clear(): void {
        this.shapeHeap.clear();
    }

    public clone(shape: ShapeType): ShapeType {
        return this.shapeHeap.clone(shape);
    }

}

return init;

})(window, document);
























