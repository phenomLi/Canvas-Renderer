import { Body, state } from "../body/body";
import CollisionManager from "../collision/core";
import BoundariesManager from "../boundary/core";




// 运动模拟器
export default class Motion {
    private raf: number;
    private bodyList: Array<Body>;
    private collisionManager: CollisionManager;

    // 是否开始/暂停
    private isPause: boolean;

    constructor(bodyList: Array<Body>, collisionManager: CollisionManager) {
        this.bodyList = bodyList;
        this.collisionManager = collisionManager;

        // 默认不开始模拟
        this.isPause = true;
    }

    // 循环帧
    private loopFrame() {

        // 计数器，计算世界中还需要模拟的刚体
        let counter = 0;

        // 若世界中没有刚体，则退出模拟
        // if(this.bodyList.length === 0) {
        //     window.cancelAnimationFrame(this.raf);
        //     return;
        // }

        // 检测碰撞 -> 处理碰撞
        this.collisionManager.collisionDetection.sweep().map(item => 
            this.collisionManager.collisionResolver.resolve(item)
        );

        for(let i = 0, len = this.bodyList.length; i < len; i++) {
            let b = this.bodyList[i];
            // 更新位置
            b.state !== state.sleep && b.update();

            counter++;
        }

        
        
        // 若世界中已经没有需要模拟的刚体（刚体数量为0或全部刚体休眠），则退出模拟
        // if(!counter) {
        //     window.cancelAnimationFrame(this.raf);
        //     return;
        // }

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
}


