/* advisor */
export { Advisor } from './advisor';
/* CKB */
export { ckb, ckbDict, CHANNELS, CHART_IDS, COORDINATE_SYSTEMS, FAMILIES, GRAPHIC_CATEGORIES, LEVEL_OF_MEASUREMENTS, PURPOSES, RECOMMEND_RATINGS, SHAPES, } from './ckb';
/* data */
export { analyzeField, Series, DataFrame, min, max, sum, mean, normalDistributionQuantile, tDistributionQuantile, distinct, valueMap, missing, valid, pearson, covariance, coefficientOfVariance, standardDeviation, variance, quantile, quartile, median, harmonicMean, geometricMean, pcorrtest, cdf, maxabs, } from './data';
/* insight */
export { getInsights, generateInsightVisualizationSpec, insightPatternsExtractor, getSpecificInsight } from './insight';
/* NTV (Narrative Text Vis) */
export { generateTextSpec, isCustomSection, isStandardSection, isCustomParagraph, isTextParagraph, isBulletParagraph, getHeadingWeight, isHeadingParagraph, isDividerParagraph, isEntityPhrase, isImagePhrase, isCustomPhrase, isTextPhrase, isEntityType, isEscapePhrase, isFormulaPhrase, ENTITY_TYPES, } from './ntv';
export * from './ntv/types';
