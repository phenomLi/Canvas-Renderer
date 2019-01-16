import { Shape } from '../shape/BaseShape';
import { Composite } from '../shape/composite';
import { isInShape } from '../util/util';


export class bindInfo {
    shape: Shape | Composite;
    eventName: string;
    fn: ((e: event) => {}) | keyBoardEvent;
}


export class keyBoardEvent {
    keyCode: number;
    fn: (e: event) => {}
}

export class event {
    target: Shape | Composite;
    // 鼠标坐标
    x: number;
    y: number;
}


export class EventSystem {
    private canvasEle: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private canvasTop: number;
    private canvasLeft: number;

    private eventList: Array<string> = ['click', 'mousemove', 'keypress', 'mouseover', 'mouseout'];
    
    private clickEventList: Array<bindInfo>;
    private mouseoverEventList: Array<bindInfo>;
    private mouseoutEventList: Array<bindInfo>;
    private mousemoveEventList: Array<bindInfo>;
    // private mousedownEventList: Array<bindInfo>;
    // private mouseupEventList: Array<bindInfo>;

    //键盘数字对应表
    private keypressEventMap;

    constructor(canvasEle: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        this.canvasEle = canvasEle;
        this.canvasLeft = canvasEle.getBoundingClientRect().left;
        this.canvasTop = this.canvasEle.getBoundingClientRect().top;
        this.ctx = ctx;

        this.clickEventList = [];
        this.mouseoverEventList = [];
        this.mouseoutEventList = [];
        this.mousemoveEventList = [];
        // this.mousedownEventList = [];
        // this.mouseupEventList = [];
        this.keypressEventMap = {};

        this.init();
    }

    // 初始化
    init() {
        // 键盘事件
        this.bindKeyBoardEvent();
        // 鼠标事件
        this.bindMouseEvent();
    }

    // 触发事件回调函数
    omitEvent(shape: Shape, fn: (e: event) => {}, x?: number, y?: number) {
        fn({
            target: shape,
            x: x,
            y: y
        });
    }


    // 绑定鼠标事件
    bindMouseEvent() {
        
        // 点击事件
        this.canvasEle.addEventListener('click', ev => {
            let x = ev['clientX'] - this.canvasLeft,
                y = ev['clientY'] - this.canvasTop; 

            this['clickEventList'].map((bindInfo: bindInfo) => {
                if(isInShape(this.ctx, bindInfo.shape, x, y)) {
                    // 触发click（一次）
                    this.omitEvent(bindInfo.shape, <(e: event) => {}>bindInfo.fn, x, y);
                }
            });
        });


        // 移入移出
        this.canvasEle.addEventListener('mousemove', ev => {
            let x = ev['clientX'] - this.canvasLeft,
                y = ev['clientY'] - this.canvasTop;  

            this['mouseoverEventList'].map((bindInfo: bindInfo) => {
                if(isInShape(this.ctx, bindInfo.shape, x, y)) {
                    // 若之前鼠标不在该图形上，而且现在鼠标在该图形上
                    if(!bindInfo.shape.isMouseIn) {
                        // 触发mouseover（一次）
                        this.omitEvent(bindInfo.shape, <(e: event) => {}>bindInfo.fn, x, y);
                        // 设置图形鼠标状态为true
                        bindInfo.shape.isMouseIn = true;
                    }
                }
            });

            this['mouseoutEventList'].map((bindInfo: bindInfo) => {
                if(!isInShape(this.ctx, bindInfo.shape, x, y)) {
                    // 若之前鼠标在该图形上，而且现在鼠标不在该图形上
                    if(bindInfo.shape.isMouseIn) {
                        // 触发mouseout（一次）
                        this.omitEvent(bindInfo.shape, <(e: event) => {}>bindInfo.fn, x, y);
                        // 设置图形鼠标状态为false
                        bindInfo.shape.isMouseIn = false;
                    }
                }
            });

            this['mousemoveEventList'].map((bindInfo: bindInfo) => {
                if(isInShape(this.ctx, bindInfo.shape, x, y)) {
                    // 触发mousemove（多次）
                    this.omitEvent(bindInfo.shape, <(e: event) => {}>bindInfo.fn, x, y);
                    // 设置图形鼠标状态为true
                    bindInfo.shape.isMouseIn = true;
                }
            });

        });
    }



    // 绑定键盘事件
    bindKeyBoardEvent() {
        document.addEventListener('keydown', ev => {
            this['keypressEventMap'][ev.keyCode] && this['keypressEventMap'][ev.keyCode].map((bindInfo: bindInfo) => {
                this.omitEvent(bindInfo.shape, (<keyBoardEvent>bindInfo.fn).fn);
            })
        });
    }

    // 添加事件
    addEvent(bindInfo: bindInfo) {
        if(bindInfo.eventName === 'keypress') {
            if(this.keypressEventMap[(<keyBoardEvent>bindInfo.fn).keyCode] === undefined) 
                this.keypressEventMap[(<keyBoardEvent>bindInfo.fn).keyCode] = [];
            this.keypressEventMap[(<keyBoardEvent>bindInfo.fn).keyCode].push(bindInfo);
        }
        else {
            this[bindInfo.eventName + 'EventList'].push(bindInfo);
        }
    }

    // 删除事件
    delEvent(shape: Shape) {
        let eventList = null;

        shape.getEventList().map(item => {
            if(item.eventName === 'keypress') {
                eventList = this.keypressEventMap[item.fn['keyCode']];
                eventList.map((bindInfoItem, index) => {
                    if(bindInfoItem.shape.attr('id') === shape.attr('id')) {
                        eventList.splice(index, 1);
                    }
                });
            }
            else {
                eventList = this[item.eventName + 'EventList'];
                eventList.map((bindInfoItem, index) => {
                    if(bindInfoItem.shape.attr('id') === shape.attr('id')) {
                        eventList.splice(index, 1);
                    }
                });
            }
        });
    }
}
