
function animationDemo(v, index) {
    // 获取渲染器
    const R = new P2.Renderer(document.getElementById("canvas" + index), {
        size: v.size,
        offset: v.offset
    });

    let rect = new R.shapes.Rectangle({
        pin: [150, 150],
        edge: [120, 120],
        color: '#bda29a',
        shadow: '10 0 0 rgba(0,0,0,0.5)'
    });

    R.append(rect);

    let animate = new R.animation(rect, {
        duration: 1500,
        timingFunction: 'easeOutBounce',
        value: [150, 400],
        render: function(v) {
            this.attr('x', v);
        }
    });

    animate.next({
        duration: 1500,
        timingFunction: 'easeOutBounce',
        value: [150, 400],
        render: function(v) {
            this.attr('y', v);
        }
    }).next({
        duration: 1500,
        timingFunction: 'easeOutBounce',
        value: [400, 150],
        render: function(v) {
            this.attr('x', v);
        }
    }).next({
        duration: 1500,
        timingFunction: 'easeOutBounce',
        value: [400, 150],
        render: function(v) {
            this.attr('y', v);
        }
    });

    animate.loop();


    let tri = new R.shapes.Triangle({
        pin: [1000, 100],
        edge: 150,
        color: '#928ea8',
        shadow: '10 0 0 rgba(0,0,0,0.5)'
    });


    R.append(tri);

    let animate1 = new R.animation(tri, {
        duration: 2000,
        value: [0, 360],
        render: function(v) {
            this.attr('rotate', v);
        }
    });

    animate1.loop();


    let cir = new R.shapes.Circle({
        pin: [1000, 500],
        radius: 60,
        color: '#e1e8c8',
        shadow: '10 0 0 rgba(0,0,0,0.5)'
    });

    R.append(cir);

    let animate2 = new R.animation(cir, {
        timingFunction: 'easeOut',
        duration: 2000,
        value: [[60, 100], [1, 0.5]],
        render: function(v1, v2) {
            this.attr('radius', v1).attr('opacity', v2);
        }
    });

    animate2.next({
        timingFunction: 'easeOut',
        duration: 2000,
        value: [[100, 60], [0.5, 1]],
        render: function(v1, v2) {
            this.attr('radius', v1).attr('opacity', v2);
        }
    });

    animate2.loop();


    let lineNum = 18;

    for(let i = 0; i < lineNum; i++) {
        let r = 100,
            center = [700, 300],
            angle = Math.PI*2/lineNum*i,
            x = center[ 0 ] + r*Math.sin(angle),
        	y = center[ 1 ] + r*Math.cos(angle);

        let l = new R.shapes.Line({
            range: [center, [x, y]],
            curveness: 0.3,
            percent: 0,
            color: getRandomColor()
        });

        R.append(l);

        let ani = new R.animation(l, {
            value: [0, 100],
            duration: 1000,
            timingFunction: 'easeOut',
            render: function(v) {
                this.attr('percent', v);
            }
        });

        ani.next({
            value: [100, 0],
            duration: 1000,
            timingFunction: 'easeOut',
            render: function(v) {
                this.attr('percent', v);
            }
        });

        ani.loop();
    }


    return {
        renderer: R,
        chart: null
    };
}





    




