import { sumBy, sum, mean } from 'lodash';
import { maxabs } from '..';
import { calcPValue } from './window';
/**
 * Buishad U statistics test
 */
export function buishandUTest(data) {
    var n = data === null || data === void 0 ? void 0 : data.length;
    var meanValue = mean(data);
    var Sk = data.map(function (_, index) { return sum(data.slice(0, index + 1)) - meanValue * (index + 1); });
    var U = sumBy(Sk.slice(0, n - 1), function (item) { return Math.pow(item, 2); }) / (n * (n + 1));
    var Smax = maxabs(Sk);
    var maxIndex = Sk.findIndex(function (item) { return item === Smax; });
    return {
        uValue: U,
        index: maxIndex,
        significance: 1 - calcPValue(data, maxIndex),
    };
}
