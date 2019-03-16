import Boundary from "./Boundary";
import { Body, staticType } from "../body/body";



class Boundaries {
    left: Boundary;
    right:Boundary;
    top: Boundary;
    bottom: Boundary;
}


/**
 * 边界管理器
 */
export default class BoundariesManager {
    private containerSize: number[];
    public boundaries: Boundaries;

    constructor(containerSize: number[]) {
        this.boundaries = {
            top: null,
            bottom: null,
            left: null,
            right: null
        };

        this.containerSize = containerSize;
    }
    
    // 添加边界
    add(bound: Boundary) {
        if(!this.boundaries[bound.position]) {
            this.boundaries[bound.position] = bound;
        }
    }

    // 移除边界
    remove(pos: string) {
        delete this.boundaries[pos];
    }

    clear() {
        for(let dir in this.boundaries) {
            delete this.boundaries[dir];
        }
    }

    // 刚体碰撞边界处理
    concatResolver(body: Body) {
        // 如果是固定刚体，则不做处理
        if(body.static === staticType.position || body.static === staticType.total) return;

        // 碰到左边界且左边界存在
        if(body.getBoundRect().hor[0] < 0 && this.boundaries.left) {
            let inverseVel = this.boundaries.left.bound*body.linearVel[0],
                d = body.getBoundRect().hor[0];

            body.linearVel = [inverseVel, body.linearVel[1]];
            body.setPos([body.pos[0] - d, body.pos[1]]);
        }

        // 碰到右边界且右边界存在
        if(body.getBoundRect().hor[1] > this.containerSize[0] && this.boundaries.right) {
            let inverseVel = this.boundaries.right.bound*body.linearVel[0],
                d = body.getBoundRect().hor[1] - this.containerSize[0];

            body.linearVel = [inverseVel, body.linearVel[1]];
            body.setPos([body.pos[0] - d, body.pos[1]]);
        }

        // 碰到上边界且上边界存在
        if(body.getBoundRect().ver[0] < 0 && this.boundaries.top) {
            let inverseVel = this.boundaries.top.bound*body.linearVel[1],
                d = body.getBoundRect().ver[0];

            body.linearVel = [body.linearVel[0], inverseVel];
            body.setPos([body.pos[0], body.pos[1] - d]);
        }

        // 碰到下边界且下边界存在
        if(body.getBoundRect().ver[1] > this.containerSize[1] && this.boundaries.bottom) {
            let inverseVel = this.boundaries.bottom.bound*body.linearVel[1],
                d = body.getBoundRect().ver[1] - this.containerSize[1];

            body.linearVel = [body.linearVel[0], inverseVel];
            body.setPos([body.pos[0], body.pos[1] - d]);
        }
    }
}