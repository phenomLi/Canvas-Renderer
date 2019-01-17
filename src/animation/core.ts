import Tween from './tween';


class animationConfig {
    // 动画时长
    duration: number;
    // 变化的value
    value: Array<Array<number>> | Array<number>; //*
    // 渲染函数
    render: (...value: number[]) => {}; //*
    // 缓动函数
    timingFunction: string;

    // hook
    onStart: Function;
    onEnd: Function;
    onStop: Function;
    onReset: Function;
}


class valueInfo {
    start: number;
    end: number;
}


enum state {
    init = 0, // 初始化
    play = 1, //播放
    stop = 2, // 停止
    end = 3 //停止
};


export default class Animation {
    private _value: Array<valueInfo>;
    private _duration :number;
    private _timingFunction: Function;
    private _renderFunction: Function;
    
    // hook
    private _onStart: Function;
    private _onEnd: Function;
    private _onStop: Function;
    private _onReset: Function;

    private state: state;
    // 开始时间
    private beginTime: number;
    // 动画队列
    private animationQueue: Array<animationConfig>;

    constructor(config: animationConfig) {
        this.animationQueue = [];
        this.init(config);
    }

    private init(config: animationConfig): Animation {
        this._value = [];
        this._duration = config.duration || 1000;
        this._timingFunction = config.timingFunction? Tween[config.timingFunction]: Tween['linear'];
        this._renderFunction = config.render || ((...value: number[]) => {});

        /* Events */   
        this._onStart = config.onStart || (() => {});
        this._onEnd = config.onEnd || (() => {});
        this._onStop = config.onStop || (() => {});
        this._onReset = config.onReset || (() => {});

        // 状态为初始化
        this.state = state.init;

        this.initValue(config.value);

        return this;
    }

    // 初始化value列表
    private initValue(value: Array<Array<number>> | Array<number>) {
        if((<Array<Array<number>>>value).every(item => item instanceof Array)) {
            (<Array<Array<number>>>value).map(item => {
                this._value.push({
                    start: item[0],
                    end: item[1],
                });
            })
        }
        else {
            this._value.push({
                start: (<Array<number>>value)[0],
                end: (<Array<number>>value)[1]
            });
        }
    }

    // 循环函数
    private loop() {
        // 动画已经播放的时间
        let time = Date.now() - this.beginTime;

        // 若动画已经播放的时间已经大于设定的动画持续时间，则动画结束
        if(time >= this._duration || this.state === state.end) {          
            this.renderFunction(this._duration, this._duration);
            this.end();
        } 
        else if(this.state === state.stop) {
            this.renderFunction(time, this._duration);
        }
        else if(this.state === state.init) {
            this.renderFunction(0, this._duration);
        }
        else {  
            this.renderFunction(time, this._duration);
            window.requestAnimationFrame(this.loop.bind(this));
        }
    }

    // 渲染函数
    private renderFunction(time, duration) {
        // 对value应用缓动函数，返回结果
        const values = this._value.map(value => this._timingFunction(time, value.start, value.end - value.start, duration)); 
        this._renderFunction.apply(this, values);
    }


    /** --------------------------暴露的api------------------------------------- */

    // 开始
    public start() {
        this.state = state.play;
        this.beginTime = Date.now();

        this._onStart();

        window.requestAnimationFrame(this.loop.bind(this));
    }

    // 暂停
    public stop() {
        if(this.state === state.play) {
            this.state = state.stop;
            this._onStop();
        } 
    }

    // 结束
    public end() {
        if(this.state === state.play) {
            this.state = state.end;
            this._onEnd();
            
            console.log(this.animationQueue);

            if(this.animationQueue.length) {
                this.init(this.animationQueue.shift()).start();
            }
        } 
    }

    public reset() {
        if(this.state === state.play) {
            this.state = state.init;
            this._onReset();
        } 
    }

    public next(config: animationConfig): Animation {
        this.animationQueue.push(config);

        return this;
    }
}


