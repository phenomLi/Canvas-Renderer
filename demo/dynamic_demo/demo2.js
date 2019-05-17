
function init2(v) {
    const World2 = new P2.World(document.getElementById("canvas1"), {
        size: v.size,
        offset: v.offset,
        gravity: [0, 6],
        linearDrag: [v.drag, 0],
        angularDrag: 0.05
    });

    let height = v.size[1],
        cirList = [],
        vex = [[0, 0], [50, 50], [50, 70], [-50, 70], [-50, 50], [0, 0]];

    let b2 = new World2.body.BoundaryRight({});
        b4 = new World2.body.BoundaryLeft({});

    World2.append([b2, b4]);
  

    for(let i = 0; i < 6; i++) {
        let flag = i%2 === 0? 0: 1.9;
            
        for(let j = 0; j < 8; j++) {
            let tri = new World2.body.Polygon({
                shape: {
                    pin: [50*flag + j*190, 50 + i*120],
                    vex: vex,
                    color: '#7b7c68',
                    //shadow: '10 0 0 rgba(0,0,0,0.5)'
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
                pin: [ev.x, ev.y],
                radius: 20,
                color: getRandomColor(),
                //shadow: '10 0 0 rgba(0,0,0,0.5)'
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


