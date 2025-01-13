import { hasSubset } from '../../utils';
import { MAX_SOFT_RULE_COEFFICIENT } from './constants';
var applyChartTypes = [
    'bar_chart',
    'grouped_bar_chart',
    'stacked_bar_chart',
    'percent_stacked_bar_chart',
    'column_chart',
    'grouped_column_chart',
    'stacked_column_chart',
    'percent_stacked_column_chart',
];
export var barSeriesQty = {
    id: 'bar-series-qty',
    type: 'SOFT',
    docs: {
        lintText: 'Bar chart should has proper number of bars or bar groups.',
    },
    trigger: function (_a) {
        var chartType = _a.chartType;
        return applyChartTypes.includes(chartType);
    },
    validator: function (args) {
        var result = 1;
        var dataProps = args.dataProps, chartType = args.chartType;
        if (dataProps && chartType) {
            var field4Series = dataProps.find(function (field) { return hasSubset(field.levelOfMeasurements, ['Nominal']); });
            var seriesQty = field4Series && field4Series.count ? field4Series.count : 0;
            if (seriesQty > 20) {
                result = 20 / seriesQty;
            }
        }
        result = result < 1 / MAX_SOFT_RULE_COEFFICIENT ? 1 / MAX_SOFT_RULE_COEFFICIENT : result;
        return result;
    },
};
