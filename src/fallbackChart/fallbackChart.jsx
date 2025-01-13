import { useState, useEffect } from "react";
import { Row, Col } from "antd";
import { InsightCard } from "@antv/ava-react";
import { Flex, Spin, Table } from "antd";
import { defaultInsightData, defaultTableData } from "./transfer";
import { getInsights } from "@antv/ava";

export const FallbackChart = (data) => {
  const [firstInsight, setFirstInsight] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);

  const setDefaultColumns = (data) => {
    if (!data.length) {
      setColumns(null);
    }
    const first = data[0] ?? {};
    const defaultColumns = Object.keys(first).map((item) => ({
      key: item,
      title: item,
      dataIndex: item,
    }));
    setColumns(defaultColumns);
  };

  useEffect(() => {
    // setFirstInsight(defaultInsightData);
    setFirstInsight(getInsights(defaultTableData).insights[0]);
    setTableData(defaultTableData);
    setDefaultColumns(defaultTableData);
  }, []);
  return (
    <>
      <Row gutter={20}>
        <Col span={24}>
          <InsightCard insightInfo={firstInsight} visualizationOptions={{ lang: "zh-CN" }} footerTools={[]} />
        </Col>

        <Col span={24}>
          <Table dataSource={tableData} columns={columns} size="small" />;
        </Col>
      </Row>
    </>
  );
};
