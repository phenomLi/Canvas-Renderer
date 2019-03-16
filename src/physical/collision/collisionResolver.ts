import { vector, Vector } from "../../math/vector";
import { Body, staticType } from "../body/body";
import { collisionRes } from './collisionDetection';




/**
 * 碰撞处理器
 */
export default class CollisionResolver {
    // 碰撞法线
    private collisionNormal: vector;

    constructor() {}

    // 处理反弹
    private resolveRebound(body1: Body, body2: Body, duration: number) {
        // 计算碰撞前分离速度
        let vel1 = Vector.dot(Vector.sub(body1.linearVel, body2.linearVel), this.collisionNormal),
            res = (body1.restitution + body2.restitution)/2;

        // 两刚体分离速度>0，说明不会有冲量
        if(vel1 > 0) {
            return;
        }

        // 碰撞后分离速度 = 碰撞前分离速度*碰撞系数
        let vel2 = -vel1*res;

        // // 合加速度
        // let acc = Vector.sub(body1.linearAcc, body2.linearAcc),
        //     accCaused = Vector.dot(acc, this.collisionNormal)*duration;

        // if(accCaused < 0) {
        //     vel2 += accCaused*res;
        //     if(vel2 < 0) {
        //         vel2 = 0;
        //     }
        // }

        let deltaVel = vel2 - vel1;

        let invMass = body1.inverseMass + body2.inverseMass;

        let impulse = Vector.scl(deltaVel/invMass, this.collisionNormal);

        
        body1.linearVel = Vector.add(body1.linearVel, Vector.scl(body1.inverseMass, impulse));
        body2.linearVel = Vector.add(body2.linearVel, Vector.scl(-body2.inverseMass, impulse));
    }

    // 处理两个相互嵌入的刚体
    private resolvePenetration(collisionRes: collisionRes) {
        let b1 = collisionRes.body1,
            b2 = collisionRes.body2;

        let invMass = b1.inverseMass + b2.inverseMass,
            movePerMass = Vector.scl(collisionRes.penetration/invMass, Vector.nol(this.collisionNormal));

        b1.setPos(Vector.add(b1.pos, Vector.scl(b1.inverseMass, movePerMass)));
        b2.setPos(Vector.add(b2.pos, Vector.scl(-b2.inverseMass, movePerMass)));
    }


    // 处理刚体速度
    public resolve(collisionRes: collisionRes, duration: number) {
        let p1 = collisionRes.body1.centroid,
            p2 = collisionRes.body2.centroid;

        // 计算碰撞法线
        this.collisionNormal = Vector.nol(Vector.sub(p1, p2));

        this.resolvePenetration(collisionRes);
        this.resolveRebound(collisionRes.body1, collisionRes.body2, duration);

        // 响应碰撞时间
        collisionRes.body1.collided(collisionRes.body2);
        collisionRes.body2.collided(collisionRes.body1);
    }

}