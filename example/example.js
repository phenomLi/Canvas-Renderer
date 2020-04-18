let r = new R(document.getElementById('container'));

let circle = new r.shapes.Circle({
    pin: [300, 200],
    radius: 60,
    color: '#11999e'
});

let rect = new r.shapes.Rectangle({
    pin: [400, 400],
    edge: [160, 100],
    color: '#aa96da',
    rotate: 45
});

r.append([circle, rect]);



circle.attr('color', 'red');
rect.attr('opacity', '0.5');



let circleAnimation = new r.animation(circle, {
    duration: 1000,
    value: [300, 800],
    render: function(value) { this.attr('x', value) },
    timingFunction: 'easeOutBounce'
});

circleAnimation.next({
    duration: 1000,
    value: [200, 400],
    render: function(value) { this.attr('y', value) },
    timingFunction: 'easeOutBounce'
}).next({
    duration: 1000,
    value: [800, 300],
    render: function(value) { this.attr('x', value) },
    timingFunction: 'easeOutBounce'
}).next({
    duration: 1000,
    value: [400, 200],
    render: function(value) { this.attr('y', value) },
    timingFunction: 'easeOutBounce'
}).loop();

rect.animateTo({
    target: {
        rotate: 360
    },
    duration: 2000,
    timingFunction: 'easeOutElastic'
});