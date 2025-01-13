import { mergeWith } from 'lodash';
import { pearson } from './base';
import { DEFAULT_PCORRTEST_OPTIONS } from './constants';
import { normalDistributionQuantile, tDistributionQuantile } from './quantile';
/** Perform a Pearson product-moment correlation test between paired samples  */
export var pcorrtest = function (x, y, options) {
    if (x.length !== y.length) {
        // eslint-disable-next-line no-console
        console.error('invalid arguments: First and second arguments must be arrays having the same length');
        return {
            pcorr: null,
            rejected: false,
        };
    }
    var _a = mergeWith(DEFAULT_PCORRTEST_OPTIONS, options, function (defaultValue, inputValue) {
        return inputValue !== null && inputValue !== void 0 ? inputValue : defaultValue;
    }), alpha = _a.alpha, alternative = _a.alternative, rho = _a.rho;
    /** pearson correlation coefficient */
    var pcorr = pearson(x, y);
    /** statistic to be tested */
    var statistic;
    var threshold;
    /** whether to reject null hypothesis */
    var rejected = false;
    if (rho !== 0) {
        /**
         * - if rho is provided, it needs to be corrected by Fisher's z transform so that it satisfies the normal distribution
         * - https://en.wikipedia.org/wiki/Fisher_transformation
         *  */
        var z = 0.5 * Math.log((1 + pcorr) / (1 - pcorr));
        /** mean of z */
        var meanZ = 0.5 * Math.log((1 + rho) / (1 - rho));
        /** standard error of z */
        var sigmaZ = 1 / Math.sqrt(x.length - 3);
        statistic = (z - meanZ) / sigmaZ;
        if (alternative === 'greater') {
            threshold = normalDistributionQuantile(1 - alpha);
            if (statistic >= threshold)
                rejected = true;
        }
        else if (alternative === 'less') {
            threshold = normalDistributionQuantile(alpha);
            if (statistic <= threshold)
                rejected = true;
        }
        else {
            threshold = normalDistributionQuantile(1 - alpha / 2);
            if (Math.abs(statistic) >= threshold)
                rejected = true;
        }
    }
    else {
        // obey the t distribution under the null hypothesis, t~t(n-2)
        var degree = x.length - 2;
        statistic = (pcorr * Math.sqrt(degree)) / Math.sqrt(1 - Math.pow(pcorr, 2));
        if (alternative === 'greater') {
            threshold = tDistributionQuantile(1 - alpha, degree);
            if (statistic >= threshold)
                rejected = true;
        }
        else if (alternative === 'less') {
            threshold = tDistributionQuantile(alpha, degree);
            if (statistic <= threshold)
                rejected = true;
        }
        else {
            threshold = tDistributionQuantile(1 - alpha / 2, degree);
            if (Math.abs(statistic) >= threshold)
                rejected = true;
        }
    }
    return {
        rejected: rejected,
        pcorr: pcorr,
    };
};
