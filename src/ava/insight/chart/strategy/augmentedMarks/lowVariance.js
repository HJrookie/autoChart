import { __read, __spreadArray } from "tslib";
import { lineMarkStrategy } from '../commonMarks';
import { insight2ChartStrategy } from '../chart';
import { augmentedMarks2Marks } from '../../utils';
import { dataFormat } from '../../../../utils';
export var lowVarianceAugmentedMarkStrategy = function (insight) {
    var patterns = insight.patterns;
    var marks = [];
    patterns.forEach(function (pattern) {
        var mean = pattern.mean;
        var meanLineMark = lineMarkStrategy({ y: mean }, { label: "mean: ".concat(dataFormat(mean)) });
        marks.push({
            meanLine: [meanLineMark],
        });
    });
    return marks;
};
export var lowVarianceStrategy = function (insight) {
    var chartMark = insight2ChartStrategy(insight);
    var lowVarianceMarks = lowVarianceAugmentedMarkStrategy(insight);
    var marks = augmentedMarks2Marks(lowVarianceMarks);
    return __spreadArray([chartMark], __read(marks), false);
};
