import { toNumber, isNaN } from 'lodash';
export function isString(val) {
    return typeof val === 'string';
}
export function isObject(val) {
    return val !== null && typeof val === 'object';
}
export function isUndefined(val) {
    return val === undefined;
}
export function isNumberLike(val) {
    var numVal = toNumber(val);
    return !isNaN(numVal);
}
