import { __assign, __read } from "tslib";
import { groupBy, omit } from 'lodash';
import generateInsightNarrative from '../narrative';
import { generateInsightChartSpec } from '../chart';
export var generateInsightVisualizationSpec = function (insight, visualizationOptions) {
    if (visualizationOptions === void 0) { visualizationOptions = {
        lang: 'en-US',
    }; }
    var patterns = insight.patterns;
    var specs = [];
    if (!patterns.length)
        return [];
    var patternGroups = groupBy(patterns, function (pattern) { return pattern.type; });
    Object.entries(patternGroups).forEach(function (_a) {
        var _b = __read(_a, 2), patternType = _b[0], patternGroup = _b[1];
        var chartSpec = generateInsightChartSpec(__assign(__assign({}, insight), { patterns: patternGroup }));
        specs.push({
            patternType: patternType,
            chartSpec: chartSpec,
            narrativeSpec: generateInsightNarrative(__assign(__assign({}, insight), { patterns: patternGroup }), visualizationOptions),
        });
    });
    return specs;
};
export var generateHomogeneousInsightVisualizationSpec = function (insight, visualizationOptions) {
    if (visualizationOptions === void 0) { visualizationOptions = {
        lang: 'en-US',
    }; }
    var patterns = insight.patterns;
    var schemas = [];
    patterns.forEach(function (pattern) {
        var insightType = pattern.insightType;
        var chartSpec = {};
        schemas.push({
            patternType: insightType,
            chartSpec: chartSpec,
            narrativeSpec: generateInsightNarrative(__assign(__assign({}, omit(insight, ['patterns'])), pattern), visualizationOptions),
        });
    });
    return schemas;
};
