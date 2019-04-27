

// properties管理器，用作添加或者删除properties
const PropertiesManager = {
    baseProp: {
        // 可写属性
        writableProperties: [],
        // 只读属性
        readonlyProperties: [],
        // 可动画属性
        animateProperties: [],
        // 不用重新绘制路径的属性
        notRePathProperties: [],
        // 可读
        readableProperties: [],
        // 必填属性
        requiredProperties: []
    },

    init() {
        this.baseProp.writableProperties = ['x', 'y', 'color', 'fill', 'opacity', 'rotate', 'scale', 'show', 'zIndex', 'lineWidth'];
        this.baseProp.readonlyProperties = ['id', 'type', 'center', 'tag'];
        this.baseProp.animateProperties = ['x', 'y', 'color', 'opacity', 'rotate', 'lineWidth'];
        this.baseProp.notRePathProperties = ['color', 'fill', 'opacity', 'show', 'lineWidth'];
        this.baseProp.requiredProperties = ['pin'];
        this.baseProp.readableProperties = [];

        return this;
    },

    handle(op: string, p: string, prop: string | string[]) {
        switch(op) {
            case 'add': {
                this.add(p, prop);
                break;
            }
            case 'remove': {
                this.remove(p, prop);
                break;
            }
            case 'replace': {
                this.baseProp[p] = prop;
                break;
            }
        } 
    },

    writableProperties(op: string, prop: string | string[]) {
        this.handle(op, 'writableProperties', prop);
        return this;
    },
    readonlyProperties(op: string, prop: string | string[]) {
        this.handle(op, 'readonlyProperties', prop);
        return this;
    },
    animateProperties(op: string, prop: string | string[]) {
        this.handle(op, 'animateProperties', prop);
        return this;
    },
    notRePathProperties(op: string, prop: string | string[]) {
        this.handle(op, 'notRePathProperties', prop);
        return this;
    },

    requiredProperties(op: string, prop: string | string[]) {
        this.handle(op, 'requiredProperties', prop);
        return this;
    },

    add(p: string, prop: string | string[]) {
        Array.isArray(prop)?
            prop.map(item => this.baseProp[p].push(item)):
            this.baseProp[p].push(prop);

        return this;
    },


    remove(p: string, prop: string | string[]) {
        Array.isArray(prop)?
            prop.map(item => {
                this.baseProp[p].splice(this.baseProp[p].findIndex(i => i === item), 1);
            }):
            this.baseProp[p].splice(this.baseProp[p].findIndex(item => item === prop), 1)

        return this;
    },


    merge(prop1, prop2) {
        return prop1.concat(prop2);
    },


    get() {
        return {
            ...this.baseProp,
            readableProperties: this.merge(this.baseProp.readonlyProperties, this.baseProp.writableProperties)
        };
    }
};




export default {
    Line: (() => {
        let baseProp = {};

        baseProp['writableProperties'] = ['color', 'opacity', 'show', 'zIndex', 'lineWidth', 'range'];
        baseProp['readonlyProperties'] = ['id', 'type', 'tag'];
        baseProp['animateProperties'] = [];
        baseProp['notRePathProperties'] = ['color', 'opacity', 'show', 'lineWidth'];
        baseProp['requiredProperties'] = ['range'];
        baseProp['readableProperties'] = ['color', 'opacity', 'show', 'zIndex', 'lineWidth', 'id', 'type', 'tag', 'range'];

        return baseProp;
    })(),
    Circle: (() => {
        PropertiesManager.init();

        PropertiesManager['writableProperties']('add', 'radius');
        PropertiesManager['animateProperties']('add', 'radius');
        PropertiesManager['requiredProperties']('add', 'radius');

        return PropertiesManager.get();
    })(),
    Ring: (() => {
        PropertiesManager.init();

        PropertiesManager['writableProperties']('add', ['radius', 'width']);
        PropertiesManager['animateProperties']('add', ['radius', 'width']);
        PropertiesManager['requiredProperties']('add', ['radius', 'width']);

        return PropertiesManager.get();
    })(),
    Sector: (() => {
        PropertiesManager.init();

        PropertiesManager['writableProperties']('add', ['radius', 'range']);
        PropertiesManager['animateProperties']('add', ['radius', 'range']);
        PropertiesManager['requiredProperties']('add', ['radius', 'range']);

        return PropertiesManager.get();
    })(),
    Ellipse: (() => {
        PropertiesManager.init();
        PropertiesManager['writableProperties']('add', ['radiusX', 'radiusY']);
        PropertiesManager['animateProperties']('add', ['radiusX', 'radiusY']);
        PropertiesManager['requiredProperties']('add', 'radius');

        return PropertiesManager.get();
    })(),
    Rectangle: (() => {
        PropertiesManager.init();
        PropertiesManager['writableProperties']('add', ['width', 'height']);
        PropertiesManager['animateProperties']('add', ['width', 'height']);
        PropertiesManager['requiredProperties']('add', 'edge');
        PropertiesManager['readonlyProperties']('add', 'vex');

        return PropertiesManager.get();
    })(),
    RoundRect: (() => {
        PropertiesManager.init();
        PropertiesManager['writableProperties']('add', ['round', 'height', 'width']);
        PropertiesManager['animateProperties']('add', ['round', 'height', 'width']);
        PropertiesManager['requiredProperties']('add', ['round', 'edge']);

        return PropertiesManager.get();
    })(),
    Triangle: (() => {
        PropertiesManager.init();
        PropertiesManager['writableProperties']('add', 'edge');
        PropertiesManager['animateProperties']('add', 'edge');
        PropertiesManager['requiredProperties']('add', 'edge');
        PropertiesManager['readonlyProperties']('add', 'vex');

        return PropertiesManager.get();
    })(),
    Polygon: (() => {
        PropertiesManager.init();
        PropertiesManager['writableProperties']('add', 'vex');
        PropertiesManager['requiredProperties']('add', 'vex');

        return PropertiesManager.get();
    })(),
    Custom: (() => {
        PropertiesManager.init();
        return PropertiesManager.get();
    })(),
    SVGPath: (() => {
        PropertiesManager.init()
        PropertiesManager['writableProperties']('add', 'svgPath');
        PropertiesManager['requiredProperties']('add', ['svgPath', 'center']);
         
        return PropertiesManager.get();
    })(),
    Text: (() => {
        PropertiesManager.init();
        PropertiesManager['writableProperties']('add', ['align', 'dir', 'content', 'fontSize']);
        PropertiesManager['animateProperties']('add', 'fontSize');

        PropertiesManager['notRePathProperties']('replace', PropertiesManager.merge(
            PropertiesManager.baseProp['writableProperties'],
            PropertiesManager.baseProp['readonlyProperties']
        ));

        return PropertiesManager.get();
    })(),
    Composite: (() => {
        PropertiesManager.init();
        PropertiesManager['writableProperties']('remove', ['color', 'fill', 'opacity']);
        PropertiesManager['animateProperties']('remove', ['color', 'opacity']);
        PropertiesManager['notRePathProperties']('remove', ['color', 'fill', 'opacity']);

        PropertiesManager['requiredProperties']('add', 'center');

        return PropertiesManager.get();
    })(),
    Group: (() => {
        PropertiesManager.init();
        PropertiesManager['readonlyProperties']('remove', 'center');
        PropertiesManager['writableProperties']('replace', ['show']);
        PropertiesManager['animateProperties']('replace', []);
        PropertiesManager['notRePathProperties']('replace', ['show']);

        return PropertiesManager.get();
    })()
};
