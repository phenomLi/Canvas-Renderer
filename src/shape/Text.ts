import { Base } from "./BaseShape";


class textConfig {
    pin: number[]; //*
    content: string;  //*
    fontSize: number;
    opacity: number;
    color: string;
    rotate: number;
    fill: boolean;
    align: CanvasTextAlign;
    dir: CanvasDirection;
    maxWidth: number;
    mounted: Function;
    removed: Function;
}


export class TextBlock extends Base {
    private _x: number;
    private _y: number;
    private _color: string;
    private _fill: boolean;
    private _fontSize: number;
    private _opacity: number;
    private _content: string;
    private _maxWidth: number;
    private _rotate: number;
    private _align: CanvasTextAlign;
    private _direction: CanvasDirection;

    private font: string;
    private center: number[];
    private compositeRotate: number;
    private compositeCenter: number[];

    constructor(config: textConfig) {
        super(config, 'Text');

        this._x = config.pin[0];
        this._y = config.pin[1];
        this._color = config.color;
        this._fill = (config.fill === undefined)? true: config.fill;
        this._maxWidth = config.maxWidth || null;
        this._fontSize = config.fontSize || 10;
        this._opacity = config.opacity || 1;
        this._rotate = config.rotate || 0;
        this._content = config.content || '';
        this._align = config.align || 'start';
        this._direction = config.dir || 'inherit';

        this._mounted = config.mounted || (() => {});
        this._removed = config.removed || (() => {});

        this.font = 'px sans-serif';
        this.center = [];
        this.compositeCenter = [];
        this.compositeRotate = 0;

        this.writableProperties = ['x', 'y', 'color', 'opacity', 'rotate', 'show', 'align', 'dir', 'content', 'fontSize'];
        this.readonlyProperties.push('center');

        this.initSetter();

        this.notRePathProperties = this.readableProperties;
    }

    config() {
        return {
            pin: [this._x, this._y],
            content: this._content,
            fontSize: this._fontSize,
            opacity: this._opacity,
            color: this._color,
            rotate: this._rotate,
            fill: this._fill,
            align: this._align,
            dir: this._direction,
            maxWidth: this._maxWidth,
            mounted: this._mounted,
            removed: this._removed
        };
    }

    // 若text被加入composite，则叠加旋转(获取composite的center和rotate)
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