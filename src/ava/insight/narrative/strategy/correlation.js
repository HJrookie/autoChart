import { __extends, __read } from "tslib";
/* eslint-disable no-template-curly-in-string */
import { generateTextSpec } from '../../../ntv';
import { InsightNarrativeStrategy } from './base';
var variableMetaMap = {
    pcorr: {
        varType: 'metric_value',
    },
    m1: {
        varType: 'metric_value',
    },
    m2: {
        varType: 'metric_value',
    },
};
var CorrelationNarrativeStrategy = /** @class */ (function (_super) {
    __extends(CorrelationNarrativeStrategy, _super);
    function CorrelationNarrativeStrategy() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CorrelationNarrativeStrategy.prototype.generateTextSpec = function (insightInfo, lang) {
        var patterns = insightInfo.patterns;
        var _a = patterns[0], _b = __read(_a.measures, 2), m1 = _b[0], m2 = _b[1], pcorr = _a.pcorr;
        var spec = generateTextSpec({
            structures: CorrelationNarrativeStrategy.structures[lang],
            variable: {
                m1: m1,
                m2: m2,
                pcorr: pcorr,
            },
        });
        return spec.sections[0].paragraphs;
    };
    CorrelationNarrativeStrategy.insightType = 'correlation';
    CorrelationNarrativeStrategy.structures = {
        'zh-CN': [
            {
                template: '${m1} 与 ${m2} 相关性最大，相关系数为 ${pcorr}。',
                variableMetaMap: variableMetaMap,
            },
        ],
        'en-US': [
            {
                template: '${m1} is most correlated with ${m2} with a correlation coefficient of ${pcorr}.',
                variableMetaMap: variableMetaMap,
            },
        ],
    };
    return CorrelationNarrativeStrategy;
}(InsightNarrativeStrategy));
export default CorrelationNarrativeStrategy;
