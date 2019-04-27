import { vector, Vector } from "../../math/vector";
import { Body, state } from "../body/body";
import { collisionRes, collisionInfo } from './collisionDetection';
import { collisionType } from "./SAT";




/**
 * 碰撞处理器
 */
export default class CollisionResolver {
    // 碰撞法线
    private collisionNormal: vector;

    constructor() {
        this.collisionNormal = [0, 0];
    }

    // 计算碰撞法线
    private calcCollisionNormal(body1: Body, body2: Body, collisionInfo: collisionInfo): vector {
        // 若是边界碰撞，直接返回
        if(body2 === null) return collisionInfo.nor;

        let p1 = body1.pos,
            p2 = body2.pos,
            edge = collisionInfo.edge,
            // 参考向量，用作判断碰撞图形在碰撞面的哪一侧
            refV = [],
            // 方向
            dir = 0;

        // 若是球体间碰撞，碰撞法线直接取圆心间的单位向量
        if(collisionInfo.type === collisionType.c2c) {
            return Vector.nol(Vector.sub(p1, p2)); 
        }

        // 若存在碰撞边
        if(edge) {
            let nor = Vector.nol(collisionInfo.nor),
                plane = [];


            if(edge[0][1] !== edge[1][1]) {
                if(edge[0][1] > edge[1][1]) {
                    plane = Vector.sub(edge[0], edge[1]);
                    refV = Vector.sub(p2, edge[1]);
                }
                else {
                    plane = Vector.sub(edge[1], edge[0]);
                    refV = Vector.sub(p2, edge[0]);
                }

                dir = Vector.cor(plane, refV);

                // 修正碰撞法线的方向
                if(dir < 0 && nor[0] > 0 || dir > 0 && nor[0] < 0) {
                    nor = Vector.inv(nor);
                }
            }
            else {
                if(edge[0][0] > edge[1][0]) {
                    plane = Vector.sub(edge[0], edge[1]);
                    refV = Vector.sub(p2, edge[1]);
                }
                else {
                    plane = Vector.sub(edge[1], edge[0]);
                    refV = Vector.sub(p2, edge[0]);
                }

                dir = Vector.cor(plane, refV);

                // 修正碰撞法线的方向
                if(dir < 0 && nor[1] < 0 || dir > 0 && nor[1] > 0) {
                    nor = Vector.inv(nor);
                }
            }
            return nor;
        }
        // 不存在碰撞边
        else {
            return Vector.nol(Vector.sub(p1, p2));
        }
    }


    // 处理反弹速度
    private resolveRebound(body1: Body, body2: Body, collisionInfo: collisionInfo) {
        // 计算碰撞前分离速度
        let relaVel = body1.linearVel, 
            res = body1.restitution, 
            point = collisionInfo.p, 
            vel1 = 0,
            vel2 = 0,
            deltaVel = 0,
            invMass = body1.inverseMass,
            impulse = [0, 0];

        if(body2) {
            relaVel = Vector.sub(relaVel, body2.linearVel);
            res = (res + body2.restitution)*0.5;
            invMass += body2.inverseMass;
        }

        vel1 = Vector.dot(relaVel, this.collisionNormal);

        // 两刚体分离速度>0，说明不会有冲量
        if(vel1 > 0) {
            return;
        }

        // 碰撞后分离速度 = 碰撞前分离速度*碰撞系数
        vel2 = -vel1*res;

        deltaVel = vel2 - vel1,
        impulse = Vector.scl(deltaVel/invMass, this.collisionNormal);


        if(point) {
            // body1.force.applyImpulse(impulse, Vector.sub(point, body1.centroid));
            // body2 && body2.force.applyImpulse(Vector.inv(impulse), Vector.sub(point, body2.centroid));

            body1.linearVel = Vector.add(body1.linearVel, Vector.scl(body1.inverseMass, impulse));
            body1.angularVel += 1/body1.rotationInertia*Vector.cor(Vector.sub(point, body1.centroid), impulse)*10;

            if(body2) {
                body2.linearVel = Vector.add(body2.linearVel, Vector.scl(-body2.inverseMass, impulse));
                body2.angularVel += 1/body2.rotationInertia*Vector.cor(Vector.sub(point, body2.centroid), Vector.inv(impulse))*10;
            }
        }
        else {
            // body1.force.applyImpulse(impulse, [0, 0]);
            // body2 && body2.force.applyImpulse(Vector.inv(impulse), [0, 0]);

            body1.linearVel = Vector.add(body1.linearVel, Vector.scl(body1.inverseMass, impulse));

            if(body2) {
                body2.linearVel = Vector.add(body2.linearVel, Vector.scl(-body2.inverseMass, impulse));
            }
        }
    }


    // 处理两个相互嵌入的刚体
    private resolvePenetration(body1: Body, body2: Body, collisionInfo: collisionInfo) {
        let invMass = body1.inverseMass,
            movePerMass, p1, p2,
            len = collisionInfo.len;

        if(body2) invMass += body2.inverseMass;
        movePerMass = Vector.scl(len/invMass, this.collisionNormal);

        p1 = Vector.add(body1.pos, Vector.scl(body1.inverseMass, movePerMass));
        body1.setPos(p1);

        if(body2) {
            p2 = Vector.add(body2.pos, Vector.scl(-body2.inverseMass, movePerMass));
            body2.setPos(p2);
        }
    }


    // 处理刚体碰撞
    public resolve(collisionRes: collisionRes) {
        let body1 = collisionRes.body1,
            body2 = collisionRes.body2;

        for(let i = 0, len = collisionRes.collisionInfo.length; i < len; i++) {
            let info = collisionRes.collisionInfo[i];

            // 修正碰撞法线
            //this.collisionNormal = Vector.add(this.calcCollisionNormal(body1, body2, info), this.collisionNormal);
            this.collisionNormal = this.calcCollisionNormal(body1, body2, info);
            this.resolvePenetration(body1, body2, info);
            this.resolveRebound(body1, body2, info);
        }

        this.collisionNormal = [0, 0];

        // 响应碰撞时间
        body1.collided(body2);
        body2 && body2.collided(body1);
    }
}