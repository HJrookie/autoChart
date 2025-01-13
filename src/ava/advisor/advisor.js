import { ckb } from '../ckb';
import { processRuleCfg } from './ruler';
import { advicesForChart } from './advise-pipeline';
import { checkRules } from './lint-pipeline/check-rules';
/*
 * 搬运计划
 * 0. 架构设计
 * 1. Advisor 搬运
 * 2. Linter 搬运
 */
var Advisor = /** @class */ (function () {
    function Advisor(config) {
        if (config === void 0) { config = {}; }
        this.ckb = ckb(config.ckbCfg);
        this.ruleBase = processRuleCfg(config.ruleCfg);
    }
    Advisor.prototype.advise = function (params) {
        var adviseResult = advicesForChart(params, this.ckb, this.ruleBase);
        return adviseResult.advices;
    };
    Advisor.prototype.adviseWithLog = function (params) {
        var adviseResult = advicesForChart(params, this.ckb, this.ruleBase);
        return adviseResult;
    };
    Advisor.prototype.lint = function (params) {
        var lintResult = checkRules(params, this.ruleBase, this.ckb);
        return lintResult.lints;
    };
    Advisor.prototype.lintWithLog = function (params) {
        var lintResult = checkRules(params, this.ruleBase, this.ckb);
        return lintResult;
    };
    return Advisor;
}());
export { Advisor };
