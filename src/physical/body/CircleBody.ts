import { Body, BodyConfig, staticType } from "./body";
import BoundRect from "../collision/boundRect";
import { vector } from "../../math/vector";


export class circleInfo {
    x: number;
    y: number;
    radius: number;
}



export class CirBody extends Body {
    private cirInfo: circleInfo;

    constructor(opt: BodyConfig) {
        super(opt, 'Circle');

        this.cirInfo = {
            x: this.pos[0],
            y: this.pos[1],
            radius: this.shape.attr('radius')
        };

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

    // 计算面积
    calcArea(): number {
        return Math.pow(this.cirInfo.radius, 2)*Math.PI;
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
        return 0.5*this.mass*Math.pow(this.cirInfo.radius, 2);
    }





    // 创建包围盒（需重载）
    createBoundRect(): BoundRect {
        let range = [
            [this.cirInfo.x - this.cirInfo.radius, this.cirInfo.x + this.cirInfo.radius],
            [this.cirInfo.y - this.cirInfo.radius, this.cirInfo.y + this.cirInfo.radius]
        ];

        return new BoundRect(range);
    }

    // 更新包围盒
    updateBoundRect(updateInfo: any) {
        if(updateInfo.type === 'pos') {
            this.cirInfo.x = updateInfo.val[0] + this.cirInfo.x;
            this.cirInfo.y = updateInfo.val[1] + this.cirInfo.y;
        }

        let range = [
            [this.cirInfo.x - this.cirInfo.radius, this.cirInfo.x + this.cirInfo.radius],
            [this.cirInfo.y - this.cirInfo.radius, this.cirInfo.y + this.cirInfo.radius]
        ];

        this.boundRect.update(range);
    }

    getInfo(): circleInfo {
        return this.cirInfo;
    }
}