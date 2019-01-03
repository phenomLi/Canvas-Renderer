import { shape } from './shape/baseShape';
import { shapes } from './render/core';
import { group } from './shape/group';
import { shapeHeap } from './render/shapeHeap';
import { broadcast } from './render/core';


/* ------------------------------------------------------------------------------------------ */

export default (function(window, document) {

class canvasConfig {
    backgroundColor: string;
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
    public shapes;

    constructor(canvasEle: HTMLCanvasElement, config: canvasConfig) {
        this.canvasEle = canvasEle;
        this.ctx = canvasEle.getContext('2d');

        // 设置canvas基本样式
        this.canvasStyle = new initCanvasStyle(canvasEle, config);

        //初始化图形对象堆
        this.shapeHeap = new shapeHeap(this.ctx, {
            width: this.getWidth(),
            height: this.getHeight()
        });

        //初始化广播器(监听者：图形对象堆的界面重刷方法)
        broadcast.init(this.shapeHeap.reRender.bind(this.shapeHeap));

        // 图形api
        this.shapes = shapes;
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

    public append(shape: shape | group): void {
        this.shapeHeap.append(shape);
    }

    public remove(shape: shape | group): void {
        this.shapeHeap.remove(shape);
    }

    public clear(): void {
        this.shapeHeap.clear();
    }

    public clone(shape: shape | group): shape | group {
        return this.shapeHeap.clone(shape);
    }

}

return init;

})(window, document);
























