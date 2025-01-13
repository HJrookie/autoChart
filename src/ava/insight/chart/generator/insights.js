import { categoryOutlierStrategy, changePointStrategy, lowVarianceStrategy, majorityStrategy, correlationStrategy, timeSeriesOutlierStrategy, trendStrategy, viewSpecStrategy, } from '../strategy';
export function generateInsightChartSpec(insight) {
    var _a;
    var insightType = insight.patterns[0].type;
    var insightType2Strategy = {
        trend: trendStrategy,
        time_series_outlier: timeSeriesOutlierStrategy,
        category_outlier: categoryOutlierStrategy,
        change_point: changePointStrategy,
        low_variance: lowVarianceStrategy,
        majority: majorityStrategy,
        correlation: correlationStrategy,
    };
    var marks = (_a = insightType2Strategy[insightType]) === null || _a === void 0 ? void 0 : _a.call(insightType2Strategy, insight);
    return viewSpecStrategy(marks, insight);
}
