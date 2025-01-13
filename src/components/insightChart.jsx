import React from "react";

import ReactDOM from "react-dom";
import { InsightCard } from "@antv/ava-react";
import { getInsights } from "@antv/ava";

const timeSeriesData = [
  { year: "1991", value: 0.3 },
  { year: "1992", value: -0.5 },
  { year: "1993", value: 0.05 },
  { year: "1994", value: -0.2 },
  { year: "1995", value: 0.4 },
  { year: "1996", value: 6 },
  { year: "1997", value: 3 },
  { year: "1998", value: 9 },
  { year: "1999", value: 5 },
];

const trendInsightData = getInsights(timeSeriesData)?.insights[0];

export const InsightChart1 = () => {
  return <InsightCard insightInfo={trendInsightData} visualizationOptions={{ lang: "zh-CN" }} />;
};
