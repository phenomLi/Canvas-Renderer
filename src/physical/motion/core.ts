import { Body, state } from "../body/body";
import CollisionManager from "../collision/core";
import BoundariesManager from "../boundary/core";




// 运动图形堆
export default class Motion {
    private raf: number;
    private bodyList: Array<Body>;
    private collisionManager: CollisionManager;
    private boundariesManager: BoundariesManager;

    // 当前帧时间
    private curTime: number;

    constructor(bodyList: Array<Body>, collisionManager: CollisionManager, boundariesManager: BoundariesManager) {
        this.bodyList = bodyList;
        this.collisionManager = collisionManager;
        this.boundariesManager = boundariesManager;

        this.raf = window.requestAnimationFrame(this.loopFrame.bind(this, (new Date()).getTime()));
    }

    // 循环帧
    private loopFrame(prevTime: number) {
        // 渲染这一帧的时间
        this.curTime = (new Date()).getTime();

        // 计数器，计算世界中还需要模拟的刚体
        let counter = 0,
        // 两帧间的间隔时间
            duration = this.curTime - prevTime;

        // 若世界中没有刚体，则退出模拟
        if(this.bodyList.length === 0) {
            window.cancelAnimationFrame(this.raf);
            return;
        }

        this.bodyList.map(b => {
            b.separated();

            if(b.state !== state.sleep) {
                // 更新位置
                b.update();
                // 处理边缘碰撞
                this.boundariesManager.concatResolver(b);

                counter++;
            }
        });

        // 若世界中已经没有需要模拟的刚体（刚体数量为0或全部刚体休眠），则退出模拟
        if(counter === 0) {
            window.cancelAnimationFrame(this.raf);
            return;
        }

        // 检测碰撞
        let res = this.collisionManager.collisionDetection.sweep();
        
        // 处理碰撞
        res.map(item => {
            this.collisionManager.collisionResolver.resolve(item, duration);
        });

        window.requestAnimationFrame(this.loopFrame.bind(this, this.curTime));
    }

    /**----------------API------------------- */

    
}
