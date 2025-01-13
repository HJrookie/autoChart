import { __read, __spreadArray } from "tslib";
import { flow, isFunction } from 'lodash';
import { getCategoryOutlierInfo } from './extractors/categoryOutlier';
import { getChangePointInfo } from './extractors/changePoint';
import { getCorrelationInfo } from './extractors/correlation';
import { getLowVarianceInfo } from './extractors/lowVariance';
import { getMajorityInfo } from './extractors/majority';
import { getTimeSeriesOutlierInfo } from './extractors/timeSeriesOutlier';
import { getTrendInfo } from './extractors/trend';
import { pickValidPattern } from './util';
export var extractorMap = {
    category_outlier: getCategoryOutlierInfo,
    trend: getTrendInfo,
    change_point: getChangePointInfo,
    time_series_outlier: getTimeSeriesOutlierInfo,
    majority: getMajorityInfo,
    low_variance: getLowVarianceInfo,
    correlation: getCorrelationInfo,
};
export var insightPatternsExtractor = function (props) {
    var _a = props.insightType, insightType = _a === void 0 ? 'trend' : _a, options = props.options;
    var _b = (options || {}).filterInsight, filterInsight = _b === void 0 ? false : _b;
    var extractor = extractorMap[insightType];
    if (!isFunction(extractor))
        return [];
    return flow(__spreadArray([extractor], __read((filterInsight ? [pickValidPattern] : [])), false))(props);
};
export * from './checkers';
