import { __assign, __read, __spreadArray } from "tslib";
import { groupBy, uniq, flatten, isString } from 'lodash';
import { PATTERN_TYPES, INSIGHT_SCORE_BENCHMARK, IMPACT_SCORE_WEIGHT } from '../constant';
import { insightPatternsExtractor, ExtractorCheckers } from '../insights';
import { aggregate } from '../utils/aggregate';
import { extractHomogeneousPatternsForMeasures, extractHomogeneousPatternsForSiblingGroups, } from '../insights/extractors/homogeneous';
import { calculateImpactValue } from './preprocess';
import { addInsightsToHeap } from './util';
/** calculate the Impact which reflects the importance of the subject of an insight against the entire dataset  */
function computeSubspaceImpact(data, subspace, impactMeasureReferences, measures) {
    if (!(measures === null || measures === void 0 ? void 0 : measures.length) || !subspace)
        return 1;
    var impactValues = measures.map(function (measure) {
        var measureValue = calculateImpactValue(data, measure);
        var referenceKey = "".concat(measure.fieldName, "@").concat(measure.method);
        var referenceValue = impactMeasureReferences[referenceKey];
        return measureValue / referenceValue;
    });
    return Math.max.apply(Math, __spreadArray([], __read(impactValues), false));
}
/** extract patterns from a specific subject */
function extractPatternsFromSubject(data, subjectInfo, fieldPropsMap, options) {
    var measures = subjectInfo.measures, dimensions = subjectInfo.dimensions;
    var enumInsightTypes = (options === null || options === void 0 ? void 0 : options.insightTypes) || PATTERN_TYPES;
    var patterns = {};
    enumInsightTypes.forEach(function (insightType) {
        var insightExtractorChecker = ExtractorCheckers[insightType];
        var isValid = true;
        // Check whether the data requirements of the extractor are met
        if (insightExtractorChecker) {
            if (isString(insightExtractorChecker({ data: data, subjectInfo: subjectInfo, fieldPropsMap: fieldPropsMap })))
                isValid = false;
        }
        if (isValid && insightPatternsExtractor) {
            var _a = options || {}, algorithmParameter = _a.algorithmParameter, dataProcessInfo = _a.dataProcessInfo;
            var extractorOptions = {
                algorithmParameter: algorithmParameter,
                dataProcessInfo: dataProcessInfo,
                // Validation has been done in method extractInsights
                dataValidation: false,
                // Select only significant insights
                filterInsight: true,
            };
            var extractedPatterns = insightPatternsExtractor({
                data: data,
                dimensions: dimensions.map(function (dim) { return ({ fieldName: dim }); }),
                measures: measures,
                insightType: insightType,
                options: extractorOptions,
            });
            patterns[insightType] = extractedPatterns;
        }
        else {
            patterns[insightType] = undefined;
        }
    });
    return patterns;
}
export function extractInsightsFor1M1DCombination(data, dimensions, measures, subspace, referenceInfo, options) {
    var fieldPropsMap = referenceInfo.fieldPropsMap;
    var insights = [];
    dimensions.forEach(function (dimension) {
        var _a, _b;
        var insightsPerDim = [];
        var isTimeField = (_b = (_a = fieldPropsMap[dimension]) === null || _a === void 0 ? void 0 : _a.levelOfMeasurements) === null || _b === void 0 ? void 0 : _b.includes('Time');
        measures.forEach(function (measure) {
            var childSubjectInfo = { dimensions: [dimension], subspace: subspace, measures: [measure] };
            var aggregatedData = aggregate(data, dimension, [measure], isTimeField);
            var patterns = extractPatternsFromSubject(aggregatedData, childSubjectInfo, fieldPropsMap, options);
            var patternsArray = flatten(Object.values(patterns).filter(function (item) { return (item === null || item === void 0 ? void 0 : item.length) > 0; })).sort(function (a, b) { return b.significance - a.significance; });
            if (patternsArray.length) {
                var insight = {
                    subspace: subspace,
                    dimensions: [
                        {
                            fieldName: dimension,
                        },
                    ],
                    measures: [measure],
                    patterns: patternsArray,
                    data: aggregatedData,
                    score: patternsArray[0].significance,
                };
                insightsPerDim.push(insight);
            }
            else {
                insightsPerDim.push(null);
            }
        });
        insights.push(insightsPerDim);
    });
    return insights;
}
export function extractInsightsForCorrelation(data, dimensions, measures, subspace, referenceInfo, options) {
    var _a;
    var fieldPropsMap = referenceInfo.fieldPropsMap;
    var insights = [];
    var measureNum = measures.length;
    if (measureNum >= 2) {
        for (var i = 0; i < measureNum - 1; i += 1) {
            for (var j = i + 1; j < measureNum; j += 1) {
                var childSubjectInfo = { dimensions: dimensions, subspace: subspace, measures: [measures[i], measures[j]] };
                var patterns = extractPatternsFromSubject(data, childSubjectInfo, fieldPropsMap, __assign(__assign({}, options), { insightTypes: ['correlation'] }));
                var patternsArray = (_a = patterns === null || patterns === void 0 ? void 0 : patterns.correlation) === null || _a === void 0 ? void 0 : _a.sort(function (a, b) { return b.significance - a.significance; });
                if (patternsArray === null || patternsArray === void 0 ? void 0 : patternsArray.length) {
                    var insight = {
                        subspace: subspace,
                        dimensions: dimensions.map(function (d) { return ({ fieldName: d }); }),
                        measures: [measures[i], measures[j]],
                        patterns: patternsArray,
                        data: data,
                        score: patternsArray[0].significance,
                    };
                    insights.push(insight);
                }
            }
        }
    }
    return insights;
}
/** recursive extraction in data subspace */
export function extractInsightsFromSubspace(data, dimensions, measures, subspace, referenceInfo, insightsHeap, homogeneousInsightsHeap, options) {
    var _a, _b;
    /** subspace pruning */
    if (!(data === null || data === void 0 ? void 0 : data.length)) {
        return [];
    }
    // calculate impact score
    var impactMeasureReferences = referenceInfo.impactMeasureReferences, fieldPropsMap = referenceInfo.fieldPropsMap;
    // console.log('e-1',impactMeasureReferences)
    var subspaceImpact = computeSubspaceImpact(data, subspace, impactMeasureReferences, options === null || options === void 0 ? void 0 : options.impactMeasures);
    // console.log('e-2',subspaceImpact)
    // pruning1: check the subpace impact limit
    if (subspaceImpact < INSIGHT_SCORE_BENCHMARK) {
        return [];
    }
    // pruning2: check if the impact score is greater than the minimum score in heap
    var impactScoreWeight = !!(options === null || options === void 0 ? void 0 : options.impactWeight) && options.impactWeight >= 0 && options.impactWeight < 1
        ? options.impactWeight
        : IMPACT_SCORE_WEIGHT;
    var optimalScore = subspaceImpact * impactScoreWeight + 1 * (1 - impactScoreWeight);
    if (insightsHeap.length >= insightsHeap.limit) {
        var minScoreInHeap = (_a = insightsHeap.peek()) === null || _a === void 0 ? void 0 : _a.score;
        if (optimalScore <= minScoreInHeap) {
            return [];
        }
    }
    /** insight extraction */
    var insights = [];
    /** Combination: 1M * 1D */
    var insightsFor1M1DCombination = extractInsightsFor1M1DCombination(data, dimensions, measures, subspace, referenceInfo, options);
    insightsFor1M1DCombination.forEach(function (insightsPerDim) {
        var insightsForMeasures = insightsPerDim
            .filter(function (item) { return !!item; })
            .map(function (item) { return (__assign(__assign({}, item), { score: item.score * (1 - impactScoreWeight) + subspaceImpact * impactScoreWeight })); });
        insights.push.apply(insights, __spreadArray([], __read(insightsPerDim), false));
        addInsightsToHeap(insightsForMeasures, insightsHeap);
    });
    // Combination 3: 1M * 1M */
    if ((options.insightTypes || PATTERN_TYPES).includes('correlation')) {
        var extracted = extractInsightsForCorrelation(data, dimensions, measures, subspace, referenceInfo, options);
        var insightsForCorrelation = extracted === null || extracted === void 0 ? void 0 : extracted.map(function (item) { return (__assign(__assign({}, item), { score: item.score * (1 - impactScoreWeight) + subspaceImpact * impactScoreWeight })); });
        addInsightsToHeap(insightsForCorrelation, insightsHeap);
    }
    /**  extract homogeneous insight in measures */
    if (options === null || options === void 0 ? void 0 : options.homogeneous) {
        insightsFor1M1DCombination.forEach(function (insightsPerDim, dimIndex) {
            var homogeneousPatternsForMeasures = extractHomogeneousPatternsForMeasures(measures, insightsPerDim);
            if (homogeneousPatternsForMeasures.length > 0) {
                var homogeneousInsights = homogeneousPatternsForMeasures.map(function (pattern) { return ({
                    subspace: subspace,
                    dimensions: [{ fieldName: dimensions[dimIndex] }],
                    measures: measures,
                    patterns: [pattern],
                    data: data,
                    score: pattern.significance * (1 - impactScoreWeight) + subspaceImpact * impactScoreWeight,
                }); });
                homogeneousInsightsHeap.addAll(homogeneousInsights);
            }
        });
    }
    /** subspace search */
    if (!(options === null || options === void 0 ? void 0 : options.ignoreSubspace)) {
        var searchedDimensions_1 = subspace.map(function (item) { return item.dimension; });
        var remainDimensionFields_1 = (((_b = options === null || options === void 0 ? void 0 : options.dimensions) === null || _b === void 0 ? void 0 : _b.map(function (dimension) { return dimension.fieldName; })) ||
            Object.values(fieldPropsMap)
                .filter(function (item) { return item.domainType === 'dimension'; })
                .map(function (item) { return item.name; })).filter(function (field) { return !searchedDimensions_1.includes(field); });
        if (remainDimensionFields_1.length > 0) {
            remainDimensionFields_1.forEach(function (dimension) {
                var siblingGroupInsights = [];
                var groupedData = groupBy(data, dimension);
                var breakdownValues = uniq(fieldPropsMap[dimension].rawData);
                var dimensionsInSubspace = remainDimensionFields_1.filter(function (item) { return item !== dimension; });
                if (breakdownValues.length > 1) {
                    breakdownValues.forEach(function (value) {
                        var childSubspace = __spreadArray(__spreadArray([], __read(subspace), false), [{ dimension: dimension, value: value }], false);
                        var subspaceInsights = extractInsightsFromSubspace(groupedData[value], dimensionsInSubspace, measures, childSubspace, referenceInfo, insightsHeap, homogeneousInsightsHeap, options);
                        siblingGroupInsights.push(subspaceInsights);
                    });
                }
                /** extract homegenehous insight in sibling group */
                if (options === null || options === void 0 ? void 0 : options.homogeneous) {
                    dimensionsInSubspace.forEach(function (dim) {
                        measures.forEach(function (measure) {
                            var siblingGroupInsightsArr = siblingGroupInsights.map(function (siblingItem) {
                                return (siblingItem.find(function (insight) {
                                    return (!!insight &&
                                        insight.dimensions.length === 1 &&
                                        insight.dimensions[0].fieldName === dim &&
                                        insight.measures.length === 1 &&
                                        insight.measures[0].fieldName === measure.fieldName);
                                }) || null);
                            });
                            var homogeneousPatternsForSiblingGroups = extractHomogeneousPatternsForSiblingGroups(breakdownValues, siblingGroupInsightsArr);
                            var insightsForSiblingGroup = homogeneousPatternsForSiblingGroups.map(function (pattern) { return ({
                                subspace: subspace,
                                dimensions: [{ fieldName: dimension }, { fieldName: dim }],
                                measures: [measure],
                                patterns: [pattern],
                                data: data,
                                score: pattern.significance * (1 - impactScoreWeight) + subspaceImpact * impactScoreWeight,
                            }); });
                            homogeneousInsightsHeap.addAll(insightsForSiblingGroup);
                        });
                    });
                }
            });
        }
    }
    return insights;
}
/** insight subject enumeration in the data */
export function enumerateInsights(data, dimensions, measures, referenceInfo, insightsHeap, metaInsightsHeap, options) {
    if (options === void 0) { options = {}; }
    var initSubspace = [];
    extractInsightsFromSubspace(data, dimensions, measures, initSubspace, referenceInfo, insightsHeap, metaInsightsHeap, options);
}
