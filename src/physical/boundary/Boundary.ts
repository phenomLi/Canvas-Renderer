import BoundariesManager from "./core";

/**
 * 边界
 */

class BoundaryConfig {
    bound: number;
    position: string; //*
}


export default class Boundary {
    // 位置
    public position: string;

    // 弹力
    public bound: number;

    private opt: BoundaryConfig;

    constructor(opt: BoundaryConfig) {
        this.bound = opt.bound || -1;
        this.position = opt.position;

        this.opt = opt;
    }
}  
