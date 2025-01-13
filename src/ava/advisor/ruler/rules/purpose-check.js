export var purposeCheck = {
    id: 'purpose-check',
    type: 'HARD',
    docs: {
        lintText: 'Choose chart types that satisfy the purpose, if purpose is defined.',
    },
    trigger: function () {
        return true;
    },
    validator: function (args) {
        var result = 0;
        var chartType = args.chartType, purpose = args.purpose, chartWIKI = args.chartWIKI;
        // if purpose is not defined
        if (!purpose) {
            result = 1;
            return result;
        }
        if (chartType && chartWIKI[chartType] && purpose) {
            var purp = chartWIKI[chartType].purpose || '';
            if (purp.includes(purpose)) {
                result = 1;
                return result;
            }
        }
        return result;
    },
};
