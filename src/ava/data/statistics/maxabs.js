import { __read, __spreadArray } from "tslib";
/**
 * Returns the maximum absolute value of array
 * @param x input array
 * */
export var maxabs = function (x) {
    var absoluteX = x.map(function (value) { return Math.abs(value); });
    return Math.max.apply(Math, __spreadArray([], __read(absoluteX), false));
};
