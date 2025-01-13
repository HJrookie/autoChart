import { intersects } from '../../utils';
import { compare } from '../utils';
import { MAX_SOFT_RULE_COEFFICIENT } from './constants';
function hasSeriesField(dataProps) {
    var nominalOrOrdinalFields = dataProps.filter(function (field) {
        return intersects(field.levelOfMeasurements, ['Nominal', 'Ordinal']);
    });
    return nominalOrOrdinalFields.length >= 2;
}
/*
只有 heatmap 能映射两个 维值非常多的 字段，因为对于 其他图表，如柱状图来说，第二个维度字段 就要映射成 颜色了。而颜色不适合映射特别多的维度。
所以，在有 两个 维度字段的时候，在两个维度的维值都很多的情况下，要给 heatmap 加分，给其他图表减分。
 */
export var limitSeries = {
    id: 'limit-series',
    type: 'SOFT',
    docs: {
        lintText: 'Avoid too many values in one series.',
    },
    trigger: function (_a) {
        var dataProps = _a.dataProps;
        return hasSeriesField(dataProps);
    },
    validator: function (args) {
        var result = 1;
        var dataProps = args.dataProps, chartType = args.chartType;
        if (dataProps) {
            var nominalOrOrdinalFields = dataProps.filter(function (field) {
                return intersects(field.levelOfMeasurements, ['Nominal', 'Ordinal']);
            });
            if (nominalOrOrdinalFields.length >= 2) {
                var sortedFields = nominalOrOrdinalFields.sort(compare);
                var f = sortedFields[1];
                if (f.distinct) {
                    result = f.distinct > MAX_SOFT_RULE_COEFFICIENT ? 1 / MAX_SOFT_RULE_COEFFICIENT : 1 / f.distinct;
                    if (f.distinct > 6 && chartType === 'heatmap') {
                        result = MAX_SOFT_RULE_COEFFICIENT * 0.5;
                    }
                    else if (chartType === 'heatmap') {
                        result = 1;
                    }
                }
            }
        }
        return result;
    },
};
