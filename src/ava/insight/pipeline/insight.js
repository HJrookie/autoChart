import { __assign } from "tslib";
import Heap from 'heap-js';
import { INSIGHT_DEFAULT_LIMIT } from '../constant';
import { aggregateWithSeries, aggregateWithMeasures } from '../utils/aggregate';
import { enumerateInsights } from './extract';
import { dataToDataProps, calculateImpactMeasureReferenceValues } from './preprocess';
import { generateHomogeneousInsightVisualizationSpec, generateInsightVisualizationSpec } from './visualize';
import { insightPriorityComparator, homogeneousInsightPriorityComparator } from './util';
export function extractInsights(sourceData, options) {
    var _a;
    // get data columns infomations (column type, statistics, etc.)
    var data = sourceData.filter(function (item) { return !Object.values(item).some(function (v) {
         return v === null || v === undefined; }); });
    var dataProps = dataToDataProps(data, options === null || options === void 0 ? void 0 : options.dataProcessInfo);
    var fieldPropsMap = dataProps.reduce(function (acc, item) {
        acc[item.name] = item;
        return acc;
    }, {});
    var impactMeasureReferences = calculateImpactMeasureReferenceValues(data, options === null || options === void 0 ? void 0 : options.impactMeasures);
    var referenceInfo = {
        fieldPropsMap: fieldPropsMap,
        impactMeasureReferences: impactMeasureReferences,
    };
    // console.log(1,referenceInfo)
    var measures = (options === null || options === void 0 ? void 0 : options.measures) ||
        dataProps
            .filter(function (item) { return item.domainType === 'measure'; })
            .map(function (item) { return ({
            fieldName: item.name,
            method: 'SUM',
        }); });
    var dimensions = ((_a = options === null || options === void 0 ? void 0 : options.dimensions) === null || _a === void 0 ? void 0 : _a.map(function (dimension) { return dimension.fieldName; })) ||
        dataProps.filter(function (item) { return item.domainType === 'dimension'; }).map(function (item) { return item.name; });
    // init insights storage
    // console.log(2,measures,dimensions)
    var insightsHeap = new Heap(insightPriorityComparator);
    var homogeneousInsightsHeap = new Heap(homogeneousInsightPriorityComparator);
    var insightsLimit = (options === null || options === void 0 ? void 0 : options.limit) || INSIGHT_DEFAULT_LIMIT;
    insightsHeap.limit = insightsLimit;
    insightsHeap.init([]);
    homogeneousInsightsHeap.init([]);
    // console.log(3,'before enumerate')
    // console.log('3------->data',data)
    console.log('3------->dim',dimensions)
    console.log('3------->mea',measures)
    // console.log('3------->referenceInfo',referenceInfo)
    enumerateInsights(data, dimensions, measures, referenceInfo, insightsHeap, homogeneousInsightsHeap, options);
    // console.log(4 ,'after enumerate')
    // get top N results
    var insights = [];
    var heapSize = insightsHeap.size();
    // console.log('size',heapSize,insightsLimit)
    var insightsSize = heapSize > insightsLimit ? insightsLimit : heapSize;
    for (var i = 0; i < insightsSize; i += 1) {
        // console.log('insight->',i,insightsSize,)
        var top_1 = insightsHeap.pop();
        insights.push(top_1);
    }
    var result = { insights: insights.reverse() };
    if (options === null || options === void 0 ? void 0 : options.homogeneous) {
        var homogeneousInsightsResult = [];
        var homogeneousHeapSize = homogeneousInsightsHeap.size();
        var homogeneousInsightsSize = homogeneousHeapSize > insightsLimit ? insightsLimit : homogeneousHeapSize;
        for (var i = 0; i < homogeneousInsightsSize; i += 1) {
            var top_2 = homogeneousInsightsHeap.pop();
            homogeneousInsightsResult.push(top_2);
        }
        result.homogeneousInsights = homogeneousInsightsResult.reverse();
    }
    return result;
}
export function generateInsightsWithVisualizationSpec(extraction, options) {
    var insights = extraction.insights, homogeneousInsights = extraction.homogeneousInsights;
    var insightsWithVis = insights.map(function (item) { return (__assign(__assign({}, item), { visualizationSpecs: generateInsightVisualizationSpec(item, options === null || options === void 0 ? void 0 : options.visualization) })); });
    var result = { insights: insightsWithVis };
    if (homogeneousInsights && (options === null || options === void 0 ? void 0 : options.homogeneous)) {
        var homogeneousInsightsWithVis = homogeneousInsights.map(function (item) {
            var visualizationSpecs = generateHomogeneousInsightVisualizationSpec(item, options.visualization);
            var data = item.data, measures = item.measures, dimensions = item.dimensions;
            var insight = __assign(__assign({}, item), { visualizationSpecs: visualizationSpecs });
            if (measures.length > 1) {
                insight.data = aggregateWithMeasures(data, dimensions[0].fieldName, measures);
            }
            else {
                insight.data = aggregateWithSeries(data, dimensions[0].fieldName, measures[0], dimensions[1].fieldName);
            }
            return insight;
        });
        result.homogeneousInsights = homogeneousInsightsWithVis;
    }
    return result;
}
