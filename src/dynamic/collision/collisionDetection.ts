import { Body } from "../body/body";
import { vector } from "../../math/vector";
import { AABBIntersect } from "./AABB";
import SATDetection from "./SAT";
import BoundariesManager from "../boundary/core";

/**
 * 碰撞信息
 * len：嵌入深度
 * nor：碰撞法线
 * edge：碰撞边
 * type：碰撞类型
 * p: 碰撞点
 */
export class collisionInfo {
    len: number;
    nor: vector;
    edge: Array<number[]>;
    type: number;
    p: vector;
}


// 碰撞结果对象
export class collisionRes {
    body1: Body;
    body2: Body;
    // 碰撞信息
    collisionInfo: collisionInfo[];
}


/**
 * 碰撞检测器
 */
export default class CollisionDetection {
    private bodyList: Array<Body>;
    private boundariesManager: BoundariesManager;

    constructor(bodyList: Array<Body>, boundariesManager: BoundariesManager) {
        this.bodyList = bodyList;
        this.boundariesManager = boundariesManager;
    }

    // 扫描检测
    sweep(): collisionRes[] {
        let collisionResList: Array<collisionRes> = [];

        // 端点排序
        this.bodyList.sort((b1, b2) => b1.getBoundRect().hor[0] - b2.getBoundRect().hor[0]);

        for(let i = 0, len = this.bodyList.length; i < len; i++) {

            // 检测刚体与边界的碰撞
            collisionResList = this.boundariesManager.concatDetection(this.bodyList[i], collisionResList);

            // 检测刚体间的碰撞
            for(let j = i + 1; j < len; j++ ) {
                let b1 = this.bodyList[i], b2 = this.bodyList[j],
                    br1 = b1.getBoundRect(), br2 = b2.getBoundRect();

                if(br1.hor[1] >= br2.hor[0]) {
                    if(AABBIntersect(br1, br2)) {
                        let info = SATDetection(b1, b2);

                        if(info) {
                            collisionResList.push({
                                body1: b1, 
                                body2: b2,
                                collisionInfo: info
                            });
                        }
                        else {
                            b1.separated();
                            b2.separated();
                        }
                    }
                }
                else {
                    b1.separated();
                    b2.separated();

                    break
                };
            }
        }

        return collisionResList;
    }
} 