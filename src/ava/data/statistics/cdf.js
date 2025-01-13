import { isNil } from 'lodash';
/**
 * Evaluates the cumulative distribution function (CDF) for a normal distribution at a value x
 * - Reference to equation 26.2.17 in https://personal.math.ubc.ca/~cbm/aands/abramowitz_and_stegun.pdf
 * @param mu mean
 * @param sigma standard deviation
 * */
export var cdf = function (x, mu, sigma) {
    if (mu === void 0) { mu = 0; }
    if (sigma === void 0) { sigma = 1; }
    if (sigma < 0 || [x, mu, sigma].some(function (value) { return isNil(value); }))
        return NaN;
    // transfer to standard normal distribution
    var normalX = Math.abs((x - mu) / sigma);
    /** probability density function of the standard normal distribution */
    var Zx = (1 / Math.sqrt(2 * Math.PI)) * Math.exp((-1 * Math.pow(normalX, 2)) / 2);
    /**
     * - use approximate elementary functional algorithm, error less than 4.5e-4
     * @todo add document explaining the derivation process
     * */
    var t = 1 / (1 + 0.33267 * normalX);
    // error less than 1e-5
    var Px = 1 - Zx * (0.4361836 * t - 0.1201676 * Math.pow(t, 2) + 0.937298 * Math.pow(t, 3));
    return x > mu ? Px : 1 - Px;
};
