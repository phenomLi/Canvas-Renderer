import { shape, base } from './baseShape';
import { broadcast, rotate } from '../render/util';


class compositeConfig {
    pin: Array<number>;
    center: Array<number>;
    rotate: number;

    mounted: Function;
    removed: Function;
}


export class composite extends base {
    private _x: number;
    private _y: number;
    private _rotate: number;
    private center: Array<number>;

    private shapeList: Array<shape | composite>;

    constructor(config: compositeConfig) {
        super(config, 'composite');

        this._x = config.pin[0];
        this._y = config.pin[1];
        this._rotate = config.rotate || 0;
        this.center = config.center;

        this.shapeList = [];
    } 

    config(): compositeConfig {
        return {
            pin: [this._x, this._y],
            rotate: this._rotate,
            center: this.center,
            mounted: this._mounted,
            removed: this._removed
        }
    }

    x(x?: number): number | composite {
        if(x !== undefined && typeof x === 'number') {
            let d = x - this._x;

            this._x = x;

            this.shapeList.map(item => {  
                item.x(<number>item.x() + d);
            });

            this._isMount && broadcast.notify();
            return this;
        }
        else {
            return this._x;
        }
    }

    y(y?: number): number | composite {
        if(y !== undefined && typeof y === 'number') {
            let d = y - this._y;

            this._y = y;

            this.shapeList.map(item => {  
                item.y(<number>item.y() + d);
            });

            this._isMount && broadcast.notify();
            return this;
        }
        else {
            return this._y;
        }
    }

    getShapeList(): Array<shape | composite> {
        return this.shapeList;
    }

    join(shape: shape | composite) {
        if(shape.type() === 'group') {
            console.warn('group类型不能加入composite');

            return;
        }

        this.shapeList.push(shape);

        this._isMount && broadcast.notify();
    }
    
    render(ctx: CanvasRenderingContext2D, shapeList: Array<shape | composite>) {
        this.shapeList.map(item => {
            if(!item.show()) return; 

            if(item.type() === 'composite') {
                this.render(ctx, (<composite>item).getShapeList());
            }
            else {
                ctx.save();
                item.draw(ctx);
                ctx.restore();
            }
        });
    }

    draw(ctx: CanvasRenderingContext2D) {
        rotate(ctx, [this.center[0], this.center[1]], this._rotate);
        this.render(ctx, this.shapeList);
    }
}