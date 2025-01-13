import { __assign } from "tslib";
import { INSIGHT_COLOR_PLATTE } from '../../constants';
/** get mark for point patterns, the patterns should have same dimension and measure */
export var intervalMarkStrategy = function (patterns, config) {
    var data = patterns.map(function (_a) {
        var x = _a.x, y = _a.y;
        return ({ x: x, y: y });
    });
    var intervalMark = __assign(__assign({ type: 'interval', data: data, encode: {
            x: 'x',
            y: 'y',
        } }, config), { style: __assign(__assign({}, config === null || config === void 0 ? void 0 : config.style), { fill: INSIGHT_COLOR_PLATTE.outlier }) });
    return intervalMark;
};
