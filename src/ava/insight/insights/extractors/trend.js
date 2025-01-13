import { __assign } from "tslib";
import regression from 'regression';
import { get, isNil, isString } from 'lodash';
import { trendDirection } from '../../algorithms';
import { getAlgorithmCommonInput, getNonSignificantInsight, preValidation } from '../util';
import { SIGNIFICANCE_LEVEL } from '../../constant';
export function findTimeSeriesTrend(series, trendParameter) {
    var _a;
    var significance = (_a = trendParameter === null || trendParameter === void 0 ? void 0 : trendParameter.threshold) !== null && _a !== void 0 ? _a : SIGNIFICANCE_LEVEL;
    var testResult = trendDirection.mkTest(series, significance);
    var pValue = testResult.pValue, trend = testResult.trend;
    var regressionResult = regression.linear(series.map(function (item, index) { return [index, item]; }));
    var r2 = regressionResult.r2, points = regressionResult.points, equation = regressionResult.equation;
    return {
        trend: trend,
        significance: 1 - pValue,
        regression: {
            r2: r2,
            points: points.map(function (item) { return item[1]; }),
            equation: equation,
        },
    };
}
export var getTrendInfo = function (props) {
    var _a;
    var valid = preValidation(props);
    var insightType = 'trend';
    if (isString(valid))
        return getNonSignificantInsight({ detailInfo: valid, insightType: insightType, infoType: 'verificationFailure' });
    var _b = getAlgorithmCommonInput(props), dimension = _b.dimension, values = _b.values, measure = _b.measure;
    if (isNil(dimension) || isNil(measure))
        return getNonSignificantInsight({
            detailInfo: 'Measure or dimension is empty.',
            insightType: insightType,
            infoType: 'verificationFailure',
        });
    var trendParameter = get(props, 'options.algorithmParameter.trend');
    var result = findTimeSeriesTrend(values, trendParameter);
    return [
        __assign(__assign(__assign({}, result), { type: 'trend', dimension: dimension, measure: measure }), (result.trend === 'no trend'
            ? {
                significantInsight: false,
                info: "The Mann-Kendall (MK) test does not pass at the specified significance level ".concat((_a = trendParameter === null || trendParameter === void 0 ? void 0 : trendParameter.threshold) !== null && _a !== void 0 ? _a : SIGNIFICANCE_LEVEL, "."),
            }
            : {
                significantInsight: true,
            })),
    ];
};
