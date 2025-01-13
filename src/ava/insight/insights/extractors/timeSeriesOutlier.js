import { get, isNil, isString } from 'lodash';
import { distinct, lowess } from '../../../data';
import { LOWESS_N_STEPS } from '../../constant';
import { getAlgorithmCommonInput, getNonSignificantInsight, preValidation } from '../util';
import { findOutliers } from './categoryOutlier';
// detect the outliers using LOWESS
function findTimeSeriesOutliers(values, outlierParameter) {
    var indexes = Array(values.length)
        .fill(0)
        .map(function (_, index) { return index; });
    var baseline = lowess(indexes, values, { nSteps: LOWESS_N_STEPS });
    var residuals = values.map(function (item, index) { return item - baseline.y[index]; });
    var _a = findOutliers(residuals, outlierParameter), outliers = _a.outliers, thresholds = _a.thresholds;
    return { outliers: outliers, baselines: baseline.y, thresholds: thresholds };
}
export var getTimeSeriesOutlierInfo = function (props) {
    var valid = preValidation(props);
    var insightType = 'time_series_outlier';
    if (isString(valid))
        return getNonSignificantInsight({ detailInfo: valid, insightType: insightType, infoType: 'verificationFailure' });
    var data = props.data;
    var _a = getAlgorithmCommonInput(props), dimension = _a.dimension, values = _a.values, measure = _a.measure;
    if (isNil(dimension) || isNil(measure))
        return getNonSignificantInsight({
            detailInfo: 'Measure or dimension is empty.',
            insightType: insightType,
            infoType: 'verificationFailure',
        });
    if (distinct(values) === 1)
        return getNonSignificantInsight({ insightType: insightType, infoType: 'noInsight' });
    var outlierParameter = get(props, 'options.algorithmParameter.outlier');
    var _b = findTimeSeriesOutliers(values, outlierParameter), outliers = _b.outliers, baselines = _b.baselines, thresholds = _b.thresholds;
    if (outliers.length === 0)
        return getNonSignificantInsight({
            insightType: insightType,
            infoType: 'noInsight',
            customInfo: {
                baselines: baselines,
                thresholds: thresholds,
                dimension: dimension,
                measure: measure,
                info: 'No outliers were found.',
            },
        });
    var timeSeriesOutliers = outliers.map(function (item) {
        var index = item.index, significance = item.significance;
        return {
            type: insightType,
            dimension: dimension,
            measure: measure,
            significance: significance,
            index: index,
            x: data[index][dimension],
            y: data[index][measure],
            baselines: baselines,
            thresholds: thresholds,
            significantInsight: true,
        };
    });
    return timeSeriesOutliers;
};
