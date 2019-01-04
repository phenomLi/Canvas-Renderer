import { shape, shapeConfig } from './baseShape';
import { broadcast } from './../render/core';


class groupConfig {
    mounted: Function;
    removed: Function;
}


export class group {
    private _id: symbol;
    private _type: string;
    private _isMount: boolean;
    private _mounted: Function;
    private _removed: Function;

    private count: number;
    private shapeList: Array<shape | group>;

    constructor(config: groupConfig) {
        this._id = Symbol();
        this._type = 'group';
        this._isMount = false;
        this._mounted = config? config.mounted: () => {};
        this._removed = config? config.removed: () => {};

        this.count = 0;
        this.shapeList = new Array();
    }

    id() {
        return this._id;
    }

    type(): string {
        return this._type;
    }

    config(): groupConfig {
        return {
            mounted: this._mounted,
            removed: this._removed
        }
    }

    getCount(): number {
        return this.count;
    }

    isMount(isMount?: boolean): boolean {
        if(isMount !== undefined && typeof isMount === 'boolean') {
            this._isMount = isMount;
        }
        else {
            return this._isMount;
        }
    }


    getShapeList(): Array<shape | group> {
        return this.shapeList;
    }

    append(shape: shape | group) {
        this.shapeList.push(shape);
        
        shape instanceof group? this.count += shape.getCount(): this.count += 1;

        this._isMount && broadcast.notify();
    }

    remove(shape: shape | group) {
        let id = shape.id();

        this.shapeList.map((item, index) => {
            if(item.id() === id) {
                this.shapeList.splice(index, 1);
            }
        });

        shape instanceof group? this.count -= shape.getCount(): this.count -= 1;

        this._isMount && broadcast.notify();
    }


    /** 钩子函数 */
    mounted() {
        this._mounted && typeof this._mounted === 'function' && this._mounted();
    }

    removed() {
        this._removed && typeof this._removed === 'function' && this._removed();
    }
}
























