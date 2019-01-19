

// properties管理器，用作添加或者删除properties
const PropertiesManager = {
    baseProp: {
        writableProperties: [],
        readonlyProperties: [],
        animateProperties: [],
        notRePathProperties: [],
        readableProperties: []
    },

    init() {
        this.baseProp.writableProperties = ['x', 'y', 'color', 'fill', 'opacity', 'rotate', 'transform', 'show'];
        this.baseProp.readonlyProperties = ['id', 'type', 'center'];
        this.baseProp.animateProperties = ['x', 'y', 'color', 'opacity', 'rotate'];
        this.baseProp.notRePathProperties = ['color', 'fill', 'opacity', 'show'];
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
    Circle: (() => {
        PropertiesManager.init();

        PropertiesManager['writableProperties']('add', 'radius');
        PropertiesManager['animateProperties']('add', 'radius');

        return PropertiesManager.get();
    })(),
    Ellipse: (() => {
        PropertiesManager.init();
        PropertiesManager['writableProperties']('add', ['radiusX', 'radiusY']);
        PropertiesManager['writableProperties']('remove', 'transform');
        PropertiesManager['animateProperties']('add', ['radiusX', 'radiusY']);

        return PropertiesManager.get();
    })(),
    Rectangle: (() => {
        PropertiesManager.init();
        PropertiesManager['writableProperties']('add', ['width', 'height']);
        PropertiesManager['animateProperties']('add', ['width', 'height']);

        return PropertiesManager.get();
    })(),
    RoundRect: (() => {
        PropertiesManager.init();
        PropertiesManager['writableProperties']('add', ['round', 'height', 'width']);
        PropertiesManager['animateProperties']('add', ['round', 'height', 'width']);

        return PropertiesManager.get();
    })(),
    Triangle: (() => {
        PropertiesManager.init();
        PropertiesManager['writableProperties']('add', 'edge');
        PropertiesManager['animateProperties']('add', 'edge');

        return PropertiesManager.get();
    })(),
    Custom: PropertiesManager.init().get(),
    SVGPath: PropertiesManager.init()['writableProperties']('add', 'svgPath').get(),
    Text: (() => {
        PropertiesManager.init();
        PropertiesManager['writableProperties']('remove', 'transform');
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
