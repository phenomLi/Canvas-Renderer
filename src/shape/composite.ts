import { shape, base } from './baseShape';
import { broadcast } from '../render/util';


class compositeConfig {
    pin: Array<number>;

    mounted: Function;
    removed: Function;
}


export class composite extends base {
    private _x: number;
    private _y: number;

    constructor(config: compositeConfig) {
        super(config, 'composite');

        this._x = config.pin[0];
        this._y = config.pin[1];
    } 

    config(): compositeConfig {
        return {
            pin: [this._x, this._y],
            mounted: this._mounted,
            removed: this._removed
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
    
}