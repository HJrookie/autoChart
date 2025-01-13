/*
 * implementation of deepMix in antv/utils
 */
var MAX_MIX_LEVEL = 5;
var isObjectLike = function (value) {
    /*
     * isObjectLike({}) => true
     * isObjectLike([1, 2, 3]) => true
     * isObjectLike(Function) => false
     * isObjectLike(null) => false
     */
    return typeof value === 'object' && value !== null;
};
var toString = {}.toString;
var isType = function (value, type) { return toString.call(value) === "[object ".concat(type, "]"); };
var isPlainObject = function (value) {
    /*
     * isObjectLike(new Foo) => false
     * isObjectLike([1, 2, 3]) => false
     * isObjectLike({ x: 0, y: 0 }) => true
     * isObjectLike(Object.create(null)) => true
     */
    if (!isObjectLike(value) || !isType(value, 'Object')) {
        return false;
    }
    if (Object.getPrototypeOf(value) === null) {
        return true;
    }
    var proto = value;
    while (Object.getPrototypeOf(proto) !== null) {
        proto = Object.getPrototypeOf(proto);
    }
    return Object.getPrototypeOf(value) === proto;
};
var isArray = function (value) {
    return Array.isArray ? Array.isArray(value) : isType(value, 'Array');
};
function pDeepMix(inputDist, src, inputLevel, inputMaxLevel) {
    var level = inputLevel || 0;
    var maxLevel = inputMaxLevel || MAX_MIX_LEVEL;
    var dist = inputDist;
    Object.keys(src).forEach(function (key) {
        if (Object.prototype.hasOwnProperty.call(src, key)) {
            var value = src[key];
            if (value !== null && isPlainObject(value)) {
                if (!isPlainObject(dist[key])) {
                    dist[key] = {};
                }
                if (level < maxLevel) {
                    pDeepMix(dist[key], value, level + 1, maxLevel);
                }
                else {
                    dist[key] = src[key];
                }
            }
            else if (isArray(value)) {
                dist[key] = [];
                dist[key] = dist[key].concat(value);
            }
            else if (value !== undefined) {
                dist[key] = value;
            }
        }
    });
}
var deepMix = function (rst) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    for (var i = 0; i < args.length; i += 1) {
        pDeepMix(rst, args[i]);
    }
    return rst;
};
export default deepMix;
