import { __assign } from "tslib";
import { PIE_RADIUS_STYLE } from '../constants';
export var insight2ChartStrategy = function (insight) {
    var _a, _b;
    var data = insight.data, patterns = insight.patterns, dimensions = insight.dimensions, measures = insight.measures;
    var insightType = patterns[0].type;
    var commonSpec = {
        data: data,
        encode: {
            x: dimensions[0].fieldName,
            y: measures[0].fieldName,
        },
    };
    // pie
    if (insightType === 'majority') {
        return __assign(__assign({}, commonSpec), { type: 'interval', encode: {
                color: dimensions[0].fieldName,
                y: measures[0].fieldName,
            }, transform: [{ type: 'stackY' }], coordinate: {
                type: 'theta',
                innerRadius: PIE_RADIUS_STYLE.innerRadius,
                outerRadius: PIE_RADIUS_STYLE.outerRadius,
            }, tooltip: {
                items: [{ field: dimensions[0].fieldName }, { field: measures[0].fieldName }],
            } });
    }
    // line
    if (insightType === 'trend' || insightType === 'time_series_outlier' || insightType === 'change_point') {
        return __assign(__assign({}, commonSpec), { type: 'line', style: {
                lineWidth: 2,
            } });
    }
    // bar
    if (insightType === 'category_outlier' || insightType === 'low_variance') {
        return __assign(__assign({}, commonSpec), { type: 'interval' });
    }
    // scatter
    if (insightType === 'correlation') {
        return __assign(__assign({}, commonSpec), { type: 'point', encode: {
                x: (_a = measures[0]) === null || _a === void 0 ? void 0 : _a.fieldName,
                y: (_b = measures[1]) === null || _b === void 0 ? void 0 : _b.fieldName,
            } });
    }
    return null;
};
