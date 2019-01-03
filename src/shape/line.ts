


export class line {
    ctx: CanvasRenderingContext2D;
    arcX: number;
    arcY: number;
    color: string;
    fill: boolean;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    start(pin: Array<number>, color: string, fill: boolean) {
        this.arcX = pin[0];
        this.arcY = pin[1];
        this.color = color;
        this.fill = fill;

        this.ctx.save();

        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(this.arcX, this.arcY);
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
        this.ctx.arc(this.arcX, this.arcY, radius, startDeg, endDeg, false);
        return this;
    }

    end() {
        this.fill? this.ctx.fill(): this.ctx.stroke();

        this.ctx.restore();
    } 
}