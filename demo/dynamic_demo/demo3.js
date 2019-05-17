

function init3(v) {
    const World3 = new P2.World(document.getElementById("canvas2"), {
        size: v.size,
        offset: v.offset,
        gravity: [0, 0],
        linearDrag: [0, 0],
        angularDrag: 0.0
    });

    const maxBrickNum = 16,
          row = 7,
          width = v.size[0],
          height = v.size[1],
          brickWidth = width/maxBrickNum,
          brickHeight = 30;

    let x = 0, y = 0,
        isMouseInWorld = false,
        isGameStart = false,
        brokenBrickList = [];

    let b1 = new World3.body.BoundaryTop({
            restitution: 1,
            friction: 0
        }),
        b2 = new World3.body.BoundaryRight({
            restitution: 1,
            friction: 0
        });
        b4 = new World3.body.BoundaryLeft({
            restitution: 1,
            friction: 0
        });

    World3.append([b1, b2, b4]);
    
    for(let i = 0; i < row; i++) {
        for(let j = 0; j < maxBrickNum - i; j++) {
            World3.append(new World3.body.Rect({
                shape: {
                    pin: [i*(brickWidth/2) + j*brickWidth, i*brickHeight],
                    edge: [brickWidth, brickHeight],
                    color: '#928ea8',
                    shadow: '1 0 0 rgba(0,0,0,0.5)',
                },
                nature: {
                    static: 'total',
                    restitution: 1
                },
                collided() {
                    brokenBrickList.push(this);
                    World3.remove(this);
                    v.score += 10;
                }
            }));
        }
    }


    let base = new World3.body.Rect({
        shape: {
            pin: [width/2 - 75, height - 20],
            edge: [150, 20],
            color: getRandomColor(),
            zIndex: 1
        },
        nature: {
            static: 'total',
            restitution: 1
        }
    });

    let ball = new World3.body.Circle({
        shape: {
            pin: [width/2, height - 42],
            radius: 20,
            color: getRandomColor(),
            zIndex: 1
        },
        nature: {
            restitution: 1
        }
    });

    World3.append([base, ball]);

    World3.bind('mousemove', ev => {
        isMouseInWorld = true;
        x = ev.x;
        y = ev.y;
    });

    World3.bind('mouseover', ev => {
        isMouseInWorld = true;
    });

    World3.bind('mouseout', ev => {
        isMouseInWorld = false;
    });

    World3.addWorldStepFn(() => {
        if(isMouseInWorld) {
            if(!isGameStart) {
                ball.setPos([x, height - 40]);
                base.setPos([x, height - 10]);
            }
            else {
                base.setPos([x, height - 10]);

                if(ball.pos[1] - 25 > height) {
                    ball.setPos([base.pos[0], height - 40]);
                    ball.setLinearVel([0, 0]);
                    isGameStart = false;
                    v.score = 0;

                    World3.append(brokenBrickList);
                    brokenBrickList = [];
                }
            }
        }
    });


    World3.bind('click', ev => {
        if(!isGameStart) {
            isGameStart = true;
            ball.setLinearVel([5, -8]);
        };
    });

    return World3;
}

