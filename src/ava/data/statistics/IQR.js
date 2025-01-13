import { ascending } from '../../insight/algorithms/base/compare';
function getQuartilePercentValue(array, percent) {
    var product = percent * array.length;
    var ceil = Math.ceil(product);
    if (ceil === product) {
        if (ceil === 0) {
            return array[0];
        }
        if (ceil === array.length) {
            return array[array.length - 1];
        }
        return (array[ceil - 1] + array[ceil]) / 2;
    }
    return array[ceil - 1];
}
/**
 *
 * @param data
 * @param params
 * @returns
 */
export function IQR(data, params) {
    var k = (params === null || params === void 0 ? void 0 : params.k) || 1.5;
    var sorted = data.slice().sort(ascending);
    var q25 = getQuartilePercentValue(sorted, 0.25);
    var q75 = getQuartilePercentValue(sorted, 0.75);
    var iqr = q75 - q25;
    var outliers = {
        upper: {
            threshold: 0,
            indexes: [],
        },
        lower: {
            threshold: 0,
            indexes: [],
        },
    };
    outliers.lower.threshold = q25 - k * iqr;
    outliers.upper.threshold = q75 + k * iqr;
    data.forEach(function (item, index) {
        if (item <= outliers.lower.threshold) {
            outliers.lower.indexes.push(index);
        }
        else if (item >= outliers.upper.threshold) {
            outliers.upper.indexes.push(index);
        }
    });
    return outliers;
}
