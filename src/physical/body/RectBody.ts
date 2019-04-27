import { PolygonBody, polygonType } from "./PolygonBody";
import { BodyConfig, staticType } from "./body";
import { vector, Vector } from "../../math/vector";
import { rotateVex } from "../../util/util";



export class RectBody extends PolygonBody {
    private width: number;
    private height: number;

    constructor(opt: BodyConfig) {
        super(opt, 'Rectangle');

        // 矩形是凸多边形
        this.polygonType = polygonType.convex;

        let x = this.shape.attr('x'), y = this.shape.attr('y');
        this.width = this.shape.attr('width'), this.height = this.shape.attr('height');

        // 设置矩形的顶点
        this.baseVex = this.shape.attr('vex');

        this.vex = this.baseVex.map(v => [x + v[0], y + v[1]]);

        if(this.rot != 0) {
            this.vex = rotateVex(this.vex, this.pos, this.rot);
        }

        this.area = this.calcArea();
        
        // 如果质量被用户定义了，那就重新计算密度
        if(this.mass !== 0) {
            this.density = this.calcDensity();
        }
        // 否则根据面积计算面积，密度使用默认密度（0.01）
        else {
            this.mass = this.area*this.density;
        }

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

    // 计算面积
    calcArea(): number {
        return this.width*this.height;
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
        return this.mass*Vector.dot([this.width, this.height], [this.width, this.height])/12;
    }
}