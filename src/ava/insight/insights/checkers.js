import { intersection } from 'lodash';
var fieldsQuantityChecker = function (subjectInfo, dimensionsQuantity, measuresQuantity) {
    var dimensions = subjectInfo.dimensions, measures = subjectInfo.measures;
    if (dimensions.length === dimensionsQuantity && measures.length === measuresQuantity)
        return true;
    return false;
};
var generalCheckerFor1M1D = function (_a) {
    var _b, _c, _d, _e;
    var data = _a.data, subjectInfo = _a.subjectInfo, fieldPropsMap = _a.fieldPropsMap, lom = _a.lom;
    var dimensions = subjectInfo.dimensions;
    // check data length
    if ((data === null || data === void 0 ? void 0 : data.length) < 3)
        return 'The data length is less than 3. ';
    // check field quantity
    if (!fieldsQuantityChecker(subjectInfo, 1, 1))
        return 'The length of the measure or dimension is not 1. ';
    // check dimension type
    if (Array.isArray(lom)
        ? !((_c = intersection((_b = fieldPropsMap[dimensions[0]]) === null || _b === void 0 ? void 0 : _b.levelOfMeasurements, lom)) === null || _c === void 0 ? void 0 : _c.length)
        : !((_e = (_d = fieldPropsMap[dimensions[0]]) === null || _d === void 0 ? void 0 : _d.levelOfMeasurements) === null || _e === void 0 ? void 0 : _e.includes(lom)))
        return "The type of the dimension field is not included in the option ".concat(Array.isArray(lom) ? lom : [lom], ". ");
    return true;
};
export var trendChecker = function (_a) {
    var data = _a.data, subjectInfo = _a.subjectInfo, fieldPropsMap = _a.fieldPropsMap;
    return generalCheckerFor1M1D({ data: data, subjectInfo: subjectInfo, fieldPropsMap: fieldPropsMap, lom: 'Time' });
};
export var categoryOutlierChecker = function (_a) {
    var data = _a.data, subjectInfo = _a.subjectInfo, fieldPropsMap = _a.fieldPropsMap;
    return generalCheckerFor1M1D({ data: data, subjectInfo: subjectInfo, fieldPropsMap: fieldPropsMap, lom: ['Nominal', 'Discrete', 'Ordinal'] });
};
export var changePointChecker = function (_a) {
    var data = _a.data, subjectInfo = _a.subjectInfo, fieldPropsMap = _a.fieldPropsMap;
    return generalCheckerFor1M1D({ data: data, subjectInfo: subjectInfo, fieldPropsMap: fieldPropsMap, lom: 'Time' });
};
export var timeSeriesChecker = function (_a) {
    var data = _a.data, subjectInfo = _a.subjectInfo, fieldPropsMap = _a.fieldPropsMap;
    return generalCheckerFor1M1D({ data: data, subjectInfo: subjectInfo, fieldPropsMap: fieldPropsMap, lom: 'Time' });
};
export var majorityChecker = function (_a) {
    var data = _a.data, subjectInfo = _a.subjectInfo, fieldPropsMap = _a.fieldPropsMap;
    var checkerFor1M1D = generalCheckerFor1M1D({
        data: data,
        subjectInfo: subjectInfo,
        fieldPropsMap: fieldPropsMap,
        lom: ['Nominal', 'Discrete', 'Ordinal', 'Time'],
    });
    if (checkerFor1M1D !== true)
        return checkerFor1M1D;
    var measures = subjectInfo.measures;
    if (!['count', 'sum'].includes(measures[0].method))
        return 'Measure is not aggregated in sum or count mode. ';
    return true;
};
export var lowVarianceChecker = function (_a) {
    var data = _a.data, subjectInfo = _a.subjectInfo, fieldPropsMap = _a.fieldPropsMap;
    var checkerFor1M1D = generalCheckerFor1M1D({
        data: data,
        subjectInfo: subjectInfo,
        fieldPropsMap: fieldPropsMap,
        lom: ['Nominal', 'Discrete', 'Ordinal'],
    });
    if (checkerFor1M1D !== true)
        return checkerFor1M1D;
    var measures = subjectInfo.measures;
    // 低方差检验使用变异系数 sigma/mean 作为检验统计量，要求均值不能为0
    if (['float', 'integer'].includes(fieldPropsMap[measures[0].fieldName].recommendation)) {
        if (fieldPropsMap[measures[0].fieldName].mean !== 0)
            return true;
        return 'The low variance test uses the coefficient of variation sigma/mean as the test statistic and requires that the mean cannot be 0. ';
    }
    return 'The recommended data type of measure is not float or integer. ';
};
export var correlationChecker = function (_a) {
    var _b, _c;
    var data = _a.data, subjectInfo = _a.subjectInfo, fieldPropsMap = _a.fieldPropsMap;
    var measures = subjectInfo.measures;
    // check data length
    if ((data === null || data === void 0 ? void 0 : data.length) < 3)
        return 'The data length is less than 3. ';
    // check field quantity
    if (measures.length !== 2)
        return 'The length of the measure or dimension is not 2. ';
    if (!((_b = fieldPropsMap[measures[0].fieldName].levelOfMeasurements) === null || _b === void 0 ? void 0 : _b.includes('Continuous')) ||
        !((_c = fieldPropsMap[measures[1].fieldName].levelOfMeasurements) === null || _c === void 0 ? void 0 : _c.includes('Continuous')))
        return 'Level of measurement is not continuous. ';
    return true;
};
export var ExtractorCheckers = {
    category_outlier: categoryOutlierChecker,
    trend: trendChecker,
    change_point: changePointChecker,
    time_series_outlier: timeSeriesChecker,
    low_variance: lowVarianceChecker,
    correlation: correlationChecker,
};
