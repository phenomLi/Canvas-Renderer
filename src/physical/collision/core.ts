import { Polygon } from "../../shape/Polygon";
import { Circle } from "../../shape/Circle";
import ABTree from './ABTree';
import SATDetection from './SAT';


type collisionShape = Polygon | Circle;






/**
 * 碰撞检测
 * 1.SAT检测（细）
 * 2.AABB树检测（粗）
 * 
 * 2种情况：
 * 1：两个图形中至少有一个为多边形
 * 2：两个图形都为圆形
 */
export function collisionDetection(shape1: collisionShape, shape2: collisionShape): boolean {

    

    return true;
} 