export var dataFieldQty = {
    id: 'data-field-qty',
    type: 'HARD',
    docs: {
        lintText: 'Data must have at least the min qty of the prerequisite.',
    },
    trigger: function () {
        return true;
    },
    validator: function (args) {
        var result = 0;
        var dataProps = args.dataProps, chartType = args.chartType, chartWIKI = args.chartWIKI;
        if (dataProps && chartType && chartWIKI[chartType]) {
            result = 1;
            var dataPres = chartWIKI[chartType].dataPres || [];
            var minFieldQty = dataPres.map(function (e) { return e.minQty; }).reduce(function (acc, cv) { return acc + cv; });
            if (dataProps.length) {
                var fieldQty = dataProps.length;
                if (fieldQty >= minFieldQty) {
                    result = 1;
                }
            }
        }
        return result;
    },
};
