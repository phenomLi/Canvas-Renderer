import { polygonVex, polygonType } from "../body/PolygonBody";
import { circleInfo, CirBody } from "../body/CircleBody";
import { vector, Vector } from "../../math/vector";
import { isOverlaps, getOverlapsLength } from "../../util/util";
import { PolygonBody } from "../body/PolygonBody";
import { Body } from '../body/body';



type collisionData = polygonVex | circleInfo;


/**
 * 细检测阶段，使用SAT算法
 * 3种情况：
 * 1：body1为多边形，body2为多边形
 *  - body1为凹多边形，body2为凹多边形
 *  - body1为凹多边形，body2为凸多边形
 *  - body1为凸多边形，body2为凹多边形
 *  - body1和body2都为凸多边形
 * 2：obj1为多边形，body2为圆形
 * 3：body1为圆形，body2为多边形
 */
export default function SATDetection(body1: Body, body2: Body): number {
    // body1和body2都是多边形
    if(body1 instanceof PolygonBody && body2 instanceof PolygonBody) {
        // body1，body2都为为凹多边形
        if(body1.getPolyType() === polygonType.concave && body2.getPolyType() === polygonType.concave) {
            let polies1, polies2;

            polies1 = body1.getConvexPolyList();
            polies2 = body2.getConvexPolyList();

            for(let i = 0, len = polies1.length; i < len; i++) {

                for(let j = 0, len = polies2.length; j < len; j++) {
                    let pen = SAT(polies1[i], polies2[j]);

                    if(pen >= 0) {
                        return pen;
                    }
                }
            }

            return -1;
        }
        // body1为凹多边形，body2为凸多边形
        else if(body1.getPolyType() === polygonType.concave && body2.getPolyType() === polygonType.convex) {
            let vex = body2.getInfo(),
                polies = body1.getConvexPolyList();

            for(let i = 0, len = polies.length; i < len; i ++) {
                let pen = SAT(polies[i], vex);

                if(pen >= 0) {
                    return pen;
                }
            }

            return -1;
        }
        // body1为凸多边形，body2为凹多边形
        else if(body1.getPolyType() === polygonType.convex && body2.getPolyType() === polygonType.concave) {
            let vex = body1.getInfo(),
                polies = body2.getConvexPolyList();

            for(let i = 0, len = polies.length; i < len; i ++) {
                let pen = SAT(polies[i], vex);

                if(pen >= 0) {
                    return pen;
                }
            }

            return null;
        }
        // 两个都为凸多边形
        else {
            return SAT(body1.getInfo(), body2.getInfo());
        }
    }
    // body1是多边形body2是圆形
    else if(body1 instanceof PolygonBody && body2 instanceof CirBody) {
        if(body1.getPolyType() === polygonType.concave) {
            let polies = body1.getConvexPolyList(),
                rad = body2.getInfo();

            for(let i = 0, len = polies.length; i < len; i ++) {
                let pen = SAT(polies[i], rad);

                if(pen >= 0) {
                    return pen;
                }
            }

            return -1;
        }
        else {
            return SAT(body1.getInfo(), body2.getInfo());
        }
    }
    // body1是圆形body2是多边形
    else if(body1 instanceof CirBody && body2 instanceof PolygonBody) {
        if(body2.getPolyType() === polygonType.concave) {
            let polies = body2.getConvexPolyList(),
                rad = body1.getInfo();

            for(let i = 0, len = polies.length; i < len; i ++) {
                let pen = SAT(polies[i], rad);

                if(pen >= 0) {
                    return pen;
                }
            }

            return -1;
        }
        else {
            return SAT(body1.getInfo(), body2.getInfo());
        }
    }
    // 两个都是圆形
    else {
        return circleContact(<CirBody>body1, <CirBody>body2);
    }
}   




// SAT分离轴
function SAT(obj1: collisionData, obj2: collisionData): number {
    let axes = getAxes(obj1, obj2),
        minOverlaps = 10000,
        overlaps = 0;

    for(let i = 0; i < axes.length; i++) {
        let pro1 = project(obj1, axes[i]),
            pro2 = project(obj2, axes[i]);

        if(isOverlaps(pro1, pro2)) {
            overlaps = getOverlapsLength(pro1, pro2);

            if(overlaps < minOverlaps) {
                minOverlaps = overlaps;
            }
        }
        else {
            return -1;
        }
    }

    return minOverlaps;
}

// 获取两个图形的所有分离轴
function getAxes(obj1: collisionData, obj2: collisionData): Array<vector> {
    let axesList1: Array<vector>,
        axesList2: Array<vector>;

    axesList1 = Array.isArray(obj1)? getPolyAxes(obj1): getCirAxes(obj1, <polygonVex>obj2);
    axesList2 = Array.isArray(obj2)? getPolyAxes(obj2): getCirAxes(obj2, <polygonVex>obj1);

    return axesList1.concat(axesList2);
}


// 获取多边形的分离轴
function getPolyAxes(poly: polygonVex): Array<vector> {
    let axesList: Array<vector> = [];

    for(let i = 1, len = poly.length; i < len; i++) {
        axesList.push(Vector.nor([poly[i][0] - poly[i - 1][0], poly[i][1] - poly[i - 1][1]]));
    }

    return axesList;
}

// 获取圆形的分离轴
function getCirAxes(cir: circleInfo, poly: polygonVex): Array<vector> {
    let minLen: number, index = 0;

    // 假设距离最短为第一个顶点
    minLen = Vector.len([poly[0][0] - cir.x, poly[0][1] - cir.y]);

    // 找出多边形到圆心距离最小的顶点
    poly.map((v, i) => {
        let len = Vector.len([v[0] - cir.x, v[1] - cir.y]);

        if(len < minLen) {
            minLen = len;
            index = i;
        }
    });

    return [[poly[index][0] - cir.x, poly[index][1] - cir.y]];
}

/**
 * 投影
 * @param {collisionData} obj 图形
 * @param {vector} sAxis 要将图形投影到的分离轴
 * @returns {number[]} 投影结果的范围
 */
function project(obj: collisionData, sAxis: vector): number[] {
    let range: number[];

    // 若是多边形
    if(Array.isArray(obj)) {
        let projection = obj.map(v => Vector.pro(v, sAxis));
        range = [
            Math.min.apply(Math, projection), 
            Math.max.apply(Math, projection)
        ];
    }
    // 若是圆形
    else {
        let len = Vector.pro([obj.x, obj.y], sAxis);
        range = [len - obj.radius, len + obj.radius];
    }

    return range;
}


// 检测圆形间的碰撞
function circleContact(cir1: CirBody, cir2: CirBody): number {
    let center1 = [cir1.getInfo().x, cir1.getInfo().y],
        center2 = [cir2.getInfo().x, cir2.getInfo().y];

    let centerDistance = Math.sqrt(Math.pow(center1[0] - center2[0], 2) + Math.pow(center1[1] - center2[1], 2)),
        sumRadius = cir1.getInfo().radius + cir2.getInfo().radius;

    return sumRadius - centerDistance;
}