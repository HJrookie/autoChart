import { mean } from 'lodash';
import { SIGNIFICANCE_BENCHMARK } from '../../insight/constant';
import { calculatePValue } from '../../insight/insights/util';
var DEFAULT_WINDOW_SIZE = 4;
/**
 * Window-based change point detection
 */
export function windowBasedMean(data, params) {
    var len = data === null || data === void 0 ? void 0 : data.length;
    var K = (params === null || params === void 0 ? void 0 : params.windowSize) || DEFAULT_WINDOW_SIZE;
    if (len <= 2 * K + 3)
        return [];
    var significanceLimit = (params === null || params === void 0 ? void 0 : params.significanceLimit) || SIGNIFICANCE_BENCHMARK;
    var diff = Array(len).fill(0);
    for (var i = K; i <= len - K; i += 1) {
        var meanLeft = mean(data.slice(i - K, i));
        var meanRight = mean(data.slice(i, i + K));
        diff[i] = Math.abs(meanLeft - meanRight);
    }
    var differences = diff.slice(K, len - K + 1);
    var sorted = differences.sort(function (a, b) { return b - a; });
    var result = [];
    var _loop_1 = function (i) {
        var difference = sorted[i];
        var index = diff.findIndex(function (item) { return item === difference; });
        var significance = 1 - calculatePValue(differences, difference);
        if (significance >= significanceLimit) {
            result.push({
                index: index,
                significance: significance,
            });
        }
    };
    for (var i = 0; i < sorted.length; i += 1) {
        _loop_1(i);
    }
    return result;
}
/**
 * Window-based change point test
 */
export function calcPValue(data, index, window) {
    var len = data === null || data === void 0 ? void 0 : data.length;
    var K = window || DEFAULT_WINDOW_SIZE;
    if (len <= 2 * K + 3)
        return 0;
    var diff = Array(len).fill(0);
    for (var i = K; i <= len - K; i += 1) {
        var meanLeft = mean(data.slice(i - K, i));
        var meanRight = mean(data.slice(i, i + K));
        diff[i] = Math.abs(meanLeft - meanRight);
    }
    var p = calculatePValue(diff.slice(K, len - K + 1), diff[index]);
    return p;
}
