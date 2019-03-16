import { PolygonBody, polygonType } from "./PolygonBody";
import { BodyConfig } from "./body";
import { vector, Vector } from "../../math/vector";



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
        this.baseVex = [
            [0, 0],
            [this.width, 0],
            [this.width, this.height],
            [0, this.height],
            [0, 0]
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
        return this.width*this.height;
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
        return this.mass/12*Vector.dot([this.width, this.height], [this.width, this.height]);
    }
}