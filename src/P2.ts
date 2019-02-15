import { shapes, utils, ShapeType, ContainerManager } from './render/core';
import Animation from './animation/core';
import Motion from './motion/core';
import MotionHeap from './motion/motionHeap';
import { EventSystem } from './event/core';


/* ------------------------------------------------------------------------------------------ */

export default (function(window, document) {



class P2 {
    private container: HTMLElement;
    private containerManager: ContainerManager;
    private eventSystem: EventSystem;
    private motionHeap: MotionHeap;

    // 开放的api
    public shapes;
    public utils;
    public animation: Function;
    public motion: Function;

    constructor(containerEle: HTMLElement) {
        this.container = containerEle;
        this.container.style.position = 'relative';
        this.container.style.userSelect = 'none';

        // 初始化容器管理器
        this.containerManager = new ContainerManager(this.container);
        // 初始事件系统
        this.eventSystem = new EventSystem(this.container, this.containerManager.getLayerMap());

        //初始化运动图形堆
        this.motionHeap = new MotionHeap();


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
        return this.container.offsetHeight;
    }

    public getWidth(): number {
        return this.container.offsetWidth;
    }

    public getShapesCount(): number {
        return this.containerManager.getTotalCount();
    }

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

return P2;

})(window, document);
























