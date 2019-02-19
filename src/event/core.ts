import { Shape } from '../shape/BaseShape';
import { Composite } from '../shape/composite';
import { isInShape } from '../util/util';
import Broadcast from '../Broadcast/Broadcast';


export class eventInfo {
    shape: Shape;
    eventName: string;
    fn: ((e: event) => {}) | keyBoardEvent;
    zIndex: number;
}


export class keyBoardEvent {
    keyCode: number;
    fn: ((e: event) => {})
}

export class event {
    target: Shape;
    // 鼠标坐标
    x: number;
    y: number;
}


export class EventSystem {
    private container: HTMLElement;
    private layerMap: object;
    private containerTop: number;
    private containerLeft: number;

    private eventList: Array<string> = ['click', 'mousemove', 'keypress', 'mouseover', 'mouseout'];
    
    private clickEventList: Array<eventInfo>;
    private mouseoverEventList: Array<eventInfo>;
    private mouseoutEventList: Array<eventInfo>;
    private mousemoveEventList: Array<eventInfo>;
    private mousedownEventList: Array<eventInfo>;
    private mouseupEventList: Array<eventInfo>;

    //键盘数字对应表
    private keypressEventMap;

    constructor(container: HTMLElement, layerMap: object, containerPosition: number[]) {
        this.container = container;
        this.layerMap = layerMap;
        this.containerLeft = containerPosition[0];
        this.containerTop = containerPosition[1];

        this.clickEventList = [];
        this.mouseoverEventList = [];
        this.mouseoutEventList = [];
        this.mousemoveEventList = [];
        this.mousedownEventList = [];
        this.mouseupEventList = [];
        this.keypressEventMap = {};

        //初始化广播器(监听者：事件系统管理器的事件添加方法)
        Broadcast.addListener('add_event', this.addEvent.bind(this));
        //初始化广播器(监听者：事件系统管理器的事件删除方法)
        Broadcast.addListener('del_event', this.delEvent.bind(this));

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
        this.container.addEventListener('click', ev => {
            let x = ev['clientX'] - this.containerLeft,
                y = ev['clientY'] - this.containerTop; 

            this['clickEventList'].map((eventInfo: eventInfo) => {
                if(isInShape(eventInfo['ctx'], eventInfo.shape, x, y)) {
                    // 触发click（一次）
                    this.omitEvent(eventInfo.shape, <(e: event) => {}>eventInfo.fn, x, y);
                }
            });
        });


        // 鼠标按下、释放事件
        this.container.addEventListener('mousedown', ev => {
            let x = ev['clientX'] - this.containerLeft,
                y = ev['clientY'] - this.containerTop; 

            this['mousedownEventList'].map((eventInfo: eventInfo) => {
                if(isInShape(eventInfo['ctx'], eventInfo.shape, x, y)) {
                    // 触发
                    this.omitEvent(eventInfo.shape, <(e: event) => {}>eventInfo.fn, x, y);
                }
            });
        });
        this.container.addEventListener('mouseup', ev => {
            let x = ev['clientX'] - this.containerLeft,
                y = ev['clientY'] - this.containerTop; 

            this['mouseupEventList'].map((eventInfo: eventInfo) => {
                if(isInShape(eventInfo['ctx'], eventInfo.shape, x, y)) {
                    // 触发
                    this.omitEvent(eventInfo.shape, <(e: event) => {}>eventInfo.fn, x, y);
                }
            });
        });


        // 移入移出
        this.container.addEventListener('mousemove', ev => {
            let x = ev['clientX'] - this.containerLeft,
                y = ev['clientY'] - this.containerTop;  

            this['mouseoverEventList'].map((eventInfo: eventInfo) => {
                if(isInShape(eventInfo['ctx'], eventInfo.shape, x, y)) {
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
                if(!isInShape(eventInfo['ctx'], eventInfo.shape, x, y)) {
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
                if(isInShape(eventInfo['ctx'], eventInfo.shape, x, y)) {
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
        eventInfo['ctx'] = this.layerMap[eventInfo.zIndex].getCTX();

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
