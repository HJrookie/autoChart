var getPointChart = function (spec) {
    if (spec.encode.size) {
        return 'bubble_chart';
    }
    return 'scatter_plot';
};
/**
 * 推荐所有 type 为 interval 的 spec 对应的具体图表类型
 * type 为 interval的图表，可能为 column chart、bar chart、pie chart、donut chart
 * @param spec
 * @returns
 */
var getIntervalChart = function (spec) {
    var _a;
    /** 饼图类型推断 */
    var coordinate = spec.coordinate;
    if ((coordinate === null || coordinate === void 0 ? void 0 : coordinate.type) === 'theta') {
        if (coordinate === null || coordinate === void 0 ? void 0 : coordinate.innerRadius) {
            return 'donut_chart';
        }
        return 'pie_chart';
    }
    /** 柱状图、条形图类型推断 */
    var transform = spec.transform;
    var isBarChart = (_a = coordinate === null || coordinate === void 0 ? void 0 : coordinate.transform) === null || _a === void 0 ? void 0 : _a.some(function (item) { return item.type === 'transpose'; });
    var isNormalized = transform === null || transform === void 0 ? void 0 : transform.some(function (item) { return item.type === 'normalizeY'; });
    var isStacked = transform === null || transform === void 0 ? void 0 : transform.some(function (item) { return item.type === 'stackY'; });
    var isGrouped = transform === null || transform === void 0 ? void 0 : transform.some(function (item) { return item.type === 'dodgeX'; });
    if (isBarChart) {
        // Bar
        if (isGrouped)
            return 'grouped_bar_chart';
        if (isNormalized)
            return 'stacked_bar_chart';
        if (isStacked)
            return 'percent_stacked_bar_chart';
        return 'bar_chart';
    }
    // Column
    if (isGrouped)
        return 'grouped_column_chart';
    if (isNormalized)
        return 'stacked_column_chart';
    if (isStacked)
        return 'percent_stacked_column_chart';
    return 'column_chart';
};
/**
 * 推荐所有 type 为 area 的 spec 对应的具体图表类型
 * @param spec
 * @returns
 */
var getAreaChart = function (spec) {
    var transform = spec.transform;
    var isStacked = transform === null || transform === void 0 ? void 0 : transform.some(function (item) { return item.type === 'stackY'; });
    var isNormalized = transform === null || transform === void 0 ? void 0 : transform.some(function (item) { return item.type === 'normalizeY'; });
    if (isStacked) {
        if (isNormalized) {
            return 'percent_stacked_area_chart';
        }
        return 'stacked_area_chart';
    }
    return 'area_chart';
};
/**
 * 推荐所有 type 为 line 的 spec 对应的具体图表类型
 * @param spec
 * @returns
 */
var getLineChart = function (spec) {
    var encode = spec.encode;
    if (encode.shape && encode.shape === 'hvh') {
        return 'step_line_chart';
    }
    return 'line_chart';
};
/**
 * 由于一种类型的 mark 可能对应多种可能的图表，所以需要此处进行转换
 * @param spec
 * @returns
 */
export var getChartType = function (spec) {
    var chartType;
    var chartSpec = spec;
    var mark = chartSpec.type;
    switch (mark) {
        case 'area':
            chartType = getAreaChart(chartSpec);
            break;
        case 'interval':
            chartType = getIntervalChart(chartSpec);
            break;
        case 'line':
            chartType = getLineChart(chartSpec);
            break;
        case 'point':
            chartType = getPointChart(chartSpec);
            break;
        case 'rect':
            chartType = 'histogram';
            break;
        case 'cell':
            chartType = 'heatmap';
            break;
        default:
            chartType = '';
    }
    return chartType;
};
