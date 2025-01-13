import { lowerCase } from 'lodash';
export var getDiffDesc = function (value, lang) {
    if (value > 0)
        return lang === 'en-US' ? 'more than' : '超过';
    if (value < 0)
        return lang === 'en-US' ? 'less than' : '少于';
    return lang === 'en-US' ? 'equal' : '持平';
};
export var INSIGHT_TYPE_NAME = {
    change_point: '突变点',
    time_series_outlier: '时序异常值',
    trend: '趋势',
    majority: '主要因素',
    low_variance: '分布均匀',
    category_outlier: '异常值',
    correlation: '相关性',
};
export var getInsightName = function (insightType, lang) {
    if (lang === 'en-US')
        return lowerCase(insightType);
    return INSIGHT_TYPE_NAME[insightType];
};
export var getDefaultSeparator = function (lang) {
    return lang === 'zh-CN' ? '，' : ', ';
};
