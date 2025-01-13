import { __extends } from "tslib";
/* eslint-disable no-template-curly-in-string */
import { sumBy } from 'lodash';
import { generateTextSpec } from '../../../ntv';
import { InsightNarrativeStrategy } from './base';
var variableMetaMap = {
    measure: {
        varType: 'metric_name',
    },
    total: {
        varType: 'metric_value',
    },
    proportion: {
        varType: 'proportion',
    },
    dimValue: {
        varType: 'dim_value',
    },
    y: {
        varType: 'metric_value',
    },
};
var MajorityNarrativeStrategy = /** @class */ (function (_super) {
    __extends(MajorityNarrativeStrategy, _super);
    function MajorityNarrativeStrategy() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MajorityNarrativeStrategy.prototype.generateTextSpec = function (insightInfo, lang) {
        var patterns = insightInfo.patterns, data = insightInfo.data;
        var _a = patterns[0], dimension = _a.dimension, measure = _a.measure, x = _a.x, y = _a.y;
        var total = sumBy(data, measure);
        var spec = generateTextSpec({
            structures: MajorityNarrativeStrategy.structures[lang],
            variable: {
                dimension: dimension,
                measure: measure,
                dimValue: x,
                y: y,
                total: total,
                proportion: y / total,
            },
        });
        return spec.sections[0].paragraphs;
    };
    MajorityNarrativeStrategy.insightType = 'majority';
    MajorityNarrativeStrategy.structures = {
        'zh-CN': [
            {
                template: '按照 ${dimension} 对 ${measure} 进行拆解，${dimValue} 的 ${measure} 显著高于其他维值，为 ${y}, 占总数（${total}）的 ${proportion}。',
                variableMetaMap: variableMetaMap,
            },
        ],
        'en-US': [
            {
                template: 'Breaking down the ${measure} by ${dimension}, the ${measure} for ${dimValue} is significantly higher than the other dimensions, at ${y}, ${proportion} of the total (${total}).',
                variableMetaMap: variableMetaMap,
            },
        ],
    };
    return MajorityNarrativeStrategy;
}(InsightNarrativeStrategy));
export default MajorityNarrativeStrategy;
