import { polygonVex, Polygon, polygonType } from "../../shape/Polygon";
import { circleInfo, Circle } from "../../shape/Circle";
import { vector, Vector } from "../../math/vector";
import { isOverlaps } from "../../util/util";


type collisionData = polygonVex | circleInfo;
type collisionShape = Polygon | Circle;


/**
 * SAT检测
 * 3种情况：
 * 1：obj1为多边形，obj2为多边形
 * 2：obj1为多边形，obj2为圆形
 * 3：obj1为圆形，obj2为多边形
 */
export default function SATDetection(shape1: collisionShape, shape2: collisionShape): boolean {
    // shape1和shape2都是多边形
    if(shape1 instanceof Polygon && shape2 instanceof Polygon) {
        // shape1，shape2都为为凹多边形
        if(shape1.getPolyType() === polygonType.concave && shape2.getPolyType() === polygonType.concave) {
            let polyList1, polyList2;

            polyList1 = shape1.getConvexPolyList();
            polyList2 = shape2.getConvexPolyList();

            return !polyList1.every(poly1 => polyList2.every(poly2 => !SAT(poly1, poly2)));
        }
        // shape1为凹多边形，shape2为凸多边形
        else if(shape1.getPolyType() === polygonType.concave && shape2.getPolyType() === polygonType.convex) {
            let vex = shape2.getPolygonInfo();
            return !shape1.getConvexPolyList().every(poly => !SAT(poly, vex));
        }
        // shape1为凸多边形，shape2为凹多边形
        else if(shape1.getPolyType() === polygonType.convex && shape2.getPolyType() === polygonType.concave) {
            let vex = shape1.getPolygonInfo();
            return !shape2.getConvexPolyList().every(poly => !SAT(poly, vex));
        }
        // 两个都为凸多边形
        else {
            return SAT(shape1.getPolygonInfo(), shape2.getPolygonInfo());
        }

    }
    // 一个是多边形一个是圆形
    else {
        return shape1 instanceof Polygon? 
            SAT(shape1.getPolygonInfo(), (<Circle>shape2).getCircleInfo()):
            SAT(shape1.getCircleInfo(), (<Polygon>shape2).getPolygonInfo());
    }
}   




// SAT分离轴
function SAT(obj1: collisionData, obj2: collisionData): boolean {
    return !getAxes(obj1, obj2).every(v => !isOverlaps(project(obj1, v), project(obj2, v)));
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
    let minLen: number, index;

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