
// 获取渲染器
const p = new P2.Renderer(document.getElementById("line-chart"));


// 获取随机颜色
function getRandomColor() {
    return "rgb(" + Math.round(Math.random() * 255) + "," + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 10) + ')';
}



class BarChart {

    constructor(opt, renderer) {
        this.r = renderer;

        this.data = opt.data;

        this.origin = [100, 350];
        this.xAsixLength = 400;
        this.yAsixLength = 300;
        this.xAsixInterval = this.data.length;
        this.yAsixInterval = 6;
        this.xAsixIntervalLength = this.xAsixLength/this.xAsixInterval;
        this.yAsixIntervalLength = this.yAsixLength/this.yAsixInterval;
        
        this.xMaxVal = this.xAsixIntervalLength*(this.xAsixInterval - 1);
        this.yMaxVal = this.yAsixIntervalLength*(this.yAsixInterval - 1);

        this.max = 0;

        this.barWidth = 30;

        this.valFloatTag = {
            shape: null,
            text: null,
            container: null
        };

        this.yFloatTag = {
            shape: null,
            container: null,
            text: null
        };
        
        this.floatLine = null;

        this.init();
    }

    init() {
        this.initFloatTag(2, this.valFloatTag);
        this.initFloatTag(2, this.yFloatTag);
        this.floatLine = this.initFloatLine(2);

        this.r.append(this.valFloatTag.shape);
        this.r.append(this.yFloatTag.shape);
        this.r.append(this.floatLine);

        this.drawCoordinate(0);
        this.drawData(1);

        this.r.bind('mousemove', ev => {
            if(
                ev.y > this.origin[1] - this.yAsixLength 
                && ev.y < this.origin[1]
                && ev.x > this.origin[0]
                && ev.x < this.origin[0] + this.xAsixLength) {
                this.floatLine
                .attr('show', true)
                .attr('range', 
                    [[this.origin[0], ev.y], [this.origin[0] + this.xAsixLength, ev.y]]
                );

                if(this.valFloatTag.shape.attr('show')) {
                    this.yFloatTag.shape
                    .attr('show', true)
                    .attr('x', this.valFloatTag.container.attr('x') + this.valFloatTag.container.attr('width') + this.valFloatTag.container.attr('round')*2)
                    .attr('y', ev.y);
                }
                else {
                    this.yFloatTag.shape.attr('show', true).attr('x', ev.x + 10).attr('y', ev.y);
                }

                let val = ((this.origin[1] - ev.y)/this.yMaxVal*this.max).toFixed(2);

                this.setFloatTagContent(`y：${val}`, this.yFloatTag);
            }
            else {
                this.yFloatTag.shape.attr('show', false);
                this.floatLine.attr('show', false);
            }
        });
    }

    initFloatTag(zIndex, ft) {
        ft.text = new this.r.shapes.Text({
            pin: [8, 18],
            content: '',
            zIndex: zIndex,
            color: '#fff'
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

    initFloatLine(zIndex) {
        return new this.r.shapes.Line({
            range: [this.origin, [this.origin[0] + this.xAsixLength, this.origin[1]]],
            color: '#999',
            show: false,
            zIndex
        });
    }

    // 画直线
    drawLine(range, color) {
        return new this.r.shapes.Line({
            color: color,
            range: range
        });
    }

    // 绘制数据
    drawData(zIndex) {
        this.max = Math.max.apply(Math, this.data.map(item => item.val));

        this.data.map((item, i) => {
            let h = (item.val/this.max)*this.yMaxVal,
                x = (this.origin[0] + this.xAsixIntervalLength*i) + (this.xAsixIntervalLength - this.barWidth)/2;

            let that = this;

            let rect = new this.r.shapes.Rectangle({
                pin: [x, this.origin[1]],
                edge: [this.barWidth, 0],
                color: '#2d91ea',
                opacity: 0.5,
                zIndex: zIndex,
                onMouseOver: function(ev) {
                    this.animateTo({
                        target: {
                            opacity: 1
                        },
                        duration: 200
                    });

                    that.setFloatTagContent(`${item.category}：${item.val}`, that.valFloatTag);

                    that.valFloatTag.shape
                    .attr('show', true)
                    .attr('x', this.attr('x') + that.barWidth + 5);
                },
                onMouseOut: function(ev) {
                    this.animateTo({
                        target: {
                            opacity: 0.5
                        },
                        duration: 200
                    });

                    that.valFloatTag.shape.attr('show', false);
                },
                onMouseMove: function(ev) {
                    that.valFloatTag.shape.attr('y', ev.y)
                }
            });

            let category = new this.r.shapes.Text({
                pin:[0, this.origin[1] + 25],
                content: item.category,
                color: '#000',
                fontSize: 15
            });

            category.attr('x', this.origin[0] + this.xAsixIntervalLength*i + (this.xAsixIntervalLength - category.getTextWidth())/2);

            this.r.append(rect);
            this.r.append(category);

            rect.animateTo({
                target: {
                    y: this.origin[1] - h,
                    height: h
                },
                duration: 750,
                delay: 1000,
                timingFunction: 'easeOutBounce'
            });
        });
    }

    
    // 绘制坐标轴
    drawCoordinate(zIndex) {
        this.r.append(this.drawLine([this.origin, [this.origin[0], this.origin[1] - this.yAsixLength]], '#000'));
        this.r.append(this.drawLine([this.origin, [this.origin[0] + this.xAsixLength, this.origin[1]]], '#000'));

        for(let i = 1; i < this.xAsixInterval; i++) {
            let x = (this.origin[0] + this.xAsixIntervalLength*i), y = this.origin[1] + 5,
                range = [[x, this.origin[1]], [x, y]],
                dot = this.drawLine(range, '#000');

            this.r.append(dot);
        }

        for(let j = 1; j < this.yAsixInterval; j++) {
            let y = (this.origin[1] - this.yAsixIntervalLength*j), x = this.origin[0] - 5,
                range = [[x, y], [this.origin[0], y]],
                dot = this.drawLine(range, '#000');

            let horLine = this.drawLine([[this.origin[0], y], [this.origin[0], y]], '#eee');

            this.r.append(dot);
            this.r.append(horLine);

            (new this.r.animation({
                duration: 1000,
                timingFunction: 'easeOut',
                value: [this.origin[0], this.origin[0] + this.xAsixLength],
                render: v => {
                    horLine.attr('range', [[this.origin[0], y], [v, y]]);
                }
            })).start();
        }
    }
}


new BarChart({
    data: Array.from(new Array(6), (item, i) => {
        return {
            val: Math.floor(Math.random()*100) + 15,
            category: (i + 1) + '月'
        };
    })
}, p);



