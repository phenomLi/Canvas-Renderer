import { Base, Shape, shapeConfig } from "./BaseShape";


class textConfig extends shapeConfig {
    content: string;  //*
    fontSize: number;
    align: CanvasTextAlign;
    dir: CanvasDirection;
    maxWidth: number;
}


export class TextBlock extends Shape {
    private _fontSize: number;
    private _content: string;
    private _maxWidth: number;
    private _align: CanvasTextAlign;
    private _direction: CanvasDirection;

    private textWidth: number;

    private font: string;
    private compositeRotate: number;
    private compositeScale: number[];
    private compositeCenter: number[];

    private tmpCtx: CanvasRenderingContext2D;

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
        this.compositeScale = [1, 1];

        this.tmpCtx = document.createElement('canvas').getContext('2d');
        this.textWidth = this.tmpCtx.measureText(this._content).width;

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


    /**-----------------------重载setter-------------------------------- */

    // 重载setter（x）
    setterX(x: number) {
        let d = x - this._x;
        this._x = x;
        this._center[0] = this._center[0] + d;
    }

    // 重载setter（y）
    setterY(y: number) {
        let d = y - this._y;
        this._y = y;
        this._center[1] = this._center[1] + d;
    }

    // 重载setter（rotate）
    setterRotate(rotate: number) {
        if(this.lastRotate !== rotate) {
            this._rotate = rotate;
            this.lastRotate = this._rotate;
        }
    }

    // 重载setter（scale）
    setterScale(scale: number[]) {
        if(this.lastScale.toString() !== scale.toString()) {
            this._scale = scale;
            this.lastScale = this._scale;
        }
    }

    // 重载setter（content）
    setterContent(content: string) {
        this._content = content;
        this.tmpCtx.font = this._fontSize + this.font;
        this.textWidth = this.tmpCtx.measureText(this._content).width;
    }

    /**---------------------------------------------------------------- */

    // 若 text 被加入 composite，则叠加旋转(获取 composite 的 center 和 rotate)
    setCompositeRotate(center: number[], deg: number) {
        this.compositeCenter = center;
        this.compositeRotate = deg;
    }

    // 若 text 被加入 composite，则叠加缩放(获取 composite 的 center 和 scale)
    setCompositeScale(center: number[], scale: number[]) {
        this.compositeCenter = center;
        this.compositeScale= scale;
    }

    // 文本旋转
    textRotate(ctx: CanvasRenderingContext2D, center: number[], deg: number) {
        ctx.translate(center[0], center[1]);
        ctx.rotate(deg/180*Math.PI);
        ctx.translate(-center[0], -center[1]);
    }

    // 文本缩放
    textScale(ctx: CanvasRenderingContext2D, center: number[], scale: number[]) {
        ctx.translate(center[0], center[1]);
        ctx.scale(scale[0], scale[1]);
        ctx.translate(-center[0], -center[1]);
    }

    /** -------------------PATH2D路径---------------------------- */

    drawPath(): TextBlock { return this; }

    // 旋转path2D路径
    rotatePath(): TextBlock { return this; }

    // 形变path2D路径
    scalePath(): TextBlock { return this; }

    render(ctx: CanvasRenderingContext2D) {
        if(!this._show) return; 
 
        if(this.compositeCenter.length) {
            this.textRotate(ctx, this.compositeCenter, this.compositeRotate);
            this.textScale(ctx, this.compositeCenter, this.compositeScale);
        } 

        this.textRotate(ctx, [this._x + this.textWidth, this._y - this._fontSize/2], this._rotate);
        this.textScale(ctx, [this._x + this.textWidth, this._y - this._fontSize/2], this._scale);

        ctx.font = this._fontSize + this.font;
        ctx.direction = this._direction;
        ctx.textAlign = this._align;
        ctx.textBaseline = 'top';
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

    // --------------------------------------------------------------- //

    getTextWidth(): number {
        return this.textWidth;
    }

    getTextHeight(): number {
        return this._fontSize + 2;
    }
}