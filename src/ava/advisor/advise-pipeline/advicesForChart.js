import { __assign } from "tslib";
import { DataFrame } from '../../data';
import { cloneDeep } from '../utils';
import { dataToAdvices } from './data-to-advices';
/**
 * A utility function that assemble dataProps with user input and DataFrame
 * @param copyData a copy of original data
 * @param fields the fields that user specified to be used in dataset
 * @param inputDataProps user input dataProps which will cover or combine with dataProps from DataFrame
 * @returns assembled data props
 */
export function assembleDataProps(copyData, fields, inputDataProps) {
    // transform data into DataFrame
    var dataFrame;
    if (fields) {
        dataFrame = new DataFrame(copyData, { columns: fields });
    }
    else {
        dataFrame = new DataFrame(copyData);
    }
    var dataPropsForAdvice;
    var defaultDataProps = dataFrame.info();
    if (inputDataProps) {
        dataPropsForAdvice = defaultDataProps.map(function (dwItem) {
            var inputProps = inputDataProps.find(function (item) {
                return item.name === dwItem.name;
            });
            return __assign(__assign({}, dwItem), inputProps);
        });
    }
    else {
        dataPropsForAdvice = defaultDataProps;
    }
    return dataPropsForAdvice;
}
export function advicesForChart(params, ckb, ruleBase) {
    var data = params.data, dataProps = params.dataProps, smartColor = params.smartColor, options = params.options, colorOptions = params.colorOptions, fields = params.fields;
    try {
        // otherwise the input data will be mutated
        var copyData = cloneDeep(data);
        // get dataProps from DataFrame
        var dataPropsForAdvice = assembleDataProps(copyData, fields, dataProps);
        // filter out fields that are not included for advising
        var filteredData = [];
        if (fields) {
            filteredData = copyData.map(function (row) {
                var filteredRow = row;
                Object.keys(filteredRow).forEach(function (col) {
                    if (!fields.includes(col)) {
                        delete filteredRow[col];
                    }
                });
                return row;
            });
        }
        else {
            filteredData = copyData;
        }
        var adviceResult = dataToAdvices(filteredData, dataPropsForAdvice, ckb, ruleBase, smartColor, options, colorOptions);
        return adviceResult;
    }
    catch (error) {
        // if the input data cannot be transformed into DataFrame
        // eslint-disable-next-line no-console
        console.error('error: ', error);
        return { advices: [], log: [] };
    }
}
