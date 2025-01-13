import { hexToColor, colorToHex, paletteGeneration, colorSimulation } from '@antv/smart-color';
import { computeScore } from '../ruler/utils';
import { deepMix } from '../utils';
import { getSpecWithEncodeType } from '../utils/inferDataType';
import { getChartTypeSpec } from './spec-mapping';
/**
 * Run all rules for a given chart type, get scoring result.
 *
 * @param chartType chart ID to be score
 * @param dataProps data props of the input data
 * @param ruleBase rule base
 * @param options
 * @returns
 */
function scoreRules(chartType, chartWIKI, dataProps, ruleBase, options) {
    var purpose = options ? options.purpose : '';
    var preferences = options ? options.preferences : undefined;
    // for log
    var log = [];
    var info = { dataProps: dataProps, chartType: chartType, purpose: purpose, preferences: preferences };
    var hardScore = computeScore(chartType, chartWIKI, ruleBase, 'HARD', info, log);
    // Hard-Rule pruning
    if (hardScore === 0) {
        var result_1 = { chartType: chartType, score: 0, log: log };
        return result_1;
    }
    var softScore = computeScore(chartType, chartWIKI, ruleBase, 'SOFT', info, log);
    var score = hardScore * softScore;
    var result = { chartType: chartType, score: score, log: log };
    return result;
}
function applyDesignRules(chartType, dataProps, ruleBase, chartSpec) {
    var toCheckRules = Object.values(ruleBase).filter(function (rule) { var _a; return rule.type === 'DESIGN' && rule.trigger({ dataProps: dataProps, chartType: chartType }) && !((_a = ruleBase[rule.id].option) === null || _a === void 0 ? void 0 : _a.off); });
    var encodingSpec = toCheckRules.reduce(function (lastSpec, rule) {
        var relatedSpec = rule.optimizer(dataProps, chartSpec);
        return deepMix(lastSpec, relatedSpec);
    }, {});
    return encodingSpec;
}
var DISCRETE_PALETTE_TYPES = ['monochromatic', 'analogous'];
var CATEGORICAL_PALETTE_TYPES = ['polychromatic', 'split-complementary', 'triadic', 'tetradic'];
var DEFAULT_COLOR = '#678ef2';
function applyTheme(dataProps, chartSpec, theme) {
    var _a;
    var specWithEncodeType = getSpecWithEncodeType(chartSpec);
    var primaryColor = theme.primaryColor;
    var layerEnc = specWithEncodeType.encode;
    if (primaryColor && layerEnc) {
        // convert primary color
        var color = hexToColor(primaryColor);
        // if color is specified
        if (layerEnc.color) {
            var _b = layerEnc.color, type = _b.type, field_1 = _b.field;
            var colorScheme = void 0;
            if (type === 'quantitative') {
                colorScheme = DISCRETE_PALETTE_TYPES[Math.floor(Math.random() * DISCRETE_PALETTE_TYPES.length)];
            }
            else {
                colorScheme = CATEGORICAL_PALETTE_TYPES[Math.floor(Math.random() * CATEGORICAL_PALETTE_TYPES.length)];
            }
            var count = (_a = dataProps.find(function (d) { return d.name === field_1; })) === null || _a === void 0 ? void 0 : _a.count;
            var palette = paletteGeneration(colorScheme, {
                color: color,
                count: count,
            });
            return {
                scale: {
                    color: { range: palette.colors.map(function (color) { return colorToHex(color); }) },
                },
            };
        }
        return chartSpec.type === 'line'
            ? {
                style: {
                    stroke: colorToHex(color),
                },
            }
            : {
                style: {
                    fill: colorToHex(color),
                },
            };
    }
    return {};
}
function applySmartColor(dataProps, chartSpec, primaryColor, colorType, simulationType) {
    var _a;
    var specWithEncodeType = getSpecWithEncodeType(chartSpec);
    var layerEnc = specWithEncodeType.encode;
    if (primaryColor && layerEnc) {
        // convert primary color
        var color = hexToColor(primaryColor);
        // if color is specified
        if (layerEnc.color) {
            var _b = layerEnc.color, type = _b.type, field_2 = _b.field;
            var colorScheme = colorType;
            if (!colorScheme) {
                if (type === 'quantitative') {
                    colorScheme = 'monochromatic';
                }
                else {
                    colorScheme = 'polychromatic';
                }
            }
            var count = (_a = dataProps.find(function (d) { return d.name === field_2; })) === null || _a === void 0 ? void 0 : _a.count;
            var palette = paletteGeneration(colorScheme, {
                color: color,
                count: count,
            });
            return {
                scale: {
                    color: {
                        range: palette.colors.map(function (color) {
                            return colorToHex(simulationType ? colorSimulation(color, simulationType) : color);
                        }),
                    },
                },
            };
        }
        return chartSpec.type === 'line'
            ? {
                style: {
                    stroke: colorToHex(color),
                },
            }
            : {
                style: {
                    fill: colorToHex(color),
                },
            };
    }
    return {};
}
/**
 * recommending charts given data and dataProps, based on CKB and RuleBase
 *
 * @param data input data [ {a: xxx, b: xxx}, ... ]
 * @param dataProps data props derived from data or customized by users
 * @param chartWIKI ckb
 * @param ruleBase rule base
 * @param smartColor switch smart color on/off, optional props, default is off
 * @param options options for advising such as log, preferences
 * @param colorOptions color options, optional props, @see {@link SmartColorOptions}
 * @returns chart list [ { type: chartTypes, spec: antv-spec, score: >0 }, ... ]
 */
