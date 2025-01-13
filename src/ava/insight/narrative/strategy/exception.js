import { __extends } from "tslib";
/* eslint-disable no-template-curly-in-string */
import { generateTextSpec } from '../../../ntv';
import { InsightNarrativeStrategy } from './base';
import { getInsightName, getDefaultSeparator } from './helpers';
var variableMetaMap = {
    measures: {
        varType: 'metric_name',
    },
    '.dim': {
        varType: 'dim_value',
    },
};
var ExceptionNarrativeStrategy = /** @class */ (function (_super) {
    __extends(ExceptionNarrativeStrategy, _super);
    function ExceptionNarrativeStrategy() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ExceptionNarrativeStrategy.prototype.generateTextSpec = function (insightInfo, lang) {
        var measures = insightInfo.measures, dimensions = insightInfo.dimensions, insightType = insightInfo.insightType, exceptions = insightInfo.exceptions;
        var spec = generateTextSpec({
            structures: ExceptionNarrativeStrategy.structures[lang],
            structureTemps: ExceptionNarrativeStrategy.structureTemps[lang],
            variable: {
                measures: measures.map(function (m) { return m.fieldName; }).join(getDefaultSeparator(lang)),
                dimensions: dimensions.map(function (m) { return m.fieldName; }).join(getDefaultSeparator(lang)),
                insightType: getInsightName(insightType, lang),
                exceptions: exceptions.map(function (dim) { return ({ dim: dim }); }),
            },
        });
        return spec.sections[0].paragraphs;
    };
    ExceptionNarrativeStrategy.insightType = 'exception';
    ExceptionNarrativeStrategy.structures = {
        'zh-CN': [
            {
                template: '大部分 ${dimensions} 的维值在 ${measures} 上具有 ${insightType}，除了&{exceptionList}。',
                variableMetaMap: variableMetaMap,
            },
        ],
        'en-US': [
            {
                template: 'Most of the dimension values of ${dimensions} have ${insightType} on ${measures}, except for &{exceptionList}.',
                variableMetaMap: variableMetaMap,
            },
        ],
    };
    ExceptionNarrativeStrategy.structureTemps = {
        'zh-CN': [
            {
                templateId: 'exceptionList',
                template: '${.dim}',
                useVariable: 'exceptions',
                separator: getDefaultSeparator('zh-CN'),
                variableMetaMap: variableMetaMap,
            },
        ],
        'en-US': [
            {
                templateId: 'exceptionList',
                template: '${.dim}',
                useVariable: 'exceptions',
                separator: getDefaultSeparator('en-US'),
                variableMetaMap: variableMetaMap,
            },
        ],
    };
    return ExceptionNarrativeStrategy;
}(InsightNarrativeStrategy));
export default ExceptionNarrativeStrategy;
