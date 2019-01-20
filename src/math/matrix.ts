
/* 
    [[a, c, e]
    [b, d, f]]
*/
type matrixArray = Array<number[]>;
// 矩阵或者svg矩阵
type matrixType = DOMMatrix | Matrix;


export default class Matrix {
    a: number;
    b: number;
    c: number;
    d: number;
    e: number;
    f: number;

    constructor(matrixArray?: matrixArray) {
        if(matrixArray === undefined) {
            this.a = 1;
            this.b = 0;
            this.c = 0;
            this.d = 1;
            this.e = 0;
            this.f = 0;
        }
        else {
            this.a = matrixArray[0][0];
            this.b = matrixArray[1][0];
            this.c = matrixArray[0][1];
            this.d = matrixArray[1][1];
            this.e = matrixArray[0][2];
            this.f = matrixArray[1][2];
        }
    }
}

// 矩阵相乘 
// m1左，m2右
Matrix['mult'] = function(m1: matrixType, m2: matrixType, m: matrixType) {
    m.a = m1.a*m2.a + m1.c*m2.b;
    m.b = m1.b*m2.a + m1.d*m2.b;
    m.c = m1.a*m2.c + m1.c*m2.d;
    m.d = m1.b*m2.c + m1.d*m2.d;
    m.e = m1.a*m2.e + m1.c*m2.f + m1.e;
    m.f = m1.b*m2.e + m1.d*m2.f + m1.f;
}

// 矩阵相加
Matrix['add'] = function(m1: matrixType, m2: matrixType, m: matrixType) {
    m.a = m1.a + m2.a;
    m.b = m1.b + m2.b;
    m.c = m1.c + m2.c;
    m.d = m1.d + m2.d;
    m.e = m1.e + m2.e;
    m.f = m1.f + m2.f;
}