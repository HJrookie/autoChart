import { useState, useEffect, createRef, useRef } from "react";
import "./App.css";

import { getInsights } from "./ava/index";
import { InsightCard } from "@antv/ava-react";
import { LoadingOutlined } from "@ant-design/icons";
import { Flex, Spin, Table } from "antd";
import { getSqlData } from "./api/ava";
import { getChartKVs } from "./ava/sp/chartKV";
import { FallbackChart } from "./fallbackChart/fallbackChart";
import { Button, message, Space, Row, Col, Collapse, Tooltip, Divider } from "antd";
import { Chart } from "@antv/g2";
import { DownloadOutlined } from "@ant-design/icons";
import { downloadDataAsExcel } from "./components/DynamicChart/transfer";
import { Advisor } from "@antv/ava";
// import { Line, Bar, Column, Pie } from '@ant-design/charts';
import {
  getArgsFromLocation,
  parseTryIns,
  replaceLocationPercent,
  getMockedData,
  transformChartAdviseResult,
  uuid,
  parseSqlResult,
} from "./transfer";
import { Empty } from "antd";
import { algoriData } from "./algorithm";
import G2Chart from "./components/G2Chart/G2Chart";
import { ChartLineIcon, ChartBarIcon, ChartPieIcon } from "./components/Icons/index";
import { DynamicChart } from "./components/DynamicChart";
const myChartAdvisor = new Advisor();

export const MainContainer = (props) => {
  const { arr = [], settings } = props;
  const isMob = document.body.clientWidth < 768;
  const [messageApi, contextHolder] = message.useMessage();
  const [firstInsight, setFirstInsight] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoadig] = useState(true);
  const [recommendData, setRecommendData] = useState([]);
  const [recCols, setRecCols] = useState([]);
  const [desc, setDesc] = useState("");
  const _lobj = getArgsFromLocation(window.location.search.slice(1));
  const [showFb, setShowFb] = useState(false); // fallback
  const [tryInsightFirst, setTryInsF] = useState(parseTryIns(localStorage.getItem("tryIns"))); // 是否默认先让insight去处理数据

  const initTable = (data) => {
    setTableData(data);
    if (!data.length) {
      setColumns(null);
    }
    const defaultColumns = Object.keys(data[0] ?? {}).map((item) => ({
      key: item,
      title: item,
      dataIndex: item,
    }));
    setColumns(defaultColumns);
  };

  const initRecommend = (data) => {
    setRecommendData(data);
    const defaultColumns = Object.keys(data[0] ?? {}).map((item) => ({
      key: item,
      title: item,
      dataIndex: item,
    }));
    setRecCols(defaultColumns);
  };

  const tryInsight = (parsedData) => {
    const result = getInsights(parsedData, {
      ...algoriData,
      homogeneous: true, //共性/例外模式提取 可能没有结果
    });
    if (result.insights[0]) {
      setFirstInsight(result.insights[0]);
    } else {
      setShowFb(true);
    }
    console.log("dig -res", result.insights);
  };

  const init = async (wid, cid, count, roleName, serviceId) => {
    try {
      // init parsedData
      let data = [];
      if(arr.length){
        data = arr;
      }
      if (_lobj.mock) {
        data = getMockedData(_lobj.mock);
      } 

      console.log("parsedData--->", settings);
      if (settings.tryInsightFirst) {
        tryInsight(data);
      } else {
        setShowFb(true);
      }
      initTable(data);
      setLoadig(false);
    } catch (err) {
      console.log("error--->", err);
      setLoadig(false);
      setShowFb(true);
    }
  };

  const downloadTable = () => {
    const data = tableData ?? [];
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

  const renderDefaultChart = () => {
    if (!tableData.length) {
      // no table data
      return <></>;
    }
    let result = myChartAdvisor.advise({ data: tableData }).map((advice) => {
      const lints = myChartAdvisor.lint({ spec: advice.spec }); // lint  result
      return { ...advice, lint: lints };
    });
    console.log("advice-->", result);
    if (!result.length) {
      return <></>;
    }

    result = transformChartAdviseResult(result, tableData);
    return (
      <>
        <DynamicChart charts={result}></DynamicChart>
        {desc && <div className="chart-desc">{desc}</div>}
        {/* <G2Chart chartRef={chartRef} spec={first?.spec}></G2Chart> */}
        {/* <Component {...chartConfig} />; */}
      </>
    );
  };

  useEffect(() => {
    setShowFb(false);
    const wid = _lobj.wid ?? undefined;
    const cid = _lobj.cid ?? undefined;
    init(wid, cid, _lobj.count ?? undefined, _lobj.roleName ?? undefined, _lobj.serviceId ?? undefined);
  }, [arr, settings]);

  if (loading) {
    return (
      <div className="app-wrapper-center">
        <Spin indicator={<LoadingOutlined spin />} wrapperClassName="sp-loading-wrapper" tip="正在加载中...">
          <span></span>
        </Spin>
      </div>
    );
  }

  return (
    <div className={`border-wrapper ${isMob && "mob"}`}>
      <Row>
        <Col span={24}>
          {showFb ? (
            renderDefaultChart()
          ) : (
            <>
              {contextHolder}
              <Row type="flex" justify={"end"}>
                <Tooltip title="导出为 Excel">
                  <Button icon={<DownloadOutlined />} onClick={() => downloadTable()}>
                    导出
                  </Button>
                </Tooltip>
              </Row>
              <InsightCard insightInfo={firstInsight} visualizationOptions={{ lang: "zh-CN" }} footerTools={[]} />
            </>
          )}
        </Col>

        <Col span={24}>
          <Table dataSource={tableData} columns={columns} scroll={{ x: "max-content" }} size="small" rowKey={(row) => JSON.stringify(row) + uuid()} />
        </Col>

        {recommendData.length > 0 && (
          <>
            <Divider />
            <Col span={24}>
              <Collapse
                size="small"
                defaultActiveKey={["1"]}
                items={[
                  {
                    key: "1",
                    label: (
                      <div>
                        <h3 style={{ marginBottom: 0 }}>推荐</h3>
                      </div>
                    ),
                    children: (
                      <Table
                        dataSource={recommendData}
                        pagination={{
                          defaultPageSize: 5,
                        }}
                        columns={recCols}
                        scroll={{ x: "max-content" }}
                        size="small"
                        rowKey={(row) => JSON.stringify(row) + uuid()}
                      />
                    ),
                  },
                ]}
              />
            </Col>
          </>
        )}
      </Row>
    </div>
  );
};
