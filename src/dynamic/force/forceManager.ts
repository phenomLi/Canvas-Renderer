import { vector, Vector } from "../../math/vector";
import { Body } from "../body/body";
import ForceGenerator from "./globalForce";



// 作用力管理器
export default class ForceManager {
    // 线性力队列
    private linearForceList: ForceGenerator[];
    // 角力队列
    private angularForceList: ForceGenerator[];

    constructor() {
        this.linearForceList = [];
        this.angularForceList = [];
    }

    // 添加线性力
    addLinearForce(force: ForceGenerator) {
        this.linearForceList.push(force);
    }

    // 添加角力
    addAngularForce(force: ForceGenerator) {
        this.angularForceList.push(force);
    }   

    
    applyLinearForce(body: Body) {
        let force = [0, 0];

        this.linearForceList.map(item => force = Vector.add(force, <vector>item.apply(body)));

        body.linearAcc = Vector.add(body.linearAcc, Vector.scl(body.inverseMass, force));
    }

    applyAngularForce(body: Body) {
        this.angularForceList.map(item => item.apply(body));
    }

    clear(body: Body) {
        body.linearAcc = [0, 0];
        body.angularAcc = 0;
    }
} 


