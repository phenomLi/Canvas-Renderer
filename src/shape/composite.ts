import { Shape, shapeConfig } from './BaseShape';
import Broadcast from './../Broadcast/Broadcast';
import { rotate, DFS, transform } from '../render/util';
import { Matrix } from '../render/core';


class compositeConfig extends shapeConfig {
    center: Array<number>;
    shapes: Array<Shape | Composite>;
}



/**
 * 难点：合成类型的旋转和形变
 * 思路：对一个合成类型图形进行旋转（形变）操作 =》 对合成图形下的每个子图形进行以合成图形的中心旋转（形变）
 * =》但要保持子图形原有的旋转（形变）状态，且不改变子图形的center属性
 */

export class Composite extends Shape {
    private shapeList: Array<Shape | Composite>;

    constructor(config: compositeConfig) {
        super(config, 'composite');

        this._center = config.center;
        this.shapeList = [];

        if(config && config.shapes) {
            config.shapes.map(item => {
                this.join(item, true);
            });
        }

        this.initSetter();
    } 

    join(shape: Shape | Composite, deep?: boolean) {
        if(shape.attr('type') === 'group') {
            console.warn('group类型不能加入composite');
            return;
        }

        //this.shapeList.push(this.shapeProcessor(deep? Broadcast.notify('clone', shape): shape));
        this.shapeList.push(this.shapeProcessor(shape));

        this.isMount && Broadcast.notify('update');
    }

    config() {
        return {
            ...this.getBaseConfig(),
            shapes: this.shapeList,
        }
    }

    // 重载setter（x）
    setX(x: number) {
        let d = x - this._x;
        this._x = x;
        this._center[0] = this._center[0] + d;

        this.shapeList.map(item => {  
            item.attr('x', item.attr('x') + d);
        });
    }

    // 重载setter（y）
    setY(y: number) {
        let d = y - this._y;
        this._y = y;
        this._center[1] = this._center[1] + d;

        this.shapeList.map(item => {  
            item.attr('y', item.attr('y') + d);
        });
    }

    // 重载setter（show）
    setShow(show: boolean) {
        this._show = show;
        this.shapeList.map(item => {
            item.attr('show', show);
        });
    }

    // 重载setter（rotate）
    setRotate(deg: number) {
        this._rotate = deg;

        DFS(this.getShapeList(), item => {
            item.drawPath().rotatePath().transFormPath();
        }, false);

        this.shapeList.map(item => {
            this.rotatePath(item);
        });
    }

    // 重载setter（transform）
    setTransform(trans: Array<Array<number>>) {
        DFS(this.getShapeList(), item => {
            item.drawPath().rotatePath().transFormPath();
        }, false);

        this.shapeList.map(item => {
            this.transFormPath(item);
        });
        return this;
    }

    getShapeList(): Array<Shape | Composite> {
        return this.shapeList;
    }
    
    // 处理一下新加进来的shape
    shapeProcessor(shape: Shape | Composite): Shape {
        // 对加入的每个图形进行旋转操作
        this._rotate && this.rotatePath(shape);
        // 对加入的每个图形进行形变操作
        this._transform && this.transFormPath(shape);
        return shape;
    }

    // 以合成类型图形为中心对每个字图形进行旋转
    rotatePath(shape: Shape | Composite): Shape {
        if(shape.attr('type') === 'composite') {
            DFS(shape.getShapeList(), item => {
                let tPath = new Path2D();
                tPath.addPath(item.getPath(), rotate(Matrix.rotateMatrix, this._center, this._rotate));
                item.setPath(tPath);
            }, false);
        }
        else {
            let tPath = new Path2D();
            tPath.addPath(shape.getPath(), rotate(Matrix.rotateMatrix, this._center, this._rotate));
            shape.setPath(tPath);
        }

        return this;
    }

    // 以合成类型图形为中心对每个字图形进行形变
    transFormPath(shape: Shape | Composite): Shape {
        if(shape.attr('type') === 'composite') {
            DFS(shape.getShapeList(), item => {
                let tPath = new Path2D();
                tPath.addPath(item.getPath(), transform(Matrix.transformMatrix, this._center, this._transform));
                item.setPath(tPath);
            }, false);
        }
        else {
            let tPath = new Path2D();
            tPath.addPath(shape.getPath(), transform(Matrix.transformMatrix, this._center, this._transform));
            shape.setPath(tPath);
        }

        return this;
    }

    renderPath(ctx: CanvasRenderingContext2D) {
        DFS(this.getShapeList(), item => {
            ctx.save();
            item.renderPath(ctx);
            ctx.restore();
        }, false);
    }
}