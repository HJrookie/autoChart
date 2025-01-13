import { insight2ChartStrategy } from '../chart';
export var correlationStrategy = function (insight) {
    // todo add correlation regression line and value
    var chartMark = insight2ChartStrategy(insight);
    return [chartMark];
};
