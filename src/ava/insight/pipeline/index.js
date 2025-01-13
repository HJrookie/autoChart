import { __assign } from "tslib";
import { extractInsights, generateInsightsWithVisualizationSpec } from './insight';
export function getInsights(sourceData, options) {
    var extractResult = extractInsights(sourceData, options);
    if (options === null || options === void 0 ? void 0 : options.visualization) {
        // Provide all vis options
        var visOption = __assign({ lang: 'en-US' }, ((options === null || options === void 0 ? void 0 : options.visualization) === true ? {} : options === null || options === void 0 ? void 0 : options.visualization));
        return generateInsightsWithVisualizationSpec(extractResult, __assign(__assign({}, options), { visualization: visOption }));
    }
    return extractResult;
}
