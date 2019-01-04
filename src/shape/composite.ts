import { shape } from './baseShape';
import { broadcast } from './../render/core';


class compositeConfig {
    pin: Array<number>;

    mounted: Function;
    removed: Function;
}


export class composite {
    private _x: number;
    private _y: number;
    private _id: symbol;
    private _type: string;
    private _isMount: boolean;
    private _mounted: Function;
    private _removed: Function;

    constructor(config: compositeConfig) {
        this._id = Symbol();
        this._type = 'composite';
        this._isMount = false;

        this._x = config.pin[0];
        this._y = config.pin[1];

        this._mounted = config? config.mounted: () => {};
        this._removed = config? config.removed: () => {};
    }

    id() {
        return this._id;
    }

    type(): string {
        return this._type;
    }   

    config(): compositeConfig {
        return {
            pin: [this._x, this._y],
            mounted: this._mounted,
            removed: this._removed
        }
    }

    isMount(isMount?: boolean): boolean {
        if(isMount !== undefined && typeof isMount === 'boolean') {
            this._isMount = isMount;
        }
        else {
            return this._isMount;
        }
    }

    x(x?: number): number | composite {
        if(x !== undefined && typeof x === 'number') {
            this._x = x;
            this._isMount && broadcast.notify();
            return this;
        }
        else {
            return this._x;
        }
    }

    y(y?: number): number | composite {
        if(y !== undefined && typeof y === 'number') {
            this._y = y;
            this._isMount && broadcast.notify();
            return this;
        }
        else {
            return this._y;
        }
    }


    join(shape: shape) {
        
    }


    /** 钩子函数 */
    mounted() {
        this._mounted && typeof this._mounted === 'function' && this._mounted();
    }

    removed() {
        this._removed && typeof this._removed === 'function' && this._removed();
    }
}