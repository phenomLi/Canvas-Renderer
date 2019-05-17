

function init1(v) {
    const World1 = new P2.World(document.getElementById("canvas0"), {
        size: v.size,
        offset: v.offset,
        gravity: [0, v.gravityY],
        linearDrag: [0.3, 0],
        angularDrag: 0.1
    })
    
    
    World1.bind('click', ev => {
        let cir = new World1.body.Circle({
            shape: {
                pin: [ev.x, ev.y],
                radius: Math.floor(Math.random()*20) + 30,
                color: getRandomColor(),
                fill: false,
                zIndex: 0
            }
        });
    
        World1.append(cir);
    
        let r = new World1.body.Rect({
            shape: {
                pin: [ev.x, ev.y],
                edge: [50, 50],
                color: getRandomColor(),
                fill: false,
                zIndex: 1
            }
        });
    
        World1.append(r);
    
        let t = new World1.body.Tri({
            shape: {
                pin: [ev.x, ev.y],
                edge: Math.floor(Math.random()*50) + 50,
                color: getRandomColor(),
                fill: false,
                zIndex: 2
            }
        });
    
        World1.append(t);
    });

    document.getElementById('rect').addEventListener('click', function() {
        let r = new World1.body.Rect({
            shape: {
                pin: getRandomPos(World1.getWidth(), World1.getHeight()),
                edge: [Math.floor(Math.random()*50) + 50, Math.floor(Math.random()*50) + 50],
                color: getRandomColor(),
                fill: false
            }
        });
    
        World1.append(r);
    });
    
    document.getElementById('cir').addEventListener('click', function() {
        let c = new World1.body.Circle({
            shape: {
                pin: getRandomPos(World1.getWidth(), World1.getHeight()),
                radius: Math.floor(Math.random()*20) + 30,
                color: getRandomColor(),
                fill: false
            }
        });
    
        World1.append(c);
    });
    
    document.getElementById('tir').addEventListener('click', function() {
        let t = new World1.body.Tri({
            shape: {
                pin: getRandomPos(World1.getWidth(), World1.getHeight()),
                edge: Math.floor(Math.random()*50) + 50,
                color: getRandomColor(),
                fill: false
            }
        });
    
        World1.append(t);
    });
    
    
    document.getElementById('concave').addEventListener('click', function() {
        let ca = new World1.body.Polygon({
            shape: {
                pin: getRandomPos(World1.getWidth(), World1.getHeight()),
                vex: [[0, 0], [50, 50], [100, 0], [100, 100], [0, 100], [0, 0]],
                color: getRandomColor(),
                fill: false
            }
        });
    
        World1.append(ca);
    });
    
    document.getElementById('convex').addEventListener('click', function() {
        let cv = new World1.body.Polygon({
            shape: {
                pin: getRandomPos(World1.getWidth(), World1.getHeight()),
                vex: [[0, 0], [50, -50], [100, 0], [100, 50], [0, 50], [0, 0]],
                color: getRandomColor(),
                fill: false
            }
        });
    
        World1.append(cv);
    });



    let b1 = new World1.body.BoundaryTop({}),
        b2 = new World1.body.BoundaryRight({});
        b3 = new World1.body.BoundaryBottom({}),
        b4 = new World1.body.BoundaryLeft({});


    World1.append([b1, b2, b3, b4]);

    return World1;
}

