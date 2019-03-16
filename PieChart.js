
// 获取渲染器
const p = new P2.Renderer(document.getElementById("pie-chart"));


// 获取随机颜色
function getRandomColor() {
    return "rgb(" + Math.round(Math.random() * 255) + "," + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 10) + ')';
}





class PieChart {

    constructor(opt, renderer) {
        this.r = renderer;

        this.data = opt.data;

        this.origin = [400, 200];
        
        this.maxRadius = 600;
        

        this.valFloatTag = {
            shape: null,
            text: null,
            container: null
        };


        this.init();
    }

    init() {
        this.initFloatTag(1, this.valFloatTag);

        this.r.append(this.valFloatTag.shape);

        this.drawData(0);
    }

    initFloatTag(zIndex, ft) {
        ft.text = new this.r.shapes.Text({
            pin: [8, 23],
            content: '',
            zIndex: zIndex,
            color: '#fff',
            fontSize: 15
        });

        ft.container = new this.r.shapes.RoundRect({
            pin: [0, 3],
            edge: [ft.text.getTextWidth() + 16, ft.text.getTextHeight() + 6],
            round: 3,
            zIndex: zIndex,
            color: 'rgba(0, 0, 0, 0.5)'
        });

        ft.shape = new this.r.shapes.Composite({
            pin: [0, 0],
            center: [0, 0],
            zIndex: zIndex,
            shapes: [ft.container, ft.text],
            deep: false,
            show: false
        });
    }

    setFloatTagContent(content, ft) {
        ft.text.attr('content', content);
        ft.container.attr('width', ft.text.getTextWidth() + 12);
    }


    // 绘制数据
    drawData(zIndex) {
        let total = this.data.map(item => item.val).reduce((preValue, curValue) => preValue + curValue),
            startAngle = 0;

        this.data.sort((n1, n2) => n1.val - n2.val).map(item => {
            let endAngle = startAngle + (item.val/total)*360,
                that = this;

            let sector = new this.r.shapes.Sector({
                pin: this.origin,
                radius: Math.floor((item.val/total)*this.maxRadius),
                range: [Math.ceil(startAngle), Math.ceil(endAngle)],
                color: getRandomColor(),
                onMouseOver: function(ev) {
                    this.animateTo({
                        target: {
                            radius: this.attr('radius')*1.5
                        },
                        duration: 250,
                        timingFunction: 'easeOutBounce'
                    });

                    that.setFloatTagContent(`${item.category}：${item.val}`, that.valFloatTag);

                    that.valFloatTag.shape.attr('show', true);
                },
                onMouseOut: function(ev) {
                    this.animateTo({
                        target: {
                            radius: Math.floor((item.val/total)*that.maxRadius)
                        },
                        duration: 250,
                        timingFunction: 'easeOutBounce'
                    });
                },
                onMouseMove: function(ev) {
                    that.valFloatTag.shape.attr('y', ev.y).attr('x', ev.x);
                }
            });

            this.r.append(sector);

            startAngle = endAngle;
        });
    }
}


new PieChart({
    data: Array.from(new Array(6), (item, i) => {
        return {
            val: Math.floor(Math.random()*60) + 20,
            category: (i + 1) + '月'
        };
    })
}, p);

