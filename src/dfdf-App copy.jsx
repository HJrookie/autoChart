import { useState, useEffect } from "react";
import "./App.css";
import { Row, Col } from "antd";
import { InsightChart1 } from "./components/insightChart";
import { getInsights } from "@antv/ava";
import { InsightCard } from "@antv/ava-react";
import axios from "axios";
function App() {
  const [args, setArgs] = useState("");
  const data = [
    { year: "2000", value: 1 },
    { year: "2001", value: -1 },
    { year: "2002", value: 2 },
    { year: "2003", value: -2 },
    { year: "2004", value: 7 },
    { year: "2005", value: 3 },
    { year: "2006", value: -3 },
    { year: "2007", value: 0 },
    { year: "2008", value: 0 },
    { year: "2009", value: 1 },
  ];
  const firstInsight = getInsights(data).insights[0];

  return (
    <>
      <div>
        <Row gutter={20}>
          <Col span={24}>
            <InsightCard insightInfo={firstInsight} visualizationOptions={{ lang: "zh-CN" }} />
          </Col>
          <Col span={12}>
            <InsightChart1></InsightChart1>
          </Col>
        </Row>
      </div>
    </>
  );
}

// export default App;
