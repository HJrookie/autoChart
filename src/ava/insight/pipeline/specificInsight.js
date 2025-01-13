import { __assign } from "tslib";
import { size } from 'lodash';
import { generateInsightChartSpec, changePointAugmentedMarksStrategy, trendAugmentedMarksStrategy, timeSeriesOutlierStrategyAugmentedMarksStrategy, lowVarianceAugmentedMarkStrategy, categoryOutlierAugmentedMarksStrategy, } from '../chart';
import { insightPatternsExtractor } from '../insights';
import generateInsightNarrative from '../narrative';
import { pickValidPattern, pickValidTimeSeriesOutlierPatterns } from '../insights/util';
import { insight2ChartStrategy, viewSpecStrategy } from '../chart/strategy';
export var patternInfo2InsightInfo = function (props) {
    var dimensions = props.dimensions, measures = props.measures, data = props.data, patternInfos = props.patternInfos;
    return {
        subspace: [],
        dimensions: dimensions,
        measures: measures,
        patterns: patternInfos,
        data: data,
    };
};
export var getAnnotationSpec = function (insightInfo) {
    var _a, _b;
    var insightType = ((_a = insightInfo.patterns[0]) !== null && _a !== void 0 ? _a : {}).type;
    var insightType2AugmentedMarks = {
        trend: trendAugmentedMarksStrategy,
        change_point: changePointAugmentedMarksStrategy,
        time_series_outlier: timeSeriesOutlierStrategyAugmentedMarksStrategy,
        low_variance: lowVarianceAugmentedMarkStrategy,
        category_outlier: categoryOutlierAugmentedMarksStrategy,
    };
    return (_b = insightType2AugmentedMarks[insightType]) === null || _b === void 0 ? void 0 : _b.call(insightType2AugmentedMarks, insightInfo);
};
export var getChartSpecWithoutAugmentedMarks = function (insightInfo, insightType) {
    var chartMark = insight2ChartStrategy(__assign(__assign({}, insightInfo), (size(insightInfo.patterns) === 0
        ? {
            patterns: [{ type: insightType }],
        }
        : {})));
    return viewSpecStrategy([chartMark], insightInfo);
};
export var filterValidInsightInfoForAnnotationSpec = function (_a) {
    var _b = _a.patternInfos, patternInfos = _b === void 0 ? [] : _b, insightType = _a.insightType;
    if (insightType === 'time_series_outlier')
        return pickValidTimeSeriesOutlierPatterns(patternInfos);
    return pickValidPattern(patternInfos);
};
export var getSpecificInsight = function (props) {
    var _a = props.options, options = _a === void 0 ? {} : _a, insightType = props.insightType;
    var _b = options.visualizationOptions, visualizationOptions = _b === void 0 ? { lang: 'zh-CN' } : _b;
    var patternInfos = insightPatternsExtractor(props);
    var validPatternInfos = filterValidInsightInfoForAnnotationSpec({ patternInfos: patternInfos, insightType: insightType });
    var totalInsightInfo = patternInfo2InsightInfo(__assign(__assign({}, props), { patternInfos: patternInfos }));
    if (size(validPatternInfos)) {
        var validInsightInfo = patternInfo2InsightInfo(__assign(__assign({}, props), { patternInfos: validPatternInfos }));
        var annotationSpec = getAnnotationSpec(validInsightInfo);
        var chartSpec_1 = generateInsightChartSpec(validInsightInfo);
        var narrativeSpec = generateInsightNarrative(validInsightInfo, visualizationOptions);
        return __assign(__assign({}, totalInsightInfo), { visualizationSpecs: [
                {
                    annotationSpec: annotationSpec,
                    chartSpec: chartSpec_1,
                    patternType: insightType,
                    narrativeSpec: narrativeSpec,
                },
            ] });
    }
    var chartSpec = getChartSpecWithoutAugmentedMarks(totalInsightInfo, insightType);
    return __assign(__assign({}, totalInsightInfo), { visualizationSpecs: [
            {
                chartSpec: chartSpec,
                patternType: insightType,
            },
        ] });
};
