/*
 * Statistical methods used internally by ava.
 */
import { __read, __spreadArray } from "tslib";
import { assert } from '../utils';
import * as cache from './caches';
/**
 * Get the minimum of the array.
 * @param value - The array to process
 */
export function min(value) {
    var cachedValue = cache.get(value, 'min');
    if (cachedValue !== undefined)
        return cachedValue;
    return cache.set(value, 'min', Math.min.apply(Math, __spreadArray([], __read(value), false)));
}
function getMinIndex(value) {
    var min = value[0];
    var idx = 0;
    for (var i = 0; i < value.length; i += 1) {
        if (value[i] < min) {
            idx = i;
            min = value[i];
        }
    }
    return idx;
}
/**
 * Get the minimum index of the array.
 * @param value - The array to process
 */
export function minIndex(value) {
    var cachedValue = cache.get(value, 'minIndex');
    if (cachedValue !== undefined)
        return cachedValue;
    return cache.set(value, 'minIndex', getMinIndex(value));
}
/**
 * Get the maximum of the array.
 * @param value - The array to process
 */
export function max(value) {
    var cachedValue = cache.get(value, 'max');
    if (cachedValue !== undefined)
        return cachedValue;
    return cache.set(value, 'max', Math.max.apply(Math, __spreadArray([], __read(value), false)));
}
function getMaxIndex(value) {
    var max = value[0];
    var idx = 0;
    for (var i = 0; i < value.length; i += 1) {
        if (value[i] > max) {
            idx = i;
            max = value[i];
        }
    }
    return idx;
}
/**
 * Get the maximum index of the array.
 * @param value - The array to process
 */
export function maxIndex(value) {
    var cachedValue = cache.get(value, 'maxIndex');
    if (cachedValue !== undefined)
        return cachedValue;
    return cache.set(value, 'maxIndex', getMaxIndex(value));
}
/**
 * Calculate the sum of the array.
 * @param value - The array to process
 */
export function sum(value) {
    var cachedValue = cache.get(value, 'sum');
    if (cachedValue !== undefined)
        return cachedValue;
    return cache.set(value, 'sum', value.reduce(function (prev, current) { return current + prev; }, 0));
}
/**
 * Calculate the mean of the array.
 * @param value - The array to process

 */
export function mean(value) {
    return sum(value) / value.length;
}
/**
 * Calculate the geometricMean of the array.
 * @param value - The array to process
 */
export function geometricMean(value) {
    assert(value.some(function (item) { return item > 0; }), 'Each item in value must greater than 0.');
    var cachedValue = cache.get(value, 'geometricMean');
    if (cachedValue !== undefined)
        return cachedValue;
    return cache.set(value, 'geometricMean', Math.pow(value.reduce(function (prev, curr) { return prev * curr; }, 1), (1 / value.length)));
}
/**
 * Calculate the harmonic mean of the array.
 * @param value - The array to process
 */
export function harmonicMean(value) {
    var base = Math.pow(2, 16);
    var cachedValue = cache.get(value, 'harmonicMean');
    if (cachedValue !== undefined)
        return cachedValue;
    return cache.set(value, 'harmonicMean', (base * value.length) / value.reduce(function (prev, curr) { return base / curr + prev; }, 0));
}
function sort(value) {
    return value.sort(function (l, r) { return (l > r ? 1 : -1); });
}
/**
 * Calculate the median of the array.
 * @param value - The array to process
 */
export function median(value, sorted) {
    if (sorted === void 0) { sorted = false; }
    var length = value.length;
    var newArray = sorted ? value : sort(value);
    if (length % 2 === 1)
        return newArray[(length - 1) / 2];
    return (newArray[length / 2 - 1] + newArray[length / 2]) / 2;
}
/**
 * Calculate the quartile of the array.
 * @param value - The array to process
 * @param sorted - Whether it is sorted
 */
export function quartile(value, sorted) {
    if (sorted === void 0) { sorted = false; }
    assert(value.length >= 3, 'The length of value cannot be less than 3.');
    var length = value.length;
    var newArray = sorted ? value : sort(value);
    var Q2 = median(newArray, true);
    var Q1;
    var Q3;
    if (length % 2 === 1) {
        Q1 = median(newArray.slice(0, (length - 1) / 2), true);
        Q3 = median(newArray.slice((length + 1) / 2), true);
    }
    else {
        Q1 = median(newArray.slice(0, length / 2), true);
        Q3 = median(newArray.slice(length / 2), true);
    }
    return [Q1, Q2, Q3];
}
/**
 * Calculate the quantile of the array.
 * @param value - The array to process
 * @param percent - percent
 * @param sorted - Whether it is sorted
 */
export function quantile(value, percent, sorted) {
    if (sorted === void 0) { sorted = false; }
    assert(percent > 0 && percent < 100, 'The percent cannot be between (0, 100).');
    var newArray = sorted ? value : sort(value);
    var index = Math.ceil((value.length * percent) / 100) - 1;
    return newArray[index];
}
/**
 * Calculate the variance of the array.
 * @param value - The array to process
 */
export function variance(value) {
    var m = mean(value);
    var cachedValue = cache.get(value, 'variance');
    if (cachedValue !== undefined)
        return cachedValue;
    return cache.set(value, 'variance', value.reduce(function (prev, curr) { return prev + Math.pow((curr - m), 2); }, 0) / value.length);
}
/**
 * Calculate the standard deviation of the array.
 * @param value - The array to process
 */
export function standardDeviation(value) {
    return Math.sqrt(variance(value));
}
/**
 * Calculate the coefficient of variance of the array.
 * @param value - The array to process
 */
export function coefficientOfVariance(value) {
    var stdev = standardDeviation(value);
    var arrayMean = mean(value);
    return stdev / arrayMean;
}
/**
 * Calculate the covariance of the array.
 * @param x - variable x
 * @param y - variable y
 */
export function covariance(x, y) {
    assert(x.length === y.length, 'The x and y must has same length.');
    var exy = mean(x.map(function (item, i) { return item * y[i]; }));
    return exy - mean(x) * mean(y);
}
/**
 * Calculate the pearson correlation coefficient of two value.
 * @param x - variable x
 * @param y - variable y
 */
export function pearson(x, y) {
    var cov = covariance(x, y);
    var dx = standardDeviation(x);
    var dy = standardDeviation(y);
    return cov / (dx * dy);
}
/**
 * Calculate the counts of valid value in the array.
 * @param value - The array to process
 */
export function valid(value) {
    var count = 0;
    for (var i = 0; i < value.length; i += 1) {
        if (value[i])
            count += 1;
    }
    return count;
}
/**
 * Calculate the counts of missing value in the array.
 * @param value - The array to process
 */
export function missing(value) {
    return value.length - valid(value);
}
/**
 * Calculate the counts of each distinct value in the array.
 * @param value - The array to process
 */
export function valueMap(value) {
    var data = {};
    value.forEach(function (v) {
        var vStr = "".concat(v);
        if (data[vStr])
            data[vStr] += 1;
        else
            data[vStr] = 1;
    });
    return data;
}
/**
 * Calculate the counts of distinct value in the array.
 * @param value - The array to process
 */
export function distinct(value) {
    return Object.keys(valueMap(value)).length;
}
