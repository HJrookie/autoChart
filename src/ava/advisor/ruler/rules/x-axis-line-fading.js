import { getSpecWithEncodeType } from '../../utils/inferDataType';
import { MAX_SOFT_RULE_COEFFICIENT } from './constants';
var applyChartTypes = ['line_chart'];
export var xAxisLineFading = {
    id: 'x-axis-line-fading',
    type: 'DESIGN',
    docs: {
        // FIXME formal description
        lintText: 'Adjust axis to make it prettier',
    },
    trigger: function (_a) {
        var chartType = _a.chartType;
        return applyChartTypes.includes(chartType);
    },
    optimizer: function (dataProps, chartSpec) {
        var _a;
        var specWithEncodeType = getSpecWithEncodeType(chartSpec);
        var encode = specWithEncodeType.encode;
        if (encode && ((_a = encode.y) === null || _a === void 0 ? void 0 : _a.type) === 'quantitative') {
            var fieldInfo = dataProps.find(function (item) { var _a; return item.name === ((_a = encode.y) === null || _a === void 0 ? void 0 : _a.field); });
            if (fieldInfo) {
                var range = fieldInfo.maximum - fieldInfo.minimum;
                if (fieldInfo.minimum && fieldInfo.maximum && range < (fieldInfo.maximum * 2) / 3) {
                    var yScaleMin = Math.floor(fieldInfo.minimum - range / (MAX_SOFT_RULE_COEFFICIENT * 0.5));
                    return {
                        axis: {
                            x: { tick: false },
                        },
                        scale: {
                            y: {
                                domainMin: yScaleMin > 0 ? yScaleMin : 0,
                            },
                        },
                        clip: true,
                    };
                }
            }
        }
        return {};
    },
};
