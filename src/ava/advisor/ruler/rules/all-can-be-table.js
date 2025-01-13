import { isUndefined } from '../utils';
var applyChartTypes = ['table'];
export var allCanBeTable = {
    id: 'all-can-be-table',
    type: 'HARD',
    docs: {
        lintText: 'all dataset can be table',
    },
    trigger: function (_a) {
        var chartType = _a.chartType;
        return applyChartTypes.includes(chartType);
    },
    validator: function (_a) {
        var weight = _a.weight;
        return isUndefined(weight) ? 1 : weight;
    },
};
