import { Shape, Base } from './BaseShape';
import { rotate } from '../render/util';
import Broadcast from './../Broadcast/Broadcast';


class compositeConfig {
    pin: Array<number>;
    center: Array<number>;
    rotate: number;

    mounted: Function;
    removed: Function;
}


export class Composite extends Base {
    private _x: number;
    private _y: number;
    private _rotate: number;
    private center: Array<number>;

    private shapeList: Array<Shape | Composite>;

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

    x(x?: number): number | Composite {
        if(x !== undefined && typeof x === 'number') {
            let d = x - this._x;

            this._x = x;

            this.shapeList.map(item => {  
                item.x(<number>item.x() + d);
            });

            this._isMount && Broadcast.notify('update');
            return this;
        }
        else {
            return this._x;
        }
    }

    y(y?: number): number | Composite {
        if(y !== undefined && typeof y === 'number') {
            let d = y - this._y;

            this._y = y;

            this.shapeList.map(item => {  
                item.y(<number>item.y() + d);
            });

            this._isMount && Broadcast.notify('UPDATE');
            return this;
        }
        else {
            return this._y;
        }
    }

    getShapeList(): Array<Shape | Composite> {
        return this.shapeList;
    }

    join(shape: Shape | Composite) {
        if(shape.type() === 'group') {
            console.warn('group类型不能加入composite');

            return;
        }

        this.shapeList.push(shape);

        this._isMount && Broadcast.notify('update');
    }
    
    render(ctx: CanvasRenderingContext2D, shapeList: Array<Shape | Composite>) {
        this.shapeList.map(item => {
            if(!item.show()) return; 

            if(item.type() === 'composite') {
                this.render(ctx, (<Composite>item).getShapeList());
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