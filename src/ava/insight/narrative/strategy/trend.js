import { __extends } from "tslib";
/* eslint-disable no-template-curly-in-string */
import { first, last } from 'lodash';
import { generateTextSpec } from '../../../ntv';
import { InsightNarrativeStrategy } from './base';
var trendMapping = {
    decreasing: '下降',
    increasing: '上升',
    'no trend': '无明显趋势。',
};
var variableMetaMap = {
    dateRange: {
        varType: 'time_desc',
    },
    trend: {
        varType: 'trend_desc',
    },
    measure: {
        varType: 'metric_name',
    },
};
var TrendNarrativeStrategy = /** @class */ (function (_super) {
    __extends(TrendNarrativeStrategy, _super);
    function TrendNarrativeStrategy() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TrendNarrativeStrategy.prototype.generateTextSpec = function (insightInfo, lang) {
        var patterns = insightInfo.patterns, data = insightInfo.data;
        var _a = patterns[0], dimension = _a.dimension, measure = _a.measure, trend = _a.trend;
        var spec = generateTextSpec({
            structures: TrendNarrativeStrategy.structures[lang],
            variable: {
                dateRange: "".concat(first(data)[dimension], "~").concat(last(data)[dimension]),
                measure: measure,
                trend: lang === 'en-US' ? trend : trendMapping[trend],
            },
        });
        return spec.sections[0].paragraphs;
    };
    TrendNarrativeStrategy.insightType = 'trend';
    TrendNarrativeStrategy.structures = {
        'zh-CN': [
            {
                template: '${dateRange}，${measure}${trend}。',
                variableMetaMap: variableMetaMap,
            },
        ],
        'en-US': [
            {
                template: 'In ${dateRange}, the ${measure} goes ${trend}.',
                variableMetaMap: variableMetaMap,
            },
        ],
    };
    return TrendNarrativeStrategy;
}(InsightNarrativeStrategy));
export default TrendNarrativeStrategy;
