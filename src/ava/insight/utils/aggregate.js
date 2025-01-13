import { __assign, __read } from "tslib";
import { groupBy, sumBy, minBy, maxBy, meanBy, sortBy, flatten, uniq } from 'lodash';
var sum = function (data, measure) {
    return sumBy(data, measure);
};
var count = function (data, measure) {
    return data.filter(function (item) { return measure in item; }).length;
};
var countDistinct = function (data, measure) {
    return uniq(data.filter(function (item) { return measure in item; }).map(function (item) { return item[measure]; })).length;
};
var max = function (data, measure) {
    var _a;
    return (_a = maxBy(data, measure)) === null || _a === void 0 ? void 0 : _a[measure];
};
var min = function (data, measure) {
    var _a;
    return (_a = minBy(data, measure)) === null || _a === void 0 ? void 0 : _a[measure];
};
var mean = function (data, measure) {
    return meanBy(data, measure);
};
export var AggregatorMap = {
    SUM: sum,
    COUNT: count,
    MAX: max,
    MIN: min,
    MEAN: mean,
    COUNT_DISTINCT: countDistinct,
};
export function aggregate(data, groupByField, measures, sort) {
    var grouped = groupBy(data, groupByField);
    var entries = sort ? sortBy(Object.entries(grouped), '0') : Object.entries(grouped);
    return entries.map(function (_a) {
        var _b;
        var _c = __read(_a, 2), value = _c[0], dataGroup = _c[1];
        var datum = (_b = {}, _b[groupByField] = value, _b);
        measures.forEach(function (measure) {
            var measureField = measure.fieldName, method = measure.method;
            var aggregator = AggregatorMap[method];
            datum[measureField] = aggregator(dataGroup, measureField);
        });
        return datum;
    });
}
export function aggregateWithMeasures(data, groupByField, measures) {
    var grouped = groupBy(data, groupByField);
    var result = [];
    Object.entries(grouped).forEach(function (_a) {
        var _b = __read(_a, 2), value = _b[0], dataGroup = _b[1];
        measures.forEach(function (measure) {
            var _a;
            var measureField = measure.fieldName, method = measure.method;
            if (measureField in dataGroup[0]) {
                var aggregator = AggregatorMap[method];
                var measureValue = aggregator(dataGroup, measureField);
                result.push((_a = {},
                    _a[groupByField] = value,
                    _a.value = measureValue,
                    _a.measureName = measureField,
                    _a));
            }
        });
    });
    return result;
}
export function aggregateWithSeries(data, groupByField, measure, expandingField) {
    var grouped = groupBy(data, groupByField);
    var measureField = measure.fieldName, method = measure.method;
    var aggregator = AggregatorMap[method];
    return flatten(Object.entries(grouped).map(function (_a) {
        var _b = __read(_a, 2), value = _b[0], dataGroup = _b[1];
        var childGrouped = groupBy(dataGroup, expandingField);
        var part = Object.entries(childGrouped).map(function (_a) {
            var _b;
            var _c = __read(_a, 2), childValue = _c[0], childDataGroup = _c[1];
            return _b = {},
                _b[expandingField] = childValue,
                _b[measureField] = aggregator(childDataGroup, measureField),
                _b;
        });
        return part.map(function (item) {
            var _a;
            return __assign(__assign({}, item), (_a = {}, _a[groupByField] = value, _a));
        });
    }));
}
