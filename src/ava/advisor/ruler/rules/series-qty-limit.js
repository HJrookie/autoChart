import { hasSubset } from '../../utils';
import { MAX_SOFT_RULE_COEFFICIENT } from './constants';
var applyChartTypes = ['pie_chart', 'donut_chart', 'radar_chart', 'rose_chart'];
export var seriesQtyLimit = {
    id: 'series-qty-limit',
    type: 'SOFT',
    docs: {
        lintText: 'Some charts should has at most N values for the series.',
    },
    trigger: function (_a) {
        var chartType = _a.chartType;
        return applyChartTypes.includes(chartType);
    },
    validator: function (args) {
        var result = 1;
        var dataProps = args.dataProps, chartType = args.chartType;
        var limit = args.limit;
        if (!Number.isInteger(limit) || limit <= 0) {
            limit = 6;
            if (chartType === 'pie_chart' || chartType === 'donut_chart' || chartType === 'rose_chart')
                limit = 6;
            if (chartType === 'radar_chart')
                limit = 8;
        }
        if (dataProps) {
            var field4Series = dataProps.find(function (field) { return hasSubset(field.levelOfMeasurements, ['Nominal']); });
            var seriesQty = field4Series && field4Series.count ? field4Series.count : 0;
            if (seriesQty >= 2 && seriesQty <= limit) {
                result = MAX_SOFT_RULE_COEFFICIENT * 0.5 + 2 / seriesQty;
            }
        }
        return result;
    },
};
