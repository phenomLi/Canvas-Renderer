import BoundRect from "../collision/boundRect";
import { Body, BodyConfig } from "./body";
import { isConcavePoly, divideConcavePoly, closePolyVex, rotateVex, calcPolyRange } from "../../util/util";
import Broadcast from "../../Broadcast/Broadcast";
import { vector, Vector } from "../../math/vector";


export type polygonVex = Array<number[]>;

// 多边形的类型（凹，凸）
export enum polygonType {
    convex = 'convex',
    concave = 'concave'
};




// 多边形刚体
export class PolygonBody extends Body {
    // 顶点信息
    protected vex: polygonVex; 

    protected baseVex: polygonVex;

    // 多边形类型
    protected polygonType: string;
    // 若是凹多边形，该变量保存凹多边形分割后的多个凸多边形
    private convexPolyList: Array<polygonVex>;

    constructor(opt: BodyConfig, type?: string) {
        super(opt, type? type: 'Polygon');

        if(type && type !== 'Polygon') return;

        this.baseVex = this.shape.attr('vex');

        this.vex = this.baseVex.map(v => [this.shape.attr('x') + v[0], this.shape.attr('y') + v[1]]);

        // 闭合顶点
        closePolyVex(this.vex);

        // 判断多边形类型
        this.polygonType = isConcavePoly(this.vex)? polygonType.concave: polygonType.convex;
        
        // 若是凹多边形，将多边形分割为多个凸多边形
        if(this.polygonType === polygonType.concave) {
            this.convexPolyList = divideConcavePoly(this.vex);
        }
        else {
            this.convexPolyList = [];
        }

        this.area = this.calcArea();
        this.density = this.calcDensity();
        this.centroid = this.calcCentroid();
        this.rotationInertia = this.calcRotationInertia();

        this.boundRect = this.createBoundRect();
    }

    // 计算面积
    calcArea(): number {
        let area = 0.0,
            // 辅助点，取值不影响计算
            pRef = [0, 0],
            len = this.vex.length - 1;

		for (let i = 0; i < len; ++i) {
			let p1 = pRef,
			    p2 = this.vex[i],
			    p3 = i + 1 < len ? this.vex[i + 1]: this.vex[0];

			let e1 = Vector.sub(p2, p1),
			    e2 = Vector.sub(p3, p1);

			let D = Vector.cor(e1, e2);

            // 子三角形面积
			let triangleArea = 0.5*D;
            
            // 累加子三角形面积
            area += triangleArea;
        }
        
        return area;
    }

    // 计算密度
    calcDensity(): number {
        return this.mass/this.area;
    }

    // 计算质心
    calcCentroid(): vector {
        let centroid = [0, 0],
            // 辅助点，取值不影响计算
            pRef = [0, 0],
            len = this.vex.length - 1;

		for (let i = 0; i < len; ++i) {
			let p1 = pRef,
			    p2 = this.vex[i],
			    p3 = i + 1 < len ? this.vex[i + 1]: this.vex[0];

			let e1 = Vector.sub(p2, p1),
			    e2 = Vector.sub(p3, p1);

			let D = Vector.cor(e1, e2);

            // 子三角形面积
            let triangleArea = 0.5*D,
                p = Vector.add(Vector.add(p1, p2), p3);
            
            centroid = Vector.add(centroid, Vector.scl(triangleArea/3, p));
        }

        centroid = Vector.scl(1/this.area, centroid);

        return centroid;
    }

    // 计算转动惯量
    calcRotationInertia(): number {
        let I = 0,
            pRef = [0, 0],
            inv3 = 1/3,
            len = this.vex.length - 1;

		for (let i = 0; i < len; ++i) {
			let p1 = pRef,
			    p2 = this.vex[i],
			    p3 = i + 1 < len ? this.vex[i + 1]: this.vex[0];

			let e1 = Vector.sub(p2, p1),
			    e2 = Vector.sub(p3, p1);

			let D = Vector.cor(e1, e2);

			let px = p1[0],
			    py = p1[1],
			    ex1 = e1[0],
			    ey1 = e1[1],
			    ex2 = e2[0],
			    ey2 = e2[1];

			var intx2 = inv3*(0.25*(ex1*ex1 + ex2*ex1 + ex2*ex2) + (px*ex1 + px*ex2)) + 0.5*px*px;
			var inty2 = inv3*(0.25*(ey1*ey1 + ey2*ey1 + ey2*ey2) + (py*ey1 + py*ey2)) + 0.5*py*py;

			I += D * (intx2 + inty2);
		}

		I = this.density*(I - this.area*Vector.dot(this.centroid, this.centroid));
        
        return I;
    }





    createBoundRect(): BoundRect {
        return new BoundRect(calcPolyRange(this.vex, 0, 0));
    }

    // 更新包围盒
    updateBoundRect(updateInfo: any) {
        if(updateInfo.type === 'pos') {
            // 更新位移顶点的坐标
            let x = updateInfo.val[0],
                y = updateInfo.val[1];

            this.vex = this.vex.map(v => [x + v[0], y + v[1]]);
        }
        // 更新旋转后的坐标
        else {
            this.vex = rotateVex(
                this.vex, 
                this.pos, 
                updateInfo.val
            );
        }    

        if(this.polygonType === polygonType.concave) {
            this.convexPolyList = divideConcavePoly(this.vex);
        }
        
        this.boundRect.update(calcPolyRange(this.vex, 0, 0));
    }

    // 获取多边形类型
    getPolyType(): string {
        return this.polygonType;
    }

    // 若是凹多边形，获取分割后的凸多边形列表
    getConvexPolyList(): Array<polygonVex> {
        return this.convexPolyList;
    }

    // 获取多边形信息
    getInfo(): polygonVex {
        return this.vex;
    }
}