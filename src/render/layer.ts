import { shapeHeap } from './shapeHeap';
import { ShapeType } from './LayerManager';



export default class Layer {
    private zIndex: number;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private shapeHeap: shapeHeap;

    // 图形个数
    private count: number;

    constructor(zIndex: number, defaultZIndex: number, container: HTMLElement, containerSize: number[]) {
        this.zIndex = zIndex;
        this.canvas = this.createCanvasElement(zIndex, defaultZIndex, container, containerSize);
        this.ctx = this.canvas.getContext('2d');
        this.shapeHeap = new shapeHeap(this.ctx, containerSize);

        this.count = 0;
    }

    private createCanvasElement(zIndex: number, defaultZIndex: number, container: HTMLElement, containerSize: number[]) {
        let canvas = document.createElement('canvas');

        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.width = containerSize[0];
        canvas.height = containerSize[1];
        canvas.style.zIndex = (zIndex + defaultZIndex).toString();

        container.appendChild(canvas);

        return canvas;
    }


    /**---------------------公开方法----------------------- */

    public getCount(): number {
        return this.count;
    }

    public getCTX(): CanvasRenderingContext2D {
        return this.ctx;
    }

    public append(shape: ShapeType): void {
        this.shapeHeap.append(shape);
        this.update();

        // 更新画布中图形数量
        this.count += shape.getCount();
    }

    public remove(shape: ShapeType): void {
        this.shapeHeap.remove(shape);
        this.update();

        // 更新画布中图形数量
        this.count -= shape.getCount();
    }

    public update(): void {
        this.shapeHeap.update();
    }

    public clear(): void {
        this.count = 0;
        this.shapeHeap.clear();
    }

    public getCanvasElement(): HTMLCanvasElement {
        return this.canvas;
    }
}