export function dataToAdvices(data, dataProps, chartWIKI, ruleBase, smartColor, options, colorOptions) {
    /**
     * `refine`: whether to apply design rules
     */
    var enableRefine = (options === null || options === void 0 ? void 0 : options.refine) === undefined ? false : options.refine;
    /**
     * `smartColorOn`: switch SmartColor on/off
     */
    var smartColorOn = smartColor;
    /**
     * `theme`: custom theme
     */
    var theme = options === null || options === void 0 ? void 0 : options.theme;
    /**
     * `requireSpec`: only consider chart type with spec if true
     */
    var requireSpec = (options === null || options === void 0 ? void 0 : options.requireSpec) === undefined ? true : options.requireSpec;
    /**
     * customized CKB input or default CKB from @antv/ckb
     */
    var ChartWIKI = chartWIKI;
    /**
     * all charts that can be recommended
     * */
    var CHART_ID_OPTIONS = Object.keys(ChartWIKI);
    var log = [];
    // score every possible chart
    var list = CHART_ID_OPTIONS.map(function (t) {
        var _a;
        // step 1: analyze score by rule
        var resultForChartType = scoreRules(t, ChartWIKI, dataProps, ruleBase, options);
        log.push(resultForChartType);
        var score = resultForChartType.score;
        // Zero-Score pruning
        if (score <= 0) {
            return { type: t, spec: null, score: score };
        }
        // step 2: field mapping to spec encoding
        var chartTypeSpec = getChartTypeSpec(t, data, dataProps, chartWIKI[t]);
        // FIXME kpi_panel and table spec to be null temporarily
        var customChartType = ['kpi_panel', 'table'];
        if (!customChartType.includes(t) && !chartTypeSpec)
            return { type: t, spec: null, score: score };
        // step 3: apply design rules
        if (chartTypeSpec && enableRefine) {
            var partEncSpec = applyDesignRules(t, dataProps, ruleBase, chartTypeSpec);
            deepMix(chartTypeSpec, partEncSpec);
        }
        // step 4: custom theme
        if (chartTypeSpec) {
            if (theme && !smartColorOn) {
                var partEncSpec = applyTheme(dataProps, chartTypeSpec, theme);
                deepMix(chartTypeSpec, partEncSpec);
            }
            else if (smartColorOn) {
                /**
                 * `colorTheme`: theme for SmartColor
                 * Default color is blue
                 */
                var colorTheme = (_a = colorOptions === null || colorOptions === void 0 ? void 0 : colorOptions.themeColor) !== null && _a !== void 0 ? _a : DEFAULT_COLOR;
                /**
                 * `colorType`: customize SmartColor generation type
                 */
                var colorType = colorOptions === null || colorOptions === void 0 ? void 0 : colorOptions.colorSchemeType;
                /**
                 * `simulationType`: customize SmartColor for specific simulation mode
                 * Default color mode is normal
                 */
                var simulationType = colorOptions === null || colorOptions === void 0 ? void 0 : colorOptions.simulationType;
                var partEncSpec = applySmartColor(dataProps, chartTypeSpec, colorTheme, colorType, simulationType);
                deepMix(chartTypeSpec, partEncSpec);
            }
        }
        return { type: t, spec: chartTypeSpec, score: score };
    });
    /** compare two advice charts by their score */
    function compareAdvices(chart1, chart2) {
        if (chart1.score < chart2.score) {
            return 1;
        }
        if (chart1.score > chart2.score) {
            return -1;
        }
        return 0;
    }
    // filter and sorter
    var isAvailableAdvice = function (advice) {
        return advice.score > 0 && (requireSpec ? advice.spec : true);
    };
    var resultList = list.filter(isAvailableAdvice).sort(compareAdvices);
    var result = {
        advices: resultList,
        log: log,
    };
    return result;
}
