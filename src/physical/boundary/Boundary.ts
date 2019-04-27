import BoundariesManager from "./core";
import { vector, Vector } from "../../math/vector";
import { Body } from "../body/body";
import { polygonVex } from "../body/PolygonBody";

/**
 * 边界
 */


export enum boundaryType {
    top = 0,
    right = 1,
    bottom = 2,
    left = 3
} 


class BoundaryConfig {
    restitution: number;
    friction: number;
    collided: Function;
    separated: Function;
}


export class Boundary {
    // 边界类型(上下左右)
    public type: number;
    // 摩擦力
    public friction: number;
    // 恢复系数
    public restitution: number;
    // 质量倒数：因为墙壁质量无限大，所以质量倒数为0
    public inverseMass: number;
    // 边界范围
    public range: vector[];
    // 边界法向量
    public nor: vector;

    private collidedFn: Function;
    private separatedFn: Function;

    constructor(opt: BoundaryConfig) {
        this.restitution = opt.restitution || 0.8;
        this.friction = opt.friction || 0.2;
        this.inverseMass = 0;

        this.collidedFn = opt.collided || (() => {});
        this.separatedFn = opt.separated || (() => {});
    }

    // 初始化边界的范围和法向量
    init(containerSize: number[]) {
        throw '此方法必须由子类重写';
    }

    // 设定边界的碰撞判定,并返回相交的深度(返回正值表示相交，即碰撞，返回负值表示没有相交)
    collisionDetect(body: Body): number {
        throw '此方法必须由子类重写';
    }

    // 找出所有在边界后面的顶点
    findPointBehind(vex: polygonVex): vector[] {
        throw '此方法必须由子类重写';
    }

    /**------------------------------碰撞------------------------- */

    // 碰撞事件
    collided(opp: Body) {
        this.collidedFn.call(this, opp);
    }

    // 分离事件
    separated() {
        this.separatedFn.call(this);
    }
}  





// 上边界
export class BoundaryTop extends Boundary {
    constructor(opt: BoundaryConfig) {
        super(opt);
        this.type = boundaryType.top;
    }

    init(containerSize: number[]) {
        this.range = [[0, 0], [containerSize[0], 0]];
        this.nor = Vector.nol(Vector.nor(Vector.sub(this.range[1], this.range[0])));
        if(this.nor[1] < 0) this.nor = Vector.inv(this.nor);
    }

    collisionDetect(body: Body): number {
        return -body.getBoundRect().ver[0];
    }

    findPointBehind(vex: polygonVex): vector[] {
        return vex.filter(item => item[1] < 0);
    }
}


// 右边界
export class BoundaryRight extends Boundary {
    constructor(opt: BoundaryConfig) {
        super(opt);
        this.type = boundaryType.right;
    }

    init(containerSize: number[]) {
        this.range = [[containerSize[0], 0], [containerSize[0], containerSize[1]]];
        this.nor = Vector.nol(Vector.nor(Vector.sub(this.range[1], this.range[0])));
        if(this.nor[0] > 0) this.nor = Vector.inv(this.nor);
    }

    collisionDetect(body: Body): number {
        return body.getBoundRect().hor[1] - this.range[0][0];
    }

    findPointBehind(vex: polygonVex): vector[] {
        return vex.filter(item => item[0] > this.range[0][0]);
    }
}


// 下边界
export class BoundaryBottom extends Boundary {
    constructor(opt: BoundaryConfig) {
        super(opt);
        this.type = boundaryType.bottom;
    }

    init(containerSize: number[]) {
        this.range = [[0, containerSize[1]], [containerSize[0], containerSize[1]]];
        this.nor = Vector.nol(Vector.nor(Vector.sub(this.range[1], this.range[0])));
        if(this.nor[1] > 0) this.nor = Vector.inv(this.nor);
    }

    collisionDetect(body: Body): number {
        return body.getBoundRect().ver[1] - this.range[0][1];
    }

    findPointBehind(vex: polygonVex): vector[] {
        return vex.filter(item => item[1] > this.range[0][1]);
    }
}



// 左边界
export class BoundaryLeft extends Boundary {
    constructor(opt: BoundaryConfig) {
        super(opt);
        this.type = boundaryType.left;
    }

    init(containerSize: number[]) {
        this.range = [[0, 0], [0, containerSize[1]]];
        this.nor = Vector.nol(Vector.nor(Vector.sub(this.range[1], this.range[0])));
        if(this.nor[0] < 0) this.nor = Vector.inv(this.nor);
    }

    collisionDetect(body: Body): number {
        return -body.getBoundRect().hor[0];
    }

    findPointBehind(vex: polygonVex): vector[] {
        return vex.filter(item => item[0] < 0);
    }
}