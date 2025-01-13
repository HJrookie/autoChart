/** operation of vector or matrix */
export var vectorAdd = function (x, y) {
    if (x.length !== y.length)
        return null;
    return x.map(function (xi, i) { return xi + y[i]; });
};
export var vectorSubtract = function (x, y) {
    if (x.length !== y.length)
        return null;
    return x.map(function (xi, i) { return xi - y[i]; });
};
export var vectorInnerProduct = function (x, y) {
    if (x.length !== y.length)
        return null;
    var result = 0;
    x.forEach(function (xi, i) {
        result += xi * y[i];
    });
    return result;
};
export var matrixTranspose = function (x) {
    var result = [];
    var _loop_1 = function (j) {
        result.push(x.map(function (xi) { return xi[j]; }));
    };
    for (var j = 0; j < x[0].length; j += 1) {
        _loop_1(j);
    }
    return result;
};
export var matrixMultiply = function (x, y) {
    var _a;
    if (((_a = x[0]) === null || _a === void 0 ? void 0 : _a.length) !== y.length)
        return null;
    var result = [];
    var yT = matrixTranspose(y);
    x.forEach(function (xi) { return result.push(yT.map(function (yj) { return vectorInnerProduct(xi, yj); })); });
    return result;
};
export var multiMatrixMultiply = function (matrixSet) {
    var result = matrixSet[0];
    for (var i = 1; i < matrixSet.length; i += 1) {
        result = matrixMultiply(result, matrixSet[i]);
    }
    return result;
};
/**
 * Constructs a diagonal matrix where the values of the main diagonal are the values of the given vector
 */
export var constructDiagonalMatrix = function (diagonalVector) {
    return diagonalVector.map(function (diagonalValue, i) {
        // ith row
        var row = Array(diagonalVector.length).fill(0);
        row[i] = diagonalValue;
        return row;
    });
};
/**
 * Calculate the inverse matrix for second order matrix
 * */
export var inverseSecondOrderMatrix = function (matrix) {
    var determinant = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    return [
        [matrix[1][1] / determinant, -matrix[0][1] / determinant],
        [-matrix[1][0] / determinant, matrix[0][0] / determinant],
    ];
};
