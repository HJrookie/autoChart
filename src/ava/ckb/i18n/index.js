import { zhCN } from './zh-CN';
/**
 * Mapping from languages to translation lists.
 *
 * 从语言类型到翻译表的映射
 */
var translateMapping = {
    'zh-CN': zhCN,
};
/**
 * Get CKB dictionary of specific language except English.
 *
 * 得到除英文外的所有语言词汇表
 *
 * @param lang i18n Language code
 * @returns TranslateList or null
 */
export function ckbDict(lang) {
    if (!lang || !Object.keys(translateMapping).includes(lang)) {
        throw new Error("No CKB Dictionary for lang code ".concat(lang, "!"));
    }
    return translateMapping[lang];
}
