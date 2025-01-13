import { __assign } from "tslib";
export var viewSpecStrategy = function (marks, insight) {
    // majority insight pattern visualizes as 'pie', should not use y nice (G2 handle it as rescale y, the pie chart will be less than 100%)
    var isMajorityPattern = insight.patterns.map(function (pattern) { return pattern.type; }).includes('majority');
    var viewConfig = isMajorityPattern
        ? { scale: { y: { nice: false } } }
        : {
            scale: { y: { nice: true } },
        };
    return __assign({ type: 'view', theme: 'classic', axis: {
            x: { labelAutoHide: true, labelAutoRotate: false, title: false },
            y: { title: false },
        }, interaction: {
            tooltip: { groupName: false },
        }, legend: false, children: marks }, viewConfig);
};
