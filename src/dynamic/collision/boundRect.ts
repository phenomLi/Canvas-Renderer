

/**
 * AABB包围盒
 * 只有多边形（包括矩形和三角形）和圆形拥有
 *  */ 

export default class BoundRect {
    public hor: number[];
    public ver: number[];

    constructor(range: Array<number[]>) {
        this.update(range);
    }

    // 更新包围盒
    update(range: Array<number[]>) {
        this.hor = range[0];
        this.ver = range[1];
    }
}