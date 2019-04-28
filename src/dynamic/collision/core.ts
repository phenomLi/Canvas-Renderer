import CollisionDetection from "./collisionDetection";
import CollisionResolver from "./collisionResolver";
import { Body } from "../body/body";
import BoundariesManager from "../boundary/core";





/**
 * 碰撞管理器
 */

export default class CollisionManager {
    public collisionDetection: CollisionDetection;
    public collisionResolver: CollisionResolver;

    constructor(bodyList: Array<Body>, boundariesManager: BoundariesManager) {
        this.collisionDetection = new CollisionDetection(bodyList, boundariesManager);
        this.collisionResolver = new CollisionResolver();
    }
} 