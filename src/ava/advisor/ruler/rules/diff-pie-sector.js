import { hasSubset } from '../../utils';
import { MAX_SOFT_RULE_COEFFICIENT } from './constants';
var applyChartTypes = ['pie_chart', 'donut_chart'];
export var diffPieSector = {
    id: 'diff-pie-sector',
    type: 'SOFT',
    docs: {
        lintText: 'The difference between sectors of a pie chart should be large enough.',
    },
    trigger: function (_a) {
        var chartType = _a.chartType;
        return applyChartTypes.includes(chartType);
    },
    validator: function (args) {
        var result = 1;
        var dataProps = args.dataProps;
        if (dataProps) {
            var intervalField = dataProps.find(function (field) { return hasSubset(field.levelOfMeasurements, ['Interval']); });
            if (intervalField && intervalField.sum && intervalField.rawData) {
                var sum = intervalField.sum;
                var scale_1 = 1 / sum;
                var scaledSamples = intervalField.rawData.map(function (v) { return v * scale_1; });
                var scaledProduct = scaledSamples.reduce(function (a, c) { return a * c; });
                var count = intervalField.rawData.length;
                var maxProduct = Math.pow((1 / count), count);
                // Math.abs(maxProduct - Math.abs(scaledProduct)) / maxProduct 这个值 小于 0.5 会被认为有点问题
                result = MAX_SOFT_RULE_COEFFICIENT * 0.2 * (Math.abs(maxProduct - Math.abs(scaledProduct)) / maxProduct);
            }
        }
        result = result < 1 / MAX_SOFT_RULE_COEFFICIENT ? 1 / MAX_SOFT_RULE_COEFFICIENT : result;
        return result;
    },
};
