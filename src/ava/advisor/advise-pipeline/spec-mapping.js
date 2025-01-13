import { __read, __spreadArray } from "tslib";
import { CHART_IDS } from '../../ckb';
import { pearson, isParentChild } from '../../data';
import { compare, hasSubset, intersects } from '../utils';
/* !!!START pie_chart & donut_chart ------------------- */
function splitAngleColor(dataProps) {
    var field4Color = dataProps.find(function (field) { return hasSubset(field.levelOfMeasurements, ['Nominal']); });
    var field4Angle = dataProps.find(function (field) { return hasSubset(field.levelOfMeasurements, ['Interval']); });
    return [field4Color, field4Angle];
}
function pieChart(data, dataProps) {
    var _a = __read(splitAngleColor(dataProps), 2), field4Color = _a[0], field4Angle = _a[1];
    if (!field4Angle || !field4Color)
        return null;
    var spec = {
        type: 'interval',
        data: data,
        encode: {
            color: field4Color.name,
            y: field4Angle.name,
        },
        transform: [{ type: 'stackY' }],
        coordinate: { type: 'theta' },
    };
    return spec;
}
function donutChart(data, dataProps) {
    var _a = __read(splitAngleColor(dataProps), 2), field4Color = _a[0], field4Angle = _a[1];
    if (!field4Angle || !field4Color)
        return null;
    var spec = {
        type: 'interval',
        data: data,
        encode: {
            color: field4Color.name,
            y: field4Angle.name,
        },
        transform: [{ type: 'stackY' }],
        coordinate: { type: 'theta', innerRadius: 0.6 },
    };
    return spec;
}
/* !!!END pie_chart & donut_chart ------------------- */
/* !!!START line_chart & step_line_chart ------------------- */
function splitLineXY(dataProps) {
    var field4X = dataProps.find(function (field) { return intersects(field.levelOfMeasurements, ['Time', 'Ordinal']); });
    var field4Y = dataProps.find(function (field) { return hasSubset(field.levelOfMeasurements, ['Interval']); });
    var field4Color = dataProps.find(function (field) { return hasSubset(field.levelOfMeasurements, ['Nominal']); });
    return [field4X, field4Y, field4Color];
}
function lineChart(data, dataProps) {
    var _a = __read(splitLineXY(dataProps), 3), field4X = _a[0], field4Y = _a[1], field4Color = _a[2];
    if (!field4X || !field4Y)
        return null;
    var spec = {
        type: 'line',
        data: data,
        encode: {
            x: field4X.name,
            y: field4Y.name,
        },
    };
    if (field4Color) {
        spec.encode.color = field4Color.name;
    }
    return spec;
}
function stepLineChart(data, dataProps) {
    var _a = __read(splitLineXY(dataProps), 3), field4X = _a[0], field4Y = _a[1], field4Color = _a[2];
    if (!field4X || !field4Y)
        return null;
    var spec = {
        type: 'line',
        data: data,
        encode: {
            x: field4X.name,
            y: field4Y.name,
            shape: 'hvh',
        },
    };
    if (field4Color) {
        spec.encode.color = field4Color.name;
    }
    return spec;
}
/* !!!END line_chart & step_line_chart ------------------- */
/* !!!START area_chart & stack_area_chart & percent_stacked_area_chart ------------------- */
function splitAreaXYSeries(dataProps) {
    var field4X = dataProps.find(function (field) { return intersects(field.levelOfMeasurements, ['Time', 'Ordinal']); });
    var field4Series = dataProps.find(function (field) { return hasSubset(field.levelOfMeasurements, ['Nominal']); });
    var field4Y = dataProps.find(function (field) { return hasSubset(field.levelOfMeasurements, ['Interval']); });
    return [field4X, field4Y, field4Series];
}
function areaChart(data, dataProps) {
    var field4X = dataProps.find(function (field) { return intersects(field.levelOfMeasurements, ['Time', 'Ordinal']); });
    var field4Y = dataProps.find(function (field) { return hasSubset(field.levelOfMeasurements, ['Interval']); });
    if (!field4X || !field4Y)
        return null;
    var spec = {
        type: 'area',
        data: data,
        encode: {
            x: field4X.name,
            y: field4Y.name,
        },
    };
    return spec;
}
function stackedAreaChart(data, dataProps) {
    var _a = __read(splitAreaXYSeries(dataProps), 3), field4X = _a[0], field4Y = _a[1], field4Series = _a[2];
    if (!field4X || !field4Y || !field4Series)
        return null;
    var spec = {
        type: 'area',
        data: data,
        encode: {
            x: field4X.name,
            y: field4Y.name,
            color: field4Series.name,
        },
        transform: [{ type: 'stackY' }],
    };
    return spec;
}
function percentStackedAreaChart(data, dataProps) {
    var _a = __read(splitAreaXYSeries(dataProps), 3), field4X = _a[0], field4Y = _a[1], field4Series = _a[2];
    if (!field4X || !field4Y || !field4Series)
        return null;
    var spec = {
        type: 'area',
        data: data,
        encode: {
            x: field4X.name,
            y: field4Y.name,
            color: field4Series.name,
        },
        transform: [{ type: 'stackY' }, { type: 'normalizeY' }],
    };
    return spec;
}
/* !!!END area_chart & stack_area_chart & percent_stacked_area_chart ------------------- */
/* !!!START bar_chart & group_bar_chart & stack_bar_chart & percent_stacked_bar_chart ------------------- */
function splitBarXYSeries(dataProps) {
    var nominalFields = dataProps.filter(function (field) { return hasSubset(field.levelOfMeasurements, ['Nominal']); });
    var sortedNominalFields = nominalFields.sort(compare);
    var field4Y = sortedNominalFields[0];
    var field4Series = sortedNominalFields[1];
    var field4X = dataProps.find(function (field) { return hasSubset(field.levelOfMeasurements, ['Interval']); });
    return [field4X, field4Y, field4Series];
}
// barchart in AVA means: horizontal bar chart
function barChart(data, dataProps) {
    var _a = __read(splitBarXYSeries(dataProps), 3), field4X = _a[0], field4Y = _a[1], field4Color = _a[2];
    if (!field4X || !field4Y)
        return null;
    var spec = {
        type: 'interval',
        data: data,
        // G2's implementation converts column chart (vertical bar) and bar chart (horizontal bar) by transpose, so the x and y fields need to be swapped.
        // 由于g2的实现是通过transpose来转换 column chart（竖着的bar）和bar chart（横着的bar），所以x和y的字段需要做交换
        encode: {
            x: field4Y.name,
            y: field4X.name,
        },
        coordinate: {
            transform: [{ type: 'transpose' }],
        },
    };
    if (field4Color) {
        spec.encode.color = field4Color.name;
        spec.transform = [{ type: 'stackY' }];
    }
    return spec;
}
function groupedBarChart(data, dataProps) {
    var _a = __read(splitBarXYSeries(dataProps), 3), field4X = _a[0], field4Y = _a[1], field4Series = _a[2];
    if (!field4X || !field4Y || !field4Series)
        return null;
    var spec = {
        type: 'interval',
        data: data,
        encode: {
            x: field4Y.name,
            y: field4X.name,
            color: field4Series.name,
        },
        transform: [{ type: 'dodgeX' }],
        coordinate: {
            transform: [{ type: 'transpose' }],
        },
    };
    return spec;
}
function stackedBarChart(data, dataProps) {
    var _a = __read(splitBarXYSeries(dataProps), 3), field4X = _a[0], field4Y = _a[1], field4Series = _a[2];
    if (!field4X || !field4Y || !field4Series)
        return null;
    var spec = {
        type: 'interval',
        data: data,
        encode: {
            x: field4Y.name,
            y: field4X.name,
            color: field4Series.name,
        },
        transform: [{ type: 'stackY' }],
        coordinate: {
            transform: [{ type: 'transpose' }],
        },
    };
    return spec;
}
function percentStackedBarChart(data, dataProps) {
    var _a = __read(splitBarXYSeries(dataProps), 3), field4X = _a[0], field4Y = _a[1], field4Series = _a[2];
    if (!field4X || !field4Y || !field4Series)
        return null;
    var spec = {
        type: 'interval',
        data: data,
        encode: {
            x: field4Y.name,
            y: field4X.name,
            color: field4Series.name,
        },
        transform: [{ type: 'stackY' }, { type: 'normalizeY' }],
        coordinate: {
            transform: [{ type: 'transpose' }],
        },
    };
    return spec;
}
/* !!!END bar_chart & group_bar_chart & stack_bar_chart & percent_stacked_bar_chart ------------------- */
/* !!!START column_chart & grouped_column_chart & stacked_column_chart & percent_stacked_column_chart ------------------- */
function splitColumnXYSeries(dataProps) {
    var _a, _b;
    var _c, _d;
    var nominalFields = dataProps.filter(function (field) { return hasSubset(field.levelOfMeasurements, ['Nominal']); });
    var sortedNominalFields = nominalFields.sort(compare);
    var field4X;
    var Field4Series;
    if (isParentChild((_c = sortedNominalFields[1]) === null || _c === void 0 ? void 0 : _c.rawData, (_d = sortedNominalFields[0]) === null || _d === void 0 ? void 0 : _d.rawData)) {
        _a = __read(sortedNominalFields, 2), Field4Series = _a[0], field4X = _a[1];
    }
    else {
        _b = __read(sortedNominalFields, 2), field4X = _b[0], Field4Series = _b[1];
    }
    var field4Y = dataProps.find(function (field) { return hasSubset(field.levelOfMeasurements, ['Interval']); });
    return [field4X, field4Y, Field4Series];
}
function columnChart(data, dataProps) {
    var nominalFields = dataProps.filter(function (field) { return hasSubset(field.levelOfMeasurements, ['Nominal']); });
    var sortedNominalFields = nominalFields.sort(compare);
    var field4X = sortedNominalFields[0];
    var field4Color = sortedNominalFields[1];
    var field4Y = dataProps.find(function (field) { return hasSubset(field.levelOfMeasurements, ['Interval']); });
    if (!field4X || !field4Y)
        return null;
    var spec = {
        type: 'interval',
        data: data,
        encode: {
            x: field4X.name,
            y: field4Y.name,
        },
    };
    if (field4Color) {
        spec.encode.color = field4Color.name;
        spec.transform = [{ type: 'stackY' }];
    }
    return spec;
}
function groupedColumnChart(data, dataProps) {
    var _a = __read(splitColumnXYSeries(dataProps), 3), field4X = _a[0], field4Y = _a[1], field4Series = _a[2];
    if (!field4X || !field4Y || !field4Series)
        return null;
    var spec = {
        type: 'interval',
        data: data,
        encode: {
            x: field4X.name,
            y: field4Y.name,
            color: field4Series.name,
        },
        transform: [{ type: 'dodgeX' }],
    };
    return spec;
}
function stackedColumnChart(data, dataProps) {
    var _a = __read(splitColumnXYSeries(dataProps), 3), field4X = _a[0], field4Y = _a[1], Field4Series = _a[2];
    if (!field4X || !field4Y || !Field4Series)
        return null;
    var spec = {
        type: 'interval',
        data: data,
        encode: {
            x: field4X.name,
            y: field4Y.name,
            color: Field4Series.name,
        },
        transform: [{ type: 'stackY' }],
    };
    return spec;
}
function percentStackedColumnChart(data, dataProps) {
    var _a = __read(splitColumnXYSeries(dataProps), 3), field4X = _a[0], field4Y = _a[1], Field4Series = _a[2];
    if (!field4X || !field4Y || !Field4Series)
        return null;
    var spec = {
        type: 'interval',
        data: data,
        encode: {
            x: field4X.name,
            y: field4Y.name,
            color: Field4Series.name,
        },
        transform: [{ type: 'stackY' }, { type: 'normalizeY' }],
    };
    return spec;
}
/* !!!END column_chart & grouped_column_chart & stacked_column_chart & percent_stacked_column_chart ------------------- */
/* !!!START scatter_plot ------------------- */
function scatterPlot(data, dataProps) {
    var intervalFields = dataProps.filter(function (field) { return hasSubset(field.levelOfMeasurements, ['Interval']); });
    var sortedIntervalFields = intervalFields.sort(compare);
    var field4X = sortedIntervalFields[0];
    var field4Y = sortedIntervalFields[1];
    var field4Color = dataProps.find(function (field) { return hasSubset(field.levelOfMeasurements, ['Nominal']); });
    if (!field4X || !field4Y)
        return null;
    var spec = {
        type: 'point',
        data: data,
        encode: {
            x: field4X.name,
            y: field4Y.name,
        },
    };
    if (field4Color) {
        spec.encode.color = field4Color.name;
    }
    return spec;
}
/* !!!END scatter_plot ------------------- */
/* !!!START bubble_chart ------------------- */
function bubbleChart(data, dataProps) {
    var intervalFields = dataProps.filter(function (field) { return hasSubset(field.levelOfMeasurements, ['Interval']); });
    var triple = {
        x: intervalFields[0],
        y: intervalFields[1],
        corr: 0,
        size: intervalFields[2],
    };
    var _loop_1 = function (i) {
        var _loop_2 = function (j) {
            var p = pearson(intervalFields[i].rawData, intervalFields[j].rawData);
            if (Math.abs(p) > triple.corr) {
                triple.x = intervalFields[i];
                triple.y = intervalFields[j];
                triple.corr = p;
                triple.size = intervalFields[__spreadArray([], __read(Array(intervalFields.length).keys()), false).find(function (e) { return e !== i && e !== j; }) || 0];
            }
        };
        for (var j = i + 1; j < intervalFields.length; j += 1) {
            _loop_2(j);
        }
    };
    for (var i = 0; i < intervalFields.length; i += 1) {
        _loop_1(i);
    }
    var field4X = triple.x;
    var field4Y = triple.y;
    var field4Size = triple.size;
    var field4Color = dataProps.find(function (field) { return intersects(field.levelOfMeasurements, ['Nominal']); });
    // require x,y,size,color at the same time
    if (!field4X || !field4Y || !field4Size)
        return null;
    var spec = {
        type: 'point',
        data: data,
        encode: {
            x: field4X.name,
            y: field4Y.name,
            size: field4Size.name,
        },
    };
    if (field4Color) {
        spec.encode.color = field4Color.name;
    }
    return spec;
}
/* !!!END bubble_chart ------------------- */
/* !!!START histogram ------------------- */
function histogram(data, dataProps) {
    var field = dataProps.find(function (field) { return hasSubset(field.levelOfMeasurements, ['Interval']); });
    if (!field)
        return null;
    var spec = {
        type: 'rect',
        data: data,
        encode: {
            x: field.name,
        },
        transform: [{ type: 'binX', y: 'count' }],
    };
    return spec;
}
/* !!!END histogram ------------------- */
/* !!!END heatmap ------------------- */
function heatmap(data, dataProps) {
    var axisFields = dataProps.filter(function (field) { return intersects(field.levelOfMeasurements, ['Nominal', 'Ordinal']); });
    var sortedFields = axisFields.sort(compare);
    var field4X = sortedFields[0];
    var field4Y = sortedFields[1];
    var field4Color = dataProps.find(function (field) { return hasSubset(field.levelOfMeasurements, ['Interval']); });
    if (!field4X || !field4Y || !field4Color)
        return null;
    var spec = {
        type: 'cell',
        data: data,
        encode: {
            x: field4X.name,
            y: field4Y.name,
            color: field4Color.name,
        },
    };
    return spec;
}
/* !!!END heatmap ------------------- */
/**
 * Convert chartType + data to antv-spec
 * recommend chart with specific data mapping
 *
 * @param chartType chart type
 * @param data input data [ { col1: ..., col2: ... } ]
 * @param dataProps data property for advisor derived by data
 * @param chartKnowledge chart knowledge of a singble chart
 * @returns spec or null
 */
