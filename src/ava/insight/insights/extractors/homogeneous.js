import { __read, __spreadArray } from "tslib";
import { groupBy, flatten } from 'lodash';
import { PATTERN_TYPES } from '../../constant';
/**
 * homogeneous data pattern (HDP) represents a set of basic data patterns that share certain relations. HDP are identified by categorizing basic data patterns (within an HDP) into commonness(es) and exceptions considering inter-pattern similarity,
 */
function extractHomogeneousPatterns(collection, type) {
    var _a, _b;
    var homogeneousPatterns = [];
    var scopeLength = collection.length;
    var validScopes = collection.filter(function (item) { var _a; return item.patterns && ((_a = item.patterns) === null || _a === void 0 ? void 0 : _a.length) > 0; });
    if (validScopes.length > 1) {
        if (type === 'trend') {
            var parts = Object.values(groupBy(collection, 'patterns.0.trend')).sort(function (a, b) { return b.length - a.length; });
            if (parts.length === 2 &&
                ((_b = (_a = parts[0][0]) === null || _a === void 0 ? void 0 : _a.patterns) === null || _b === void 0 ? void 0 : _b.length) &&
                parts[0].length / scopeLength > 0.75 &&
                parts[1].length < 5) {
                homogeneousPatterns.push({
                    type: 'exception',
                    insightType: type,
                    childPatterns: flatten(validScopes.map(function (item) { return item.patterns; })),
                    commonSet: parts[0].map(function (item) { return item.key; }),
                    exceptions: parts[1].map(function (item) { return item.key; }),
                    significance: 1 - parts[1].length / scopeLength,
                });
            }
            else {
                parts.forEach(function (part) {
                    var _a;
                    var ratio = part.length / scopeLength;
                    if (ratio > 0.3 && part.length >= 3 && ((_a = part[0]) === null || _a === void 0 ? void 0 : _a.patterns)) {
                        var childPatterns = flatten(part.map(function (item) { return item.patterns; }));
                        if (childPatterns.length) {
                            homogeneousPatterns.push({
                                type: 'commonness',
                                insightType: type,
                                childPatterns: childPatterns,
                                commonSet: part.map(function (item) { return item.key; }),
                                significance: ratio,
                            });
                        }
                    }
                });
            }
        }
        if (['change_point', 'outlier', 'time_series_outlier'].includes(type)) {
            var commonSetIndexes = Object.values(groupBy(flatten(validScopes.map(function (item) { return item.patterns.map(function (item) { return item.index; }); })))).sort(function (a, b) { return b.length - a.length; });
            commonSetIndexes.forEach(function (indexArr) {
                var ratio = indexArr.length / scopeLength;
                if (ratio > 0.3 && indexArr.length >= 3) {
                    var scopes = validScopes.filter(function (item) {
                        return item.patterns.some(function (item) { return item.index === indexArr[0]; });
                    });
                    var childPatterns = flatten(scopes.map(function (item) { return item.patterns.filter(function (item) { return item.index === indexArr[0]; }); }));
                    homogeneousPatterns.push({
                        type: 'commonness',
                        insightType: type,
                        childPatterns: childPatterns,
                        commonSet: scopes.map(function (item) { return item.key; }),
                        significance: ratio,
                    });
                }
            });
        }
    }
    return homogeneousPatterns;
}
export function extractHomogeneousPatternsForMeasures(measures, insightsCollection) {
    var series = measures.map(function (item) { return item.fieldName; });
    var patternsForAllMeasures = insightsCollection.map(function (item) { return item === null || item === void 0 ? void 0 : item.patterns; });
    var homogeneousPatterns = [];
    PATTERN_TYPES.forEach(function (type) {
        var patternCollection = patternsForAllMeasures.map(function (item, index) { return ({
            key: series[index],
            patterns: item === null || item === void 0 ? void 0 : item.filter(function (item) { return item.type === type; }),
        }); });
        var patterns = extractHomogeneousPatterns(patternCollection, type);
        homogeneousPatterns.push.apply(homogeneousPatterns, __spreadArray([], __read(patterns), false));
    });
    return homogeneousPatterns;
}
export function extractHomogeneousPatternsForSiblingGroups(siblingItems, insightsCollection) {
    var groupLength = insightsCollection.length;
    if (siblingItems.length !== groupLength)
        return [];
    var patternsForSiblingGroup = insightsCollection.map(function (item) { return item === null || item === void 0 ? void 0 : item.patterns; });
    var homogeneousPatterns = [];
    PATTERN_TYPES.forEach(function (type) {
        var patternCollection = patternsForSiblingGroup.map(function (arr, index) { return ({
            key: siblingItems[index],
            patterns: arr === null || arr === void 0 ? void 0 : arr.filter(function (item) { return item.type === type; }),
        }); });
        var patterns = extractHomogeneousPatterns(patternCollection, type);
        homogeneousPatterns.push.apply(homogeneousPatterns, __spreadArray([], __read(patterns), false));
    });
    return homogeneousPatterns;
}
