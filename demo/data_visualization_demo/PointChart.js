
function init3(v, index) {

    // 获取渲染器
    const renderer = new P2.Renderer(document.getElementById("canvas" + index), {
        size: v.size,
        offset: v.offset
    });

    class PointChart {
        constructor(opt) {
            this.r = renderer;

            this.categoryShowCount = 0;
            this.lastCategoryShowCount = 0;
            this.data = this.initCategory(opt.data);
            this.timelineStart = opt.timeline.start;
            this.timelineEnd = opt.timeline.end;
            this.timelineDotNum = opt.timeline.length;

            this.title = opt.title;
            this.unit = opt.unit;
            this.xAxis = opt.xAxis;
            this.yAxis = opt.yAxis;

            this.yMaxVal = this.calcMaxVal('y', 'age');
            this.xMaxVal = this.calcMaxVal('x', 'income');

            this.xAxisIntervalNum = Math.ceil(this.xMaxVal/this.xAxis) + 1;
            this.yAxisIntervalNum = Math.ceil(this.yMaxVal/this.yAxis) + 1;

            this.xAxisLength = opt.xAxisLength;
            this.yAxisLength = opt.yAxisLength;
            this.origin = [this.r.getWidth()/2 - this.xAxisLength/2, this.r.getHeight()/2 + this.yAxisLength/2];
            
            this.xAxisIntervalLength = this.xAxisLength/this.xAxisIntervalNum;
            this.yAxisIntervalLength = this.yAxisLength/this.yAxisIntervalNum;

            this.xMax = this.xAxisIntervalLength*(this.xAxisIntervalNum - 1);
            this.yMax = this.yAxisIntervalLength*(this.yAxisIntervalNum - 1);

            this.timelineLength = this.yAxisLength + 80;
            this.timelineLeft = this.origin[0] + this.xAxisLength + 180;
            this.timelineTop = this.origin[1] - this.yAxisLength - 30;
            this.timelineInterval = this.timelineLength/(this.timelineDotNum - 1);

            this.timeLine = null;
            this.timeLineDot = null;
            this.isTimeLineDotClick = false;

            this.tooltip = {
                shape: null,
                text: null,
                container: null
            };

            this.curYearIndex = 0;
            this.play = false;

            this.layer1 = 0;
            this.layer2 = 1;
            this.layer3 = 2;
            this.layer4 = 3;

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
                data.circle = null;
                data.badge = null;
                data.badgeText = null;

                this.categoryShowCount++;

                this.data.push(data);
            }

            return this.data;
        }


        initTooltip() {
            this.tooltip = this.createTooltip();
            this.r.append(this.tooltip.shape);
        }

        setTooltipText(tooltip, country, income, age, popular) {
            let width = [];

            tooltip.textCountry.attr('content', country);
            tooltip.textIncome.attr('content', income);
            tooltip.textAge.attr('content', age);
            tooltip.textPopular.attr('content', popular);

            width.push(tooltip.textCountry.getTextWidth());
            width.push(tooltip.textIncome.getTextWidth());
            width.push(tooltip.textAge.getTextWidth());
            width.push(tooltip.textPopular.getTextWidth());

            tooltip.container.attr('width', Math.max.apply(Math, width) + 15);
        }

        createTooltip() {
            let textCountry = new this.r.shapes.Text({
                pin: [8, 12],
                content: '',
                fontSize: 16,
                zIndex: this.layer4,
                color: '#fff'
            }),
            textIncome = new this.r.shapes.Text({
                pin: [8, 34],
                content: '',
                fontSize: 16,
                zIndex: this.layer4,
                color: '#fff'
            }),
            textAge = new this.r.shapes.Text({
                pin: [8, 56],
                content: '',
                fontSize: 16,
                zIndex: this.layer4,
                color: '#fff'
            }),
            textPopular = new this.r.shapes.Text({
                pin: [8, 78],
                content: '',
                fontSize: 16,
                zIndex: this.layer4,
                color: '#fff'
            }),
            container = new this.r.shapes.RoundRect({
                pin: [0, 3],
                edge: [0, 100],
                round: 3,
                zIndex: this.layer4,
                color: 'rgba(0, 0, 0, 0.5)'
            })

            return {
                textCountry,
                textIncome,
                textAge,
                textPopular,
                container: container,
                shape: new this.r.shapes.Composite({
                    pin: [0, 0],
                    center: [0, 0],
                    zIndex: this.layer4,
                    shapes: [
                        container, 
                        textCountry,
                        textIncome,
                        textAge,
                        textPopular
                    ],
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
   

        calcCircleRadius(popular) {
            let y = Math.sqrt(popular/5e8);
            return y * 80;
        }

        calcMaxVal(type, name) {
            if(type === 'y') {
                let maxVal = Math.max.apply(Math, this.data.map(item => Math.max.apply(Math, item.data.map(i => i[name]))));
                return Math.ceil(maxVal/this.yAxis)*this.yAxis;
            }
            else {
                let maxVal = Math.max.apply(Math, this.data.map(item => Math.max.apply(Math, item.data.map(i => i[name]))));
                return Math.ceil(maxVal/this.xAxis)*this.xAxis;
            }
        }

        calcPos(income, age) {
            let x = this.origin[0] + (income/this.xMaxVal)*this.xAxisLength,
                y = this.origin[1] - (age/this.yMaxVal)*this.yAxisLength;

            return [x, y];
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

        drawCategory(item, itemIndex) {
            let that = this;

            let circle = new this.r.shapes.Circle({
                pin: this.calcPos(item.data[this.curYearIndex].income, item.data[this.curYearIndex].age),
                radius: 0,
                color: item.color,
                shadow: '10 0 0 rgba(0,0,0,0.5)',
                opacity: 0.6,
                zIndex: this.layer2,
                onMouseOver: function(ev) {
                    this.attr('zIndex', that.layer3);

                    this.animateTo({
                        target: {
                            opacity: 1
                        },
                        duration: 200
                    });

                    that.setTooltipText(
                        that.tooltip, 
                        `国家：${item.name}`,
                        `人均收入：${item.data[that.curYearIndex].income}`,
                        `人均寿命：${item.data[that.curYearIndex].age}`,
                        `人口：${item.data[that.curYearIndex].popular}`,
                    );

                    that.tooltip.shape
                    .attr('show', true);

                    this.animateTo({
                        target: {
                            radius: this.attr('radius')*1.3,
                        },
                        duration: 300,
                        timingFunction: 'easeOutBounce'
                    });
                },
                onMouseOut: function(ev) {
                    this.attr('zIndex', that.layer2);

                    this.animateTo({
                        target: {
                            opacity: 0.5
                        },
                        duration: 200
                    });

                    that.tooltip.shape.attr('show', false);

                    this.animateTo({
                        target: {
                            radius: this.attr('radius')/1.3,
                        },
                        duration: 300,
                        timingFunction: 'easeOutBounce'
                    });
                },
                onMouseMove: function(ev) {
                    that.tooltip.shape.attr('y', ev.y).attr('x', ev.x);
                }
            });

            item.circle = circle;

            this.r.append(circle);
           
            this.animateCircleRadius(circle, item.data[this.curYearIndex].popular);

            this.drawControlBoardItem(item, itemIndex);
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

            let unit1 = new this.r.shapes.Text({
                pin:[0, this.origin[1] + 40],
                content: this.unit[0],
                color: '#ccc',
                fontSize: 15
            }),
            unit2 = new this.r.shapes.Text({
                pin:[0, this.origin[1] - this.yAxisLength - 40],
                content: this.unit[1],
                color: '#ccc',
                fontSize: 15
            })

            unit1.attr('x', this.origin[0] + this.xAxisLength/2 - unit1.getTextWidth()/2);
            unit2.attr('x', this.origin[0] - unit2.getTextWidth());

            this.r.append([unit1, unit2]);
        }

        drawXLabel() {
            for(let i = 1; i < this.xAxisIntervalNum + 1; i++) {
                let x = (this.origin[0] + this.xAxisIntervalLength*i), y = this.origin[1] + 5,
                    dot = this.createLine({
                        range: [[x, this.origin[1]], [x, y]], 
                        color: '#ccc'
                    }),
                    text = new this.r.shapes.Text({
                        pin:[0, 0],
                        content: this.xAxis*i,
                        color: '#ccc',
                        fontSize: 15
                    });
    
                text
                .attr('y', this.origin[1] + 25 - text.getTextHeight())
                .attr('x', this.origin[0] + i*this.xAxisIntervalLength - text.getTextWidth()/2 - 4);

                this.r.append([text, dot]);
            }
        }

        drawYLabel() {
            for(let j = 1; j < this.yAxisIntervalNum + 1; j++) {
                let y = (this.origin[1] - this.yAxisIntervalLength*j), x = this.origin[0] - 5,
                    dot = this.createLine({
                        range: [[x, y], [this.origin[0], y]], 
                        color: '#ccc'
                    }),
                    text = new this.r.shapes.Text({
                        pin:[0, 0],
                        content: this.yAxis*j,
                        color: '#ccc',
                        fontSize: 15
                    });
    
                text
                .attr('x', this.origin[0] - 20 - text.getTextWidth())
                .attr('y', this.origin[1] - j*this.yAxisIntervalLength - text.getTextHeight()/2 - 4);
    
                this.r.append([text, dot]);
            }
        }


        drawTimeline() {
            let interval = (this.timelineEnd - this.timelineStart)/(this.timelineDotNum),
                that = this;

            this.timeLine = this.createLine({
                range: [
                    [this.timelineLeft, this.timelineTop],
                    [this.timelineLeft, this.timelineTop + this.timelineLength]
                ],
                color: '#666',
                lineWidth: 4
            });

            this.timeLineDot = new this.r.shapes.Circle({
                pin: [this.timelineLeft, this.timelineTop],
                radius: 8,
                shadow: '10 0 0 rgba(0,0,0,0.5)',
                color: '#ccc',
                zIndex: this.layer4,
                onMouseDown: function(ev) {
                    that.isTimeLineDotClick = true;
                    that.play = false;
                }
            });

            this.r.bind('mouseup', () => {
                if(this.isTimeLineDotClick) {
                    that.isTimeLineDotClick = false;
                    that.play = true;

                    this.curYearIndex = Math.ceil((this.timeLineDot.attr('y') - this.timelineTop)/this.timelineInterval);
                    this.setTimeStep(this.curYearIndex);
                }
            });

            this.r.bind('mousemove', (ev) => {
                if(this.isTimeLineDotClick) {

                    let len = this.timelineInterval*Math.round((ev.y - this.timelineTop)/this.timelineInterval),
                        y = this.timelineTop + len;

                    if(y > this.timelineTop + this.timelineLength) y = this.timelineTop + this.timelineLength;
                    if(y < this.timelineTop) y = this.timelineTop; 

                    this.timeLineDot.attr('y', y);
                }
            });

            this.r.append([this.timeLine, this.timeLineDot]);

            for(let i = 0; i < this.timelineDotNum; i++) {
                let y = this.timelineInterval*i + this.timelineTop;

                let line = this.createLine({
                    range: [[this.timelineLeft - 4, y], [this.timelineLeft + 4, y]],
                    color: '#777'
                }),
                text = new this.r.shapes.Text({
                    pin: [this.timelineLeft + 16, y - 7],
                    content: (this.timelineStart + i*interval),
                    color: '#ccc',
                    fontSize: 12
                });

                this.r.append([line, text]);
            }
        }


        render() {
            this.drawTitle();
            this.drawCoordinate();
            this.data.map((item, index) => {
                this.drawCategory(item, index);
            });

            this.drawTimeline();
            this.startTimeline();
        }



        setTimeStep(curTime) {
            this.data.map(item => {
                if(item.show) {
                    let income = item.data[curTime].income,
                    age = item.data[curTime].age,
                    popular = item.data[curTime].popular;

                    this.animateCircelPos(item.circle, income, age);
                    this.animateCircleRadius(item.circle, popular);
                }
            });
        }

        startTimeline() {
            this.play = true;

            setInterval(() => {
                if(!this.play) return;

                let timeLineDotY = this.timeLineDot.attr('y') + this.timelineInterval;
                this.curYearIndex++;

                if(this.curYearIndex === this.timelineDotNum) {
                    this.curYearIndex = 0;
                    timeLineDotY = this.timelineTop;
                }
                
                this.setTimeStep(this.curYearIndex);

                this.timeLineDot.animateTo({
                    target: {
                        y: timeLineDotY
                    },
                    duration: 250,
                    timingFunction: 'easeOut'
                });

            }, 1200)
        }



        animateCircleRadius(c, val) {
            let r = this.calcCircleRadius(val);

            c.animateTo({
                target: {
                    radius: r,
                },
                duration: 300,
                timingFunction: 'easeOut'
            });
        }

        animateCircelPos(c, income, age) {
            let newPos = this.calcPos(income, age);

            c.animateTo({
                target: {
                    x: newPos[0],
                    y: newPos[1]
                },
                duration: 500,
                timingFunction: 'easeInOut'
            });
        }


        toggleCategory(category) {
            if(!category.show) {
                category.badge.attr('color', category.color);
                category.badgeText.attr('color', '#fff');

                let pos = this.calcPos(category.data[this.curYearIndex].income, category.data[this.curYearIndex].age);

                category.circle.attr('x', pos[0]).attr('y', pos[1]);
                this.animateCircleRadius(category.circle, category.data[this.curYearIndex].popular);

                this.categoryShowCount++;
            }
            else {
                category.badge.attr('color', '#999');
                category.badgeText.attr('color', '#999');
                this.animateCircleRadius(category.circle, 0);

                this.categoryShowCount--;
            }

            category.show = !category.show;
        }

        pause() {
            this.play = false;
        }

        start() {
            this.play = true;
        }
    }











    let dataLength = 20;
    let color = ['#bcd3bb', '#e88f70', '#edc1a5', '#9dc5c8', '#e1e8c8', 
    '#7b7c68', '#e5b5b5', '#f0b489', '#928ea8', '#bda29a'];
    let country = ['美国', '中国', '日本', '德国', '英国', '法国', '印度', '意大利', '巴西', '加拿大'];

    const posnav = function(flag) {
        return Math.random() > 0.5? 1: -1;
    }

    const generateData = function(length) {
        let lastIncome = 5000,
            lastPopular = Math.ceil(Math.random()*20000000) + 500000,
            lastAge = 8 + Math.ceil(Math.random()*30);

        return Array.from(new Array(length), (item, i) => {
            lastIncome = lastIncome + Math.ceil(Math.random()*5000);
            lastPopular = lastPopular + Math.ceil(Math.random()*Math.random()*30000000) + posnav()*5000000;
            lastAge = lastAge + Math.ceil(Math.random()*3);

            return {
                income: lastIncome,
                popular: lastPopular,
                age: lastAge
            };
        });
    };
    
    
    let chart = new PointChart({
        data: Array.from(new Array(8), (item, i) => {
            return {
                name: country[i],
                data: generateData(dataLength),
                color: color[i]
            };
        }),
        xAxis: 20000,
        yAxis: 20,
        timeLine: Array.from(new Array(dataLength), (item, i) => 1960 + i*2),
        xAxisLength: 650,
        yAxisLength: 400,
        title: '虚拟各国人均寿命与人均收入关系演变',
        unit: ['人均收入（美元）', '平均寿命（岁）'],
        timeline: {
            start: 1960,
            end: 2020,
            length: dataLength
        }
    }, renderer); 

    return {
        renderer: renderer,
        chart: chart
    };
}





    




