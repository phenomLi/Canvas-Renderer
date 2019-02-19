
/* 
    [[a, c, e]
    [b, d, f]]
*/
type matrixArray = Array<number[]>;
// 矩阵或者svg矩阵
type matrixType = DOMMatrix | ArrayMatrix;

// 矩阵类
class ArrayMatrix {
    a: number;
    b: number;
    c: number;
    d: number;
    e: number;
    f: number;

    constructor(matrixArray?: matrixArray) {
        if(matrixArray && matrixArray.length) {
            this.a = matrixArray[0][0];
            this.b = matrixArray[1][0];
            this.c = matrixArray[0][1];
            this.d = matrixArray[1][1];
            this.e = matrixArray[0][2];
            this.f = matrixArray[1][2];
        }
        else {
            this.a = 1;
            this.b = 0;
            this.c = 0;
            this.d = 1;
            this.e = 0;
            this.f = 0;
        }
    }
}

// 矩阵工具包
export const Matrix = {
    // 初始化矩阵为单位矩阵
    init(matrix: matrixType) {
        matrix.a = 1;
        matrix.b = 0;
        matrix.c = 0;
        matrix.d = 1;
        matrix.e = 0;
        matrix.f = 0;
    },

    // 设置矩阵的值
    set(matrix: matrixType, matrixArray: matrixArray) {
        matrix.a = matrixArray[0][0];
        matrix.b = matrixArray[1][0];
        matrix.c = matrixArray[0][1];
        matrix.d = matrixArray[1][1];
        matrix.e = matrixArray[0][2];
        matrix.f = matrixArray[1][2];
    },

    // 矩阵相乘 
    // m1左，m2右
    mul(m1: matrixType, m2: matrixType, m: matrixType) {
        m.a = m1.a*m2.a + m1.c*m2.b;
        m.b = m1.b*m2.a + m1.d*m2.b;
        m.c = m1.a*m2.c + m1.c*m2.d;
        m.d = m1.b*m2.c + m1.d*m2.d;
        m.e = m1.a*m2.e + m1.c*m2.f + m1.e;
        m.f = m1.b*m2.e + m1.d*m2.f + m1.f;
    },

    // 矩阵相加
    add(m1: matrixType, m2: matrixType, m: matrixType) {
        m.a = m1.a + m2.a;
        m.b = m1.b + m2.b;
        m.c = m1.c + m2.c;
        m.d = m1.d + m2.d;
        m.e = m1.e + m2.e;
        m.f = m1.f + m2.f;
    },

    // 创建普通矩阵
    create(matrixArray?: matrixArray): ArrayMatrix {
        return new ArrayMatrix(matrixArray);
    },

    // 创建svg矩阵
    createSVGMatrix(matrixArray?: matrixArray): DOMMatrix {
        let m = document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGMatrix();

        if(matrixArray && matrixArray.length) {
            m.a = matrixArray[0][0];
            m.b = matrixArray[1][0];
            m.c = matrixArray[0][1];
            m.d = matrixArray[1][1];
            m.e = matrixArray[0][2];
            m.f = matrixArray[1][2];
        }

        return m;
    }
};


// 4个svg矩阵：旋转矩阵, 缩放矩阵, 位移矩阵, 结果矩阵
export const RotateMatrix = Matrix.createSVGMatrix();
export const ScaleMatrix = Matrix.createSVGMatrix();
export const TranslateMatrix = Matrix.createSVGMatrix();
export const ResultMatrix = Matrix.createSVGMatrix();