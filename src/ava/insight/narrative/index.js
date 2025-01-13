import InsightNarrativeStrategyFactory from './factory';
function isHomogeneousPattern(insightInfo) {
    return 'childPatterns' in insightInfo;
}
export default function generateInsightNarrative(insightInfo, options) {
    var _a;
    var insightType = isHomogeneousPattern(insightInfo) ? insightInfo === null || insightInfo === void 0 ? void 0 : insightInfo.type : (_a = insightInfo === null || insightInfo === void 0 ? void 0 : insightInfo.patterns[0]) === null || _a === void 0 ? void 0 : _a.type;
    if (!insightType)
        throw Error('insight info has no insight type');
    var lang = options.lang;
    var strategy = InsightNarrativeStrategyFactory.getStrategy(insightType);
    var result = strategy.generateTextSpec(insightInfo, lang);
    return result;
}
