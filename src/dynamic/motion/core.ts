import { Body, state } from "../body/body";
import CollisionManager from "../collision/core";
import ForceManager from "../force/forceManager";




// 运动模拟器
export default class Motion {
    private raf: number;
    private bodyList: Array<Body>;
    private collisionManager: CollisionManager;
    private foceManager: ForceManager;

    private worldStepList: Function[];

    // 是否开始/暂停
    private isPause: boolean;

    constructor(bodyList: Array<Body>, collisionManager: CollisionManager, foceManager: ForceManager) {
        this.bodyList = bodyList;
        this.collisionManager = collisionManager;
        this.foceManager = foceManager;
        this.worldStepList = [];

        // 默认不开始模拟
        this.isPause = true;
    }

    // 循环帧
    private loopFrame() {

        // 检测碰撞 -> 处理碰撞
        this.collisionManager.collisionDetection.sweep().map(item => 
            this.collisionManager.collisionResolver.resolve(item)
        );

        // 更新刚体
        for(let i = 0, len = this.bodyList.length; i < len; i++) {
            let b = this.bodyList[i];
            // 更新位置
            b.state !== state.sleep && b.update(this.foceManager);
        }

        if(this.worldStepList.length) {
            this.worldStepList.map(item => {
                item();
            });
        }

        // 模拟控制
        if(this.isPause) {
            window.cancelAnimationFrame(this.raf);
            return;
        }
        else {
            this.raf = window.requestAnimationFrame(this.loopFrame.bind(this));
        }
    }

    /**----------------API------------------- */

    start() {
        this.isPause = false;
        this.loopFrame();
    }

    pause() {
        this.isPause = true;
    }

    addWorldStepFun(fn: Function) {
        this.worldStepList.push(fn);
    }
}


