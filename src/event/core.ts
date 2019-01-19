import { Shape } from '../shape/BaseShape';
import { Composite } from '../shape/composite';
import { isInShape } from '../util/util';


export class eventInfo {
    shape: Shape | Composite;
    eventName: string;
    fn: ((e: event) => {}) | keyBoardEvent;
}


export class keyBoardEvent {
    keyCode: number;
    fn: ((e: event) => {})
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
    
    private clickEventList: Array<eventInfo>;
    private mouseoverEventList: Array<eventInfo>;
    private mouseoutEventList: Array<eventInfo>;
    private mousemoveEventList: Array<eventInfo>;
    // private mousedownEventList: Array<eventInfo>;
    // private mouseupEventList: Array<eventInfo>;

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

            this['clickEventList'].map((eventInfo: eventInfo) => {
                if(isInShape(this.ctx, eventInfo.shape, x, y)) {
                    // 触发click（一次）
                    this.omitEvent(eventInfo.shape, <(e: event) => {}>eventInfo.fn, x, y);
                }
            });
        });


        // 移入移出
        this.canvasEle.addEventListener('mousemove', ev => {
            let x = ev['clientX'] - this.canvasLeft,
                y = ev['clientY'] - this.canvasTop;  

            this['mouseoverEventList'].map((eventInfo: eventInfo) => {
                if(isInShape(this.ctx, eventInfo.shape, x, y)) {
                    // 若之前鼠标不在该图形上，而且现在鼠标在该图形上
                    if(!eventInfo.shape.isMouseIn()) {
                        // 触发mouseover（一次）
                        this.omitEvent(eventInfo.shape, <(e: event) => {}>eventInfo.fn, x, y);
                        // 设置图形鼠标状态为true
                        eventInfo.shape.isMouseIn(true);
                    }
                }
            });

            this['mouseoutEventList'].map((eventInfo: eventInfo) => {
                if(!isInShape(this.ctx, eventInfo.shape, x, y)) {
                    // 若之前鼠标在该图形上，而且现在鼠标不在该图形上
                    if(eventInfo.shape.isMouseIn()) {
                        // 触发mouseout（一次）
                        this.omitEvent(eventInfo.shape, <(e: event) => {}>eventInfo.fn, x, y);
                        // 设置图形鼠标状态为false
                        eventInfo.shape.isMouseIn(false);
                    }
                }
            });

            this['mousemoveEventList'].map((eventInfo: eventInfo) => {
                if(isInShape(this.ctx, eventInfo.shape, x, y)) {
                    // 触发mousemove（多次）
                    this.omitEvent(eventInfo.shape, <(e: event) => {}>eventInfo.fn, x, y);
                    // 设置图形鼠标状态为true
                    eventInfo.shape.isMouseIn(true);
                }
            });

        });
    }



    // 绑定键盘事件
    bindKeyBoardEvent() {
        document.addEventListener('keydown', ev => {
            this['keypressEventMap'][ev.keyCode] && this['keypressEventMap'][ev.keyCode].map((eventInfo: eventInfo) => {
                this.omitEvent(eventInfo.shape, (<keyBoardEvent>eventInfo.fn).fn);
            })
        });
    }

    // 添加事件
    addEvent(eventInfo: eventInfo) {
        if(eventInfo.eventName === 'keypress') {
            if(this.keypressEventMap[(<keyBoardEvent>eventInfo.fn).keyCode] === undefined) 
                this.keypressEventMap[(<keyBoardEvent>eventInfo.fn).keyCode] = [];
            this.keypressEventMap[(<keyBoardEvent>eventInfo.fn).keyCode].push(eventInfo);
        }
        else {
            this[eventInfo.eventName + 'EventList'].push(eventInfo);
        }
    }

    // 删除事件
    delEvent(eventInfo: eventInfo) {
        let eventList = null;

        if(eventInfo.eventName === 'keypress') {
            eventList = this.keypressEventMap[eventInfo['keyCode']];
            eventList.map((item, index) => {
                if(item.shape.attr('id') === eventInfo.shape.attr('id')) {
                    eventList.splice(index, 1);
                }
            });
        }
        else {
            eventList = this[eventInfo.eventName + 'EventList'];
            eventList.map((item, index) => {
                if(item.shape.attr('id') === eventInfo.shape.attr('id')) {
                    eventList.splice(index, 1);
                }
            });
        }
    
    }
}
