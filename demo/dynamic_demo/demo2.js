
function init2(c, v) {
    const World2 = new P2.World(document.getElementById("canvas1"), {
        width: c.offsetWidth,
        height: c.offsetHeight,
        gravity: [0, 6],
        linearDrag: [v.drag, 0],
        angularDrag: 0.05
    });

    let height = c.offsetHeight,
        cirList = [],
        vex = [[0, 0], [100, 60], [100, 90], [-100, 90], [-100, 60], [0, 0]];

    let b2 = new World2.body.BoundaryRight({});
        b4 = new World2.body.BoundaryLeft({});

    World2.append([b2, b4]);
  

    for(let i = 0; i < 5; i++) {
        let flag = i%2 === 0? 1: 0;
            
        for(let j = 0; j < 6; j++) {
            let tri = new World2.body.Polygon({
                shape: {
                    pin: [150*flag + j*300, 50 + i*150],
                    vex: vex,
                    color: '#999'
                },
                nature: {
                    static: 'total'
                }
            });

            World2.append(tri);
        }
    }

    

    World2.bind('click', ev => {
        let cir = new World2.body.Circle({
            shape: {
                pin: [ev.x - 180, ev.y],
                radius: 20,
                color: getRandomColor(),
                fill: false
            }
        });

        cirList.push(cir);

        World2.append(cir);
    });


    World2.addWorldStepFn(() => {
        cirList.map(item => {
            if(item.pos[1] > height + 50) {
                item.setPos([item.pos[0], -20]);
            }
        });
    });

    return World2;
}


