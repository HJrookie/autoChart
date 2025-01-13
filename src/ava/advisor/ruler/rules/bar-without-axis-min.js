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
export var barWithoutAxisMin = {
    id: 'bar-without-axis-min',
    type: 'DESIGN',
    docs: {
        lintText: 'It is not recommended to set the minimum value of axis for the bar or column chart.',
        fixText: 'Remove the minimum value config of axis.',
    },
    trigger: function (_a) {
        var chartType = _a.chartType;
        return applyChartTypes.includes(chartType);
    },
    optimizer: function (_, chartSpec) {
        var _a, _b;
        var scale = chartSpec.scale;
        if (!scale)
            return {};
        // @ts-ignore 待 g2 发版后去掉@ts-ignore
        var xMin = (_a = scale.x) === null || _a === void 0 ? void 0 : _a.domainMin;
        //  @ts-ignore 同上
        var yMin = (_b = scale.y) === null || _b === void 0 ? void 0 : _b.domainMin;
        if (xMin || yMin) {
            var newScale = JSON.parse(JSON.stringify(scale));
            if (xMin)
                newScale.x.domainMin = 0;
            if (yMin)
                newScale.y.domainMin = 0;
            return { scale: newScale };
        }
        return {};
    },
};
