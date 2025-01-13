import {
  ChartLineIcon,
  ChartBarIcon,
  ChartPieIcon,
  DonutPieIcon,
  ZhuChartIcon,
  StepChartIcon,
  ScatterChartIcon,
  AreaChartIcon,
  BubbleChartIcon,
  HeatChartIcon,
  HistgramChartIcon,
  RadarChartIcon,
} from "../Icons/index";
import { DownloadOutlined } from "@ant-design/icons";
import { downloadDataAsExcel } from "./transfer";
import G2Chart from "../G2Chart/G2Chart";
import { useState, useEffect, createRef, useRef, act } from "react";
import { Row, Col, Button, Radio, Tooltip, message } from "antd";

export const DynamicChart = (props) => {
  const [active, setActive] = useState("column_chart"); // 就是柱状图
  const [spec, setSpec] = useState({});
  const { charts = [], } = props;
  // const { type, spec } = charts[1];
  const chartRef = createRef();
  const [messageApi, contextHolder] = message.useMessage();

  const chartIconMap = {
    pie_chart: <ChartPieIcon active={active === "pie_chart"} />,
    line_chart: <ChartLineIcon active={active === "line_chart"} />,
    column_chart: <ZhuChartIcon active={active === "column_chart"} />,
    bar_chart: <ChartBarIcon active={active === "bar_chart"} />,
    donut_chart: <DonutPieIcon active={active === "donut_chart"} />,
    area_chart: <AreaChartIcon active={active === "area_chart"} />,
    step_line_chart: <StepChartIcon active={active === "step_line_chart"} />,
    scatter_plot: <ScatterChartIcon active={active === "scatter_plot"} />,
    bubble_chart: <BubbleChartIcon active={active === "bubble_chart"} />,
    // 还是用 bar chart
    grouped_bar_chart: <ChartBarIcon active={active === "grouped_bar_chart"} />,
    grouped_column_chart: <ZhuChartIcon active={active === "grouped_column_chart"} />,
    heatmap: <HeatChartIcon active={active === "heatmap"} />,
    histgram: <HistgramChartIcon active={active === "histgram"} />,
    radar_chart: <RadarChartIcon active={active === "radar_chart"} />,
  };

  const options = charts.map((item) => {
    return {
      label: chartIconMap[item.type ?? "column_chart"],
      value: item.type ?? "column_chart",
    };
  });

  const downloadTable = () => {
    const data = spec.data ?? [];
    if (!data.length) {
      messageApi.error("下载失败,请确认无误后重试!");
    } else {
      messageApi.info("正在下载,请稍候!");
    }
    try {
      downloadDataAsExcel(data);
    } catch (err) {
      console.log("download-----error", err);
    }
  };

  useEffect(() => {
    const targetChart = charts.find((item) => item.type === active) ?? {};
    // console.log(1, charts, targetChart);
    setSpec(targetChart?.spec ?? {});
  }, [active]);

  // const options = [
  //   { label: <ChartLineIcon active={active === "line"} />, value: "line" },
  //   { label: <ChartBarIcon active={active === "bar"} />, value: "bar" },
  //   { label: chartIconMap, value: "pie" },
  // ];

  return (
    <>
      {contextHolder}
      <Row type="flex" justify={"space-between"}>
        {/* <ChartLineIcon active={active === "line"} onClick={() => setActive("line")}></ChartLineIcon>
        <ChartBarIcon active={active === "bar"} onClick={() => setActive("bar")}></ChartBarIcon>
        <ChartPieIcon active={active === "pie"} onClick={() => setActive("pie")}></ChartPieIcon> */}
        <Radio.Group options={options} optionType="button" value={active} onChange={(e) => setActive(e.target.value)} />
        <div>
          <Tooltip title="导出为 Excel">
            <Button icon={<DownloadOutlined />} onClick={() => downloadTable()}>
              导出
            </Button>
          </Tooltip>
        </div>
      </Row>
      <G2Chart chartRef={chartRef} spec={spec}></G2Chart>
    </>
  );
};
