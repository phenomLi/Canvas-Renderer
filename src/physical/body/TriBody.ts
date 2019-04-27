import { PolygonBody, polygonType } from "./PolygonBody";
import { BodyConfig, staticType } from "./body";
import { vector, Vector } from "../../math/vector";
import { rotateVex } from "../../util/util";



export class TriBody extends PolygonBody {
    private edge: number;
    private height: number;
    

    constructor(opt: BodyConfig) {
        super(opt, 'Triangle');

        this.baseVex = this.shape.attr('vex');

        // 正三角形是凸多边形
        this.polygonType = polygonType.convex;

        this.edge = this.shape.attr('edge');

        let x = this.shape.attr('x'), y = this.shape.attr('y'), midEdge = this.edge/2;

        this.height = Math.sqrt(this.edge*this.edge - midEdge*midEdge);

        // 设置矩形的顶点
        this.baseVex = this.shape.attr('vex');

        this.vex = this.baseVex.map(v => [x + v[0], y + v[1]]);

        if(this.rot != 0) {
            this.vex = rotateVex(this.vex, this.pos, this.rot);
        }

        this.area = this.calcArea();
        //this.density = this.calcDensity();
        this.mass = this.mass || this.area*this.density;
        this.centroid = this.calcCentroid();
        this.rotationInertia = this.calcRotationInertia();

        // 若此刚体是固定刚体，则质量趋于无穷大，则质量的倒数无穷小 --> 0
        if(this.static === staticType.position || this.static === staticType.total) {
            this.inverseMass = 0;
        }
        else {
            this.inverseMass = 1/this.mass;
        }

        this.boundRect = this.createBoundRect();
    }


    // 初始化刚体数据
    initBodyData() {
        
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