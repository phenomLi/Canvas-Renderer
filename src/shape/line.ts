import { shapeConfig, Shape } from "./BaseShape";



export class lineConfig extends shapeConfig {
    range: Array<number[]>; //起始和结束坐标*
    curveness?: number; // 弯曲参数
    percent?: number; //线段绘制的百分比
}


export class Line extends Shape {
    private _range: Array<number[]>;
    private _curveness: number;
    private _percent: number;

    constructor(config: lineConfig) {
        super(config, 'Line');

        this._range = config.range;
        this._curveness = config.curveness || 0;
        this._percent = config.percent === undefined? 100: config.percent;
        this._fill = false;

        this.initSetter();
        this.createPath();
    }

    //--------------------重载setter-------------------------//

    setterRange(range: Array<number[]>) {
        this._range = range;

        this.drawPath();
    }

    //------------------------------------------------------//

    config() {
        return {
            ...this.getBaseConfig(),
            range: this._range,
            percent: this._percent,
            curveness: this._curveness
        };
    }

    drawPath(): Shape {
        this.path = new Path2D();
        
        if(this._curveness) {
            let start = this._range[0],
            end = this._range[1],
            cp = [
                (start[0] + end[0])/2 - (start[1] - end[1])*this._curveness,
                (start[1] + end[1])/2 - (end[0] - start[0])*this._curveness
            ];
            
            let t = this._percent/100;

            let v1 = [cp[0] - start[0], cp[1] - start[1]],
                v2 = [end[0] - cp[0], end[1] - cp[1]],  
                q0 = [start[0] + v1[0]*t, start[1] + v1[1]*t],
                q1 = [cp[0] + v2[0]*t, cp[1] + v2[1]*t],
                v = [q1[0] - q0[0], q1[1] - q0[1]],
                b = [q0[0] + v[0]*t, q0[1] + v[1]*t];
            

            this.path.moveTo( start[ 0 ], start[ 1 ] );
            this.path.quadraticCurveTo(q0[0], q0[1], b[0], b[1]);
        }
        else {
            let dx = this._range[1][0] - this._range[0][0],
                dy = this._range[1][1] - this._range[0][1];

            this.path.moveTo(this._range[0][0], this._range[0][1]);
            this.path.lineTo(this._range[0][0] + this._percent/100*dx, this._range[0][1] + this._percent/100*dy);
        }

        return this;
    }
}











