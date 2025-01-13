// Should be confidence level. Is the SIGNIFICANCE_BENCHMARK naming correct? by @pddpd
export var SIGNIFICANCE_BENCHMARK = 0.95;
export var SIGNIFICANCE_LEVEL = 0.05;
export var INSIGHT_SCORE_BENCHMARK = 0.01;
export var IMPACT_SCORE_WEIGHT = 0.2;
export var INSIGHT_DEFAULT_LIMIT = 20;
export var IQR_K = 1.5;
export var LOWESS_N_STEPS = 2;
export var PATTERN_TYPES = [
    'category_outlier',
    'trend',
    'change_point',
    'time_series_outlier',
    'majority',
    'low_variance',
    'correlation',
];
export var HOMOGENEOUS_PATTERN_TYPES = ['commonness', 'exception'];
export var VERIFICATION_FAILURE_INFO = 'The input does not meet the requirements.';
export var NO_PATTERN_INFO = 'No insights were found at the specified significance threshold.';
export var CHANGE_POINT_SIGNIFICANCE_BENCHMARK = 0.15;
