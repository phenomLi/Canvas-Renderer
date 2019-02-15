import { vector } from './../math/vector';
import { Shape } from './../shape/BaseShape';
import MotionHeap from './motionHeap';
import Broadcast from '../Broadcast/Broadcast';


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
    public id: Symbol;

    public pos: position;
    public vel: velocity;
    public acc: acceleration;

    private shape: Shape;

    private thresholdList: ((m: Motion) => {})[];
    public endFunction: ((m: Motion) => boolean);

    constructor(shape: Shape) {
        this.id = Symbol();
        this.shape = shape;
        this.thresholdList = [];
    }
    
    // 运动关键帧
    public motionFrame() {
        this.vel.x += this.acc.x;
        this.vel.y += this.acc.y;

        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        this.thresholdList.map(item => item(this));

        this.shape.attr('x', this.pos.x).attr('y', this.pos.y);
    }


    /**----------------------api------------------------------- */


    // 开始运动
    public start(vel: vector, acc: vector, fn: ((m) => boolean)): Motion {
        this.pos = {
            x: this.shape.attr('x'),
            y: this.shape.attr('y')
        };

        this.vel = {
            x: vel[0],
            y: vel[1]
        };

        this.acc = {
            x: acc[0],
            y: acc[1]
        };

        this.endFunction = fn;

        // 将该图形加入到运动堆
        Broadcast.notify('add_motion', this);

        return this;
    }

    public end() {
        Broadcast.notify('del_motion', this);
    }

    // 规则函数
    public rule(fn: ((m: Motion) => boolean)): Motion {
        this.thresholdList.push(fn);
        return this;
    }


    
    /**------------------- getter/setter ----------------------- */

    posX(x: number) {
        if(x === undefined) {
            return this.pos.x;
        }
        this.pos.x = x;
    }

    posY(y: number) {
        if(y === undefined) {
            return this.pos.y;
        }
        this.pos.y = y;
    }

    velX(x: number) {
        if(x === undefined) {
            return this.vel.x;
        }
        this.vel.x = x;
    }

    velY(y: number) {
        if(y === undefined) {
            return this.vel.y;
        }
        this.vel.y = y;
    }

    accX(x: number) {
        if(x === undefined) {
            return this.acc.x;
        }
        this.acc.x = x;
    }

    accY(y: number) {
        if(y === undefined) {
            return this.acc.y;
        }
        this.acc.y = y;
    }
}