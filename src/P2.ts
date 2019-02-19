import { ShapeType, ContainerManager } from './render/core';
import { isInShape, isInPath, arrayDeepCopy, divideConcavePoly, isConcavePoly } from './util/util';
import Animation from './animation/core';
import Motion from './motion/core';
import MotionHeap from './motion/motionHeap';
import { EventSystem, keyBoardEvent } from './event/core';
import shapes from './../src/render/shapes';
import { Matrix } from './math/matrix';
import { Vector } from './math/vector';


// 工具函数集合
const utils = {
    isInShape,
    isInPath,
    arrayDeepCopy, 
    divideConcavePoly,
    isConcavePoly
}


// 数学工具集合
const math = {
    Matrix,
    Vector
}

/* ------------------------------------------------------------------------------------------ */

export default class P2 {
    private container: HTMLElement;
    private containerLeft: number;
    private containerTop: number;
    
    private containerManager: ContainerManager;
    private eventSystem: EventSystem;
    private motionHeap: MotionHeap;

    // 开放的api
    public shapes;
    public utils;
    public math;
    public animation: Function;
    public motion: Function;

    constructor(containerEle: HTMLElement) {
        this.container = containerEle;
        this.container.style.position = 'relative';
        this.container.style.userSelect = 'none';

        this.containerLeft = containerEle.scrollLeft + containerEle.clientLeft;
        this.containerTop = containerEle.scrollTop + containerEle.clientTop;

        // 初始化容器管理器
        this.containerManager = new ContainerManager(this.container);
        // 初始事件系统
        this.eventSystem = new EventSystem(
            this.container, 
            this.containerManager.getLayerMap(), 
            [this.containerLeft, this.containerTop]
        );

        //初始化运动图形堆
        this.motionHeap = new MotionHeap();


        // 暴露图形api
        this.shapes = shapes;
        // 暴露工具函数api
        this.utils = utils;
        //暴露数学工具api
        this.math = math;
        // 暴露动画api
        this.animation = Animation;
        // 暴露运动api
        this.motion = Motion;
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
        return this.containerManager.getTotalCount();
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
        if(shape instanceof Array) {
            shape.map(item => this.containerManager.append({
                shape: item,
                zIndex: item.attr('zIndex')
            }));
        }
        else {
            this.containerManager.append({
                shape,
                zIndex: shape.attr('zIndex')
            });
        }
    }

    public remove(shape: ShapeType): void {
        this.containerManager.remove({
            shape,
            zIndex: shape.attr('zIndex')
        });
    }

    public clear(): void {
        this.containerManager.clear();
    }

    public clone(shape: ShapeType): ShapeType {
        return this.containerManager.clone(shape);
    }
}

























