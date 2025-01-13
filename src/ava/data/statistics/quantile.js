/**
 * Normal distribution quantile function
 * - Reference to equation 26.2.23 in https://personal.math.ubc.ca/~cbm/aands/abramowitz_and_stegun.pdf
 * - If F(x) is the cumulative distribution function of a normal distribution N(mu, sigma), F(x) = p, quantile(p, mu, sigma) = x.
 * - The value range of p is [0, 1]. If p > 1 or p < 0, return NaN.
 * @param p input value
 * @param mu mean
 * @param sigma standard deviation
 * */
export var normalDistributionQuantile = function (p, mu, sigma) {
    if (mu === void 0) { mu = 0; }
    if (sigma === void 0) { sigma = 1; }
    if (p > 1 || p < 0 || sigma < 0)
        return NaN;
    // formula requires that p is no more than 0.5
    var adjustedP = p <= 0.5 ? p : 1 - p;
    var t = Math.sqrt(-2 * Math.log(adjustedP));
    /**
     * Q(qXp) + F(qXp) = 1
     * - use approximate elementary functional algorithm, error less than 4.5e-4
     * @todo add document explaining the derivation process
     * */
    var qXp = t - (2.515517 + 0.802853 * t + 0.010328 * Math.pow(t, 2)) / (1 + 1.432788 * t + 0.189269 * Math.pow(t, 2) + 0.001308 * Math.pow(t, 3));
    // quantile of standard normal distribution
    var normalXp = p <= 0.5 ? -1 * qXp : qXp;
    // transfer to quantile of normal distribution N(mu, sigma)
    var Xp = sigma * normalXp + mu;
    return Xp;
};
/**
 * student's t distribution quantile function
 * @param p probability
 * @param v degree of freedom
 */
export var tDistributionQuantile = function (p, d) {
    if (d === void 0) { d = 1; }
    if (p > 1 || p < 0 || d <= 0)
        return NaN;
    // when the degree of freedom is 1, the t distribution is the same as a standard Cauchy distribution
    // reference to equation 35 in http://www.homepages.ucl.ac.uk/~ucahwts/lgsnotes/JCF_Student.pdf
    if (d === 1)
        return -Math.cos(Math.PI * p) / Math.sin(Math.PI * p);
    // reference to equation 36 in http://www.homepages.ucl.ac.uk/~ucahwts/lgsnotes/JCF_Student.pdf
    if (d === 2)
        return (2 * p - 1) / Math.sqrt(2 * p * (1 - p));
    // Q(x) = p, Q(x) + F(x) = 1, F(x) is standard normal distribution CDF
    var prop = p > 0.5 ? p : 1 - p;
    var x = normalDistributionQuantile(prop);
    var g1 = (Math.pow(x, 3) + x) / 4;
    var g2 = (5 * Math.pow(x, 5) + 16 * Math.pow(x, 3) + 3 * x) / 96;
    var g3 = (3 * Math.pow(x, 7) + 19 * Math.pow(x, 5) + 17 * Math.pow(x, 3) - 15 * x) / 384;
    var g4 = (79 * Math.pow(x, 9) + 776 * Math.pow(x, 7) + 1482 * Math.pow(x, 5) - 1920 * Math.pow(x, 3) - 945 * x) / 92160;
    // Cornish–Fisher expansions
    // reference to equation 26.7.5 in https://personal.math.ubc.ca/~cbm/aands/abramowitz_and_stegun.pdf
    return (p > 0.5 ? 1 : -1) * (x + g1 / d + g2 / Math.pow(d, 2) + g3 / Math.pow(d, 3) + g4 / Math.pow(d, 4));
};
