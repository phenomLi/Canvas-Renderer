import { vector, Vector } from "../../math/vector";
import { Body } from "../body/body";



export class accelerationInfo {
    // 角加速度
    angularAcc: number;
    // 线加速度
    linearAcc: vector;
}


// 作用力管理器
export default class ForceManager {
    private body: Body;
    // 线加速度总和
    private accumulateLinearAcc: vector;
    // 角加速度总和
    private accumulateAngularAcc: number;

    constructor(body: Body) {
        this.body = body;

        this.accumulateLinearAcc = [0, 0];
        this.accumulateAngularAcc = 0;
    }

    getAccForce(): accelerationInfo {
        return {
            linearAcc: this.accumulateLinearAcc,
            angularAcc: this.accumulateAngularAcc
        };
    }

    // 添加受力
    applyForce(force: vector, point: vector) {
        this.accumulateLinearAcc = Vector.add(this.accumulateLinearAcc, Vector.scl(this.body.inverseMass, force));
        this.accumulateAngularAcc += 1/this.body.rotationInertia*Vector.cor(point, force);
    }

    // 添加冲量
    applyImpulse(impulse: vector, point?: vector) {

    }

    clearForce() {
        this.accumulateLinearAcc = [0, 0];
        this.accumulateAngularAcc = 0;
    }
} 