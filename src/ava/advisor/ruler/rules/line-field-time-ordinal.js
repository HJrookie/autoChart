import { intersects } from '../../utils';
import { MAX_SOFT_RULE_COEFFICIENT } from './constants';
var applyChartTypes = ['line_chart', 'area_chart', 'stacked_area_chart', 'percent_stacked_area_chart'];
export var lineFieldTimeOrdinal = {
    id: 'line-field-time-ordinal',
    type: 'SOFT',
    docs: {
        lintText: 'Data containing time or ordinal fields are suitable for line or area charts.',
    },
    trigger: function (_a) {
        var chartType = _a.chartType;
        return applyChartTypes.includes(chartType);
    },
    validator: function (args) {
        var result = 1;
        var dataProps = args.dataProps;
        if (dataProps) {
            var field4TimeOrOrdinal = dataProps.find(function (field) { return intersects(field.levelOfMeasurements, ['Ordinal', 'Time']); });
            if (field4TimeOrOrdinal) {
                result = MAX_SOFT_RULE_COEFFICIENT * 0.5;
            }
        }
        return result;
    },
};
