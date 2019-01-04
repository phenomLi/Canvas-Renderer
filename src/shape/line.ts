
class lineConfig {
    pin: Array<number>;
    color: string;
    fill: boolean;
}


export class line {
    ctx: CanvasRenderingContext2D;
    arcX: number;
    arcY: number;
    color: string;
    fill: boolean;

    constructor() {}

    start(ctx: CanvasRenderingContext2D, config: lineConfig): line {
        this.ctx = ctx;
        this.arcX = config.pin[0];
        this.arcY = config.pin[1];
        this.color = config.color;
        this.fill = config.fill;

        this.ctx.save();

        this.ctx.fillStyle = this.color;
        this.ctx.strokeStyle = this.color;
        this.ctx.beginPath();
        this.ctx.moveTo(this.arcX, this.arcY);

        return this;
    }

    bee(path: Array<Array<number>>): line {
        for(let i = 0; i < path.length; i ++) {
            this.ctx.lineTo(path[i][0], path[i][1]);
        }

        this.arcX = path[path.length - 1][0];
        this.arcY = path[path.length - 1][1];

        return this;
    }

    arc(radius: number, startDeg: number, endDeg: number): line {
        let deg = startDeg - endDeg;

        this.ctx.arc(this.arcX, this.arcY, radius, startDeg/180*Math.PI, endDeg/180*Math.PI, false);

        //this.ctx.moveTo(radius*);

        //console.log('x:' + radius*Math.cos(90/180*Math.PI) + ', y:' + radius*Math.sin(deg/180*Math.PI));

        return this;
    }

    end() {
        this.fill? this.ctx.fill(): this.ctx.stroke();

        this.ctx.restore();
    } 
}