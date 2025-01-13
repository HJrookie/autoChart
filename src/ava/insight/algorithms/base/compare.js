/**
 * lodash sortby asc function
 * @param left unknown
 * @param right unknown
 * @returns number
 */
export function ascending(left, right) {
    var leftIsNull = left === null || left === undefined;
    var rightIsNull = right === null || right === undefined;
    if (leftIsNull && rightIsNull) {
        return 0;
    }
    if (leftIsNull) {
        return 1;
    }
    if (rightIsNull) {
        return -1;
    }
    return left - right;
}
/**
 * lodash sortby desc function
 * @param left any
 * @param right any
 * @returns number
 */
export function descending(left, right) {
    var leftIsNull = left === null || left === undefined;
    var rightIsNull = right === null || right === undefined;
    if (leftIsNull && rightIsNull) {
        return 0;
    }
    if (leftIsNull) {
        return 1;
    }
    if (rightIsNull) {
        return -1;
    }
    return right - left;
}
