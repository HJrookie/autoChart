import { __assign } from "tslib";
import { intersection } from 'lodash';
import { DataFrame } from '../../data';
import { AggregatorMap } from '../utils/aggregate';
export function dataToDataProps(data, extra) {
    if (!data) {
        throw new Error('Argument `data` is missing.');
    }
    var df = new DataFrame(data, extra);
    var dataTypeInfos = df.info();
    var dataProps = [];
    dataTypeInfos.forEach(function (info) {
        var _a;
        var newInfo = __assign(__assign({}, info), { domainType: ((_a = intersection(['Interval', 'Continuous'], info.levelOfMeasurements)) === null || _a === void 0 ? void 0 : _a.length) ? 'measure' : 'dimension' });
        dataProps.push(newInfo);
    });
    return dataProps;
}
export function calculateImpactValue(data, measure) {
    var measureAggregator = AggregatorMap[measure.method];
    debugger
    var value = measureAggregator(data, measure.fieldName);
    console.log('calculateImpactValue',value)
    return value;
}
/** calculate the reference values for impact measures  */
export function calculateImpactMeasureReferenceValues(data, measures) {
    var referenceMap = {};
    measures === null || measures === void 0 ? void 0 : measures.forEach(function (measure) {
        var measureKey = "".concat(measure.fieldName, "@").concat(measure.method);
        var value = calculateImpactValue(data, measure);
        referenceMap[measureKey] = value;
    });
    return referenceMap;
}
