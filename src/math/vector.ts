import { scale, isConcavePoly } from "../util/util";

// [x, y]
export type vector = Array<number>;



// 向量工具包
export const Vector = {
    // 向量加法
    add(v1: vector, v2: vector): vector {
        return [v1[0] + v2[0], v1[1] + v2[1]];
    },

    // 向量减法
    sub(v1: vector, v2: vector): vector {
        return [v1[0] - v2[0], v1[1] - v2[1]];
    },

    // 向量点积
    dot(v1: vector, v2: vector): number {
        return v1[0]*v2[0] + v1[1]*v2[1];
    },

    // 向量叉积
    cor(v1: vector, v2: vector): number {
        return v1[0]*v2[1] - v2[0]*v1[1];
    },

    // 投影
    pro(v1: vector, v2: vector): number {
        return this.dot(v1, v2)/this.len(v2);
    },

    // 计算法向量
    nor(v: vector): vector {
        return [v[1], -v[0]];
    },

    // 向量的模
    len(v: vector): number {
        return Math.sqrt(v[0]*v[0] + v[1]*v[1]);
    },

    // 向量单位化
    nol(v: vector): vector {
        let len = this.len(v);
        return len !== 0? [v[0]/len, v[1]/len]: [0, 0];
    },

    // 乘上一个标量
    scl(scale: number, v: vector): vector {
        return [scale*v[0], scale*v[1]];
    },

    //向量反向
    inv(v: vector): vector {
        return [-v[0], -v[1]];
    },

    // 判断两向量是否相等
    eql(v1: vector, v2: vector): boolean {
        return v1[0] === v2[0] && v1[1] === v2[1];
    }
};