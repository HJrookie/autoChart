import { DataFrame } from '../../data';
import { getChartType } from './getChartType';
import { lintRules } from './lintRules';
export function checkRules(params, ruleBase, ckb) {
    var spec = params.spec, options = params.options;
    var dataProps = params.dataProps;
    var purpose = options === null || options === void 0 ? void 0 : options.purpose;
    var preferences = options === null || options === void 0 ? void 0 : options.preferences;
    var chartType = getChartType(spec);
    var lints = [];
    // for log
    var log = [];
    if (!spec || !chartType) {
        return { lints: lints, log: log };
    }
    // step 1: get data in spec and build DataFrame
    if (!dataProps || !dataProps.length) {
        var dataFrame = void 0;
        try {
            dataFrame = new DataFrame(spec.data);
            dataProps = dataFrame.info();
        }
        catch (error) {
            // if the input data cannot be transformed into DataFrame
            // eslint-disable-next-line no-console
            console.error('error: ', error);
            return { lints: lints, log: log };
        }
    }
    var info = { dataProps: dataProps, chartType: chartType, purpose: purpose, preferences: preferences };
    // step 2: lint rules
    // HARD and SOFT rules
    lintRules(ruleBase, 'notDESIGN', info, log, lints, ckb);
    // DESIGN rules
    lintRules(ruleBase, 'DESIGN', info, log, lints, ckb, spec);
    // filter rules with problems (score<1)
    lints = lints.filter(function (record) { return record.score < 1; });
    var result = {
        lints: lints,
        log: log,
    };
    return result;
}
