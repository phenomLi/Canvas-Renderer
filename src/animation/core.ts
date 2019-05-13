import Animator, { state } from "./animator";




export default class AnimationManager {
    private animationHeap: Array<Animator>;
    private isRun: boolean;

    constructor() {
        this.animationHeap = [];
        this.isRun = false;
    }

    add(ani: Animator) {
        this.animationHeap.push(ani);

        if(!this.isRun) {
            this.isRun = true;
            this.loop();
        }
    }

    // 动画帧循环函数
    private loop() {
        let flag = 0;

        this.animationHeap.map(item => {
            if(item.state !== state.final) {
                item.animationFrame();
                flag++;
            }
        });

        if(this.animationHeap.length) {
            this.animationHeap[0].state === state.final && this.animationHeap.shift();
        }

        if(flag) {
            window.requestAnimationFrame(this.loop.bind(this));
        }
        else {
            this.isRun = false;
            return;
        }
    }
}


