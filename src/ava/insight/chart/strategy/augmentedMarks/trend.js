import { __read, __spreadArray } from "tslib";
import { lineMarkStrategy } from '../commonMarks';
import { insight2ChartStrategy } from '../chart';
import { dataFormat } from '../../../../utils';
export var trendAugmentedMarksStrategy = function (insight) {
    var chartData = insight.data, _a = __read(insight.dimensions, 1), dimensionName = _a[0].fieldName, patterns = insight.patterns;
    var points = chartData.map(function (datum, index) {
        var points = patterns[0].regression.points;
        var point = points[index];
        return [datum[dimensionName], point];
    });
    var _b = __read(patterns[0].regression.equation, 2), m = _b[0], c = _b[1];
    var lineData = points.map(function (point) { return ({ x: point[0], y: point[1] }); });
    var regressionLineMark = lineMarkStrategy({ points: lineData }, { label: "y=".concat(dataFormat(m), "x").concat(c < 0 ? '' : '+').concat(dataFormat(c)) });
    return [
        {
            trendLine: [regressionLineMark],
        },
    ];
};
export var trendStrategy = function (insight) {
    var _a, _b;
    var chart = insight2ChartStrategy(insight);
    var trendMarks = trendAugmentedMarksStrategy(insight);
    return __spreadArray([chart], __read(((_b = (_a = trendMarks[0]) === null || _a === void 0 ? void 0 : _a.trendLine) !== null && _b !== void 0 ? _b : [])), false);
};
