import { __extends } from "tslib";
/* eslint-disable no-template-curly-in-string */
import { generateTextSpec } from '../../../ntv';
import { InsightNarrativeStrategy } from './base';
import { getInsightName, getDefaultSeparator } from './helpers';
var variableMetaMap = {
    measures: {
        varType: 'metric_name',
    },
};
var CommonnessNarrativeStrategy = /** @class */ (function (_super) {
    __extends(CommonnessNarrativeStrategy, _super);
    function CommonnessNarrativeStrategy() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CommonnessNarrativeStrategy.prototype.generateTextSpec = function (insightInfo, lang) {
        var measures = insightInfo.measures, dimensions = insightInfo.dimensions, insightType = insightInfo.insightType;
        var spec = generateTextSpec({
            structures: CommonnessNarrativeStrategy.structures[lang],
            variable: {
                measures: measures.map(function (m) { return m.fieldName; }).join(getDefaultSeparator(lang)),
                dimensions: dimensions.map(function (m) { return m.fieldName; }).join(getDefaultSeparator(lang)),
                insightType: getInsightName(insightType, lang),
            },
        });
        return spec.sections[0].paragraphs;
    };
    CommonnessNarrativeStrategy.insightType = 'commonness';
    CommonnessNarrativeStrategy.structures = {
        'zh-CN': [
            {
                template: '大部分 ${dimensions} 的维值在 ${measures} 上具有 ${insightType}。',
                variableMetaMap: variableMetaMap,
            },
        ],
        'en-US': [
            {
                template: 'Most of the dimension values of ${dimensions} have ${insightType} on ${measures}.',
                variableMetaMap: variableMetaMap,
            },
        ],
    };
    return CommonnessNarrativeStrategy;
}(InsightNarrativeStrategy));
export default CommonnessNarrativeStrategy;
