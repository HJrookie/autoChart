import { max, maxIndex, mean, min, minIndex, quantile, standardDeviation, sum, variance, valueMap as statsValueMap, } from '../../statistics';
import { isBasicType, isBoolean, isDate, isDateString, isFloatString, isInteger, isIntegerString, isNil, isNumber, isNumberString, isString, unique, } from '../../utils';
/**
 * Check if it is StringFieldInfo.
 */
export function isStringFieldInfo(x) {
    return x.recommendation === 'string';
}
/**
 * Check if it is NumberFieldInfo.
 */
export function isNumberFieldInfo(x) {
    return x.recommendation === 'integer' || x.recommendation === 'float';
}
/**
 * Check if it is DateFieldInfo.
 */
export function isDateFieldInfo(x) {
    return x.recommendation === 'date';
}
/**
 * Checks if field is constant
 * @param info - The {@link FieldInfo} to process
 */
export function isConst(info) {
    return info.distinct === 1;
}
/**
 * Checks if field is an ordinal.
 * @param info - Field Info
 */
export function isOrdinal(info) {
    var rawData = info.rawData, recommendation = info.recommendation;
    if (recommendation !== 'string')
        return false;
    if (isConst(info))
        return false;
    var list = rawData.filter(function (item) { return !isNil(item) && isBasicType(item); });
    if (list.length === 0)
        return false;
    var start = null;
    var end = null;
    var startIndex = -1;
    var endIndex = -1;
    var through = true;
    while (through) {
        var through_1 = true;
        for (var i = 0; i < list.length; i += 1) {
            var item = list[i];
            var char = item[startIndex + 1];
            if (start === null || i === 0)
                start = char;
            if (char !== start) {
                through_1 = false;
                break;
            }
        }
        if (!through_1)
            break;
        startIndex += 1;
    }
    through = true;
    while (through) {
        var through_2 = true;
        for (var i = 0; i < list.length; i += 1) {
            var item = list[i];
            var char = item[item.length - 1 - (endIndex + 1)];
            if (end === null || i === 0)
                end = char;
            if (char !== end) {
                through_2 = false;
                break;
            }
        }
        if (!through_2)
            break;
        endIndex += 1;
    }
    var patterns = [/\d+/, /(零|一|二|三|四|五|六|七|八|九|十)+/, /(一|二|三|四|五|六|日)/, /^[a-z]$/, /^[A-Z]$/];
    if (startIndex === -1 && endIndex === -1)
        return false;
    var arr = list.map(function (item) {
        return item.slice(startIndex === -1 ? 0 : startIndex + 1, endIndex === -1 ? undefined : item.length - endIndex - 1);
    });
    var _loop_1 = function (i) {
        var p = patterns[i];
        var notMatch = arr.some(function (item) { return !p.test(item); });
        if (!notMatch)
            return { value: true };
    };
    for (var i = 0; i < patterns.length; i += 1) {
        var state_1 = _loop_1(i);
        if (typeof state_1 === "object")
            return state_1.value;
    }
    return false;
}
/**
 * Checks if field is an unique.
 * @param info - The {@link FieldInfo} to process
 */
export function isUnique(info) {
    return info.distinct === info.count;
}
/**
 * Checks if field is discrete.
 * @remarks
 * @param info - The {@link FieldInfo} to process
 */
export function isDiscrete(info) {
    return info.recommendation === 'integer';
}
/**
 * Checks if field is a continuous.
 * @param info - The {@link FieldInfo} to process
 */
export function isContinuous(info) {
    return info.recommendation === 'float';
}
/**
 * Checks if field is an interval.
 * @param info - The {@link FieldInfo} to process
 */
export function isInterval(info) {
    return info.recommendation === 'integer' || info.recommendation === 'float';
}
/**
 * Checks if field is a nominal.
 * @param info - The {@link FieldInfo} to process
 */
export function isNominal(info) {
    if (info.recommendation === 'boolean')
        return true;
    if (info.recommendation === 'string')
        return !isOrdinal(info);
    return false;
}
/**
 * Checks if field is a time.
 * @param info - Field Info
 */
export function isTime(info) {
    return info.recommendation === 'date';
}
/**
 * Analyze string field info.
 * @param value - data
 */
export function analyzeString(value) {
    var lenArray = value.map(function (item) { return item.length; });
    return {
        maxLength: max(lenArray),
        minLength: min(lenArray),
        meanLength: mean(lenArray),
        containsChar: value.some(function (item) { return /[A-z]/.test(item); }),
        containsDigit: value.some(function (item) { return /[0-9]/.test(item); }),
        containsSpace: value.some(function (item) { return /\s/.test(item); }),
    };
}
/**
 * Analyze number field info.
 * @param value - data
 */
export function analyzeNumber(value) {
    return {
        minimum: min(value),
        maximum: max(value),
        mean: mean(value),
        percentile5: quantile(value, 5),
        percentile25: quantile(value, 25),
        percentile50: quantile(value, 50),
        percentile75: quantile(value, 75),
        percentile95: quantile(value, 95),
        sum: sum(value),
        variance: variance(value),
        standardDeviation: standardDeviation(value),
        zeros: value.filter(function (item) { return item === 0; }).length,
    };
}
/**
 * Analyze date field info.
 * @param value - data
 */
export function analyzeDate(value, isInteger) {
    if (isInteger === void 0) { isInteger = false; }
    var list = value.map(function (item) {
        if (isInteger) {
            var str = "".concat(item);
            if (str.length === 8)
                return new Date("".concat(str.substring(0, 4), "/").concat(str.substring(4, 2), "/").concat(str.substring(6, 2))).getTime();
        }
        return new Date(item).getTime();
    });
    return {
        minimum: value[minIndex(list)],
        maximum: value[maxIndex(list)],
    };
}
/**
 * Determine what type a value is, may be one of [integer float date string null].
 */
