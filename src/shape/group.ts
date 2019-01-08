import { Base } from './BaseShape';
import Broadcast from './../Broadcast/Broadcast';
import { ShapeType } from '../render/core';


class groupConfig {
    mounted: Function;
    removed: Function;
}


export class Group extends Base {
    private shapeList: Array<ShapeType>;

    constructor(config: groupConfig) {
        super(config, 'group');
        
        this.count = 0;
        this.shapeList = new Array();
    }

    config(): groupConfig {
        return {
            mounted: this._mounted,
            removed: this._removed
        }
    }

    getShapeList(): Array<ShapeType> {
        return this.shapeList;
    }

    append(shape: ShapeType) {
        this.shapeList.push(shape);
        
        shape.type() === 'group'? this.count += (<Group>shape).getCount(): this.count += 1;

        this._isMount && Broadcast.notify('update');
    }

    remove(shape: ShapeType) {
        let id = shape.id();

        this.shapeList.map((item, index) => {
            if(item.id() === id) {
                this.shapeList.splice(index, 1);
            }
        });

        shape.type() === 'group'? this.count -= (<Group>shape).getCount(): this.count -= 1;

        this._isMount && Broadcast.notify('update');
    }

    
    render(ctx: CanvasRenderingContext2D, shapeList: Array<ShapeType>) {
        shapeList.map(item => {
            if(!item.show()) return; 

            if(item.type() === 'group') {
                this.render(ctx, (<Group>item).getShapeList());
            }
            else {
                ctx.save();
                item.draw(ctx);
                ctx.restore();
            }
        });
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.render(ctx, this.shapeList);
    }
}
























