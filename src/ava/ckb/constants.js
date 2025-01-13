/**
 * Array of standard IDs for each chart type.
 *
 * 所有图表类型的标准 ID
 *
 * @public
 */
export var CHART_IDS = [
    'line_chart',
    'step_line_chart',
    'area_chart',
    'stacked_area_chart',
    'percent_stacked_area_chart',
    'column_chart',
    'grouped_column_chart',
    'stacked_column_chart',
    'percent_stacked_column_chart',
    'range_column_chart',
    'waterfall_chart',
    'histogram',
    'bar_chart',
    'stacked_bar_chart',
    'percent_stacked_bar_chart',
    'grouped_bar_chart',
    'range_bar_chart',
    'radial_bar_chart',
    'bullet_chart',
    'pie_chart',
    'donut_chart',
    'nested_pie_chart',
    'rose_chart',
    'scatter_plot',
    'bubble_chart',
    'non_ribbon_chord_diagram',
    'arc_diagram',
    'chord_diagram',
    'treemap',
    'sankey_diagram',
    'funnel_chart',
    'mirror_funnel_chart',
    'box_plot',
    'heatmap',
    'density_heatmap',
    'radar_chart',
    'wordcloud',
    'candlestick_chart',
    'compact_box_tree',
    'dendrogram',
    'indented_tree',
    'radial_tree',
    'flow_diagram',
    'fruchterman_layout_graph',
    'force_directed_layout_graph',
    'fa2_layout_graph',
    'mds_layout_graph',
    'circular_layout_graph',
    'spiral_layout_graph',
    'radial_layout_graph',
    'concentric_layout_graph',
    'grid_layout_graph',
];
/**
 * Array of chart families.
 *
 * 所有图表家族
 *
 * @public
 */
export var FAMILIES = [
    'LineCharts',
    'ColumnCharts',
    'BarCharts',
    'PieCharts',
    'AreaCharts',
    'ScatterCharts',
    'FunnelCharts',
    'HeatmapCharts',
    'RadarCharts',
    'TreeGraph',
    'GeneralGraph',
    'PolygonLayer',
    'LineLayer',
    'PointLayer',
    'HeatmapLayer',
    'Table',
    'Others',
];
/**
 * Array of analysis purposes.
 *
 * 所有分析目的
 *
 * @public
 */
export var PURPOSES = [
    'Comparison',
    'Trend',
    'Distribution',
    'Rank',
    'Proportion',
    'Composition',
    'Relation',
    'Hierarchy',
    'Flow',
    'Spatial',
    'Anomaly',
    'Value',
];
/**
 * Array of coordinate systems.
 *
 * 所有坐标系类型
 *
 * @public
 */
export var COORDINATE_SYSTEMS = [
    'NumberLine',
    'Cartesian2D',
    'SymmetricCartesian',
    'Cartesian3D',
    'Polar',
    'NodeLink',
    'Radar',
    'Geo',
    'Other',
];
/**
 * Array of graphic categories.
 *
 * 所有图形大类
 *
 * @public
 */
export var GRAPHIC_CATEGORIES = ['Statistic', 'Diagram', 'Graph', 'Map', 'Other'];
/**
 * Array of shapes.
 *
 * 所有形状
 *
 * @public
 */
export var SHAPES = [
    'Lines',
    'Bars',
    'Round',
    'Square',
    'Area',
    'Scatter',
    'Symmetric',
    'Network',
    'Map',
    'Other',
];
/**
 * Array of level of measurements.
 *
 * 所有度量水平
 *
 * @public
 */
export var LEVEL_OF_MEASUREMENTS = ['Nominal', 'Ordinal', 'Interval', 'Discrete', 'Continuous', 'Time'];
/**
 * Array of channels.
 *
 * 所有通道
 *
 * @public
 */
export var CHANNELS = [
    'Position',
    'Length',
    'Color',
    'Area',
    'Angle',
    'ArcLength',
    'Direction',
    'Size',
    'Opacity',
    'Stroke',
    'LineWidth',
    'Lightness',
];
/**
 * Array of recommend ratings.
 * Recommend - For chart types you can safely recommend
 * Use with Caution - Not recommended unless you understand the pitfalls of these chart types.
 * Not Recommended - We know this chart type exists in the community, but it's really not recommended.
 *
 * 所有推荐评级
 * Recommend - 可以安全推荐的图表类型
 * Use with Caution - 除非你了解这些图表类型的缺陷，否则不推荐使用
 * Not Recommended - 我们知道这种图表类型在社区里存在，但真的不建议使用
 *
 * @public
 * @name RECOMMEND_RATINGS
 */
export var RECOMMEND_RATINGS = ['Recommended', 'Use with Caution', 'Not Recommended'];
