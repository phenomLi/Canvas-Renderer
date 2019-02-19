import { Shape, shapeConfig } from './BaseShape';
import Broadcast from './../Broadcast/Broadcast';
import { rotate, DFS, scale } from '../util/util';
import { TextBlock } from './Text';

// Composite容器可以存放的图形
type CompositeContainType = Shape | Composite;


class compositeConfig extends shapeConfig {
    center: Array<number>; //*
    shapes: Array<CompositeContainType>;
    deep: boolean;
}



/**
 * 难点：Composite容器的旋转和形变
 * 思路：对一个Composite容器进行旋转（形变）操作 =》 对合成图形下的每个子图形进行以Composite容器的中心旋转（形变）
 * =》但要保持子图形原有的旋转（形变）状态，且不改变子图形的center属性
 */

export class Composite extends Shape {
    private shapeList: Array<CompositeContainType>;
    private deep: boolean;

    constructor(config: compositeConfig) {
        super(config, 'Composite');

        this.deep = config.deep === undefined? true: config.deep;
        this._center = config.center;

        this.shapeList = [];

        if(config && config.shapes) {
            config.shapes.map(item => {
                this.join(item, this.deep);
            });
        }

        this.initSetter();
    } 

    public join(shape: CompositeContainType | Array<CompositeContainType>, deep?: boolean) {
        if(shape instanceof Array) {
            shape.map(item => this.join(item, deep));
        }
        else {
            if(shape.attr('type') === 'Group') {
                console.warn('group类型不能加入composite');
                return;
            }
    
            this.shapeList.push(this.shapeProcessor(deep? Broadcast.notify('clone', shape): shape));

            this.isMount && Broadcast.notify('update');
        }
    }

    config() {
        return {
            ...this.getBaseConfig(),
            deep: this.deep,
            shapes: this.shapeList,
        }
    }

    // 重载setter（x）
    protected setterX(x: number) {
        let d = x - this._x;
        this._x = x;
        this._center[0] = this._center[0] + d;

        this.shapeList.map(item => {  
            item.attr('x', item.attr('x') + d);
            this.shapeProcessor(item);
        });
    }

    // 重载setter（y）
    protected setterY(y: number) {
        let d = y - this._y;
        this._y = y;
        this._center[1] = this._center[1] + d;

        this.shapeList.map(item => {  
            item.attr('y', item.attr('y') + d);
            this.shapeProcessor(item);
        });
    }

    // 重载setter（show）
    protected setterShow(show: boolean) {
        this._show = show;
        this.shapeList.map(item => {
            item.attr('show', show);
        });
    }

    // 重载setter（rotate）
    protected setterRotate(deg: number) {
        this._rotate = deg;

        // 每个图形先自己旋转
        DFS(this.getShapeList(), item => {
            item.createPath();
        }, false);

        // 然后再叠加Composite容器的旋转
        this.shapeList.map(item => {
            this.rotatePath(item);
        });
    }

    // 重载setter（scale）
    protected setterScale(trans: Array<Array<number>>) {
        // 每个图形先自己缩放
        DFS(this.getShapeList(), item => {
            item.createPath();
        }, false);

        // 然后再叠加Composite容器的缩放
        this.shapeList.map(item => {
            this.scalePath(item);
        });
        return this;
    }

    public getShapeList(): Array<CompositeContainType> {
        return this.shapeList;
    }
    
    // 处理一下新加进来的shape(为新shape加上此Composite容器的旋转和形变属性)
    private shapeProcessor(shape: CompositeContainType): CompositeContainType {
        // 对加入的每个图形进行旋转操作
        this._rotate && this.rotatePath(shape);
        // 对加入的每个图形进行形变操作
        this._scale && this.scalePath(shape);

        return shape;
    }

    // 以Composite容器为中心对每个字图形进行旋转
    rotatePath(shape?: CompositeContainType): Composite {
        if(shape.attr('type') === 'Composite') {
            DFS((<Composite>shape).getShapeList(), item => {
                let tPath = new Path2D();
                tPath.addPath(item.getPath(), rotate(this._center, this._rotate));
                item.setPath(tPath);
            }, false);
        }
        else if(shape.attr('type') === 'Text') {
            (<TextBlock>shape).setCompositeRotate(this._center, this._rotate);
        }
        else {
            let tPath = new Path2D();
            tPath.addPath((<Shape>shape).getPath(), rotate(this._center, this._rotate));
            (<Shape>shape).setPath(tPath);
        }

        return this;
    }

    // 以Composite容器为中心对每个字图形进行缩放
    scalePath(shape?: CompositeContainType): Composite {
        if(shape.attr('type') === 'Composite') {
            DFS((<Composite>shape).getShapeList(), item => {
                let tPath = new Path2D();
                tPath.addPath(item.getPath(), scale(this._center, this._scale));
                item.setPath(tPath);
            }, false);
        }
        else if(shape.attr('type') === 'Text') {
            (<TextBlock>shape).setCompositeScale(this._center, this._scale);
        }
        else {
            let tPath = new Path2D();
            tPath.addPath((<Shape>shape).getPath(), scale(this._center, this._scale));
            (<Shape>shape).setPath(tPath);
        }

        return this;
    }

    render(ctx: CanvasRenderingContext2D) {
        DFS(this.shapeList, item => {
            ctx.save();
            item.render(ctx);
            ctx.restore();
        }, false);
    }
}