import { __read, __spreadArray } from "tslib";
import { isArray } from './isType';
/**
 * Return an array with unique elements
 * @param value
 */
export function unique(value) {
    return Array.from(new Set(value));
}
/**
 * Generate an array from 0 to number.
 * @param number
 */
export function range(number) {
    return __spreadArray([], __read(Array(number).keys()), false);
}
/** Generate an array with all 1 elements */
export function nOnes(n) {
    return Array(n).fill(1);
}
/** Generate an array with all 0 elements */
export function nZeros(n) {
    return Array(n).fill(0);
}
/**
 * assert
 * @param condition
 * @param errorMessage
 */
export function assert(condition, errorMessage) {
    if (!condition)
        throw new Error(errorMessage);
}
/**
 * Check parent-child relationship. A child has only one parent, but a parent can have more children.
 * @param parent
 * @param child
 */
export function isParentChild(parent, child) {
    if (!isArray(parent) ||
        parent.length === 0 ||
        !isArray(child) ||
        child.length === 0 ||
        parent.length !== child.length)
        return false;
    var record = {};
    for (var i = 0; i < child.length; i += 1) {
        var c = child[i];
        var p = parent[i];
        if (!record[c]) {
            record[c] = p;
        }
        else if (record[c] !== p) {
            return false;
        }
    }
    return true;
}
