import { __assign } from "tslib";
import { INSIGHT_COLOR_PLATTE } from '../../constants';
export var lineMarkStrategy = function (_a, _b) {
    var points = _a.points, x = _a.x, y = _a.y;
    var encode = _b.encode, style = _b.style, label = _b.label, tooltip = _b.tooltip;
    var common = {
        style: __assign({ lineDash: [2, 2], stroke: INSIGHT_COLOR_PLATTE.highlight }, style),
        labels: label
            ? [
                {
                    text: label,
                    selector: 'last',
                    position: 'right',
                    style: {
                        textBaseline: 'bottom',
                        textAlign: 'end',
                        dy: -24,
                    },
                },
            ]
            : undefined,
        tooltip: tooltip,
    };
    if (points) {
        return __assign(__assign({}, common), { type: 'line', data: points, encode: __assign({ x: 'x', y: 'y' }, encode) });
    }
    if (x) {
        return __assign(__assign({}, common), { type: 'lineX', data: [x] });
    }
    if (y) {
        return __assign(__assign({}, common), { type: 'lineY', data: [y] });
    }
    return null;
};
