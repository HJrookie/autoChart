export var noRedundantField = {
    id: 'no-redundant-field',
    type: 'HARD',
    docs: {
        lintText: 'No redundant field.',
    },
    trigger: function () {
        return true;
    },
    validator: function (args) {
        var result = 0;
        var dataProps = args.dataProps, chartType = args.chartType, chartWIKI = args.chartWIKI;
        if (dataProps && chartType && chartWIKI[chartType]) {
            var dataPres = chartWIKI[chartType].dataPres || [];
            var maxFieldQty = dataPres
                .map(function (e) {
                if (e.maxQty === '*') {
                    return 99;
                }
                return e.maxQty;
            })
                .reduce(function (acc, cv) { return acc + cv; });
            if (dataProps.length) {
                var fieldQty = dataProps.length;
                if (fieldQty <= maxFieldQty) {
                    result = 1;
                }
            }
        }
        return result;
    },
};
