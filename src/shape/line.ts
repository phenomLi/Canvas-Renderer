import { shapeConfig, Shape } from "./BaseShape";



export class lineConfig extends shapeConfig {
    range: Array<number[]>; //*
}


export class Line extends Shape {
    private _range: Array<number[]>;

    constructor(config: lineConfig) {
        super(config, 'Line');

        this._range = config.range;
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
            range: this._range
        };
    }

    drawPath(): Shape {
        this.path = new Path2D();
        
        this.path.moveTo(this._range[0][0], this._range[0][1]);
        this.path.lineTo(this._range[1][0], this._range[1][1]);

        return this;
    }
}











