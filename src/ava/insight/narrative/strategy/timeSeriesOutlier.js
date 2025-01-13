import { __assign, __extends } from "tslib";
/* eslint-disable no-template-curly-in-string */
import { first, last, maxBy, minBy } from 'lodash';
import { generateTextSpec } from '../../../ntv';
import { InsightNarrativeStrategy } from './base';
import { getDiffDesc } from './helpers';
var variableMetaMap = {
    dateRange: {
        varType: 'time_desc',
    },
    measure: {
        varType: 'metric_name',
    },
    max: {
        varType: 'metric_value',
    },
    min: {
        varType: 'metric_value',
    },
    total: {
        varType: 'metric_value',
    },
    '.x': {
        varType: 'dim_value',
    },
    '.y': {
        varType: 'metric_value',
    },
    '.base': {
        varType: 'metric_value',
    },
    '.diff': {
        varType: 'delta_value',
    },
};
var TimeSeriesOutlierNarrativeStrategy = /** @class */ (function (_super) {
    __extends(TimeSeriesOutlierNarrativeStrategy, _super);
    function TimeSeriesOutlierNarrativeStrategy() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TimeSeriesOutlierNarrativeStrategy.prototype.generateTextSpec = function (insightInfo, lang) {
        var patterns = insightInfo.patterns, data = insightInfo.data;
        var _a = patterns[0], measure = _a.measure, dimension = _a.dimension;
        var spec = generateTextSpec({
            structures: TimeSeriesOutlierNarrativeStrategy.structures[lang],
            variable: {
                dateRange: "".concat(first(data)[dimension], "~").concat(last(data)[dimension]),
                total: patterns.length,
                measure: measure,
                max: maxBy(data, measure)[measure],
                min: minBy(data, measure)[measure],
                outliers: patterns.map(function (point) {
                    var base = point.baselines[point.index];
                    var diff = point.y - base;
                    return __assign(__assign({}, point), { base: base, diffDesc: getDiffDesc(diff, lang), diff: diff });
                }),
            },
        });
        return spec.sections[0].paragraphs;
    };
    TimeSeriesOutlierNarrativeStrategy.insightType = 'time_series_outlier';
    TimeSeriesOutlierNarrativeStrategy.structures = {
        'zh-CN': [
            {
                template: '${dateRange}，${measure} 波动范围为最大值 ${max}, 最小值 ${min}，有 ${total} 个异常点，按超过基线大小排序如下：',
                variableMetaMap: variableMetaMap,
            },
            {
                template: '${.x}，${measure} 为 ${.y}, 相比基线（${.base}）${.diffDesc} ${.diff}。',
                displayType: 'bullet',
                bulletOrder: true,
                useVariable: 'outliers',
                variableMetaMap: variableMetaMap,
            },
        ],
        'en-US': [
            {
                template: 'In ${dateRange}, ${measure} fluctuates within the range of ${max} to ${min}, with ${total} outliers, sorted by size above the baseline as follows.',
                variableMetaMap: variableMetaMap,
            },
            {
                template: '${.x}, ${measure} for ${.y}, compared to the baseline value ${.base}, ${.diffDesc} ${.diff}.',
                displayType: 'bullet',
                bulletOrder: true,
                useVariable: 'outliers',
                variableMetaMap: variableMetaMap,
            },
        ],
    };
    return TimeSeriesOutlierNarrativeStrategy;
}(InsightNarrativeStrategy));
export default TimeSeriesOutlierNarrativeStrategy;
