import { __assign } from "tslib";
import { mapValues } from 'lodash';
function isQuantitative(d) {
    return typeof d === 'number';
}
function isCategorical(d) {
    return typeof d === 'string' || typeof d === 'boolean';
}
function isTemporal(d) {
    return d instanceof Date;
}
function isField(data, encode) {
    return typeof encode === 'string' && data.some(function (d) { return d[encode] !== undefined; });
}
function isTransform(encode) {
    return typeof encode === 'function';
}
// @ts-ignore: constant - 常数比例尺 / identity - 恒等比例尺 对用户不透出，所以此处ts-ignore
function scaleType2dataType(scaleType) {
    switch (scaleType) {
        case 'linear':
        case 'log':
        case 'pow':
        case 'sqrt':
        case 'qunatile':
        case 'threshold':
        case 'quantize':
        case 'sequential':
            return 'quantitative';
        case 'time':
            return 'temporal';
        case 'ordinal':
        case 'point':
        case 'band':
            return 'categorical';
        default:
            throw new Error("Unkonwn scale type: ".concat(scaleType, "."));
    }
}
function values2dataType(values) {
    if (values.some(isQuantitative))
        return 'quantitative';
    if (values.some(isCategorical))
        return 'categorical';
    if (values.some(isTemporal))
        return 'temporal';
    throw new Error("Unknown type: ".concat(typeof values[0]));
}
function columnOf(data, encode) {
    if (isTransform(encode))
        return data.map(encode);
    if (isField(data, encode))
        return data.map(function (d) { return d[encode]; });
    return data.map(function () { return encode; });
}
/** 推断数据类型 */
export function inferDataType(data, encode, scale) {
    if (scale !== undefined)
        return scaleType2dataType(scale);
    var values = columnOf(data, encode);
    return values2dataType(values);
}
/** 获取带有字段类型的 chartSpec */
export function getSpecWithEncodeType(chartSpec) {
    var encode = chartSpec.encode, data = chartSpec.data, scale = chartSpec.scale;
    var newEncode = mapValues(encode, function (value, key) {
        return { field: value, type: inferDataType(data, value, scale === null || scale === void 0 ? void 0 : scale[key].type) };
    });
    return __assign(__assign({}, chartSpec), { encode: newEncode });
}
