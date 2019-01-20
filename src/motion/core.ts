import { vector } from './../math/vector';
import { Shape } from './../shape/BaseShape';


// 位置
class position {
    x: number;
    y: number;
};

// 速度
class velocity {
    x: number;
    y: number;
};

// 加速度
class acceleration {
    x: number;
    y: number;
}



export default class Motion {
    public pos: position;
    public vel: velocity;
    public acc: acceleration;

    private shape: Shape;

    private thresholdList: ((m: Motion) => {})[];

    constructor(shape: Shape) {
        this.shape = shape;
        this.thresholdList = [];
        
        this.pos = {
            x: this.shape.attr('x'),
            y: this.shape.attr('y')
        };
    }
    
    // 运动帧函数
    private motionFrame() {
        this.vel.x += this.acc.x;
        this.vel.y += this.acc.y;

        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        this.thresholdList.map(item => item(this));

        this.shape.attr('x', this.pos.x).attr('y', this.pos.y);

        window.requestAnimationFrame(this.motionFrame.bind(this));
    }


    /**----------------------api------------------------------- */


    // 开始运动
    public start(vel: vector, acc: vector): Motion {
        this.vel = {
            x: vel[0],
            y: vel[1]
        };

        this.acc = {
            x: acc[0],
            y: acc[1]
        };
        
        this.motionFrame();

        return this;
    }

    // 阈值函数
    public threshold(fn: ((m: Motion) => boolean)): Motion {
        this.thresholdList.push(fn);
        return this;
    }
}