export function analyzeType(value, strictDatePattern) {
    if (isNil(value))
        return 'null';
    if (isNumber(value)) {
        if (isInteger(value))
            return 'integer';
        return 'float';
    }
    // 优先识别日期类型，避免字符型日期被判断成字符
    if (isDate(value) || isDateString(value, strictDatePattern))
        return 'date';
    if (isString(value)) {
        if (isNumberString(value)) {
            if (value.includes('.'))
                return 'float';
            return 'integer';
        }
    }
    return 'string';
}
/**
 * Analyze field info.
 * @param value - data
 * @public
 */
export function analyzeField(value, strictDatePattern) {
    var list = value.map(function (item) { return (isNil(item) ? null : item); });
    var valueMap = statsValueMap(list);
    var recommendation;
    var nonNullArray = valueMap.null ? list.filter(function (item) { return item !== null; }) : list;
    var typeArray = list.map(function (item) { return analyzeType(item, strictDatePattern); });
    var types = Object.keys(statsValueMap(typeArray)).filter(function (item) { return item !== 'null'; });
    // generate recommendation
    switch (types.length) {
        case 0:
            recommendation = 'null';
            break;
        case 1:
            recommendation = types[0];
            // an integer field may be a date field
            if (recommendation === 'integer') {
                var data = list.filter(function (item) { return item !== null; });
                if (data.map(function (num) { return "".concat(num); }).every(function (str) { return isDateString(str); })) {
                    recommendation = 'date';
                }
            }
            break;
        case 2:
            if ((types.includes('integer') || types.includes('date')) && types.includes('float')) {
                recommendation = 'float';
                break;
            }
            if (types.includes('integer') && types.includes('date')) {
                // an integer field may be a date field
                var data = list.filter(function (item) { return item !== null; });
                if (data.map(function (num) { return "".concat(num); }).every(function (str) { return isDateString(str); })) {
                    recommendation = 'date';
                }
                else {
                    recommendation = 'integer';
                }
                break;
            }
            recommendation = 'string';
            break;
        default:
            recommendation = 'string';
    }
    var uniqueArray = unique(nonNullArray);
    var fieldInfo = {
        count: value.length,
        distinct: uniqueArray.length,
        type: types.length <= 1 ? types[0] || 'null' : 'mixed',
        recommendation: recommendation,
        missing: valueMap.null || 0,
        rawData: value,
        valueMap: valueMap,
    };
    if (types.length > 1) {
        var meta_1 = {};
        var restNotNullArray_1 = nonNullArray;
        types.forEach(function (item) {
            if (item === 'date') {
                meta_1.date = analyzeField(restNotNullArray_1.filter(function (item) { return isDateString(item); }), strictDatePattern);
                restNotNullArray_1 = restNotNullArray_1.filter(function (item) { return !isDateString(item); });
            }
            else if (item === 'integer') {
                meta_1.integer = analyzeField(restNotNullArray_1.filter(function (item) { return isIntegerString(item) && !isDateString(item); }), strictDatePattern);
                restNotNullArray_1 = restNotNullArray_1.filter(function (item) { return !isIntegerString(item); });
            }
            else if (item === 'float') {
                meta_1.float = analyzeField(restNotNullArray_1.filter(function (item) { return isFloatString(item) && !isDateString(item); }), strictDatePattern);
                restNotNullArray_1 = restNotNullArray_1.filter(function (item) { return !isFloatString(item); });
            }
            else if (item === 'string') {
                meta_1.string = analyzeField(restNotNullArray_1.filter(function (item) { return analyzeType(item, strictDatePattern) === 'string'; }));
                restNotNullArray_1 = restNotNullArray_1.filter(function (item) { return analyzeType(item, strictDatePattern) !== 'string'; });
            }
        });
        fieldInfo.meta = meta_1;
    }
    if (fieldInfo.distinct === 2 && fieldInfo.recommendation !== 'date') {
        // temporarily threshold
        if (list.length >= 100) {
            fieldInfo.recommendation = 'boolean';
        }
        else if (isBoolean(uniqueArray, true)) {
            fieldInfo.recommendation = 'boolean';
        }
    }
    if (recommendation === 'string') {
        Object.assign(fieldInfo, analyzeString(nonNullArray.map(function (item) { return "".concat(item); })));
    }
    if (recommendation === 'integer' || recommendation === 'float') {
        Object.assign(fieldInfo, analyzeNumber(nonNullArray.map(function (item) { return item * 1; })));
    }
    if (recommendation === 'date') {
        Object.assign(fieldInfo, analyzeDate(nonNullArray, fieldInfo.type === 'integer'));
    }
    var levelOfMeasurements = [];
    if (isNominal(fieldInfo))
        levelOfMeasurements.push('Nominal');
    if (isOrdinal(fieldInfo))
        levelOfMeasurements.push('Ordinal');
    if (isInterval(fieldInfo))
        levelOfMeasurements.push('Interval');
    if (isDiscrete(fieldInfo))
        levelOfMeasurements.push('Discrete');
    if (isContinuous(fieldInfo))
        levelOfMeasurements.push('Continuous');
    if (isTime(fieldInfo))
        levelOfMeasurements.push('Time');
    fieldInfo.levelOfMeasurements = levelOfMeasurements;
    return fieldInfo;
}
