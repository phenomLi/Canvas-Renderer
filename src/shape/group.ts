import { ShapeType } from '../render/LayerManager';
import { DFS } from '../util/util';
import { Base } from './BaseShape';


// Group容器可以存放的图形
type GroupContainType = ShapeType;


class groupConfig {
    shapes: Array<GroupContainType>;
    show: boolean;
    tag: number | string;
    zIndex: number;
    mounted: Function;
    removed: Function;
}


export class Group extends Base {
    private shapeList: Array<GroupContainType>;

    constructor(config: groupConfig) {
        super(config, 'Group');
        
        this.count = 0;
        this.shapeList = [];

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
            removed: this._removed,
            tag: this._tag,
            show: this._show,
            zIndex: this._zIndex
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
            shape.attr('show', this._show);

            this.shapeList.push(shape);
        
            this.count += (<Group>shape).getCount();

            this.isMount && this.layer.update();
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

        this.isMount && this.layer.update();
    }

    render(ctx: CanvasRenderingContext2D) {
        if(!this._show) return;

        DFS(this.shapeList, item => {
            ctx.save();
            item.render(ctx);
            ctx.restore();
        }, false);
    }
}
























