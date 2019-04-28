import BoundRect from "./boundRect";
import { isOverlaps } from "../../util/util";





//AABB包围盒相交
export function AABBIntersect(br1: BoundRect, br2: BoundRect): boolean {
    return isOverlaps(br1.ver, br2.ver);
}

// AABB包围盒包含(br2包含br1)
function AABBContain(br1: BoundRect, br2: BoundRect): boolean {
    return br1.hor[0] >= br2.hor[0] &&
           br1.hor[1] <= br1.hor[1] &&
           br1.ver[0] >= br2.ver[0] &&
           br1.ver[1] <= br2.ver[1];
}