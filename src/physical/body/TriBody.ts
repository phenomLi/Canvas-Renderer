import { PolygonBody, polygonType } from "./PolygonBody";
import { BodyConfig, staticType } from "./body";
import { vector, Vector } from "../../math/vector";
import { rotateVex } from "../../util/util";



export class TriBody extends PolygonBody {
    private edge: number;
    private height: number;
    

    constructor(opt: BodyConfig) {
        super(opt, 'Triangle');
    }


    // 初始化刚体数据
    initBodyData() {
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
        return [this.pos[0], this.pos[1]];
    }

    // 计算转动惯量
    calcRotationInertia(): number {
        let P = Vector.sub(this.vex[1], this.vex[0]),
            Q = Vector.sub(this.vex[2], this.vex[0]);

        return this.mass/6*(Vector.dot(P, P) + Vector.dot(P, Q) + Vector.dot(Q, Q));
    }
}