import { get, isArray, isUndefined, slice, replace, isString, startsWith } from 'lodash';
import { dataFormat, isNumberLike } from '../../utils';
/**
 * simple path system
 * if starts with '.', it's relative path
 * // TODO 支持相对路径找到上级
 * if starts with '..', it's can get prev level variable
 * otherwise, it's absolute path
 */
export function getByPath(globalVar, scopeVar, path) {
    if (!path)
        return scopeVar;
    if (startsWith(path, '.'))
        return get(scopeVar, path.slice(1));
    return get(globalVar, path);
}
/**
 * parse template string
 *    Use $ for variable
 *    Use & for template
 * @example 'aaa ${key} &{temp1}'
 *  => [{ type: 'text', value: 'aaa ' }, { type: 'variable', value: 'key' }, { type: 'template', value: 'temp1' }]
 */
export function templateStr2Structure(templateStr) {
    // eslint-disable-next-line no-useless-escape
    var splitReg = /([\$|&]{.*?})/;
    var varReg = /\${(.*?)}/;
    var tempReg = /&{(.*?)}/;
    return templateStr
        .split(splitReg)
        .filter(function (str) { return str; })
        .map(function (str) {
        var _a, _b;
        var templateId = (_a = tempReg.exec(str)) === null || _a === void 0 ? void 0 : _a[1];
        if (templateId)
            return { value: templateId, type: 'template' };
        var varName = (_b = varReg.exec(str)) === null || _b === void 0 ? void 0 : _b[1];
        if (varName)
            return { value: varName, type: 'variable' };
        return { value: str, type: 'text' };
    });
}
/** format any to array, and filter nil */
export function formattedAsArray(variable) {
    if (isUndefined(variable))
        return [];
    return isArray(variable) ? variable : [variable];
}
export function getScopeVariableArray(globalVar, scopeVar, path, limit) {
    return slice(formattedAsArray(getByPath(globalVar, scopeVar, path)), 0, limit);
}
export function getAssessment(entityType, value) {
    if (!isNumberLike(value))
        return undefined;
    if (entityType === 'delta_value' || entityType === 'ratio_value') {
        if (value > 0)
            return 'positive';
        if (value < 0)
            return 'negative';
    }
    return undefined;
}
export function getFormattedNumberValue(varType, value, formatter) {
    if (!isNumberLike(value))
        return value;
    if (varType === 'delta_value' || varType === 'ratio_value') {
        return formatter ? formatter(Math.abs(value)) : dataFormat(Math.abs(value));
    }
    if (varType === 'proportion') {
        return formatter ? formatter(Math.abs(value)) : "".concat(dataFormat(value * 100), "%");
    }
    return formatter ? formatter(value) : dataFormat(value);
}
/** get phrase text */
export function getDisplayValue(getDisplayValuePattern, globalVar, scopeVar) {
    if (isString(getDisplayValuePattern)) {
        // 用字符串表示使用变量拼接短语文字内容，这里进行变量替换，eg '${city} = ${value}' => '北京 = 1000'
        // Use a string to represent the text content of the phrase using variables to splice，eg '${city} = ${value}' => 'Beijing = 1000'
        return replace(getDisplayValuePattern, /\${(.*?)}/g, function (match) {
            var _a;
            var varName = (_a = /\${(.*?)}/.exec(match)) === null || _a === void 0 ? void 0 : _a[1];
            return varName ? getByPath(globalVar, scopeVar, varName) : '';
        });
    }
    return getDisplayValuePattern(globalVar, scopeVar);
}
