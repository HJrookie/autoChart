import { SPECIAL_BOOLEANS } from './constants';
export function isNil(value) {
    return value === null || value === undefined || value === '' || Number.isNaN(value) || value === 'null';
}
export function isString(value) {
    return typeof value === 'string';
}
export function isNumber(value) {
    if (typeof value === 'number')
        return true;
    return false;
}
export function isNumberString(value) {
    if (isString(value)) {
        var hasDot = false;
        var tempValue = value;
        if (/^[+-]/.test(tempValue)) {
            tempValue = tempValue.slice(1);
        }
        for (var i = 0; i < tempValue.length; i += 1) {
            var char = tempValue[i];
            if (char === '.') {
                if (hasDot === false) {
                    hasDot = true;
                }
                else {
                    return false;
                }
            }
            if (char !== '.' && !/[0-9]/.test(char)) {
                return false;
            }
        }
        return tempValue.trim() !== '';
    }
    return false;
}
export function isInteger(value) {
    if (typeof value === 'number')
        return Number.isInteger(value);
    return false;
}
export function isIntegerString(value) {
    if (isString(value) && isNumberString(value))
        return !value.includes('.');
    return false;
}
export function isFloat(value) {
    if (typeof value === 'number')
        return !Number.isNaN(value) && !Number.isInteger(value);
    return false;
}
export function isFloatString(value) {
    if (isString(value) && isNumberString(value))
        return value.includes('.');
    return false;
}
export function isDate(value) {
    if (value && Object.getPrototypeOf(value) === Date.prototype)
        return true;
    return false;
}
export function isBoolean(value, checkSpecialBoolean) {
    return checkSpecialBoolean
        ? SPECIAL_BOOLEANS.some(function (list) {
            return value.every(function (item) { return list.includes(item); });
        })
        : typeof value === 'boolean';
}
export function isObject(value) {
    return value && Object.getPrototypeOf(value) === Object.prototype;
}
export function isArray(value) {
    return Array.isArray(value);
}
export function isBasicType(value) {
    return !isArray(value) && !isObject(value);
}
