import { Body } from "../body/body";
import { Vector, vector } from "../../math/vector";




export default class ImpulseManager {

    constructor() {}

    // 添加冲量
    // applyImpulse(impulse: vector, point: vector) {
    //     this.accumulateLinearAcc = Vector.add(this.accumulateLinearAcc, Vector.scl(this.body.inverseMass, impulse));
    //     this.accumulateAngularAcc += 1/this.body.rotationInertia*Vector.cor(point, impulse)*10;
    // }
    

    applyImpulse(body: Body, impulse: vector, point: vector) {
        if(body === null) return;
    
        body.linearVel = Vector.add(body.linearVel, Vector.scl(body.inverseMass, impulse));
        if(point) {
            body.angularVel += 1/body.rotationInertia*Vector.cor(Vector.sub(point, body.centroid), impulse)*10;
        }
    }
}



