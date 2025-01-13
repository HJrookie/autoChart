import { get, isNil, isString } from 'lodash';
import { getAlgorithmCommonInput, getNonSignificantInsight, preValidation } from '../util';
var DEFAULT_PROPORTION_LIMIT = 0.6;
export function findMajority(values, majorityParameter) {
    var sum = 0;
    var max = -Infinity;
    var maxIndex = -1;
    for (var i = 0; i < (values === null || values === void 0 ? void 0 : values.length); i += 1) {
        sum += values[i];
        if (values[i] > max) {
            max = values[i];
            maxIndex = i;
        }
    }
    var proportionLimit = (majorityParameter === null || majorityParameter === void 0 ? void 0 : majorityParameter.limit) || DEFAULT_PROPORTION_LIMIT;
    if (sum === 0)
        return null;
    var proportion = max / sum;
    if (proportion > proportionLimit && proportion < 1) {
        return {
            index: maxIndex,
            value: max,
            proportion: proportion,
            significance: proportion,
        };
    }
    return null;
}
export var getMajorityInfo = function (props) {
    var valid = preValidation(props);
    var insightType = 'majority';
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
    var majorityParameter = get(props, 'options.algorithmParameter.majority');
    var majority = findMajority(values, majorityParameter);
    if (majority) {
        var significance = majority.significance, index = majority.index, proportion = majority.proportion;
        return [
            {
                type: insightType,
                dimension: dimension,
                measure: measure,
                significance: significance,
                index: index,
                proportion: proportion,
                x: data[index][dimension],
                y: data[index][measure],
                significantInsight: true,
            },
        ];
    }
    var info = "After disassembling with the given dimension, the proportion of the maximum value does not exceed ".concat((majorityParameter === null || majorityParameter === void 0 ? void 0 : majorityParameter.limit) || DEFAULT_PROPORTION_LIMIT, ".");
    return getNonSignificantInsight({
        insightType: insightType,
        infoType: 'noInsight',
        customInfo: { info: info, dimension: dimension, measure: measure },
    });
};
