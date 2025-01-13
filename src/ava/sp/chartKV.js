import { dataToDataProps, calculateImpactMeasureReferenceValues } from '../insight/pipeline/preprocess';

export function getChartKVs(sourceData, options) {
    // get data columns infomations (column type, statistics, etc.)
    const data = sourceData.filter((item) => !Object.values(item)
        .some((v) => v === null || v === undefined));
    const dataProps = dataToDataProps(data, options?.dataProcessInfo);

    console.log('dataProps',dataProps)
    const fieldPropsMap = dataProps.reduce((acc, item) => {
        acc[item.name] = item;
        return acc;
    }, {});

    const impactMeasureReferences = calculateImpactMeasureReferenceValues(data, options?.impactMeasures);

    const referenceInfo = {
        fieldPropsMap,
        impactMeasureReferences,
    };

    const measures =
        options?.measures ||
        dataProps
            .filter((item) => item.domainType === 'measure')
            .map((item) => ({
                fieldName: item.name,
                method: 'SUM',
            }));
    const dimensions =
        options?.dimensions?.map((dimension) => dimension.fieldName) ||
        dataProps.filter((item) => item.domainType === 'dimension').map((item) => item.name);

    const xField = dimensions?.[0] ?? ''  // 
    const yField = measures?.[0].fieldName ?? 'value'
    return {
        dimensions, measures, data, referenceInfo, xField, yField
    };
}