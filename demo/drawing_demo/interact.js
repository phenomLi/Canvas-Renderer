
function interactDemo(v, index) {
    // 获取渲染器
    const R = new P2.Renderer(document.getElementById("canvas" + index), {
        size: v.size,
        offset: v.offset
    });

    class Interact {
        constructor() {
            this.curRect = null;
            this.dx = 0;
            this.dy = 0;

            this.render();
        }

        randomEdge() {
            return Math.ceil(Math.random()*100) + 30;
        }

        addRect() {
            let that = this;

            let rect = new R.shapes.Rectangle({
                pin: getRandomPos(v.size[0], v.size[1]),
                edge: [this.randomEdge(), this.randomEdge()],
                color: getRandomColor(),
                shadow: '10 0 0 rgba(0,0,0,0.5)',
                tag: false,
                onMouseDown(ev) {
                    if(!this.attr('tag')) {
                        this.attr('tag', true);
                        that.curRect = this;
    
                        that.dx = ev.x - this.attr('x');
                        that.dy = ev.y - this.attr('y');
                    }
                }
            });
        
            R.append(rect);
        }

        render() {
            let len = 10,
                that = this;
        
            for(let i = 0; i < len; i++) {
                this.addRect();
        
                R.bind('mousemove', ev => {
                    if(that.curRect && that.curRect.attr('tag')) {
                        let x = ev.x - that.dx, y = ev.y - that.dy;
        
                        if(x < 0) x = 0;
                        if(x > v.size[0]) x = v.size[0];
        
                        if(y < 0) y = 0;
                        if(y > v.size[1]) y = v.size[1];
        
        
                        that.curRect.attr('x', x).attr('y', y);
                    }
                });
        
                R.bind('mouseup', ev => {
                    if(that.curRect && that.curRect.attr('tag')) {
                        that.curRect.attr('tag', false);
                        v.curShape = that.curRect;
                        that.curRect = null;
                    }
                });
            }
        }
    }

    return {
        renderer: R,
        chart: new Interact()
    };
}





    




