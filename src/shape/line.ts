import { TranslateMatrix, Matrix } from './../math/matrix';


class Line {
    path: Path2D;
    tPath: Path2D;
    oX: number;
    oY: number;
    endX: number;
    endY: number;

    constructor() {}

    init(path: Path2D, pin: Array<number>): Line {
        this.path = path;
        this.oX = pin[0];
        this.oY = pin[1];
        this.endX = this.oX;
        this.endY = this.oY;
        this.tPath = new Path2D();

        Matrix.set(
            TranslateMatrix, 
            [[1, 0, this.oX], 
            [0, 1, this.oY]]
        );

        this.tPath.moveTo(0, 0);

        return this;
    }

    // 直线
    bee(path: Array<Array<number>>): Line {
        for(let i = 0; i < path.length; i ++) {
            this.tPath.lineTo(path[i][0], path[i][1]);
        }

        this.endX = path[path.length - 1][0];
        this.endY = path[path.length - 1][1];

        return this;
    }

    // 贝塞尔曲线
    bez(ctrlPoint1: Array<number>, ctrlPoint2: Array<number>, endPoint: Array<number>) {
        this.tPath.moveTo(this.endX, this.endY);
        this.tPath.bezierCurveTo(ctrlPoint1[0], ctrlPoint1[1], ctrlPoint2[0], ctrlPoint2[1], endPoint[0], endPoint[1]);
        this.endX = endPoint[0]; this.endY = endPoint[1];
    }

    // 弧线
    arc(radius: number, startDeg: number, endDeg: number, clockWise: boolean = true): Line {
        let xCenter: number, yCenter: number;

        // 将弧的圆心进行位移，确保直线的末尾端点跟弧的开始端点可以衔接
        xCenter = this.endX - radius*Math.cos((360 - startDeg)/180*Math.PI);
        yCenter = this.endY + radius*Math.sin((360 - startDeg)/180*Math.PI);

        this.tPath.arc(xCenter, yCenter, radius, (startDeg)/180*Math.PI, endDeg/180*Math.PI, clockWise);

        // 将弧的圆心进行位移，确保弧的末尾端点和下一段直线的开端可以衔接
        this.endX = xCenter - radius*Math.cos((360 - endDeg)/180*Math.PI);
        this.endY = yCenter + radius*Math.sin((360 - endDeg)/180*Math.PI);

        return this;
    }

    move(x: number, y: number) {
        this.tPath.moveTo(x, y);
        this.endX = x;
        this.endY = y;
    }

    end() {
        this.path.addPath(this.tPath, TranslateMatrix);
        Matrix.init(TranslateMatrix);
    } 
}

export const line = new Line();