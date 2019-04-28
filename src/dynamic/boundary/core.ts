import { Boundary } from "./Boundary";
import { Body } from "../body/body";
import { collisionRes } from "../collision/collisionDetection";
import { collisionType } from "../collision/SAT";
import { findProjectionPoint, findMidPoint } from "../../util/util";




/**
 * 边界管理器
 */
export default class BoundariesManager {
    private containerSize: number[];
    public boundaries: Boundary[];

    constructor(containerSize: number[]) {
        this.boundaries = []

        this.containerSize = containerSize;
    }
    
    // 添加边界
    add(bound: Boundary) {
        if(!this.boundaries[bound.type]) {
            bound.init(this.containerSize);
            this.boundaries[bound.type] = bound;
        }
    }

    // 移除边界
    remove(bound: Boundary) {
        delete this.boundaries[bound.type];
    }

    clear() {
        for(let dir in this.boundaries) {
            delete this.boundaries[dir];
        }
    }

    // 刚体碰撞边界处理
    concatDetection(body: Body, collisionResList: Array<collisionRes>): Array<collisionRes> {
        this.boundaries.map(boundary => {
            let len = boundary.collisionDetect(body);

            if(boundary && len > 0) {
                // 边界碰撞点
                let collisionInfo,
                    info = body.getInfo();

                // 多边形与边界碰撞
                if(Array.isArray(info)) {
                    collisionInfo = {
                        len: len,
                        nor: boundary.nor,
                        edge: boundary.range,
                        type: collisionType.p2b,
                        p: findProjectionPoint(boundary.range, findMidPoint(boundary.findPointBehind(info)))
                    };
                }   
                // 圆形与边界碰撞
                else {
                    collisionInfo = {
                        len: len,
                        nor: boundary.nor,
                        edge: boundary.range,
                        type: collisionType.c2b,
                        p: findProjectionPoint(boundary.range, [info.x, info.y])
                    };
                }

                collisionResList.push({
                    body1: body,
                    body2: null,
                    collisionInfo: [collisionInfo]
                });
                
                // 应用摩擦力
                body.linearVel[0] *= (1 - boundary.friction);
            }
        });

        return collisionResList;
    }
}