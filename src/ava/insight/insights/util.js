import { __assign } from "tslib";
import { isNil, mean } from 'lodash';
import { standardDeviation, cdf, normalDistributionQuantile, max, min } from '../../data';
import { dataToDataProps } from '../pipeline/preprocess';
import { NO_PATTERN_INFO, VERIFICATION_FAILURE_INFO } from '../constant';
import { ExtractorCheckers } from './checkers';
export var calculatePValue = function (values, target, alternative) {
    if (alternative === void 0) { alternative = 'two-sided'; }
    var meanValue = mean(values);
    var std = standardDeviation(values);
    var cdfValue = cdf(target, meanValue, std);
    if (alternative === 'two-sided')
        return cdfValue < 0.5 ? 2 * cdfValue : 2 * (1 - cdfValue);
    if (alternative === 'less')
        return cdfValue;
    return 1 - cdfValue;
};
export var calculateOutlierThresholds = function (values, significance, alternative) {
    if (alternative === void 0) { alternative = 'two-sided'; }
    var meanValue = mean(values);
    var std = standardDeviation(values);
    var p = 1 - significance;
    if (alternative === 'greater')
        return [normalDistributionQuantile(significance, meanValue, std), max(values)];
    if (alternative === 'less')
        return [min(values), normalDistributionQuantile(p, meanValue, std)];
    return [
        normalDistributionQuantile(p / 2, meanValue, std),
        normalDistributionQuantile(significance + p / 2, meanValue, std),
    ];
};
export var getAlgorithmCommonInput = function (_a) {
    var _b, _c;
    var data = _a.data, dimensions = _a.dimensions, measures = _a.measures;
    var dimension = (_b = dimensions === null || dimensions === void 0 ? void 0 : dimensions[0]) === null || _b === void 0 ? void 0 : _b.fieldName;
    var measure = (_c = measures === null || measures === void 0 ? void 0 : measures[0]) === null || _c === void 0 ? void 0 : _c.fieldName;
    var values = data.map(function (item) { return Number(item === null || item === void 0 ? void 0 : item[measure]); });
    return { dimension: dimension, measure: measure, values: values };
};
export var preValidation = function (_a) {
    var data = _a.data, dimensions = _a.dimensions, measures = _a.measures, options = _a.options, insightType = _a.insightType;
    var _b = options || {}, _c = _b.dataValidation, dataValidation = _c === void 0 ? false : _c, dataProcessInfo = _b.dataProcessInfo;
    if (!data || data.length === 0)
        return 'No data. ';
    if (!dataValidation)
        return true;
    var filteredData = data.filter(function (item) { return !Object.values(item).some(function (v) { return v === null || v === undefined; }); });
    var dataProps = dataToDataProps(filteredData, dataProcessInfo);
    var fieldPropsMap = dataProps.reduce(function (acc, item) {
        acc[item.name] = item;
        return acc;
    }, {});
    var checker = ExtractorCheckers[insightType];
    if (!checker)
        return true;
    var result = checker({
        data: data,
        subjectInfo: { dimensions: dimensions === null || dimensions === void 0 ? void 0 : dimensions.map(function (dim) { return dim.fieldName; }), measures: measures, subspace: [] },
        fieldPropsMap: fieldPropsMap,
    });
    return result;
};
export var getNonSignificantInsight = function (_a) {
    var infoType = _a.infoType, insightType = _a.insightType, _b = _a.detailInfo, detailInfo = _b === void 0 ? '' : _b, _c = _a.customInfo, customInfo = _c === void 0 ? {} : _c;
    var info = "".concat(detailInfo).concat(infoType === 'noInsight' ? NO_PATTERN_INFO : VERIFICATION_FAILURE_INFO);
    return [
        __assign({ significantInsight: false, type: insightType, info: info, significance: 0 }, customInfo),
    ];
};
export var pickValidPattern = function (infos) {
    if (infos === void 0) { infos = []; }
    return infos.filter(function (info) { return info.significantInsight; });
};
export var pickValidTimeSeriesOutlierPatterns = function (infos) {
    if (infos === void 0) { infos = []; }
    return infos.filter(function (info) { return ![info.baselines, info.thresholds, info.x].every(isNil); });
};
