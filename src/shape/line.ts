import { shape } from './baseShape';


class LineConfig {
    pin: Array<number>;
    color: string;
    fill: boolean;
}


class Line {
    ctx: CanvasRenderingContext2D;
    oX: number;
    oY: number;
    endX: number;
    endY: number;
    color: string;
    fill: boolean;

    constructor() {}

    init(ctx: CanvasRenderingContext2D, shape: shape): Line {
        this.ctx = ctx;
        this.oX = <number>shape.x();
        this.oY = <number>shape.y();
        this.color = <string>shape.color();
        this.fill = <boolean>shape.fill();

        return this;
    }

    start(pin: Array<number>): Line {
        this.endX = pin[0];
        this.endY = pin[1];
        
        this.ctx.translate(this.oX, this.oY);

        this.ctx.fillStyle = this.color;
        this.ctx.strokeStyle = this.color;
        this.ctx.beginPath();
        this.ctx.moveTo(this.endX, this.endY);

        return this;
    }

    bee(path: Array<Array<number>>): Line {
        for(let i = 0; i < path.length; i ++) {
            this.ctx.lineTo(path[i][0], path[i][1]);
        }

        this.endX = path[path.length - 1][0];
        this.endY = path[path.length - 1][1];

        return this;
    }

    arc(radius: number, startDeg: number, endDeg: number, clockWise: boolean = true): Line {
        let xCenter: number, yCenter: number;

        // 将弧的圆心进行位移，确保直线的末尾端点跟弧的开始端点可以衔接
        xCenter = this.endX - radius*Math.cos((360 - startDeg)/180*Math.PI);
        yCenter = this.endY + radius*Math.sin((360 - startDeg)/180*Math.PI);

        this.ctx.arc(xCenter, yCenter, radius, (startDeg)/180*Math.PI, endDeg/180*Math.PI, clockWise);

        // 将弧的圆心进行位移，确保弧的末尾端点和下一段直线的开端可以衔接
        this.endX = xCenter - radius*Math.cos((360 - endDeg)/180*Math.PI);
        this.endY = yCenter + radius*Math.sin((360 - endDeg)/180*Math.PI);

        return this;
    }

    end() {
        this.fill? this.ctx.fill(): this.ctx.stroke();
    } 
}

export const line = new Line();