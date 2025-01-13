import { isNumber, mergeWith } from 'lodash';
import { nOnes, nZeros } from '../utils';
import { median } from './base';
import { DEFAULT_LOWESS_OPTIONS } from './constants';
import { constructDiagonalMatrix, inverseSecondOrderMatrix, matrixTranspose, multiMatrixMultiply, vectorSubtract, } from './vector';
export var tricubeWeightFunction = function (x) {
    if (!isNumber(x) || Math.abs(x) >= 1)
        return 0;
    return Math.pow((1 - Math.pow(Math.abs(x), 3)), 3);
};
export var bisquareWeightFunction = function (x) {
    if (!isNumber(x) || Math.abs(x) >= 1)
        return 0;
    return Math.pow((1 - Math.pow(x, 2)), 2);
};
export var weightedLinearRegression = function (x, y, w) {
    /** dimension: 2*n */
    var xt = [nOnes(x.length), x];
    /** dimension: n*2 */
    var xMatrix = matrixTranspose(xt);
    /** dimension: n*1 */
    var yMatrix = matrixTranspose([y]);
    /** diagonal matrix with w as the main diagonal */
    var wMatrix = constructDiagonalMatrix(w);
    /**
     * (X^(T)wX)^(-1)
     * - 2*n, n*n, n*2 => 2*2
     * */
    var factor = inverseSecondOrderMatrix(multiMatrixMultiply([xt, wMatrix, xMatrix]));
    /**
     * (X^(T)wX)^(-1) X^(T)wY
     * - 2*2, 2*n, n*1 => 2*1
     * */
    return multiMatrixMultiply([factor, xt, wMatrix, yMatrix]);
};
/**
 * Locally weighted regression
 * - General idea: perform weighted linear regression on localized subsets of the data point by point to calculate fitted value.
 * - Reference: William S. Cleveland. Robust Locally Weighted Regression and Smoothing Scatterplots. Journal of the American Statistical Association. 1979. Vol. 74(368):829-836.
 * */
export var lowess = function (x, y, options) {
    var xLength = x.length;
    var mergeOptions = mergeWith(DEFAULT_LOWESS_OPTIONS, options, function (defaultValue, inputValue) {
        return inputValue !== null && inputValue !== void 0 ? inputValue : defaultValue;
    });
    // length of subset
    var r = Math.ceil(xLength * mergeOptions.f);
    // for each i, hi be the distance from xi to the rth nearest neighbor of xi
    var h = x.map(function (xi) {
        // rth smallest number among |xi - xj|, for j = 1, ..., n
        return x.map(function (xj) { return Math.abs(xi - xj); }).sort(function (a, b) { return a - b; })[r];
    });
    // weight, n*n
    var w = x.map(function (xi, i) {
        // wk(xi) = weightFunc((xk - xi)/hi), for k = 1, ..., n
        return x.map(function (xk) { return tricubeWeightFunction((xk - xi) / h[i]); });
    });
    var robustCoefficient = nOnes(xLength);
    /** fitted values */
    var yFit = nZeros(xLength);
    var _loop_1 = function (iter) {
        for (var i = 0; i < xLength; i += 1) {
            var robustWeight = w[i].map(function (wik, k) { return wik * robustCoefficient[k]; });
            var beta = weightedLinearRegression(x, y, robustWeight);
            yFit[i] = beta[0][0] + beta[1][0] * x[i];
        }
        var residuals = vectorSubtract(y, yFit);
        /** median of |residuals| */
        var s = median(residuals.map(function (res) { return Math.abs(res); }));
        residuals.forEach(function (res, i) {
            robustCoefficient[i] = bisquareWeightFunction(res / (6 * s));
        });
    };
    for (var iter = 0; iter < mergeOptions.nSteps; iter += 1) {
        _loop_1(iter);
    }
    return {
        y: yFit,
    };
};
