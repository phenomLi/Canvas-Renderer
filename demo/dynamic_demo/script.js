
function getRandomColor() {
    let arr = [
        '#bcd3bb', '#e88f70', 
        '#edc1a5', '#9dc5c8', 
        '#e1e8c8', '#7b7c68', 
        '#e5b5b5', '#f0b489', 
        '#928ea8', '#bda29a'
    ];

    return arr[Math.floor(Math.random()*arr.length)];
}


function getRandomPos(width, height) {
    return [Math.floor(Math.random()*width), Math.floor(Math.random()*height)];
}

function isNumber(inputData) { 
　　//isNaN(inputData)不能判断空串或一个空格 
　　//如果是一个空串或是一个空格，而isNaN是做为数字0进行处理的，而parseInt与parseFloat是返回一个错误消息，这个isNaN检查不严密而导致的。 
　　if (parseFloat(inputData).toString() == 'NaN') { 
　　　　//alert(“请输入数字……”); 
　　　　return false; 
　　} else { 
　　　　return true; 
　　} 
}



const vue = new Vue({
    el: '#container',
    data: {
        pauseFlag: false,
        curCanvasIndex: 0,
        curWorld: null,
        prevWorld: null,
        worldInstanceList: [],
        navList: [
            'DEMO1',
            'DEMO2',
            'DEMO3'
        ],
        gravityX: 0,
        gravityY: 6,
        drag: 0.25,
        score: 0,
        size: [],
        offset: []
    },
    methods: {
        play() {
            this.pauseFlag = !this.pauseFlag;
            this.pauseFlag? this.curWorld.pause(): this.curWorld.start();
        },

        navSelection(index) {
            this.curCanvasIndex = index;
            this.curWorld = this.worldInstanceList[index];
            this.prevWorld.pause();

            this.curWorld.start();
            this.pauseFlag = false;

            this.prevWorld = this.curWorld;
        }
    },

    watch: {
        gravityX(val) {
            if(isNumber(val)) {
                this.curWorld.setGlobalForce({
                    gravity: [val, this.gravityY]
                });
            }
        },
        gravityY(val) {
            if(isNumber(val)) {
                this.curWorld.setGlobalForce({
                    gravity: [this.gravityX, val]
                });
            }
        },
        drag(val) {
            if(isNumber(val)) {
                this.curWorld.setGlobalForce({
                    linearDrag: [val, 0]
                });
            }
        }
    },
    
    mounted() {
        let c = document.getElementById('canvas' + this.curCanvasIndex);

        this.size = [c.offsetWidth, c.offsetHeight];
        this.offset = [c.offsetLeft, c.offsetTop];

        this.worldInstanceList.push(init1(this));
        this.worldInstanceList.push(init2(this));
        this.worldInstanceList.push(init3(this));

        this.curWorld = this.worldInstanceList[this.curCanvasIndex];
        this.prevWorld = this.curWorld;

        this.curWorld.start();
    }
});