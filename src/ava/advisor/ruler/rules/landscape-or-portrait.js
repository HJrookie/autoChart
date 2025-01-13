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
function hasCanvasLayout(_a) {
    var chartType = _a.chartType, dataProps = _a.dataProps, preferences = _a.preferences;
    return !!(dataProps && chartType && preferences && preferences.canvasLayout);
}
export var landscapeOrPortrait = {
    id: 'landscape-or-portrait',
    type: 'SOFT',
    docs: {
        lintText: 'Recommend column charts for landscape layout and bar charts for portrait layout.',
    },
    trigger: function (info) {
        return applyChartTypes.includes(info.chartType) && hasCanvasLayout(info);
    },
    validator: function (args) {
        var result = 1;
        var chartType = args.chartType, preferences = args.preferences;
        if (hasCanvasLayout(args)) {
            if (preferences.canvasLayout === 'portrait' &&
                ['bar_chart', 'grouped_bar_chart', 'stacked_bar_chart', 'percent_stacked_bar_chart'].includes(chartType)) {
                result = MAX_SOFT_RULE_COEFFICIENT * 0.5;
            }
            else if (preferences.canvasLayout === 'landscape' &&
                ['column_chart', 'grouped_column_chart', 'stacked_column_chart', 'percent_stacked_column_chart'].includes(chartType)) {
                result = MAX_SOFT_RULE_COEFFICIENT * 0.5;
            }
        }
        return result;
    },
};
