import { __read, __spreadArray } from "tslib";
import { get, isNil, isString, orderBy } from 'lodash';
import { distinct, mean } from '../../../data';
import { categoryOutlier } from '../../algorithms';
import { IQR_K, SIGNIFICANCE_BENCHMARK } from '../../constant';
import { calculatePValue, calculateOutlierThresholds, preValidation, getAlgorithmCommonInput, getNonSignificantInsight, } from '../util';
export var findOutliers = function (values, outlierParameter) {
    var _a = outlierParameter || {}, method = _a.method, iqrK = _a.iqrK, _b = _a.confidenceInterval, confidenceInterval = _b === void 0 ? SIGNIFICANCE_BENCHMARK : _b;
    var outliers = [];
    var thresholds = [];
    var candidates = values.map(function (item, index) {
        return { index: index, value: item };
    });
    if (method !== 'p-value') {
        var IQRResult = categoryOutlier.IQR(values, { k: iqrK !== null && iqrK !== void 0 ? iqrK : IQR_K });
        var lowerOutlierIndexes = IQRResult.lower.indexes;
        var upperOutlierIndexes = IQRResult.upper.indexes;
        __spreadArray(__spreadArray([], __read(lowerOutlierIndexes), false), __read(upperOutlierIndexes), false).forEach(function (index) {
            var value = values[index];
            var pValue = (candidates.findIndex(function (item) { return item.value === value; }) + 1) / values.length;
            // two-sided
            var significance = pValue > 0.5 ? pValue : 1 - pValue;
            outliers.push({
                index: index,
                value: value,
                significance: significance,
            });
        });
        thresholds.push(IQRResult.lower.threshold, IQRResult.upper.threshold);
    }
    else {
        var sortedCandidates = orderBy(candidates, function (item) { return Math.abs(mean(values) - item.value); }, ['desc']);
        thresholds.push.apply(thresholds, __spreadArray([], __read(calculateOutlierThresholds(values, confidenceInterval, 'two-sided')), false));
        for (var i = 0; i < sortedCandidates.length; i += 1) {
            var candidate = sortedCandidates[i];
            var value = candidate.value, index = candidate.index;
            var pValue = calculatePValue(values, value, 'two-sided');
            var significance = 1 - pValue;
            if (significance < confidenceInterval) {
                break;
            }
            outliers.push({
                index: index,
                value: value,
                significance: significance,
            });
        }
    }
    return { outliers: outliers, thresholds: thresholds };
};
export var getCategoryOutlierInfo = function (props) {
    var valid = preValidation(props);
    var insightType = 'category_outlier';
    if (isString(valid))
        return getNonSignificantInsight({ detailInfo: valid, insightType: insightType, infoType: 'verificationFailure' });
    var _a = getAlgorithmCommonInput(props), dimension = _a.dimension, values = _a.values, measure = _a.measure;
    if (isNil(dimension) || isNil(measure))
        return getNonSignificantInsight({
            detailInfo: 'Measure or dimension is empty.',
            insightType: insightType,
            infoType: 'verificationFailure',
        });
    if (distinct(values) === 1)
        return getNonSignificantInsight({
            insightType: insightType,
            infoType: 'noInsight',
            customInfo: { info: 'Each value in the data is the same. No outliers were found.' },
        });
    var data = props.data;
    var outlierParameter = get(props, 'options.algorithmParameter.outlier');
    var outliers = findOutliers(values, outlierParameter).outliers;
    if (outliers.length === 0) {
        var info = "No outliers were found using method ".concat((outlierParameter === null || outlierParameter === void 0 ? void 0 : outlierParameter.method) !== 'p-value' ? 'Inter Quartile Range' : 'Normal Distribution test', ".");
        return getNonSignificantInsight({ insightType: insightType, infoType: 'noInsight', customInfo: { info: info } });
    }
    var categoryOutliers = outliers.map(function (item) {
        var index = item.index, significance = item.significance;
        return {
            type: insightType,
            dimension: dimension,
            measure: measure,
            significance: significance,
            index: index,
            x: data[index][dimension],
            y: data[index][measure],
            significantInsight: true,
        };
    });
    return categoryOutliers;
};
