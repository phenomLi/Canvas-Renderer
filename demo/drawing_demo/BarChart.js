
function init2(v, index) {
    // 获取渲染器
    const renderer = new P2.Renderer(document.getElementById("canvas" + index), {
        size: v.size,
        offset: v.offset
    });


class BarChart {
    constructor(opt) {
        this.r = renderer;

        this.categoryShowCount = 0;
        this.lastCategoryShowCount = 0;
        this.data = this.initCategory(opt.data);
        this.lastCategoryShowCount = this.categoryShowCount;

        this.title = opt.title;
        this.unit = opt.unit;
        this.xAxis = opt.xAxis;
        this.yAxis = opt.yAxis;

        this.yMaxVal = this.calcYMaxVal();
        this.lastYMaxVal = this.yMaxVal;

        this.xAxisIntervalNum = this.xAxis.length;
        this.yAxisIntervalNum = this.calcYIntervalNum();
        this.lastYAxisIntervalNum = this.yAxisIntervalNum;

        this.xAxisLength = opt.xAxisLength;
        this.yAxisLength = opt.yAxisLength;
        this.origin = [this.r.getWidth()/2 - this.xAxisLength/2, this.r.getHeight()/2 + this.yAxisLength/2];
        
        this.xAxisIntervalLength = this.xAxisLength/this.xAxisIntervalNum;
        this.yAxisIntervalLength = this.calcYIntervalLength();

        this.barWidth = this.calcBarWidth();

        this.xMax = this.xAxisIntervalLength*(this.xAxisIntervalNum - 1);
        this.yMax = this.calcYMax();

        this.yInfoItem = {
            yVal: 0,
            y: 0,
            horLine: null,
            dot: null,
            text: null
        };

        this.yInfo = [];

        this.curSelectBar = null;

        this.tool = {
            yValTooltip: {
                shape: null,
                text: null,
                container: null
            },
            barValTooltip: {
                shape: null,
                text: null,
                container: null
            },
            yValLine: null
        };

        this.layer1 = 0;
        this.layer2 = 1;
        this.layer3 = 2;

        this.initTooltip();
        this.render();
    }

    initCategory(data) {
        if(data instanceof Array) {
            data.map(item => this.initCategory(item));
        }
        else {
            if(this.data === undefined) {
                this.data = [];
            }
            
            data.show = true;
            data.bars = [];
            data.badge = null;
            data.badgeText = null;

            this.categoryShowCount++;

            this.data.push(data);
        }

        return this.data;
    }


    initTooltip() {
        this.tool.yValTooltip = this.createTooltip();
        this.tool.barValTooltip = this.createTooltip();
        this.tool.yValLine = this.createLine({
            range: [this.origin, [this.origin[0] + this.xAxisLength, this.origin[1]]],
            color: '#fff',
            show: false,
            zIndex: this.layer3
        });

        this.r.append([this.tool.yValTooltip.shape, this.tool.barValTooltip.shape, this.tool.yValLine]);

        this.initToolEvent();
    }

    initToolEvent() {
        this.r.bind('mousemove', ev => {
            if(this.isPointInChart(ev.x, ev.y)) {
                let val = ((this.origin[1] - ev.y)/this.yMax*this.yMaxVal).toFixed(2);

                // 显示浮动线
                this.tool.yValLine.attr('show', true).attr('range', 
                    [[this.origin[0], ev.y], [this.origin[0] + this.xAxisLength, ev.y]]
                );

                // 如果将要显示柱形图浮动框时，将数值浮动框右移
                if(this.tool.barValTooltip.shape.attr('show')) {
                    this.tool.yValTooltip.shape
                    .attr('show', true)
                    .attr('x', this.tool.barValTooltip.container.attr('x') + this.tool.barValTooltip.container.attr('width') + this.tool.barValTooltip.container.attr('round')*2)
                    .attr('y', ev.y);
                }
                else {
                    this.tool.yValTooltip.shape.attr('show', true).attr('x', ev.x + 10).attr('y', ev.y);
                }

                this.setTooltipText(this.tool.yValTooltip, `y：${val}`);
            }
            else {
                this.tool.yValTooltip.shape.attr('show', false);
                this.tool.yValLine.attr('show', false);
            }
        });
    }

    setTooltipText(tooltip, text) {
        tooltip.text.attr('content', text);
        tooltip.container.attr('width', tooltip.text.getTextWidth() + 12);
    }

    createTooltip() {
        let text = new this.r.shapes.Text({
            pin: [8, 12],
            content: '',
            fontSize: 16,
            zIndex: this.layer3,
            color: '#fff'
        }),
        container = new this.r.shapes.RoundRect({
            pin: [0, 3],
            edge: [text.getTextWidth() + 40, text.getTextHeight() + 16],
            round: 3,
            zIndex: this.layer3,
            color: 'rgba(0, 0, 0, 0.5)'
        })

        return {
            text: text,
            container: container,
            shape: new this.r.shapes.Composite({
                pin: [0, 0],
                center: [0, 0],
                zIndex: this.layer3,
                shapes: [container, text],
                show: false
            })
        };
    }

    createLine(opt) {
        return new this.r.shapes.Line(opt);
    }




    isPointInChart(x, y) {
        return (y > this.origin[1] - this.yAxisLength 
        && y < this.origin[1]
        && x > this.origin[0]
        && x < this.origin[0] + this.xAxisLength);
    }

    calcBarX(categoryIndex, index) {
        return (this.origin[0] + this.xAxisIntervalLength*index) + (2*categoryIndex + 1)*this.barWidth;
    }   

    calcBarWidth() {
        return this.xAxisIntervalLength/(2*this.categoryShowCount + 1);
    }

    calcBarHeight(val) {
        return (val/this.yMaxVal)*this.yMax;
    }

    calcYMaxVal() {
        let maxVal = Math.max.apply(Math, this.data.map(item => {
            if(item.show) return Math.max.apply(Math, item.data);
            else return 0;
        }));
        return Math.ceil(maxVal/this.yAxis)*this.yAxis;
    }

    calcYMax() {
        return this.yAxisIntervalLength*(this.yAxisIntervalNum - 1);
    }

    calcYIntervalNum() {
        return Math.ceil(this.yMaxVal/this.yAxis) + 1;
    }


    calcYIntervalLength() {
        return this.yAxisLength/this.yAxisIntervalNum;
    }






    drawTitle() {
        let title = new this.r.shapes.Text({
            pin:[0, 80],
            content: this.title,
            color: '#ccc',
            fontSize: 26
        });

        title.attr('x', this.r.getWidth()/2 - title.getTextWidth()/2 - 60);

        this.r.append(title);
    }

    drawCategory(category, categoryIndex, flag) {
        category.data.map((item, i) => {
            let that = this,
                barX = this.calcBarX(categoryIndex, i);

            let rect = new this.r.shapes.Rectangle({
                pin: [barX, this.origin[1]],
                edge: [this.barWidth, 0],
                color: category.color,
                shadow: '10 0 0 rgba(0,0,0,0.5)',
                opacity: 0.6,
                zIndex: this.layer2,
                onMouseOver: function(ev) {
                    this.animateTo({
                        target: {
                            opacity: 1
                        },
                        duration: 200
                    });

                    that.setTooltipText(that.tool.barValTooltip, `${category.name}：${category.data[i]}`);

                    that.tool.barValTooltip.shape
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

                    that.tool.barValTooltip.shape.attr('show', false);
                },
                onMouseMove: function(ev) {
                    that.tool.barValTooltip.shape.attr('y', ev.y)
                },
                onClick: function(ev) {
                    v.curData = category.data[i];

                    that.curSelectBar = {
                        categoryIndex: categoryIndex,
                        index: i,
                        shape: rect
                    };
                }
            });

            category.bars.push({
                shape: rect,
                val: item
            });

            this.r.append(rect);

            if(flag === undefined) {
                this.animateBarHeight(rect, item, {
                    duration: 750,
                    delay: 500,
                    timingFunction: 'easeOutBounce'
                });
            }
            else {
                rect.attr('opacity', 0);
                this.animateBarHeight(rect, item);
                this.animateFade(rect, 0.6);
            }
        });

        this.drawControlBoardItem(category, categoryIndex);
    }

    drawControlBoardItem(category, categoryIndex) {
        let that = this;

        category.badge = new this.r.shapes.RoundRect({
            pin: [0, 0],
            edge: [30, 20],
            round: 2,
            color: category.color
        });

        category.badgeText = new this.r.shapes.Text({
            pin: [40, 0],
            content: category.name,
            fontSize: 14,
            color: '#fff'
        });

        let rect = new this.r.shapes.Rectangle({
            pin: [0, 0],
            edge: [40 + category.badgeText.getTextWidth(), 20],
            color: 'transparent',
            onClick: function(ev) {
                that.toggleCategory(category);
            }
        });

        let label = new this.r.shapes.Composite({
            pin: [this.origin[0] + categoryIndex*120, this.origin[1] + 70],
            center: [0, 0],
            shapes: [rect, category.badge, category.badgeText]
        });

        this.r.append(label);
    }

    // 绘制坐标轴
    drawCoordinate() {
        this.r.append(this.createLine({
            range: [this.origin, [this.origin[0], this.origin[1] - this.yAxisLength]], 
            color: '#ccc'
        }));

        this.r.append(this.createLine({
            range: [this.origin, [this.origin[0] + this.xAxisLength, this.origin[1]]], 
            color: '#ccc'
        }));

        this.drawXLabel();
        this.drawYLabel();

        let unit = new this.r.shapes.Text({
            pin:[0, this.origin[1] - this.yAxisLength - 40],
            content: this.unit,
            color: '#ccc',
            fontSize: 15
        });

        unit.attr('x', this.origin[0] - unit.getTextWidth());

        this.r.append(unit);
    }

    drawXLabel() {
        for(let i = 1; i < this.xAxisIntervalNum; i++) {
            let x = (this.origin[0] + this.xAxisIntervalLength*i), y = this.origin[1] + 5,
                dot = this.createLine({
                    range: [[x, this.origin[1]], [x, y]], 
                    color: '#ccc'
                });

            this.r.append(dot);
        }

        this.xAxis.map((item, i) => {
            let text = new this.r.shapes.Text({
                pin:[0, this.origin[1] + 15],
                content: item,
                color: '#ccc',
                fontSize: 15
            });

            text.attr('x', this.origin[0] + this.xAxisIntervalLength*i + (this.xAxisIntervalLength - text.getTextWidth())/2);

            this.r.append(text);
        });
    }

    drawYLabel() {
        for(let j = 1; j < this.yAxisIntervalNum + 1; j++) {
            let y = (this.origin[1] - this.yAxisIntervalLength*j), x = this.origin[0] - 5,
                dot = this.createLine({
                    range: [[x, y], [this.origin[0], y]], 
                    color: '#ccc'
                }),
                yInfo = {
                    yVal: this.yAxis*j,
                    y: y,
                    dot: dot
                };

            this.r.append(dot);

            if(j < this.yAxisIntervalNum) {
                let horLine = this.createLine({
                    range: [[this.origin[0], y], [this.origin[0] + this.xAxisLength, y]], 
                    color: '#666',
                    percent: 0
                });

                yInfo.horLine = horLine;

                this.r.append(horLine);
            }
            else {
                yInfo.horLine = null;
            }

            this.yInfo.push(yInfo);
        }

        this.yInfo.map((item, i) => {
            let text = new this.r.shapes.Text({
                pin:[0, 0],
                content: Math.ceil(item.yVal),
                color: '#ccc',
                fontSize: 15
            });

            text
            .attr('x', this.origin[0] - 20 - text.getTextWidth())
            .attr('y', this.origin[1] - (i + 1)*this.yAxisIntervalLength - text.getTextHeight()/2 - 4);

            item.text = text;

            this.r.append(text);
        });
    }

    render() {
        this.drawTitle();
        this.drawCoordinate();
        this.data.map((item, index) => {
            this.drawCategory(item, index);
        });

        this.yInfo.map(item => {
            this.animateLineLength(item.horLine, 100);
        });
    }


    reLayout() {
        this.yMaxVal = this.calcYMaxVal();
        this.yAxisIntervalNum = this.calcYIntervalNum();
        this.yAxisIntervalLength = this.calcYIntervalLength();
        this.yMax = this.calcYMax();
        this.barWidth = this.calcBarWidth();

        // 若category显示数目发生更改，则重新排布x轴
        if(this.categoryShowCount !== this.lastCategoryShowCount) {
            this.reLayoutXVal();
        }

        // 若y最分段数发生更改，则重新排布y轴
        if(this.yAxisIntervalNum !== this.lastYAxisIntervalNum) {
            this.reLayoutYVal();
        }

        this.lastCategoryShowCount = this.categoryShowCount;
        this.lastYAxisIntervalNum = this.yAxisIntervalNum;
        this.lastYMaxVal = this.yMaxVal;
    }


    reLayoutYVal() {
        this.yInfo.map(item => {
            item.text && this.r.remove(item.text);
            item.dot && this.r.remove(item.dot);
            item.horLine && this.r.remove(item.horLine);
        });

        this.yInfo = [];

        this.drawYLabel();

        this.yInfo.map(item => {
            this.animateLineLength(item.horLine, 100);
        });

        this.data.map(item => {
            item.show && item.bars.map(bar => this.animateBarHeight(bar.shape, bar.val));
        });
    }

    reLayoutXVal() {
        let showIndex = 0;

        this.data.map(item => {
            if(item.show) {
                showIndex++;
                item.bars.map((bar, i) => {
                    let x = (this.origin[0] + this.xAxisIntervalLength*i) + (2*(showIndex - 1) + 1)*this.barWidth;
                    
                    bar.shape.animateTo({
                        target: {
                            width: this.barWidth,
                            x: x
                        },
                        duration: 250,
                        timingFunction: 'easeOut'
                    });
                });
            } 
        });
    }

    animateBarHeight(bar, val, opt) {
        let height = this.calcBarHeight(val);

        bar.animateTo({
            target: {
                y: this.origin[1] - height,
                height: height
            },
            delay: opt? (opt.delay || 0): 0,
            duration: opt? (opt.duration || 250): 250,
            timingFunction: opt? (opt.timingFunction || 'easeOut'): 'easeOut'
        });
    }

    animateLineLength(shape, percent) {
        //let that = this;

        if(shape) {
            shape.animateTo({
                target: {
                    percent: percent
                },
                duration: 500,
                timingFunction: 'easeOut',
            });
            // (new this.r.animation(shape, {
            //     duration: 500,
            //     timingFunction: 'easeOut',
            //     value: [this.origin[0], length],
            //     render: function(v) {
            //         this.attr('range', [[that.origin[0], y], [v, y]]);
            //     }
            // })).start();
        }
    }

    animateFade(shape, opacity) {
        shape.animateTo({
            target: {
                opacity: opacity
            },
            duration: 250,
        });
    }




    setYInterval(interval) {
        this.yAxis = interval;
        this.reLayout();
    }


    setBarVal(val) {
        this.data[this.curSelectBar.categoryIndex].data[this.curSelectBar.index] = val;
        this.data[this.curSelectBar.categoryIndex].bars[this.curSelectBar.index].val = val;

        this.reLayout();
        this.animateBarHeight(this.curSelectBar.shape, val);
    }

    toggleCategory(category) {
        if(!category.show) {
            category.badge.attr('color', category.color);
            category.badgeText.attr('color', '#fff');
            category.bars.map(item => {
                this.animateBarHeight(item.shape, item.val);
                this.animateFade(item.shape, 1);
            });

            this.categoryShowCount++;
        }
        else {
            category.badge.attr('color', '#999');
            category.badgeText.attr('color', '#999');
            category.bars.map(item => {
                this.animateBarHeight(item.shape, 0);
                this.animateFade(item.shape, 0);
            });

            this.categoryShowCount--;
        }

        category.show = !category.show;

        this.reLayout();
    }

    addCategory(data) {
        this.data = this.initCategory(data);

        this.drawCategory(data, this.data.length - 1, true);

        this.reLayout();

        this.lastCategoryShowCount = this.categoryShowCount;
    }
}


    let chart = new BarChart({
        data: [{
            data: Array.from(new Array(6), () => Math.floor(Math.random()*100) + 15),
            name: '项目A',
            color: getRandomColor()
        },{
            data: Array.from(new Array(6), () => Math.floor(Math.random()*100) + 15),
            name: '项目B',
            color: getRandomColor()
        }],
        xAxis: Array.from(new Array(6), (item, i) => (i + 1) + '月'),
        yAxis: v.interval,
        xAxisLength: 650,
        yAxisLength: 400,
        title: '某公司2019上半年业绩',
        unit: '万元'
    }, renderer);


    return {
        renderer: renderer,
        chart: chart
    };
}


