export function getChartTypeSpec(chartType, data, dataProps, chartKnowledge) {
    // step 0: check whether the chartType is default in `ChartID`
    // if not, use customized `toSpec` function
    if (!CHART_IDS.includes(chartType) && chartKnowledge) {
        if (chartKnowledge.toSpec) {
            var spec = chartKnowledge.toSpec(data, dataProps);
            return spec;
        }
        return null;
    }
    switch (chartType) {
        // pie
        case 'pie_chart':
            return pieChart(data, dataProps);
        case 'donut_chart':
            return donutChart(data, dataProps);
        // line
        case 'line_chart':
            return lineChart(data, dataProps);
        case 'step_line_chart':
            return stepLineChart(data, dataProps);
        // area
        case 'area_chart':
            return areaChart(data, dataProps);
        case 'stacked_area_chart':
            return stackedAreaChart(data, dataProps);
        case 'percent_stacked_area_chart':
            return percentStackedAreaChart(data, dataProps);
        // bar
        case 'bar_chart':
            return barChart(data, dataProps);
        case 'grouped_bar_chart':
            return groupedBarChart(data, dataProps);
        case 'stacked_bar_chart':
            return stackedBarChart(data, dataProps);
        case 'percent_stacked_bar_chart':
            return percentStackedBarChart(data, dataProps);
        // column
        case 'column_chart':
            return columnChart(data, dataProps);
        case 'grouped_column_chart':
            return groupedColumnChart(data, dataProps);
        case 'stacked_column_chart':
            return stackedColumnChart(data, dataProps);
        case 'percent_stacked_column_chart':
            return percentStackedColumnChart(data, dataProps);
        // scatter
        case 'scatter_plot':
            return scatterPlot(data, dataProps);
        // bubble
        case 'bubble_chart':
            return bubbleChart(data, dataProps);
        // histogram
        case 'histogram':
            return histogram(data, dataProps);
        case 'heatmap':
            return heatmap(data, dataProps);
        // TODO other case 'kpi_panel' & 'table'
        default:
            return null;
    }
}
