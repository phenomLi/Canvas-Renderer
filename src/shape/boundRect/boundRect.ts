import { polygonVex } from "../Polygon";
import { circleInfo } from "../Circle";

/**
 * AABB包围盒
 * 只有多边形（包括矩形和三角形）和圆形拥有
 *  */ 

export default class BoundRect {
    public horizontalRange: number[];
    public verticalRange: number[];

    constructor(vex: polygonVex | circleInfo) {
        this.update(vex);
    }

    // 更新包围盒
    update(vex: polygonVex | circleInfo) {
        if(Array.isArray(vex)) {
            let xMax: number = vex[0][0], 
            yMax: number = vex[0][1], 
            xMin: number = vex[0][0], 
            yMin: number = vex[0][1];
        
            (<polygonVex>vex).map(pos => {
                if(pos[0] < xMin) xMin = pos[0];
                if(pos[0] > xMax) xMax = pos[0];
                if(pos[1] < yMin) yMin = pos[1];
                if(pos[1] > yMax) yMax = pos[1];
            });

            this.horizontalRange = [xMin, xMax];
            this.verticalRange = [yMin, yMax];
        }
        else {
            this.horizontalRange = [vex.x - vex.radius, vex.x + vex.radius];
            this.verticalRange = [vex.y - vex.radius, vex.y + vex.radius];
        }
    }
}