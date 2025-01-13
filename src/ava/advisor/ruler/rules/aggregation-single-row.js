export var aggregationSingleRow = {
    id: 'aggregation-single-row',
    type: 'HARD',
    docs: {
        lintText: 'Recommend kpi_panel when only one row of aggregated data is available.',
    },
    trigger: function () {
        return true;
    },
    validator: function (args) {
        var result = 0;
        var chartType = args.chartType, dataProps = args.dataProps;
        if (dataProps.every(function (i) { return i.count === 1 && i.levelOfMeasurements.includes('Interval'); })) {
            result = chartType === 'kpi_panel' ? 1 : 0.2;
        }
        else {
            result = chartType === 'kpi_panel' ? 0 : 1;
        }
        return result;
    },
};
