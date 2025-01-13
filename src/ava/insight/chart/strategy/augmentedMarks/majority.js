import { insight2ChartStrategy } from '../chart';
export var majorityStrategy = function (insight) {
    var chartMark = insight2ChartStrategy(insight);
    return [chartMark];
};
