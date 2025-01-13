import { isArray, isNumber, isString, range, assert, isBoolean, isNil, isDate } from '../../utils';
export function isAxis(value) {
    return isNumber(value) || isString(value);
}
// generate indexes for 1D and 2D array
export function generateArrayIndex(data, extraIndex) {
    assert(isArray(data), 'Data must be an array');
    if (extraIndex) {
        assert((extraIndex === null || extraIndex === void 0 ? void 0 : extraIndex.length) === data.length, "Index length is ".concat(extraIndex === null || extraIndex === void 0 ? void 0 : extraIndex.length, ", but data size is ").concat(data.length));
        return extraIndex;
    }
    return range(data.length);
}
export function fillMissingValue(datum, fillValue) {
    return !datum && JSON.stringify(fillValue) ? fillValue : datum;
}
export function generateSplit(length) {
    return Array(isNumber(length) ? length : 0)
        .fill(' ')
        .concat('  ')
        .join('');
}
export function stringify(value) {
    var _a, _b, _c, _d, _e, _f;
    return (((_f = (_e = (_d = (_c = (_b = (_a = JSON.stringify(value)) === null || _a === void 0 ? void 0 : _a.replace(/\\n/g, '')) === null || _b === void 0 ? void 0 : _b.replace(/\\/g, '')) === null || _c === void 0 ? void 0 : _c.replace(/"\[/g, '[')) === null || _d === void 0 ? void 0 : _d.replace(/\]"/g, ']')) === null || _e === void 0 ? void 0 : _e.replace(/"\{/g, '{')) === null || _f === void 0 ? void 0 : _f.replace(/\}"/g, ' }')) || 'undefined');
}
export function getStringifyLength(value) {
    var _a;
    return (_a = stringify(value)) === null || _a === void 0 ? void 0 : _a.length;
}
/**
 * Convert data to specified data type.
 * @param data
 * @param type
 */
export function convertDataType(data, type) {
    try {
        if (type === 'string' && !isString(data)) {
            return "".concat(data);
        }
        if (type === 'boolean' && !isBoolean(data)) {
            return Boolean(data);
        }
        if (type === 'null' && !isNil(data)) {
            return null;
        }
        if ((type === 'integer' || type === 'float') && !isNumber(data)) {
            return +data;
        }
        if (type === 'date' && !isDate(data) && (isNumber(data) || isString(data))) {
            return new Date(data);
        }
    }
    catch (error) {
        throw new Error(error);
    }
    return data;
}
