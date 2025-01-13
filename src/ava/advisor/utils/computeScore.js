import { __assign } from "tslib";
import { DEFAULT_RULE_WEIGHTS } from '../constants';
var defaultWeights = DEFAULT_RULE_WEIGHTS;
var computeScore = function (chartType, chartWIKI, ruleBase, ruleType, info, log) {
    // initial score is 1 for HARD rules and 0 for SOFT rules
    var computedScore = 1;
    Object.values(ruleBase)
        .filter(function (r) {
        var _a, _b, _c;
        var weight = ((_a = r.option) === null || _a === void 0 ? void 0 : _a.weight) || defaultWeights[r.id] || 1;
        var extra = (_b = r.option) === null || _b === void 0 ? void 0 : _b.extra;
        return r.type === ruleType && r.trigger(__assign(__assign(__assign(__assign({}, info), { weight: weight }), extra), { chartType: chartType, chartWIKI: chartWIKI })) && !((_c = r.option) === null || _c === void 0 ? void 0 : _c.off);
    })
        .forEach(function (r) {
        var _a, _b;
        var weight = ((_a = r.option) === null || _a === void 0 ? void 0 : _a.weight) || defaultWeights[r.id] || 1;
        var extra = (_b = r.option) === null || _b === void 0 ? void 0 : _b.extra;
        var base = r.validator(__assign(__assign(__assign(__assign({}, info), { weight: weight }), extra), { chartType: chartType, chartWIKI: chartWIKI }));
        var score = weight * base;
        computedScore *= score;
        log.push({ phase: 'ADVISE', ruleId: r.id, score: score, base: base, weight: weight, ruleType: ruleType });
    });
    return computedScore;
};
export default computeScore;
