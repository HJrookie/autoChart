import { __extends } from "tslib";
/* eslint-disable no-template-curly-in-string */
import { generateTextSpec } from '../../../ntv';
import { InsightNarrativeStrategy } from './base';
var variableMetaMap = {
    measure: {
        varType: 'metric_name',
    },
    mean: {
        varType: 'metric_value',
    },
};
var LowVarianceNarrativeStrategy = /** @class */ (function (_super) {
    __extends(LowVarianceNarrativeStrategy, _super);
    function LowVarianceNarrativeStrategy() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LowVarianceNarrativeStrategy.prototype.generateTextSpec = function (insightInfo, lang) {
        var patterns = insightInfo.patterns;
        var _a = patterns[0], dimension = _a.dimension, measure = _a.measure, mean = _a.mean;
        var spec = generateTextSpec({
            structures: LowVarianceNarrativeStrategy.structures[lang],
            variable: {
                dimension: dimension,
                measure: measure,
                mean: mean,
            },
        });
        return spec.sections[0].paragraphs;
    };
    LowVarianceNarrativeStrategy.insightType = 'low_variance';
    LowVarianceNarrativeStrategy.structures = {
        'zh-CN': [
            {
                template: '按照 ${dimension} 对 ${measure} 进行拆解，指标分布均匀，平均为 ${mean}。',
                variableMetaMap: variableMetaMap,
            },
        ],
        'en-US': [
            {
                template: 'The quantity is disassembled according to ${dimension}, and ${measure} are evenly distributed, with an average of ${mean}.',
                variableMetaMap: variableMetaMap,
            },
        ],
    };
    return LowVarianceNarrativeStrategy;
}(InsightNarrativeStrategy));
export default LowVarianceNarrativeStrategy;
