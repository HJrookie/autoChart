import BayesianChangePoint from 'bayesian-changepoint';
import { calcPValue } from './pettitt-test';
function breakpointVerifier(next, prev) {
    if (Math.abs(next.data - prev.data) >= 1) {
        return true;
    }
    return false;
}
/**
 * Bayesian Online Changepoint Detection
 */
export function bayesian(series) {
    if (series === void 0) { series = []; }
    var detection = new BayesianChangePoint({
        breakpointVerifier: breakpointVerifier,
        chunkSize: series.length,
        iteratee: function (t) { return t; },
    });
    detection.exec(series);
    var result = detection.breakPoints().map(function (breakPoint) { return ({
        index: breakPoint.index,
        significance: 1 - calcPValue(series, breakPoint.index),
    }); });
    return result;
}
