var _this = this;
import * as insightNarrativeStrategies from './strategy';
var InsightNarrativeStrategyFactory = /** @class */ (function () {
    function InsightNarrativeStrategyFactory() {
    }
    InsightNarrativeStrategyFactory.getStrategy = function (type) {
        var strategy = InsightNarrativeStrategyFactory.narrativeStrategyMap.get(type);
        if (!strategy)
            throw Error("There is no description policy for this '".concat(type, "'."));
        return strategy;
    };
    var _a;
    _a = InsightNarrativeStrategyFactory;
    InsightNarrativeStrategyFactory.narrativeStrategyMap = new Map();
    (function () {
        Object.values(insightNarrativeStrategies).forEach(function (Strategy) {
            _a.narrativeStrategyMap.set(Strategy.insightType, new Strategy());
        });
    })();
    return InsightNarrativeStrategyFactory;
}());
export default InsightNarrativeStrategyFactory;
