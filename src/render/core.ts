import { ShapeType, LayerManager } from './LayerManager';
import { isInShape, isInPath, arrayDeepCopy, getRandomColor } from '../util/util';
import AnimationManager from '../animation/core';
import { EventSystem, keyBoardEvent } from '../event/core';
import shapes from './shapes';
import { Matrix } from '../math/matrix';
import { Vector } from '../math/vector';
import Animator from '../animation/animator';



// 工具函数集合
const utils = {
    isInShape,
    isInPath,
    arrayDeepCopy, 
    getRandomColor
}


// 数学工具集合
const math = {
    Matrix,
    Vector
}

/* ------------------------------------------------------------------------------------------ */

// 渲染器创建器
export default class RendererCreator {
    private container: HTMLElement;
    private containerWidth: number
    private containerHeight: number;
    private containerLeft: number;
    private containerTop: number;
    
    private layerManager: LayerManager;
    private eventSystem: EventSystem;
    private animationManager: AnimationManager;

    // 开放的api
    public shapes;
    public utils;
    public math;
    public animation: Function;

    constructor(containerEle: HTMLElement, opt?) {
        this.container = containerEle;

        if(opt && opt.size) {
            this.container.style.width = opt.size[0] + 'px';
            this.container.style.height = opt.size[1] + 'px';

            this.containerWidth = opt.size[0];
            this.containerHeight = opt.size[1];
        }
        else {
            this.containerWidth = this.container.offsetWidth;
            this.containerHeight = this.container.offsetHeight;
        }   

        if(opt && opt.offset) {
            this.containerLeft = opt.offset[0];
            this.containerTop = opt.offset[1];
        }
        else {
            this.containerLeft = containerEle.scrollLeft + containerEle.offsetLeft;
            this.containerTop = containerEle.scrollTop + containerEle.offsetTop;
        }

        this.container.style.position = 'relative';
        this.container.style.userSelect = 'none';

        // 初始化容器管理器
        this.layerManager = new LayerManager(this.container, [this.containerWidth, this.containerHeight]);
        // 初始事件系统
        this.eventSystem = new EventSystem(
            this.container, 
            this.layerManager.getLayerMap(), 
            [this.containerLeft, this.containerTop]
        );
        // 初始化动画管理器
        this.animationManager = new AnimationManager();

        // 暴露图形api
        this.shapes = shapes;
        // 暴露工具函数api
        this.utils = utils;
        //暴露数学工具api
        this.math = math;
        // 暴露动画api
        this.animation = Animator;
    }

    // 获取容器的高
    public getHeight(): number {
        return this.containerHeight;
    }

    // 获取容器的宽
    public getWidth(): number {
        return this.containerWidth;
    }

    // 获取图形数量
    public getShapesCount(): number {
        return this.layerManager.getTotalCount();
    }

    // 全局事件绑定
    public bind(eventName: string | keyBoardEvent, fn: (ev?) => void) {
        if(eventName === 'keypress') {
            this.container.addEventListener('keydown', function(ev) {
                if(ev.keyCode === eventName['keyCode']) {
                    fn();
                }
            });
        }
        else {
            this.container.addEventListener(<string>eventName, function(ev) {
                let x = ev['clientX'] - this.containerLeft,
                    y = ev['clientY'] - this.containerTop; 

                fn({
                    x,
                    y
                });
            }.bind(this));
        }
    }

    /**--------------------------------------------------------- */

    public append(shape: ShapeType| Array<ShapeType>): void {
        if(shape === undefined) return;

        if(shape instanceof Array) {
            shape.map(item => this.append(item));
        }
        else {
            shape.setEventSystemContext(this.eventSystem);
            shape.setAnimationManagerContext(this.animationManager);

            this.layerManager.append({
                shape,
                zIndex: shape.attr('zIndex')
            });
        }
    }

    public remove(shape: ShapeType): void {
        if(shape === undefined) return;

        this.layerManager.remove({
            shape,
            zIndex: shape.attr('zIndex')
        });
    }

    public clear(): void {
        this.layerManager.clear();
    }

    public clone(shape: ShapeType): ShapeType {
        return this.layerManager.clone(shape);
    }
}