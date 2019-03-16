import { PolygonBody, polygonType } from "./PolygonBody";
import { BodyConfig } from "./body";
import { vector, Vector } from "../../math/vector";



export class TriBody extends PolygonBody {
    private edge: number;
    private height: number;
    

    constructor(opt: BodyConfig) {
        super(opt, 'Triangle');

        this.baseVex = this.shape.attr('vex');

        // 正三角形是凸多边形
        this.polygonType = polygonType.convex;

        this.edge = this.shape.attr('edge');

        let x = this.shape.attr('x'), y = this.shape.attr('y'), midEdge;

        midEdge = this.edge/2;

        this.height = Math.sqrt(this.edge*this.edge - midEdge*midEdge);

        // 设置矩形的顶点
        this.baseVex = [
            [0, 0],
            [-midEdge, this.height], 
            [midEdge, this.height], 
            [0, 0],
        ];

        this.vex = this.baseVex.map(v => [x + v[0], y + v[1]]);

        this.area = this.calcArea();
        this.density = this.calcDensity();
        this.centroid = this.calcCentroid();
        this.rotationInertia = this.calcRotationInertia();

        this.boundRect = this.createBoundRect();
    }


    // 计算面积
    calcArea(): number {
        return 0.5*this.edge*this.height;
    }

    // 计算密度
    calcDensity(): number {
        return this.mass/this.area;
    }

    // 计算质心
    calcCentroid(): vector {
        return this.pos;
    }

    // 计算转动惯量
    calcRotationInertia(): number {
        let P = Vector.sub(this.vex[1], this.vex[0]),
            Q = Vector.sub(this.vex[2], this.vex[0]);

        return this.mass/6*(Vector.dot(P, P) + Vector.dot(P, Q) + Vector.dot(Q, Q));
    }
}