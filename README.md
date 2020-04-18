## Renderer
该项目是我的本科毕业设计的其中一部分。本来当时打算做一个物理引擎，然后就想着肯定先要有一个简单的渲染器展示物理引擎的效果，结果越写越大越来越复杂，最后都占毕设的大头了，于是将他抽离出来成为单独的一个库。

<br />

## Getting Start
### 初始化 Renderer
在使用 Renderer 前需要初始化实例，具体方式是传入一个 DOM 容器：
```javascript
let r = new R(document.getElementById('container'));
```

<br />

### 在画布中添加元素
Renderer 提供了将近 14 种图形类型。以创建一个圆和矩形为例：
```javascript
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
```
![](https://github.com/phenomLi/Rendering-Engine/raw/master/images/微信截图_20200417232547.png)

创建了一个圆心在 [300, 200] 位置，半径为 60 像素的圆，和一个中心在 [400, 400] 位置，宽高为 [160, 100]，旋转角度为 45 度的矩形，并将它们添加到画布中。

<br />

### 修改图形元素属性
创建了图形元素之后，可以用 shape.attr('attrName') 获取图形的属性，但是如果需要对其进行修改，应该使用 shape.attr('attrName', value) 的形式修改。例子：
```javascript
circle.attr('color', 'red');
rect.attr('opacity', '0.5');
```
![](https://github.com/phenomLi/Rendering-Engine/raw/master/images/微信截图_20200418130749.png)

<br />

### 创建动画
可以使用 r.animation 和 shape.animateTo 的形式创建动画效果，例子：
```javascript
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
```
![](https://github.com/phenomLi/Rendering-Engine/raw/master/images/GIF.gif)

<br />

## TODO

- 加入描边（Stroke）属性

- append图形时进行缓存

- 加入颜色（color）相关操作

- 大量图形渲染的分帧绘制

- 高清处理
