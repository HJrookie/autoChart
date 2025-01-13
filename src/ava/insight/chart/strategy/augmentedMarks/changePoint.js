import { __read, __spreadArray } from "tslib";
import { size } from 'lodash';
import { INSIGHT_COLOR_PLATTE } from '../../constants';
import { dataFormat } from '../../../../utils';
import { pointMarkStrategy } from '../commonMarks/pointMark';
import { textMarkStrategy } from '../commonMarks/textMark';
import { insight2ChartStrategy } from '../chart';
import { augmentedMarks2Marks } from '../../utils';
export var changePointAugmentedMarksStrategy = function (insight) {
    var patterns = insight.patterns;
    var color = INSIGHT_COLOR_PLATTE.highlight;
    if (!size(patterns))
        return [];
    var measure = patterns[0].measure;
    var changePointMarks = [];
    patterns.forEach(function (pattern) {
        var pointMark = pointMarkStrategy([pattern], { style: { fill: color } });
        var textMark = textMarkStrategy([pattern], {
            formatter: dataFormat,
            label: function (pt) { return "".concat(pt.x, ", ").concat(measure, ": ").concat(pt.y); },
            style: {
                dy: -20,
                background: true,
                backgroundRadius: 2,
                connector: true,
                startMarker: true,
                startMarkerFill: '#2C3542',
                startMarkerFillOpacity: 0.65,
            },
        });
        changePointMarks.push({
            changePoint: [pointMark, textMark],
        });
    });
    return changePointMarks;
};
export var changePointStrategy = function (insight) {
    var chart = insight2ChartStrategy(insight);
    var changePointMarks = changePointAugmentedMarksStrategy(insight);
    var marks = augmentedMarks2Marks(changePointMarks);
    return __spreadArray([chart], __read(marks), false);
};
