import { Shape, shapeConfig } from './BaseShape';



class SVGPathConfig extends shapeConfig {
    svgPath: string;
    center: number[];
}



export class SVGPath extends Shape {
    private _svgPath: string;

    constructor(config: SVGPathConfig) {
        super(config, 'SVGPath');

        this._svgPath = config.svgPath;
        this.createPath();
    }

    config() {
        return {
            ...this.getBaseConfig(),
            svgPath: this._svgPath
        };
    }

    drawPath() {
        this.path = new Path2D(this._svgPath);
        return this;
    }
}