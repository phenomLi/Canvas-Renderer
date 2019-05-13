import { Body } from "../body/body";
import { Vector, vector } from "../../math/vector";




export default class ImpulseManager {

    constructor() {}
    

    applyImpulse(body: Body, impulse: vector, point: vector) {
        if(body === null) return;
    
        body.linearVel = Vector.add(body.linearVel, Vector.scl(body.inverseMass, impulse));
        
        if(point) {
            body.angularVel += 1/body.rotationInertia*Vector.cor(Vector.sub(point, body.centroid), impulse)*16*body.mass*body.inverseMass;
        }
    }
}



