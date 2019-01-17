import Broadcast from './../Broadcast/Broadcast';
import { ShapeType } from '../render/core';
import { DFS } from '../util/util';
import { Base } from './BaseShape';


// Group容器可以存放的图形
type GroupContainType = ShapeType;


class groupConfig {
    shapes: Array<GroupContainType>;
    mounted: Function;
    removed: Function;
}


export class Group extends Base {
    private shapeList: Array<GroupContainType>;

    constructor(config: groupConfig) {
        super(config, 'Group');
        
        this._mounted = config !== undefined? config.mounted: () => {};
        this._removed = config !== undefined? config.removed: () => {};

        this.count = 0;
        this.shapeList = [];

        this.writableProperties = ['show'];

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
    private setShow(show: boolean) {
        this._show = show;
        this.shapeList.map(item => {
            item.attr('show', show);
        });
    }

    getShapeList(): Array<GroupContainType> {
        return this.shapeList;
    }

    // 判断一个图形是否在group内
    public isShapeAt(shape: GroupContainType): boolean {
        return this.shapeList.some(item => item.attr('id') === shape.attr('id'));
    }

    // 添加一个图形到group
    append(shape: GroupContainType | Array<GroupContainType>) {
        if(shape instanceof Array) {
            shape.map(item => this.append(item));
        }
        else {
            this.shapeList.push(shape);
        
            this.count += (<Group>shape).getCount();

            this.isMount && Broadcast.notify('update');
        }
    }

    // 把一个图形从group移出
    remove(shape: GroupContainType) {
        let id = shape.attr('id');

        this.shapeList.map((item, index) => {
            if(item.attr('id') === id) {
                this.shapeList.splice(index, 1);
            }
        });

        this.count -= (<Group>shape).getCount();

        this.isMount && Broadcast.notify('update');
    }

    render(ctx: CanvasRenderingContext2D) {
        DFS(this.shapeList, item => {
            ctx.save();
            item.render(ctx);
            ctx.restore();
        }, false);
    }
}
























