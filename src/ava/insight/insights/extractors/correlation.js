import { __assign } from "tslib";
import { isString } from 'lodash';
import { pcorrtest } from '../../../data';
import { getNonSignificantInsight, preValidation } from '../util';
import { DEFAULT_PCORRTEST_OPTIONS } from '../../../data/statistics/constants';
export function findCorrelation(x, y, pCorrTestParameter) {
    var testResult = pcorrtest(x, y, pCorrTestParameter);
    // @ts-ignore Type Result is missing the "pcorr"
    var rejected = testResult.rejected, pcorr = testResult.pcorr;
    if (rejected) {
        return {
            pcorr: pcorr,
            significance: Math.abs(pcorr),
        };
    }
    return null;
}
export var getCorrelationInfo = function (props) {
    var _a, _b;
    var valid = preValidation(props);
    var insightType = 'correlation';
    var data = props.data, measures = props.measures, dimensions = props.dimensions, options = props.options;
    if (isString(valid) || !dimensions)
        return getNonSignificantInsight(__assign({ insightType: insightType, infoType: 'verificationFailure' }, (isString(valid) ? { detailInfo: valid } : {})));
    var xField = measures[0].fieldName;
    var yField = measures[1].fieldName;
    var x = data.map(function (item) { return item === null || item === void 0 ? void 0 : item[xField]; });
    var y = data.map(function (item) { return item === null || item === void 0 ? void 0 : item[yField]; });
    var correlationParameter = (_a = options === null || options === void 0 ? void 0 : options.algorithmParameter) === null || _a === void 0 ? void 0 : _a.correlation;
    var result = findCorrelation(x, y, correlationParameter);
    if (result) {
        return [
            __assign(__assign({}, result), { type: insightType, measures: [xField, yField], significantInsight: true }),
        ];
    }
    var info = "The Pearson product-moment correlation test does not pass at the specified significance level ".concat((_b = correlationParameter === null || correlationParameter === void 0 ? void 0 : correlationParameter.alpha) !== null && _b !== void 0 ? _b : DEFAULT_PCORRTEST_OPTIONS.alpha, ".");
    return getNonSignificantInsight({ insightType: insightType, infoType: 'noInsight', customInfo: { info: info } });
};
