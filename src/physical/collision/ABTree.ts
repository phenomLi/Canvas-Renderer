import BoundRect from "../../shape/boundRect/boundRect";
import { isOverlaps } from "../../util/util";

/** 
* AABB检测树
*/
export default class ABTree {

}







// AABB包围盒检测
function AABBDetection(br1: BoundRect, br2: BoundRect): boolean {
    return isOverlaps(br1.horizontalRange, br2.horizontalRange) && isOverlaps(br1.verticalRange, br2.verticalRange);
}