import { sumBy } from 'lodash';
import { rank } from '../../insight/utils/common';
/**
 * Pettitt's (1979) method is a rank-based nonparametric test for abrupt changes in a time series.
 * */
export function pettittTest(data) {
    var n = data === null || data === void 0 ? void 0 : data.length;
    var rankArr = rank(data);
    var Umax = 0;
    var UmaxIndex = -1;
    for (var k = 0; k < n; k += 1) {
        var U = Math.abs(2 * sumBy(rankArr.slice(0, k)) - k * (n + 1));
        if (U > Umax) {
            Umax = U;
            UmaxIndex = k;
        }
    }
    var pvalue = 2 * Math.exp((-6 * Math.pow(Umax, 2)) / (Math.pow(n, 2) + Math.pow(n, 3)));
    return {
        index: UmaxIndex,
        significance: 1 - pvalue,
    };
}
/**
 * p-value calc in Pettitt
 */
export function calcPValue(data, index) {
    var n = data === null || data === void 0 ? void 0 : data.length;
    var rankArr = rank(data);
    var U = Math.abs(2 * sumBy(rankArr.slice(0, index)) - index * (n + 1));
    var pvalue = 2 * Math.exp((-6 * Math.pow(U, 2)) / (Math.pow(n, 2) + Math.pow(n, 3)));
    return pvalue;
}
