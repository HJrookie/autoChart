import { __assign, __read, __spreadArray } from "tslib";
/* eslint-disable no-console */
import { toString } from 'lodash';
import { isNumberLike } from '../../utils';
import { isEntityType } from '../utils';
import { templateStr2Structure, getScopeVariableArray, getFormattedNumberValue, getAssessment, getDisplayValue, getByPath, } from './utils';
var TextSpecGenerator = /** @class */ (function () {
    function TextSpecGenerator(_a) {
        var variable = _a.variable, structures = _a.structures, structureTemps = _a.structureTemps;
        this.variable = variable;
        this.structures = structures;
        this.structureTemps = structureTemps;
    }
    TextSpecGenerator.prototype.generateTextPhrase = function (text) {
        // TODO 是否需要判断 value 为 string ？？是否需要默认的数值格式化？—— 暂时先简单 toString 下
        return { type: 'text', value: toString(text) };
    };
    TextSpecGenerator.prototype.generateVarPhrase = function (scopeVariable, path, value, metadata) {
        // 没有 meta 的一律按普通文本处理
        if (!metadata) {
            return this.generateTextPhrase(value);
        }
        var varType = metadata.varType, formatter = metadata.formatter, extraCustomMeta = metadata.extraCustomMeta;
        var formattedValue = getFormattedNumberValue(varType, value, formatter);
        // 声明 varType 的可能是 entity 也可能是 custom
        if (varType) {
            if (isEntityType(varType)) {
                return {
                    type: 'entity',
                    value: formattedValue,
                    metadata: {
                        entityType: varType,
                        origin: isNumberLike(value) ? value : undefined,
                        assessment: getAssessment(varType, value),
                        generateVariableInfo: { scopeVariable: scopeVariable, path: path },
                    },
                };
            }
            var extra = extraCustomMeta === null || extraCustomMeta === void 0 ? void 0 : extraCustomMeta(this.variable, scopeVariable);
            return {
                type: 'custom',
                value: formattedValue,
                // TODO 完善自定义短语 metadata
                metadata: __assign({ customType: varType, generateVariableInfo: { scopeVariable: scopeVariable, path: path } }, extra),
            };
        }
        return this.generateTextPhrase(toString(value));
    };
    // 只处理行数据拼接逻辑，表格数据
    TextSpecGenerator.prototype.generateSentence = function (template, variable, variableMetaMap) {
        var _this = this;
        var phrases = [];
        var templateStructure = templateStr2Structure(template);
        var _loop_1 = function (i) {
            var _a = templateStructure[i], tempStrType = _a.type, tempStrValue = _a.value;
            if (tempStrType === 'template') {
                var targetTempId_1 = tempStrValue;
                // get template info by template id
                var templateInfo = this_1.structureTemps.find(function (_a) {
                    var templateId = _a.templateId;
                    return templateId === targetTempId_1;
                });
                if (templateInfo) {
                    var template_1 = templateInfo.template, useVariable = templateInfo.useVariable, variableMetaMap_1 = templateInfo.variableMetaMap, limit = templateInfo.limit, _b = templateInfo.separator, separator_1 = _b === void 0 ? ',' : _b;
                    var scopeArrayVariable_1 = getScopeVariableArray(this_1.variable, variable, useVariable, limit);
                    var subPhrases = scopeArrayVariable_1
                        .map(function (v) { return _this.generateSentence(template_1, v, variableMetaMap_1); })
                        .reduce(function (prev, curr, index) {
                        var result = __spreadArray(__spreadArray([], __read(prev), false), __read(curr), false);
                        if (index !== scopeArrayVariable_1.length - 1)
                            result.push(_this.generateTextPhrase(separator_1));
                        return result;
                    }, []);
                    phrases = phrases.concat.apply(phrases, __spreadArray([], __read(subPhrases), false));
                }
                else {
                    console.warn("".concat(targetTempId_1, " is not exist"));
                }
            }
            else if (tempStrType === 'variable') {
                var key = tempStrValue;
                var metadata = variableMetaMap === null || variableMetaMap === void 0 ? void 0 : variableMetaMap[key];
                var value = (metadata === null || metadata === void 0 ? void 0 : metadata.getDisplayValue)
                    ? getDisplayValue(metadata === null || metadata === void 0 ? void 0 : metadata.getDisplayValue, this_1.variable, variable)
                    : getByPath(this_1.variable, variable, key);
                phrases.push(this_1.generateVarPhrase(variable, key, value, __assign({}, metadata)));
            }
            else if (tempStrType === 'text') {
                phrases.push(this_1.generateTextPhrase(tempStrValue));
            }
        };
        var this_1 = this;
        for (var i = 0; i < templateStructure.length; i += 1) {
            _loop_1(i);
        }
        return phrases;
    };
    /**
     * 生成段落
     * 1. 当前支持段落类型 heading normal bullet
     * 2. 生成段落个数取决于 variable 的类型：
     *  2.1 非自带循环属性的段落（heading normal）遇到数组数据时自动循环多段；
     *  2.2 自身循环段落（bullet）遇到非数组时只生成一个
     * */
    TextSpecGenerator.prototype.generateParagraphs = function (structure, variable) {
        var _this = this;
        if (variable === void 0) { variable = this.variable; }
        var variableMetaMap = structure.variableMetaMap, template = structure.template, _a = structure.displayType, displayType = _a === void 0 ? 'paragraph' : _a, _b = structure.useVariable, useVariable = _b === void 0 ? '' : _b, limit = structure.limit, 
        // 段落级别暂时用不到 separator
        // separator,
        bulletOrder = structure.bulletOrder, children = structure.children, className = structure.className;
        var scopeArrayVariable = getScopeVariableArray(this.variable, variable, useVariable, limit);
        // TODO 接入更多类型
        if (displayType === 'paragraph') {
            return scopeArrayVariable.map(function (v) { return ({
                type: 'normal',
                phrases: _this.generateSentence(template, v, variableMetaMap),
                className: className,
            }); });
        }
        if (displayType === 'bullet') {
            return [
                {
                    type: 'bullets',
                    className: className,
                    isOrder: bulletOrder,
                    bullets: scopeArrayVariable.map(function (v) { return ({
                        type: 'bullet-item',
                        phrases: _this.generateSentence(template, v, variableMetaMap),
                        subBullet: children
                            ? _this.generateParagraphs(__assign(__assign({}, children), { displayType: 'bullet' }), v)[0]
                            : undefined,
                    }); }),
                },
            ];
        }
        return null;
    };
    TextSpecGenerator.prototype.generateSection = function () {
        var _this = this;
        return {
            paragraphs: this.structures.reduce(function (prev, curr) {
                return __spreadArray(__spreadArray([], __read(prev), false), __read(_this.generateParagraphs(curr)), false);
            }, []),
        };
    };
    TextSpecGenerator.prototype.generateNarrative = function () {
        return {
            // 当前只可能构建出一个 section
            sections: [this.generateSection()],
        };
    };
    return TextSpecGenerator;
}());
export default function generateTextSpec(params) {
    return new TextSpecGenerator(params).generateNarrative();
}
