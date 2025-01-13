import { __extends } from "tslib";
/* eslint-disable no-template-curly-in-string */
import { generateTextSpec } from '../../../ntv';
import { InsightNarrativeStrategy } from './base';
import { getDefaultSeparator } from './helpers';
var variableMetaMap = {
    measure: {
        varType: 'metric_name',
    },
    total: {
        varType: 'metric_value',
    },
    '.x': {
        varType: 'dim_value',
    },
};
var CategoryOutlierNarrativeStrategy = /** @class */ (function (_super) {
    __extends(CategoryOutlierNarrativeStrategy, _super);
    function CategoryOutlierNarrativeStrategy() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CategoryOutlierNarrativeStrategy.prototype.generateTextSpec = function (insightInfo, lang) {
        var patterns = insightInfo.patterns;
        var _a = patterns[0], dimension = _a.dimension, measure = _a.measure;
        var spec = generateTextSpec({
            structures: CategoryOutlierNarrativeStrategy.structures[lang],
            variable: {
                dimension: dimension,
                measure: measure,
                total: patterns.length,
                patterns: patterns,
            },
            structureTemps: CategoryOutlierNarrativeStrategy.structureTemps[lang],
        });
        return spec.sections[0].paragraphs;
    };
    CategoryOutlierNarrativeStrategy.insightType = 'category_outlier';
    CategoryOutlierNarrativeStrategy.structures = {
        'zh-CN': [
            {
                template: '${measure} 在 ${dimension} 上有 ${total} 个类别相比其他维值突出：&{outliers}。',
                variableMetaMap: variableMetaMap,
            },
        ],
        'en-US': [
            {
                template: '${measure} has ${total} categories in the ${dimension} that are prominent compared to other dimensions: &{outliers}.',
                variableMetaMap: variableMetaMap,
            },
        ],
    };
    CategoryOutlierNarrativeStrategy.structureTemps = {
        'zh-CN': [
            {
                templateId: 'outliers',
                template: '${.x}',
                separator: getDefaultSeparator('zh-CN'),
                variableMetaMap: variableMetaMap,
                useVariable: 'patterns',
            },
        ],
        'en-US': [
            {
                templateId: 'outliers',
                template: '${.x}',
                separator: getDefaultSeparator('en-US'),
                variableMetaMap: variableMetaMap,
                useVariable: 'patterns',
            },
        ],
    };
    return CategoryOutlierNarrativeStrategy;
}(InsightNarrativeStrategy));
export default CategoryOutlierNarrativeStrategy;
