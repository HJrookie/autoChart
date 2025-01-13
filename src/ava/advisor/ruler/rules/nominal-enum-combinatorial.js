import { hasSubset } from '../../utils';
import { compare } from '../utils';
import { MAX_SOFT_RULE_COEFFICIENT } from './constants';
var applyChartTypes = [
    'bar_chart',
    'column_chart',
    'grouped_bar_chart',
    'grouped_column_chart',
    'stacked_bar_chart',
    'stacked_column_chart',
];
function getNominalFields(dataProps) {
    return dataProps.filter(function (field) { return hasSubset(field.levelOfMeasurements, ['Nominal']); });
}
export var nominalEnumCombinatorial = {
    id: 'nominal-enum-combinatorial',
    type: 'SOFT',
    docs: {
        lintText: 'Single (Basic) and Multi (Stacked, Grouped,...) charts should be optimized recommended by nominal enums combinatorial numbers.',
    },
    trigger: function (_a) {
        var chartType = _a.chartType, dataProps = _a.dataProps;
        return (applyChartTypes.includes(chartType) && getNominalFields(dataProps).length >= 2);
    },
    validator: function (args) {
        var result = 1;
        var dataProps = args.dataProps, chartType = args.chartType;
        if (dataProps) {
            var nominalFields = getNominalFields(dataProps);
            if (nominalFields.length >= 2) {
                var sortedNominals = nominalFields.sort(compare);
                var f1 = sortedNominals[0];
                var f2 = sortedNominals[1];
                if (f1.distinct === f1.count) {
                    if (['bar_chart', 'column_chart'].includes(chartType)) {
                        result = MAX_SOFT_RULE_COEFFICIENT * 0.5;
                    }
                }
                if (f1.count && f1.distinct && f2.distinct && f1.count > f1.distinct) {
                    var typeOptions = [
                        'grouped_bar_chart',
                        'grouped_column_chart',
                        'stacked_bar_chart',
                        'stacked_column_chart',
                    ];
                    if (typeOptions.includes(chartType)) {
                        result = MAX_SOFT_RULE_COEFFICIENT * 0.5;
                    }
                }
            }
        }
        return result;
    },
};
