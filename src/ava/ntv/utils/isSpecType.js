import { isObject, isString } from '../../utils';
import { ENTITY_TYPES } from '../schema';
export function isCustomSection(spec) {
    return isObject(spec) && 'customType' in spec;
}
export function isCustomParagraph(spec) {
    return isObject(spec) && 'customType' in spec;
}
export function isStandardSection(spec) {
    return isObject(spec) && 'paragraphs' in spec && Array.isArray(spec === null || spec === void 0 ? void 0 : spec.paragraphs);
}
export function isTextParagraph(spec) {
    return isObject(spec) && (spec === null || spec === void 0 ? void 0 : spec.type) === 'normal' && Array.isArray(spec === null || spec === void 0 ? void 0 : spec.phrases);
}
export function isBulletParagraph(spec) {
    return isObject(spec) && (spec === null || spec === void 0 ? void 0 : spec.type) === 'bullets' && Array.isArray(spec === null || spec === void 0 ? void 0 : spec.bullets);
}
export function isDividerParagraph(spec) {
    return isObject(spec) && (spec === null || spec === void 0 ? void 0 : spec.type) === 'divider';
}
export function getHeadingWeight(pType) {
    if (pType === null || pType === void 0 ? void 0 : pType.startsWith('heading')) {
        var weight = Number(pType === null || pType === void 0 ? void 0 : pType.slice(-1));
        if (weight >= 1 && weight <= 6)
            return weight;
    }
    return NaN;
}
export function isHeadingParagraph(spec) {
    if (isObject(spec) && 'type' in spec && isString(spec.type)) {
        var weight = getHeadingWeight(spec === null || spec === void 0 ? void 0 : spec.type);
        return spec.type.startsWith('heading') && !Number.isNaN(weight);
    }
    return false;
}
export function isCustomPhrase(spec) {
    var _a;
    return (spec === null || spec === void 0 ? void 0 : spec.type) === 'custom' && !!((_a = spec === null || spec === void 0 ? void 0 : spec.metadata) === null || _a === void 0 ? void 0 : _a.customType);
}
export function isEntityType(type) {
    return ENTITY_TYPES.includes(type);
}
export function isEntityPhrase(spec) {
    var _a;
    return (spec === null || spec === void 0 ? void 0 : spec.type) === 'entity' && ENTITY_TYPES.includes((_a = spec === null || spec === void 0 ? void 0 : spec.metadata) === null || _a === void 0 ? void 0 : _a.entityType);
}
export function isTextPhrase(spec) {
    return (spec === null || spec === void 0 ? void 0 : spec.type) === 'text';
}
export function isEscapePhrase(spec) {
    return (spec === null || spec === void 0 ? void 0 : spec.type) === 'escape';
}
export function isFormulaPhrase(spec) {
    return (spec === null || spec === void 0 ? void 0 : spec.type) === 'formula';
}
export function isImagePhrase(spec) {
    return (spec === null || spec === void 0 ? void 0 : spec.type) === 'image';
}
