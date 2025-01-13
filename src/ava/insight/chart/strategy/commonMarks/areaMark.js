import { __assign } from "tslib";
export var areaMarkStrategy = function (data, _a) {
    var encode = _a.encode, style = _a.style, tooltip = _a.tooltip;
    var common = {
        style: style,
        tooltip: tooltip,
    };
    if (data) {
        return __assign(__assign({}, common), { type: 'area', data: data, encode: __assign({ x: 'x', y: 'y' }, encode) });
    }
    return null;
};
