import { get, isNil, isString } from 'lodash';
import { changePoint } from '../../algorithms';
import { getAlgorithmCommonInput, getNonSignificantInsight, preValidation } from '../util';
import { CHANGE_POINT_SIGNIFICANCE_BENCHMARK } from '../../constant';
export var findChangePoints = function (series, changePointsParameter) {
    var _a;
    var results = changePoint.Bayesian(series);
    var changePointsResult = [];
    // significanceBenchmark is equivalent to the confidence interval in hypothesis testing
    var significanceBenchmark = 1 - ((_a = changePointsParameter === null || changePointsParameter === void 0 ? void 0 : changePointsParameter.threshold) !== null && _a !== void 0 ? _a : CHANGE_POINT_SIGNIFICANCE_BENCHMARK);
    results.forEach(function (item) {
        // item.significance is similar to confidence interval
        if ((item === null || item === void 0 ? void 0 : item.index) >= 0 && (item === null || item === void 0 ? void 0 : item.significance) >= significanceBenchmark) {
            changePointsResult.push(item);
        }
    });
    return changePointsResult;
};
export var getChangePointInfo = function (props) {
    var valid = preValidation(props);
    var insightType = 'change_point';
    if (isString(valid))
        return getNonSignificantInsight({ detailInfo: valid, insightType: insightType, infoType: 'verificationFailure' });
    var data = props.data;
    var _a = getAlgorithmCommonInput(props), dimension = _a.dimension, values = _a.values, measure = _a.measure;
    if (isNil(dimension) || isNil(measure))
        return getNonSignificantInsight({
            detailInfo: 'Measure or dimension is empty.',
            insightType: insightType,
            infoType: 'verificationFailure',
        });
    var changePointsParameter = get(props, 'options.algorithmParameter.changePoint');
    var changePoints = findChangePoints(values, changePointsParameter);
    if (changePoints.length === 0) {
        var info = 'Bayesian Online Changepoint Detection does not pass.';
        return getNonSignificantInsight({ insightType: insightType, infoType: 'noInsight', customInfo: { info: info } });
    }
    var outliers = [];
    changePoints.forEach(function (item) {
        var index = item.index, significance = item.significance;
        if (!isNil(data[index])) {
            outliers.push({
                type: insightType,
                dimension: dimension,
                measure: measure,
                significance: significance,
                index: index,
                x: data[index][dimension],
                y: data[index][measure],
                significantInsight: true,
            });
        }
    });
    return outliers;
};
