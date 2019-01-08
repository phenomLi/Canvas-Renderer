import { Shape } from '../shape/BaseShape';
import { Composite } from '../shape/composite';


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
    curShape: Shape | Composite;
    // 鼠标坐标
    x: number;
    y: number;
}


export class EventSystem {
    private canvasEle: HTMLCanvasElement;
    private eventList: Array<string> = ['click', 'mouseover', 'mouseout', 'mousemove', 'mousedown', 'mouseup'];

    private clickEventList: Array<bindInfo>;
    private mouseoverEventList: Array<bindInfo>;
    private mouseoutEventList: Array<bindInfo>;
    private mousemoveEventList: Array<bindInfo>;
    private mousedownEventList: Array<bindInfo>;
    private mouseupEventList: Array<bindInfo>;
    //键盘数字对应表
    private keypressEventMap;

    constructor(canvasEle: HTMLCanvasElement) {
        this.canvasEle = canvasEle;

        this.clickEventList = [];
        this.mouseoverEventList = [];
        this.mouseoutEventList = [];
        this.mousemoveEventList = [];
        this.mousedownEventList = [];
        this.mouseupEventList = [];
        this.keypressEventMap = {};

        this.init(this.canvasEle);
    }

    // 初始化
    init(canvasEle: HTMLCanvasElement) {
        this.eventList.map((eventName: string) => {
            if(eventName === 'keypress') {
                canvasEle.addEventListener('keydown', e => {
                    this[eventName + 'EventMap'][e.keyCode].map((bindInfo: bindInfo) => {
                        (<keyBoardEvent>bindInfo.fn).fn({
                            curShape: bindInfo.shape,
                            x: 0,
                            y: 0
                        });
                    })
                });
            }
            else {
                canvasEle.addEventListener(eventName, e => {
                    this[eventName + 'EventList'].map((bindInfo: bindInfo) => {
                        (<(e: event) => {}>bindInfo.fn)({
                            curShape: bindInfo.shape,
                            x: 0,
                            y: 0
                        });
                    })
                });
            }
        });
    }

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
}
