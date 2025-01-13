import { __read, __spreadArray } from "tslib";
import { insight2ChartStrategy } from '../chart';
import { areaMarkStrategy, lineMarkStrategy, pointMarkStrategy } from '../commonMarks';
var BASELINE = 'baseline';
var INTERVAL = 'interval';
var OUTLIER = 'outlier';
export var timeSeriesOutlierStrategyAugmentedMarksStrategy = function (insight) {
    var chartData = insight.data, _a = __read(insight.dimensions, 1), dimensionName = _a[0].fieldName, patterns = insight.patterns;
    var _b = patterns[0], baselines = _b.baselines, thresholds = _b.thresholds;
    var data = chartData.map(function (datum, index) {
        var baseline = baselines[index];
        var interval = [baseline - Math.abs(thresholds[0]), baseline + thresholds[1]];
        return {
            baseline: {
                x: datum[dimensionName],
                y: baseline,
            },
            interval: {
                x: datum[dimensionName],
                y: interval,
            },
        };
    });
    var intervalData = data.map(function (datum) { return datum[INTERVAL]; });
    var intervalMark = areaMarkStrategy(intervalData, {
        encode: {
            shape: 'smooth',
        },
        style: {
            fillOpacity: 0.3,
            fill: '#ffd8b8',
        },
        tooltip: {
            title: '',
            items: [
                function (_d, i, _data, column) { return ({
                    name: INTERVAL,
                    value: "".concat(column.y.value[i], "-").concat(column.y1.value[i]),
                    color: '#ffd8b8',
                }); },
            ],
        },
    });
    var baselineData = data.map(function (datum) { return datum[BASELINE]; });
    var baselineMark = lineMarkStrategy({ points: baselineData }, {
        encode: {
            shape: 'smooth',
        },
        style: {
            lineWidth: 1,
            stroke: '#ffa45c',
            lineDash: undefined,
        },
        tooltip: {
            title: '',
            items: [{ name: BASELINE, channel: 'y' }],
        },
    });
    var outlierMark = pointMarkStrategy(patterns, {
        style: {
            fill: '#f4664a',
            stroke: '#f4664a',
        },
        tooltip: {
            title: '',
            items: [{ name: OUTLIER, channel: 'y' }],
        },
    });
    return [
        {
            trendLine: [baselineMark],
            anomalyArea: [intervalMark],
            outliers: [outlierMark],
        },
    ];
};
export var timeSeriesOutlierStrategy = function (insight) {
    // Should to support marks free combination
    var chartMark = insight2ChartStrategy(insight);
    var _a = timeSeriesOutlierStrategyAugmentedMarksStrategy(insight)[0] || {}, _b = _a.trendLine, trendLine = _b === void 0 ? [] : _b, _c = _a.anomalyArea, anomalyArea = _c === void 0 ? [] : _c, _e = _a.outliers, outliers = _e === void 0 ? [] : _e;
    return __spreadArray(__spreadArray(__spreadArray(__spreadArray([], __read(anomalyArea), false), __read(trendLine), false), [chartMark], false), __read(outliers), false);
};
