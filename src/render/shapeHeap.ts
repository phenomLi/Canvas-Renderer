import { ShapeType } from './LayerManager';


// 画布元素堆
export class shapeHeap {
    // 容器长宽
    private containerSize: number[]; 
    // canvas上下文对象
    private ctx: CanvasRenderingContext2D;
    // 图形堆数组
    private shapeHeapArray: Array<ShapeType> = new Array();
    // 异步更新请求计数器
    private aSyncUpdateRequestCount: number;
    // 更新请求次数
    private updateRequestCount: number;

    constructor(ctx: CanvasRenderingContext2D, containerSize: number[]) {
        this.ctx = ctx;
        this.containerSize = containerSize;
        this.aSyncUpdateRequestCount = 0;
        this.updateRequestCount = 0;
    }

    public append(shape: ShapeType) {
        this.shapeHeapArray.push(shape);

        // 更改图形toggleMounted状态
        shape.toggleMount(true);
    }

    public remove(shape: ShapeType) {
        let id = shape.attr('id');

        // 将要 remove 的图形在 shapeHeapArray 中去除
        this.shapeHeapArray.map((item, index) => {
            if(item.attr('id') === id) {
                this.shapeHeapArray.splice(index, 1);
            }
        });

        // 更改图形toggleMounted状态
        shape.toggleMount(false);
    }

    public clear() {
        this.shapeHeapArray.map(item => {
            item.toggleMount(false);
        });

        this.shapeHeapArray = [];
        this.ctx.clearRect(0, 0, this.containerSize[0], this.containerSize[1]);
    }

    /** 更新画布 */
    public update() {
 
        this.updateRequestCount++;

        // 异步更新
        requestAnimationFrame(() => {
            this.aSyncUpdateRequestCount++;

            if(this.aSyncUpdateRequestCount === this.updateRequestCount) {
                this.updateRequestCount = this.aSyncUpdateRequestCount = 0;
                this.reRender();
            }
        });
    }

    public reRender() {
        this.ctx.clearRect(0, 0, this.containerSize[0], this.containerSize[1]);

        for(let i = 0, len = this.shapeHeapArray.length; i < len; i++) {
            this.ctx.save();
            this.shapeHeapArray[i].render(this.ctx);
            this.ctx.restore();
        }
    }
}