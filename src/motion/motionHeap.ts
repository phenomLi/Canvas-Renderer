import Motion from "./core";
import Broadcast from './../Broadcast/Broadcast';

// 运动图形堆
export default class MotionHeap {
    private isRun: boolean;
    private motionList: Motion[];
    private raf: number;

    constructor() {
        this.isRun = false;
        this.motionList = [];

        //初始化广播器(监听者：运动图形堆的添加方法)
        Broadcast.addListener('add_motion', this.add.bind(this));
        //初始化广播器(监听者：运动图形堆的删除方法)
        Broadcast.addListener('del_motion', this.del.bind(this));
    }

    // 循环帧
    private loopFrame() {
        for(let i = 0, len = this.motionList.length; i < len; i++) {
            if(this.motionList[i]) this.motionList[i].motionFrame();
        }

        if(this.isRun) {
            this.raf = window.requestAnimationFrame(this.loopFrame.bind(this))
        }
        else {
            window.cancelAnimationFrame(this.raf);
        }
    }

    /**----------------API------------------- */

    // 删除运动图形
    public del(motion: Motion) {
        this.motionList.splice(this.motionList.findIndex(item => item.id === motion.id), 1);

        // 若队列里面没有了运动图形，则停止递归
        if(this.motionList.length === 0) {
            this.isRun = false;
        }
    }

    // 添加运动图形
    public add(motion: Motion) {
        let m = null;

        if(m = this.motionList.find(item => item.id === motion.id)) {
            m.vel = motion.vel;
            m.acc = motion.acc;
        }
        else {
            this.motionList.push(motion);
        }

        // 若递归未启动且队列里面有图形，则启动递归
        if(!this.isRun && this.motionList.length) {
            this.isRun = true;
            this.loopFrame();
        }
    }
}
