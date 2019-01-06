import { shape, base } from './baseShape';
import { broadcast } from '../render/util';


class groupConfig {
    mounted: Function;
    removed: Function;
}


export class group extends base {
    private count: number;
    private shapeList: Array<shape | group>;

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

    getCount(): number {
        return this.count;
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
}
























