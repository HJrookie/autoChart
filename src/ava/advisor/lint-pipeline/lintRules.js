import { __assign } from "tslib";
export function lintRules(ruleBase, ruleTypeToLint, info, log, lints, ckb, spec) {
    var judge = function (type) {
        if (ruleTypeToLint === 'DESIGN') {
            return type === 'DESIGN';
        }
        return type !== 'DESIGN';
    };
    Object.values(ruleBase)
        .filter(function (r) {
        var _a;
        var _b = r.option || {}, weight = _b.weight, extra = _b.extra;
        return judge(r.type) && !((_a = r.option) === null || _a === void 0 ? void 0 : _a.off) && r.trigger(__assign(__assign(__assign(__assign({}, info), { weight: weight }), extra), { chartWIKI: ckb }));
    })
        .forEach(function (r) {
        var type = r.type, id = r.id, docs = r.docs;
        var score;
        if (ruleTypeToLint === 'DESIGN') {
            var fix = r.optimizer(info.dataProps, spec);
            // no fix -> means no violation
            score = Object.keys(fix).length === 0 ? 1 : 0;
            lints.push({ type: type, id: id, score: score, fix: fix, docs: docs });
        }
        else {
            var _a = r.option || {}, weight = _a.weight, extra = _a.extra;
            // no weight for linter's result
            score = r.validator(__assign(__assign(__assign(__assign({}, info), { weight: weight }), extra), { chartWIKI: ckb }));
            lints.push({ type: type, id: id, score: score, docs: docs });
        }
        log.push({ phase: 'LINT', ruleId: id, score: score, base: score, weight: 1, ruleType: type });
    });
}
