import { Base, Shape, shapeConfig } from "./BaseShape";


class textConfig extends shapeConfig {
    content: string;  //*
    fontSize?: number;
    align?: CanvasTextAlign;
    dir?: CanvasDirection;
    maxWidth?: number;
}


export class TextBlock extends Shape {
    private _fontSize: number;
    private _content: string;
    private _maxWidth: number;
    private _align: CanvasTextAlign;
    private _direction: CanvasDirection;

    private font: string;
    private compositeRotate: number;
    private compositeCenter: number[];

    constructor(config: textConfig) {
        super(config, 'Text');

        this._maxWidth = config.maxWidth || null;
        this._fontSize = config.fontSize || 10;
        this._content = config.content || '';
        this._align = config.align || 'start';
        this._direction = config.dir || 'inherit';

        this.font = 'px sans-serif';
        this._center = [];
        this.compositeCenter = [];
        this.compositeRotate = 0;

        this.initSetter();
    }

    config() {
        return {
            ...this.getBaseConfig(),
            content: this._content,
            fontSize: this._fontSize,
            align: this._align,
            dir: this._direction,
            maxWidth: this._maxWidth,
        };
    }

    // 若 text 被加入 composite，则叠加旋转(获取 composite 的 center 和 rotate)
    setCompositeRotate(center: number[], deg: number) {
        this.compositeCenter = center;
        this.compositeRotate = deg;
    }

    // 文本旋转
    textRotate(ctx: CanvasRenderingContext2D, center: number[], deg: number) {
        ctx.translate(center[0], center[1]);
        ctx.rotate(deg/180*Math.PI);
        ctx.translate(-center[0], -center[1]);
    }

    /** -------------------PATH2D路径---------------------------- */

    drawPath(): TextBlock { return this; }

    // 旋转path2D路径
    rotatePath(): TextBlock { return this; }

    // 形变path2D路径
    transFormPath(): TextBlock { return this; }

    render(ctx: CanvasRenderingContext2D) {
        if(!this._show) return; 

        this.compositeCenter.length && this.textRotate(ctx, this.compositeCenter, this.compositeRotate);
        this.textRotate(ctx, [this._x + ctx.measureText(this._content).width, this._y - this._fontSize/2], this._rotate);

        ctx.font = this._fontSize + this.font;
        ctx.direction = this._direction;
        ctx.textAlign = this._align;
        ctx.globalAlpha = this._opacity;

        if(this._fill) {
            ctx.fillStyle = this._color;
            this._maxWidth? 
            ctx.fillText(this._content, this._x, this._y, this._maxWidth): 
            ctx.fillText(this._content, this._x, this._y);
        }
        else {
            ctx.strokeStyle = this._color;
            this._maxWidth? 
            ctx.strokeText(this._content, this._x, this._y, this._maxWidth): 
            ctx.strokeText(this._content, this._x, this._y);
        }
    }
}