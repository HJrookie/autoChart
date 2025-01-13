import { __read } from "tslib";
import { sumBy } from 'lodash';
import { sign, unique } from '../../insight/utils/common';
import { normalDistributionQuantile, cdf } from '..';
/**
 * http://vsp.pnnl.gov/help/Vsample/Design_Trend_Mann_Kendall.htm
   the Mann-Kendall (MK) test is to statistically assess if there
   is a monotonic upward or downward trend of the variable of
   interest over time.
   使用 Mann-Kendall 单调趋势检验判断趋势是否有方向性（上升/下降）
 * @param data
 * @param alpha
 */
export function mkTest(data, alpha) {
    if (alpha === void 0) { alpha = 0.05; }
    var length = data === null || data === void 0 ? void 0 : data.length;
    var S = 0;
    for (var k = 0; k < length - 1; k += 1) {
        for (var j = k + 1; j < length; j += 1) {
            S += sign(data[j] - data[k]);
        }
    }
    var _a = __read(unique(data), 2), uniqArr = _a[0], uniqCount = _a[1];
    var uniqLength = uniqArr.length;
    var varS = (length * (length - 1) * (2 * length + 5) -
        (uniqLength === length ? 0 : sumBy(uniqCount, function (c) { return c * (c - 1) * (2 * c + 5); }))) /
        18;
    var zScore = 0;
    if (S > 0) {
        zScore = (S - 1) / Math.sqrt(varS);
    }
    else if (S < 0) {
        zScore = (S + 1) / Math.sqrt(varS);
    }
    // calculate the p_value
    var pValue = 2 * (1 - cdf(Math.abs(zScore), 0, 1));
    var h = Math.abs(zScore) > normalDistributionQuantile(1 - alpha / 2, 0, 1);
    var trend = 'no trend';
    if (zScore < 0 && h) {
        trend = 'decreasing';
    }
    else if (zScore > 0 && h) {
        trend = 'increasing';
    }
    return {
        trend: trend,
        pValue: pValue,
        zScore: zScore,
    };
}
