
 
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
        curCanvasIndex: 0,
        curRenderer: null,
        preRenderer: null,
        rendererInstanceList: [],
        initList: [],
        navList: [
            'ANIMATION',
            'INTERACT',
            'CHART1',
            'CHART2',
            'CHART3'
        ],
        curData: 0,
        interval: 20,
        play: true,
        size: [],
        offset: [],
        curShape: null
    },
    methods: {
        navSelection(index) {
            this.curCanvasIndex = index;

            if(this.rendererInstanceList[this.curCanvasIndex] === undefined) {
                this.rendererInstanceList[this.curCanvasIndex] = this.initList[this.curCanvasIndex](this, this.curCanvasIndex);
            }
            
            this.curRenderer = this.rendererInstanceList[this.curCanvasIndex];
            this.prevRenderer = this.curRenderer;
        },  

        del_shape() {
            this.curRenderer.renderer.remove(this.curShape);
            this.curShape = null;
        },

        add_shape() {
            this.curRenderer.chart.addRect();
        },

        addCategory_bar() {
            this.curRenderer.chart.addCategory({
                data: Array.from(new Array(6), () => Math.floor(Math.random()*100) + 15),
                name: '项目' + (Math.random()*10).toFixed(2),
                color: getRandomColor()
            });
        },

        addCategory_pie() {
            this.curRenderer.chart.addCategory({
                name: '国家' + Math.random().toFixed(2),
                data: Math.ceil(Math.random()*20000000) + 10000000,
                color: getRandomColor()
            });
        },

        playChart() {
            this.play = !this.play;
            this.play? this.curRenderer.chart.start(): this.curRenderer.chart.pause();
        }
    },

    watch: {
        curData(newVal) {
            if(isNumber(newVal) && parseFloat(newVal) > 0) {
                this.curRenderer.chart.setBarVal(parseFloat(newVal));
            }
        },
        interval(val) {
            if(isNumber(val) && parseInt(val) > 0) {
                this.curRenderer.chart.setYInterval(parseInt(val));
            }
        }
    },
    
    mounted() {
        let c = document.getElementById('canvas' + this.curCanvasIndex);

        this.size = [c.offsetWidth, c.offsetHeight];
        this.offset = [c.offsetLeft, c.offsetTop];

        this.initList = [animationDemo, interactDemo, init1, init2, init3];

        this.rendererInstanceList[this.curCanvasIndex] = this.initList[this.curCanvasIndex](this, this.curCanvasIndex);

        this.curRenderer = this.rendererInstanceList[this.curCanvasIndex];
        this.prevRenderer = this.curRenderer;
    }
});