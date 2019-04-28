import { polygonVex, polygonType } from "../body/PolygonBody";
import { circleInfo, CirBody } from "../body/CircleBody";
import { vector, Vector } from "../../math/vector";
import { isOverlaps, getOverlapsLength, isPointInPoly, findProjectionPoint, findMidPoint } from "../../util/util";
import { PolygonBody } from "../body/PolygonBody";
import { Body } from '../body/body';
import { collisionInfo } from "./collisionDetection";



type collisionData = polygonVex | circleInfo;


/**
 * 碰撞类型
 * e2e：边对边
 * e2a：边对角
 * a2a: 角对角
 * e2c：边对圆
 * a2c：角对圆
 * c2c: 圆对圆
 * p2b: 多边形对边界
 * c2b：圆对边界
 */
export enum collisionType {
    e2e = 0,
    e2a = 1,
    a2a = 2,
    e2c = 3,
    a2c = 4,
    c2c = 5,
    p2b = 6,
    c2b = 7
}


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
export default function SATDetection(body1: Body, body2: Body): collisionInfo[] {
    // body1和body2都是多边形
    if(body1 instanceof PolygonBody && body2 instanceof PolygonBody) {
        // body1，body2都为为凹多边形
        if(body1.getPolyType() === polygonType.concave && body2.getPolyType() === polygonType.concave) {
            let polies1, polies2,
                collisionInfoList = [];

            polies1 = body1.getConvexPolyList();
            polies2 = body2.getConvexPolyList();

            for(let i = 0, len = polies1.length; i < len; i++) {

                for(let j = 0, len = polies2.length; j < len; j++) {
                    let pen = SAT(polies1[i], polies2[j]);

                    if(pen) {
                        collisionInfoList.push(pen);
                    }
                }
            }

            return collisionInfoList.length? collisionInfoList: null;
        }
        // body1为凹多边形，body2为凸多边形
        else if(body1.getPolyType() === polygonType.concave && body2.getPolyType() === polygonType.convex) {
            let vex = body2.getInfo(),
                polies = body1.getConvexPolyList(),
                collisionInfoList = [];

            for(let i = 0, len = polies.length; i < len; i ++) {
                let pen = SAT(polies[i], vex);

                if(pen) {
                    collisionInfoList.push(pen);
                }
            }

            return collisionInfoList.length? collisionInfoList: null;
        }
        // body1为凸多边形，body2为凹多边形
        else if(body1.getPolyType() === polygonType.convex && body2.getPolyType() === polygonType.concave) {
            let vex = body1.getInfo(),
                polies = body2.getConvexPolyList(),
                collisionInfoList = [];

            for(let i = 0, len = polies.length; i < len; i ++) {
                let pen = SAT(polies[i], vex);

                if(pen) {
                    collisionInfoList.push(pen);
                }
            }

            return collisionInfoList.length? collisionInfoList: null;
        }
        // 两个都为凸多边形
        else {
            let res = SAT(body1.getInfo(), body2.getInfo());
            return res? [res]: null;
        }
    }
    // body1是多边形body2是圆形
    else if(body1 instanceof PolygonBody && body2 instanceof CirBody) {
        if(body1.getPolyType() === polygonType.concave) {
            let polies = body1.getConvexPolyList(),
                rad = body2.getInfo(),
                collisionInfoList = [];

            for(let i = 0, len = polies.length; i < len; i ++) {
                let pen = SAT(polies[i], rad);

                if(pen) {
                    collisionInfoList.push(pen);
                }
            }

            return collisionInfoList.length? collisionInfoList: null;
        }
        else {
            let res = SAT(body1.getInfo(), body2.getInfo());
            return res? [res]: null;
        }
    }
    // body1是圆形body2是多边形
    else if(body1 instanceof CirBody && body2 instanceof PolygonBody) {
        if(body2.getPolyType() === polygonType.concave) {
            let polies = body2.getConvexPolyList(),
                rad = body1.getInfo(),
                collisionInfoList = [];

            for(let i = 0, len = polies.length; i < len; i ++) {
                let pen = SAT(polies[i], rad);

                if(pen) {
                    collisionInfoList.push(pen);
                }
            }

            return collisionInfoList.length? collisionInfoList: null;
        }
        else {
            let res = SAT(body1.getInfo(), body2.getInfo());
            return res? [res]: null;
        }
    }
    // 两个都是圆形
    else {
        let res = circleContact(<CirBody>body1, <CirBody>body2);
        return res? [res]: null;
    }
}   




