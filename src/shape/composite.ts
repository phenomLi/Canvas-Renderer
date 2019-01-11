import { Shape, shapeConfig } from './BaseShape';
import { rotate } from '../render/util';
import Broadcast from './../Broadcast/Broadcast';


class compositeConfig extends shapeConfig {
    center: Array<number>;
    shapes: Array<Shape | Composite>;
}


export class Composite extends Shape {
    private shapeList: Array<Shape | Composite>;

    constructor(config: compositeConfig) {
        super(config, 'composite');

        this._center = config.center;
        this.shapeList = [];

        if(config && config.shapes) {
            config.shapes.map(item => {
                this.join(item);
            });
        }
    } 

    config() {
        return {
            ...this.getBaseConfig(),
            shapes: this.shapeList,
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

    rotate(deg?: number): number | Shape {
        if(deg !== undefined) {
            deg && (this._rotate = deg);
            this.shapeList.map(item => {
                let tCenter = item.center();
                (<Shape>(<Shape>item.center(this._center)).rotate(deg));
                item.center(<Array<number>>tCenter);
            });
            this._isMount && Broadcast.notify('update');
            return this;
        }
        else {
            return this._rotate;
        }
    }

    transform(trans?: Array<Array<number>>): Array<Array<number>> | Shape {
        if(trans !== undefined) {
            trans && (this._transform = trans);
            this._isMount && Broadcast.notify('update');
            return this;
        }
        else {
            return this._transform;
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

        let tCenter = shape.center();

        (<Shape>(<Shape>shape.center(this._center)).rotate(this._rotate));

        shape.center(<Array<number>>tCenter);

        this.shapeList.push(shape);

        this._isMount && Broadcast.notify('update');
    }
    
    render(ctx: CanvasRenderingContext2D, shapeList: Array<Shape | Composite>) {
        shapeList.map(item => {
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
        this.render(ctx, this.getShapeList());
    }
}