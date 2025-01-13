import { __assign } from "tslib";
import { isFunction } from 'lodash';
import { TEXT_STYLE } from '../../constants';
/** get mark for point patterns, the patterns should have same dimension and measure */
export var textMarkStrategy = function (patterns, textConfig) {
    var _a = textConfig || {}, style = _a.style, label = _a.label, formatter = _a.formatter;
    var _b = patterns[0], measure = _b.measure, dimension = _b.dimension;
    var data = patterns.map(function (pattern) {
        var _a;
        var customLabel = isFunction(label) ? label(pattern) : label;
        var value = isFunction(formatter) ? formatter(pattern.y) : pattern.y;
        return _a = {},
            _a[dimension] = pattern.x,
            _a[measure] = pattern.y,
            _a.label = customLabel !== null && customLabel !== void 0 ? customLabel : "".concat(pattern.x, "\n").concat(value),
            _a;
    });
    return {
        type: 'text',
        data: data,
        encode: {
            x: dimension,
            y: measure,
            text: 'label',
        },
        style: __assign(__assign({}, TEXT_STYLE), style),
    };
};