// SAT分离轴
function SAT(obj1: collisionData, obj2: collisionData): collisionInfo {
    let axes = getAxes(obj1, obj2),
        minOverlaps = 10000,
        overlaps = 0,
        index = -1;

    let p1, p2;
    
    for(let i = 0; i < axes.length; i++) {
        let pro1 = project(obj1, axes[i]),
            pro2 = project(obj2, axes[i]);

        if(isOverlaps(pro1, pro2)) {
            overlaps = getOverlapsLength(pro1, pro2);

            if(overlaps < minOverlaps) {
                minOverlaps = overlaps;
                index = i;
                p1 = pro1;
                p2 = pro2;
            }
        }
        else {
            return null;
        }
    }

    return {
        nor: axes[index],
        len: minOverlaps,
        ...calcCollisionInfo(obj1, p1, obj2, p2, axes[index])
    };
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
function circleContact(cir1: CirBody, cir2: CirBody): collisionInfo {
    let center1 = [cir1.getInfo().x, cir1.getInfo().y],
        center2 = [cir2.getInfo().x, cir2.getInfo().y];

    let centerDistance = Math.sqrt(Math.pow(center1[0] - center2[0], 2) + Math.pow(center1[1] - center2[1], 2)),
        sumRadius = cir1.getInfo().radius + cir2.getInfo().radius;

    return {
        nor: Vector.sub(center1, center2),
        len: sumRadius - centerDistance,
        edge: null,
        type: collisionType.c2c,
        p: null
    };
}


/**
 * 碰撞信息
 * edge：碰撞边
 * type：碰撞类型
 * p: 碰撞点
 */
export class info {
    edge: Array<number[]>;
    type: number;
    p: vector;
}


/**
 * 计算碰撞信息
 * @param obj1 对象1
 * @param pro1 对象1在碰撞法线的投影
 * @param obj2 对象2
 * @param pro2 对象2在碰撞法线的投影
 * @param nor 碰撞法线
 * 
 * @returns info 碰撞边，碰撞类型
 */
function calcCollisionInfo(obj1: collisionData, pro1: number[], obj2: collisionData, pro2: number[], nor: vector): info {
    // obj1和obj2都是多边形
    if(Array.isArray(obj1) && Array.isArray(obj2)) {
        let verticalEdge1 = findVerticalEdge(obj1, nor),
            verticalEdge2 = findVerticalEdge(obj2, nor),
            // 找第一个对象的碰撞边
            edge1 = findCollisionEdge(verticalEdge1, pro2, nor),
            // 找第一个对象的碰撞边
            edge2 = findCollisionEdge(verticalEdge2, pro1, nor);

        // 若只有obj1有碰撞边，则是边角碰撞
        if(edge1 && !edge2) {
            return {
                edge: edge1,
                type: collisionType.e2a,
                p: calcCollsionPoint(collisionType.e2a, edge1, obj1, obj2)
            };
        }
        
        // 同理
        if(!edge1 && edge2) {
            return {
                edge: edge2,
                type: collisionType.e2a,
                p: calcCollsionPoint(collisionType.e2a, edge2, obj2, obj1)
            };
        }
        
        // 若obj1和obj2都有碰撞边，则是边边碰撞
        if(edge1 && edge2) {
            return {
                edge: edge1,
                type: collisionType.e2e,
                p: calcCollsionPoint(collisionType.e2e, edge1, obj1, obj2)
            };
        }

        // 若obj1和obj2都没有碰撞边，则是角角碰撞
        if(!edge1 && !edge2) {
            return {
                edge: null,
                type: collisionType.a2a,
                p: null
            };
        }
    }

    // obj1是多边形，obj2是圆形
    if(Array.isArray(obj1) && !Array.isArray(obj2)) {
        let verticalEdge = findVerticalEdge(obj1, nor),
            // 找第一个对象的碰撞边
            edge = findCollisionEdge(verticalEdge, pro2, nor);

        if(edge) {
            return {
                edge,
                type: collisionType.e2c,
                p: calcCollsionPoint(collisionType.e2c, edge, obj1, obj2)
            };
        }
        else {
            return {
                edge,
                type: collisionType.a2c,
                p: null
            };
        }
    }

    // obj1是圆形，obj2是多边形
    if(!Array.isArray(obj1) && Array.isArray(obj2)) {
        let verticalEdge = findVerticalEdge(obj2, nor),
            // 找第一个对象的碰撞边
            edge = findCollisionEdge(verticalEdge, pro1, nor);

        if(edge) {
            return {
                edge,
                type: collisionType.e2c,
                p: calcCollsionPoint(collisionType.e2c, edge, obj2, obj1)
            };
        }
        else {
            return {
                edge,
                type: collisionType.a2c,
                p: null
            };
        }
    }

    return null;
}


// 寻找于碰撞法线垂直的边
function findVerticalEdge(obj: polygonVex, nor: vector): Array<Array<number[]>> {
    let edge = [];

    for(let i = 0, len = obj.length; i < len - 1; i++) {
        let e = Vector.sub(obj[i + 1], obj[i]);

        if(Vector.dot(e, nor) === 0) edge.push([obj[i], obj[i + 1]]);
    };

    return edge;
}

// 寻找碰撞边
function findCollisionEdge(verticalEdges: Array<Array<number[]>>, pro: number[], nor: vector): Array<number[]> {
    if(verticalEdges.length === 0) return null;

    for(let i = 0, len = verticalEdges.length; i < len; i++) {
        let n = Vector.pro(verticalEdges[i][0], nor);
        if(pro[0] < n && pro[1] > n) {
            return verticalEdges[i];
        }
    }
}


/**
 * 计算碰撞点
 * @param type 碰撞类型
 * @param e 碰撞边
 * @param obj1 碰撞对象1
 * @param obj2 碰撞对象2
 */
function calcCollsionPoint(type: number, e: vector[], obj1: collisionData, obj2: collisionData): vector {
    let collisionPoint = [];

    // 如果是边对边碰撞
    if(type === collisionType.e2e) {
        for(let i = 0, len = (<polygonVex>obj2).length; i < len - 1; i++) {
            if(isPointInPoly(<polygonVex>obj1, obj2[i])) {
                collisionPoint.push(findProjectionPoint(e, obj2[i]));
            }
        }

        for(let i = 0, len = (<polygonVex>obj1).length; i < len - 1; i++) {
            if(isPointInPoly(<polygonVex>obj2, obj1[i])) {
                collisionPoint.push(findProjectionPoint(e, obj1[i]));
            }
        }

        collisionPoint = findMidPoint(collisionPoint);
    }

    // 如果是边对角碰撞
    if(type === collisionType.e2a) {
        for(let i = 0, len = (<polygonVex>obj2).length; i < len - 1; i++) {
            if(isPointInPoly(<polygonVex>obj1, obj2[i])) {
                collisionPoint.push(findProjectionPoint(e, obj2[i]));
            }
        }

        collisionPoint = findMidPoint(collisionPoint);
    }

    if(type === collisionType.e2c) {
        collisionPoint = findProjectionPoint(e, [(<circleInfo>obj2).x, (<circleInfo>obj2).y]);
    }

    return collisionPoint;
}