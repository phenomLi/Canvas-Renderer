
function init1(v, index) {
    // 获取渲染器
    const renderer = new P2.Renderer(document.getElementById("canvas" + index), {
        size: v.size,
        offset: v.offset
    });

    class PieChart {
        constructor(opt) {
            this.r = renderer;

            this.categoryShowCount = 0;
            this.data = this.initCategory(opt.data);
            
            this.title = opt.title;
            
            this.origin = [this.r.getWidth()/2, this.r.getHeight()/2];

            this.max = this.calcMax();
            this.lastMax = this.max;
            this.angleInterval = this.calcAngleInterval();
            this.maxRadius = 140;

            this.tooltip = {
                shape: null,
                text: null,
                container: null
            };

            this.layer1 = 0;
            this.layer2 = 1;

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
                data.sector = null;
                data.r = 0;
                data.range = [];
                data.badge = null;
                data.badgeText = null;
                data.scale = false;

                this.categoryShowCount++;

                this.data.push(data);
            }

            return this.data;
        }


        initTooltip() {
            this.tooltip = this.createTooltip();
            this.r.append(this.tooltip.shape);
        }

        setTooltipText(tooltip, name, val) {
            let width = [];

            tooltip.textName.attr('content', name);
            tooltip.textVal.attr('content', val);

            width.push(tooltip.textName.getTextWidth());
            width.push(tooltip.textVal.getTextWidth());

            tooltip.container.attr('width', Math.max.apply(Math, width) + 15);
        }

        createTooltip() {
            let textName = new this.r.shapes.Text({
                pin: [8, 12],
                content: '',
                fontSize: 16,
                zIndex: this.layer2,
                color: '#fff'
            }),
            textVal = new this.r.shapes.Text({
                pin: [8, 34],
                content: '',
                fontSize: 16,
                zIndex: this.layer2,
                color: '#fff'
            }),
            container = new this.r.shapes.RoundRect({
                pin: [0, 3],
                edge: [0, 55],
                round: 3,
                zIndex: this.layer2,
                color: 'rgba(0, 0, 0, 0.5)'
            })

            return {
                textName,
                textVal,
                container: container,
                shape: new this.r.shapes.Composite({
                    pin: [0, 0],
                    center: [0, 0],
                    zIndex: this.layer2,
                    shapes: [
                        container, 
                        textName,
                        textVal,
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
   

        calcCircleRadius(val) {
            return val/this.max*this.maxRadius;
        }

        calcAngleInterval() {
            return 360/this.categoryShowCount;
        }

        calcMax() {
            return Math.max.apply(Math, this.data.map(item => {
                if(item.show) {
                    return item.data;
                }
                else {
                    return 0;
                }
            }));
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

            item.r = this.calcCircleRadius(item.data);
            item.range = [this.angleInterval*(itemIndex - 1), this.angleInterval*itemIndex];

            let sector = new this.r.shapes.Sector({
                pin: this.origin,
                radius: 0,
                range: item.range,
                color: item.color,
                shadow: '10 0 0 rgba(0,0,0,0.5)',
                opacity: 0.8,
                onMouseOver: function(ev) {
                    that.setTooltipText(
                        that.tooltip, 
                        `国家：${item.name}`,
                        `GDP：${item.data}`
                    );

                    that.tooltip.shape
                    .attr('show', true);

                    !item.scale && this.animateTo({
                        target: {
                            radius: item.r*1.3,
                            opacity: 1
                        },
                        duration: 300,
                        timingFunction: 'easeOutBounce'
                    }, () => {
                        item.scale = false;
                    });

                    item.scale = true;
                },
                onMouseOut: function(ev) {
                    that.tooltip.shape.attr('show', false);

                    !item.scale && this.animateTo({
                        target: {
                            radius: this.attr('radius')/1.3,
                            opacity: 0.8
                        },
                        duration: 300,
                        timingFunction: 'easeOutBounce'
                    }, () => {
                        item.scale = false;
                    });

                    item.scale = true;
                },
                onMouseMove: function(ev) {
                    that.tooltip.shape.attr('y', ev.y).attr('x', ev.x);
                }
            });

            item.sector = sector;

            this.r.append(sector);
           
            this.animateRadius(sector, item.data);

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
                pin: [200 + categoryIndex*120, this.origin[1] + 200],
                center: [0, 0],
                shapes: [rect, category.badge, category.badgeText]
            });

            this.r.append(label);
        }




        render() {
            this.drawTitle();
            this.data.map((item, index) => {
                this.drawCategory(item, index);
            });
        }



        reLayout() {
            let count = 0;

            this.max = this.calcMax();
            this.angleInterval = this.calcAngleInterval();

            this.data.map(item => {
                if(item.show) {
                    count++;
                    let range = [this.angleInterval*(count - 1), this.angleInterval*count];
                    this.animateRange(item.sector, range[0], range[1]);
                }
            });
            
            if(this.lastMax !== this.max) {
                this.data.map(item => {
                    if(item.show) {
                        this.animateRadius(item.sector, item.data);
                    }
                });
            }

            this.lastMax = this.max;
        }

 
        animateRadius(s, val) {
            let r = this.calcCircleRadius(val);

            s.animateTo({
                target: {
                    radius: r,
                },
                duration: 300,
                timingFunction: 'easeOut'
            });
        }


        animateRange(s, start, end) {
            let range = s.attr('range'),
                animate = new this.r.animation(s, {
                    duration: 500,
                    timingFunction: 'easeOut',
                    value: [[range[0], start], [range[1], end]],
                    render: function(v1, v2) {
                        this.attr('range', [v1, v2]);
                    }
                });
            
            animate.start();        
        }


        toggleCategory(category) {
            if(!category.show) {
                category.badge.attr('color', category.color);
                category.badgeText.attr('color', '#fff');

                this.categoryShowCount++;
                this.animateRadius(category.sector, category.data);
            }
            else {
                category.badge.attr('color', '#999');
                category.badgeText.attr('color', '#999');

                this.categoryShowCount--;
                this.animateRadius(category.sector, 0);
            }

            category.show = !category.show;
            this.reLayout();
        }

        addCategory(data) {
            this.data = this.initCategory(data);

            this.drawCategory(data, this.data.length - 1);

            this.reLayout();
        }
    }








    let color = ['#bcd3bb', '#e88f70', '#edc1a5', '#9dc5c8', '#e1e8c8', 
    '#7b7c68', '#e5b5b5', '#f0b489', '#928ea8', '#bda29a'];
    let country = ['美国', '中国', '日本', '德国', '英国', '法国', '印度', '意大利', '巴西', '加拿大'];


    const generateData = function() {
        return Math.ceil(Math.random()*20000000) + 10000000;
    };
    
    
    let chart = new PieChart({
        data: Array.from(new Array(6), (item, i) => {
            return {
                name: country[i],
                data: generateData(),
                color: color[i]
            };
        }),
        title: '虚拟各国GDP占比'
    }, renderer); 

    return {
        renderer: renderer,
        chart: chart
    };
}





    




