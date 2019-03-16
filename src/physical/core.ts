import BodyHeap from "./bodyHeap";
import { Body } from "./body/body";
import { PolygonBody } from "./body/PolygonBody";
import { CirBody } from "./body/CircleBody";
import { RectBody } from "./body/RectBody";
import RendererCreator from "../render/core";
import Motion from "./motion/core";
import { vector } from "../math/vector";
import Boundary from "./boundary/Boundary";
import BoundariesManager from "./boundary/core";
import CollisionManager from "./collision/core";
import { globalForce, Gravity, Drag } from "./force/globalForce";
import Broadcast from "../Broadcast/Broadcast";
import { TriBody } from "./body/TriBody";



class WorldConfig {
    // 重力
    gravity: vector;
    // 阻尼
    drag: vector;
}


const body = {
    Polygon: PolygonBody,
    Circle: CirBody,
    Rect: RectBody,
    Tri: TriBody,
    Boundary: Boundary
};



/**
 * 物理世界构建器
 */
export default class WorldCreator {
    // 将渲染器暴露
    public Renderer: RendererCreator;
    // 刚体序列
    private bodyHeap: BodyHeap;
    // 碰撞检测器
    private collisionManager: CollisionManager;
    // 运动器
    private motion: Motion;
    // 边界管理器
    private boundariesManager: BoundariesManager;

    // 刚体对象
    public body: object;

    constructor(containerEle: HTMLElement, opt: WorldConfig) {
        // 初始化渲染器
        this.Renderer = new RendererCreator(containerEle);

        // 初始化刚体堆
        this.bodyHeap = new BodyHeap();

        // 初始化碰撞检测器
        this.collisionManager = new CollisionManager(this.bodyHeap.getHeap());
        // 初始化边界管理器
        this.boundariesManager = new BoundariesManager([this.getWidth(), this.getHeight()]);
        // 初始化运动对象
        this.motion = new Motion(this.bodyHeap.getHeap(), this.collisionManager, this.boundariesManager);
        
        this.body = body;

        this.setGlobalForce(opt);

        Broadcast.addListener('createShape', this.createShape.bind(this));
    }

    /**------------------------------------------------------- */

    private setGlobalForce(opt) {
        globalForce.gravity = new Gravity(opt.gravity);
        globalForce.drag = new Drag(opt.drag.k1, opt.drag.k2);
    }

    private createShape(type, config) {
        return new this.Renderer.shapes[type](config);
    }

    /**------------------------------------------------------ */

    getWidth(): number {
        return this.Renderer.getWidth();
    }

    getHeight(): number {
        return this.Renderer.getHeight();
    }

    getBodyCount(): number {
        return this.Renderer.getShapesCount();
    }
 
    append(body: Body | Boundary) {
        if(body instanceof Boundary) {
            this.boundariesManager.add(body);
        }
        else {
            this.Renderer.append(body.getShape());
            this.bodyHeap.append(body);
        }
    }

    remove(body: Body | Boundary) {
        if(body instanceof Boundary) {
            this.boundariesManager.remove(body.position);
        }
        else {
            this.Renderer.remove(body.getShape());
            this.bodyHeap.remove(body.getId());
        }
    }

    clear() {
        this.Renderer.clear();
        this.bodyHeap.clear();
    }

    bind(event: string, fn: (ev) => void) {
        this.Renderer.bind(event, fn);
    }
}
