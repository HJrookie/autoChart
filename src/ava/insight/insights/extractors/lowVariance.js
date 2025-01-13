import { get, isNil, isString } from 'lodash';
import { coefficientOfVariance, mean } from '../../../data';
import { getAlgorithmCommonInput, getNonSignificantInsight, preValidation } from '../util';
// Coefficient of variation threshold
var CV_THRESHOLD = 0.15;
export function findLowVariance(values, lowVarianceParameter) {
    var cv = coefficientOfVariance(values);
    var cvThreshold = (lowVarianceParameter === null || lowVarianceParameter === void 0 ? void 0 : lowVarianceParameter.cvThreshold) || CV_THRESHOLD;
    if (cv >= cvThreshold) {
        return null;
    }
    // The smaller the CV is, the greater the significance is.
    var significance = 1 - cv;
    var meanValue = mean(values);
    return {
        significance: significance,
        mean: meanValue,
    };
}
export var getLowVarianceInfo = function (props) {
    var valid = preValidation(props);
    var insightType = 'low_variance';
    if (isString(valid))
        return getNonSignificantInsight({ detailInfo: valid, insightType: insightType, infoType: 'verificationFailure' });
    var _a = getAlgorithmCommonInput(props), dimension = _a.dimension, values = _a.values, measure = _a.measure;
    if (isNil(dimension) || isNil(measure))
        return getNonSignificantInsight({
            detailInfo: 'Measure or dimension is empty.',
            insightType: insightType,
            infoType: 'verificationFailure',
        });
    var lowVarianceParameter = get(props, 'options.algorithmParameter.lowVariance');
    var lowVariance = findLowVariance(values, lowVarianceParameter);
    if (lowVariance) {
        var significance = lowVariance.significance, mean_1 = lowVariance.mean;
        return [
            {
                type: insightType,
                dimension: dimension,
                measure: measure,
                significance: significance,
                mean: mean_1,
                significantInsight: true,
            },
        ];
    }
    var info = "The coefficient of variance of the data is greater than ".concat((lowVarianceParameter === null || lowVarianceParameter === void 0 ? void 0 : lowVarianceParameter.cvThreshold) || CV_THRESHOLD, ". The data does not follow a uniform distribution.");
    return getNonSignificantInsight({ insightType: insightType, infoType: 'noInsight', customInfo: { info: info } });
};
