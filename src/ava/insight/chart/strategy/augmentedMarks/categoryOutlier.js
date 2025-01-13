import { __read, __spreadArray } from "tslib";
import { size } from 'lodash';
import { dataFormat } from '../../../../utils';
import { BOLD_FONT_WEIGHT } from '../../constants';
import { insight2ChartStrategy } from '../chart';
import { textMarkStrategy, intervalMarkStrategy } from '../commonMarks';
import { augmentedMarks2Marks } from '../../utils';
export var categoryOutlierAugmentedMarksStrategy = function (insight) {
    var patterns = insight.patterns;
    if (!size(patterns))
        return [];
    var categoryOutlierMarks = [];
    patterns.forEach(function (pattern) {
        var rectMark = intervalMarkStrategy([pattern]);
        var textMark = textMarkStrategy([pattern], {
            style: { fontWeight: BOLD_FONT_WEIGHT, dy: -8 },
            formatter: dataFormat,
        });
        categoryOutlierMarks.push({
            categoryOutlier: [rectMark, textMark],
        });
    });
    return categoryOutlierMarks;
};
export var categoryOutlierStrategy = function (insight) {
    var chart = insight2ChartStrategy(insight);
    var categoryOutlierMarks = categoryOutlierAugmentedMarksStrategy(insight);
    var marks = augmentedMarks2Marks(categoryOutlierMarks);
    return __spreadArray([chart], __read(marks), false);
};
