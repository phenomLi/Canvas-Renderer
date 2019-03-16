import { vector } from "../../math/vector";
import { Body } from "../body/body";


// 作用力发生器
export default class ForceGenerator {
    protected force: vector;
    
    constructor(force?: vector) {
        this.force = force;
    }

    generateForce(body: Body): vector {
        throw '此方法必须由子类重写';
    }
}   