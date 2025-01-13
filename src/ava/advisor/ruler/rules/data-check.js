import { verifyDataProps } from '../utils';
import { intersects } from '../../utils';
export var dataCheck = {
    id: 'data-check',
    type: 'HARD',
    docs: {
        lintText: 'Data must satisfy the data prerequisites.',
    },
    trigger: function () {
        return true;
    },
    validator: function (args) {
        var result = 0;
        var dataProps = args.dataProps, chartType = args.chartType, chartWIKI = args.chartWIKI;
        if (dataProps && chartType && chartWIKI[chartType]) {
            result = 1;
            var dataPres_1 = chartWIKI[chartType].dataPres || [];
            dataPres_1.forEach(function (dataPre) {
                if (!verifyDataProps(dataPre, dataProps)) {
                    result = 0;
                }
            });
            var fieldsLOMs = dataProps.map(function (info) {
                return info.levelOfMeasurements;
            });
            fieldsLOMs.forEach(function (fieldLOM) {
                var flag = false;
                dataPres_1.forEach(function (dataPre) {
                    if (fieldLOM && intersects(fieldLOM, dataPre.fieldConditions)) {
                        flag = true;
                    }
                });
                if (!flag) {
                    result = 0;
                }
            });
        }
        return result;
    },
};
