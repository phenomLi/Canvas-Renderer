import { Base } from './BaseShape';
import Broadcast from './../Broadcast/Broadcast';
import { ShapeType } from '../render/core';


class groupConfig {
    shapes: Array<ShapeType>;
    mounted: Function;
    removed: Function;
}


export class Group extends Base {
    private shapeList: Array<ShapeType>;

    constructor(config: groupConfig) {
        super(config, 'group');
        
        this.count = 0;
        this.shapeList = new Array();

        this.writableProperties = ['show'];
        this.readableProperties = ['id', 'type', 'show'];

        if(config && config.shapes) {
            config.shapes.map(item => {
                this.append(item);
            });
        }

        this.initSetter();
    }

    config(): groupConfig {
        return {
            shapes: this.shapeList,
            mounted: this._mounted,
            removed: this._removed
        }
    }

    // 重载setter（show）
    setShow(show: boolean) {
        this._show = show;
        this.shapeList.map(item => {
            item.attr('show', show);
        });
    }

    getShapeList(): Array<ShapeType> {
        return this.shapeList;
    }

    append(shape: ShapeType) {
        this.shapeList.push(shape);
        
        shape.attr('type') === 'group'? this.count += (<Group>shape).getCount(): this.count += 1;

        this.isMount && Broadcast.notify('update');
    }

    remove(shape: ShapeType) {
        let id = shape.attr('id');

        this.shapeList.map((item, index) => {
            if(item.attr('id') === id) {
                this.shapeList.splice(index, 1);
            }
        });

        shape.attr('type') === 'group'? this.count -= (<Group>shape).getCount(): this.count -= 1;

        this.isMount && Broadcast.notify('update');
    }

    
    render(ctx: CanvasRenderingContext2D, shapeList: Array<ShapeType>) {
        shapeList.map(item => {
            if(!item.attr('show')) return; 

            if(item.attr('type') === 'group') {
                this.render(ctx, (<Group>item).getShapeList());
            }
            else {
                ctx.save();
                item.renderPath(ctx);
                ctx.restore();
            }
        });
    }

    renderPath(ctx: CanvasRenderingContext2D) {
        this.render(ctx, this.shapeList);
    }
}
























