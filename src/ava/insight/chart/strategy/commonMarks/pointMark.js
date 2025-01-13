import { __assign } from "tslib";
import { isNil } from 'lodash';
/** get mark for point patterns, the patterns should have same dimension and measure */
export var pointMarkStrategy = function (patterns, config) {
    var data = [];
    patterns.forEach(function (_a) {
        var x = _a.x, y = _a.y;
        if (isNil(x) || isNil(y))
            return;
        data.push({ x: x, y: y });
    });
    var pointMark = __assign({ type: 'point', data: data, encode: {
            x: 'x',
            y: 'y',
        } }, config);
    return pointMark;
};
