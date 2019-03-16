import CollisionDetection from "./collisionDetection";
import CollisionResolver from "./collisionResolver";
import { Body } from "../body/body";





/**
 * 碰撞管理器
 */

export default class CollisionManager {
    public collisionDetection: CollisionDetection;
    public collisionResolver: CollisionResolver;

    constructor(bodyList: Array<Body>) {
        this.collisionDetection = new CollisionDetection(bodyList);
        this.collisionResolver = new CollisionResolver();
    }
} 