import { __assign } from "tslib";
import { rules } from './rules';
export var builtInRules = Object.keys(rules);
/**
 *
 * @param id rule id
 * @returns the rule object or null if `id` not exist in built-in rules
 */
export var getChartRule = function (id) {
    if (Object.keys(rules).includes(id)) {
        return rules[id];
    }
    return null;
};
/**
 *
 * @param ids rule list
 * @returns rule object list
 */
export var getChartRules = function (ids) {
    var chartRules = {};
    ids.forEach(function (id) {
        if (Object.keys(rules).includes(id)) {
            chartRules[id] = rules[id];
        }
    });
    return chartRules;
};
/**
 * processing ckb config and setup ckb used for advising
 * @param ruleCfg rule configuration
 * @returns rule base Record<string, RuleModule>
 */
export var processRuleCfg = function (ruleCfg) {
    if (!ruleCfg) {
        // no specific rule configuration -> return default rules
        return getChartRules(builtInRules);
    }
    // step 1: remove excluded rule
    var ruleBase = getChartRules(builtInRules);
    if (ruleCfg.exclude) {
        // have `exclude` definition
        var toExclude = ruleCfg.exclude;
        toExclude.forEach(function (id) {
            if (Object.keys(ruleBase).includes(id)) {
                delete ruleBase[id];
            }
        });
    }
    // step 2: remove rules that are not included
    if (ruleCfg.include) {
        var toInclude_1 = ruleCfg.include;
        Object.keys(ruleBase).forEach(function (id) {
            if (!toInclude_1.includes(id)) {
                delete ruleBase[id];
            }
        });
    }
    // step 3: combine ruleBase and custom rules
    var finalRuleBase = __assign(__assign({}, ruleBase), ruleCfg.custom);
    // step 4: check options
    var options = ruleCfg.options;
    if (options) {
        var ruleWithOption = Object.keys(options);
        ruleWithOption.forEach(function (rule) {
            if (Object.keys(finalRuleBase).includes(rule)) {
                var ruleOption = options[rule];
                finalRuleBase[rule] = __assign(__assign({}, finalRuleBase[rule]), { option: ruleOption });
            }
        });
    }
    return finalRuleBase;
};
export * from './types';
