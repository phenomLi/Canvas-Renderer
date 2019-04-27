import { Shape, shapeConfig } from './BaseShape';
import { drawTool } from './DrawTool';
import { calcPolyRange } from '../util/util';


export class polygonConfig extends shapeConfig {
    vex?: Array<number[]>; //*
}


//绘制多边形
export class Polygon extends Shape {
    protected _vex: Array<number[]>; 

    constructor(config: polygonConfig, type?: string) {
        super(config, type? type: 'Polygon');

        if(this._type !== 'Polygon') return;

        this._vex = config.vex;

        if(this._vex.length < 3) {
            throw '多边形定点数必须大于3.';
        }

        // 计算图形几何中心
        let range = calcPolyRange(this._vex, this._x, this._y);

        this._center = [
            range[0][0] + (range[0][1] - range[0][0])/2, 
            range[1][0] + (range[1][1] - range[1][0])/2
        ];

        this.initSetter();
        this.createPath();
    }
    
    config(): any {
        return {
            ...this.getBaseConfig(),
            vex: this._vex
        };
    }


    drawPath(): Shape {
        this.path = new Path2D();

        drawTool
        .init(this.path, [this._x, this._y])
        .bee(this._vex)
        .end();

        return this;
    }
} 