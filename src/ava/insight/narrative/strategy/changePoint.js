import { __extends } from "tslib";
/* eslint-disable no-template-curly-in-string */
import { first, last } from 'lodash';
import { generateTextSpec } from '../../../ntv';
import { InsightNarrativeStrategy } from './base';
var variableMetaMap = {
    dateRange: {
        varType: 'time_desc',
    },
    total: {
        varType: 'metric_value',
    },
    measure: {
        varType: 'metric_name',
    },
};
var ChangePointNarrativeStrategy = /** @class */ (function (_super) {
    __extends(ChangePointNarrativeStrategy, _super);
    function ChangePointNarrativeStrategy() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChangePointNarrativeStrategy.prototype.generateTextSpec = function (insightInfo, lang) {
        var patterns = insightInfo.patterns, data = insightInfo.data;
        var dimension = patterns[0].dimension;
        var spec = generateTextSpec({
            structures: ChangePointNarrativeStrategy.structures[lang],
            variable: {
                dateRange: "".concat(first(data)[dimension], "~").concat(last(data)[dimension]),
                measure: patterns[0].measure,
                total: patterns.length,
            },
        });
        return spec.sections[0].paragraphs;
    };
    ChangePointNarrativeStrategy.insightType = 'change_point';
    ChangePointNarrativeStrategy.structures = {
        'zh-CN': [
            {
                template: '${measure} 在 ${dateRange} 中，共出现 ${total} 次较大变化，值得关注。',
                variableMetaMap: variableMetaMap,
            },
        ],
        'en-US': [
            {
                template: 'In ${dateRange}, ${measure} has ${total} major changes, which is worthy of attention.',
                variableMetaMap: variableMetaMap,
            },
        ],
    };
    return ChangePointNarrativeStrategy;
}(InsightNarrativeStrategy));
export default ChangePointNarrativeStrategy;
