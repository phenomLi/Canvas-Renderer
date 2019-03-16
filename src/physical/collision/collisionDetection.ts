import { Body } from "../body/body";
import { vector } from "../../math/vector";
import { AABBIntersect } from "./AABB";
import SATDetection from "./SAT";





// 碰撞结果对象
export class collisionRes {
    body1: Body;
    body2: Body;
    // 两对象嵌入深度
    penetration: number;
}


/**
 * 碰撞检测器
 */
export default class CollisionDetection {
    private bodyList: Array<Body>;

    constructor(bodyList: Array<Body>) {
        this.bodyList = bodyList;
    }

    // 扫描检测
    sweep(): collisionRes[] {
        let collisionResList: Array<collisionRes> = [];

        // 端点排序
        this.bodyList.sort((b1, b2) => b1.getBoundRect().hor[0] - b2.getBoundRect().hor[0]);

        for(let i = 0, len = this.bodyList.length; i < len; i++) {
            for(let j = i + 1; j < len; j++ ) {
                let b1 = this.bodyList[i], b2 = this.bodyList[j],
                    br1 = b1.getBoundRect(), br2 = b2.getBoundRect();

                if(br1.hor[1] >= br2.hor[0]) {
                    if(AABBIntersect(br1, br2)) {
                        let pen = SATDetection(b1, b2);

                        if(pen >= 0) {
                            collisionResList.push({
                                body1: b1, 
                                body2: b2,
                                penetration: pen
                            });
                        }
                    }
                }
                else break;
            }
        }

        return collisionResList;
    }
} 