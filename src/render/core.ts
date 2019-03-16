import { ShapeType, LayerManager } from './LayerManager';
import { isInShape, isInPath, arrayDeepCopy, divideConcavePoly, isConcavePoly, getRandomColor } from '../util/util';
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
    divideConcavePoly,
    isConcavePoly,
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

    constructor(containerEle: HTMLElement) {
        this.container = containerEle;
        this.container.style.position = 'relative';
        this.container.style.userSelect = 'none';

        this.containerLeft = containerEle.scrollLeft + containerEle.clientLeft;
        this.containerTop = containerEle.scrollTop + containerEle.clientTop;

        // 初始化容器管理器
        this.layerManager = new LayerManager(this.container);
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
        return this.container.offsetHeight;
    }

    // 获取容器的宽
    public getWidth(): number {
        return this.container.offsetWidth;
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
            shape.map(item => this.layerManager.append({
                shape: item,
                zIndex: item.attr('zIndex')
            }));
        }
        else {
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