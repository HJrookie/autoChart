import { __assign, __read, __spreadArray } from "tslib";
import { INSIGHT_COLOR_PLATTE } from '../constants';
export function generateHomogeneousInsightAugmentedMarks(pattern) {
    var annotations = [];
    var insightType = pattern.insightType, childPatterns = pattern.childPatterns;
    if (['change_point', 'time_series_outlier'].includes(insightType)) {
        var x_1 = childPatterns[0].x;
        var text = insightType === 'change_point' ? 'Abrupt Change' : 'Outlier';
        var color_1 = insightType === 'change_point' ? INSIGHT_COLOR_PLATTE.highlight : INSIGHT_COLOR_PLATTE.outlier;
        // draw line
        var line = {
            type: 'line',
            start: [x_1, 'min'],
            end: [x_1, 'max'],
            text: {
                content: text,
                position: 'left',
                offsetY: 15,
                offsetX: 5,
                rotate: 0,
                autoRotate: false,
                style: {
                    textAlign: 'left',
                },
            },
        };
        annotations.push(line);
        // draw circle
        var circles = childPatterns.map(function (pattern) {
            var y = pattern.y;
            return {
                type: 'dataMarker',
                position: [x_1, y],
                point: {
                    style: {
                        fill: '#fff',
                        stroke: color_1,
                    },
                },
                line: {
                    length: 20,
                },
                autoAdjust: false,
            };
        });
        annotations.push.apply(annotations, __spreadArray([], __read(circles), false));
    }
    return annotations;
}
export function generateHomogeneousInsightChartSpec(insight, pattern) {
    var dimensions = insight.dimensions, measures = insight.measures;
    var plotSchema;
    if (measures.length > 1) {
        plotSchema = {
            xField: dimensions[0],
            yField: 'value',
            seriesField: 'measureName',
        };
    }
    else {
        plotSchema = {
            xField: dimensions[1],
            yField: measures[0].fieldName,
            seriesField: dimensions[0],
        };
    }
    var annotationConfig = generateHomogeneousInsightAugmentedMarks(pattern);
    var chartSchema = __assign(__assign({}, plotSchema), { annotations: annotationConfig });
    return chartSchema;
}
