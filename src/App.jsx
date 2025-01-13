import { useState, useEffect, createRef, useRef } from "react";
import "./App.css";

import { getInsights } from "./ava/index";
import { InsightCard } from "@antv/ava-react";
import { LoadingOutlined } from "@ant-design/icons";
import { Flex, Spin, Table } from "antd";
import { getSqlData } from "./api/ava";
import { FallbackChart } from "./fallbackChart/fallbackChart";
import { Button, message, Space, Row, Col, Collapse, Tooltip, Divider, Switch, Input, Popover, FloatButton } from "antd";
import { Chart } from "@antv/g2";
import { DownloadOutlined } from "@ant-design/icons";
import { downloadDataAsExcel } from "./components/DynamicChart/transfer";
import { Advisor } from "@antv/ava";
import { SettingOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";

// import { Line, Bar, Column, Pie } from '@ant-design/charts';
import {
  getArgsFromLocation,
  parseTryIns,
  replaceLocationPercent,
  getMockedData,
  transformChartAdviseResult,
  uuid,
  defaultSettings,
  parseSqlResult,
} from "./transfer";
import { Empty } from "antd";
import { algoriData } from "./algorithm";
import G2Chart from "./components/G2Chart/G2Chart";
import { ChartLineIcon, ChartBarIcon, ChartPieIcon } from "./components/Icons/index";
import { DynamicChart } from "./components/DynamicChart";
const myChartAdvisor = new Advisor();
import { MainContainer } from "./MainContainer";

function App() {
  const [arr, setArr] = useState([]);
  const _lobj = getArgsFromLocation(window.location.search.slice(1));
  const [settings, setSettings] = useState({
    tryInsightFirst: false,
    showInput: true,
  });
  const onChange = (e) => {
    const value = e.target.value;
    if (value) {
      setArr(eval(value));
    } else {
      setArr([]);
    }
  };

  useEffect(() => {
    _lobj.mock && setArr(getMockedData(_lobj.mock));
  }, []);

  return (
    <Row>
      {settings.showInput ? <Input.TextArea onChange={onChange} defaultValue={JSON.stringify(arr)} autoSize={{ minRows: 6, maxRows: 12 }} placeholder="输入数组" /> : null}

      <Popover
        placement="leftBottom"
        content={
          <>
            <div>
              <span>先洞察:</span>
              <Switch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                onChange={(v) => setSettings({ tryInsightFirst: v })}
              />
            </div>
            <div>
              <span>输入框:</span>
              <Switch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                defaultChecked
                onChange={(v) => setSettings({ showInput: v })}
              />
            </div>
          </>
        }
        trigger="hover"
      >
        <FloatButton shape="circle" icon={<SettingOutlined />}></FloatButton>
      </Popover>

      {arr.length ? <MainContainer arr={arr} settings={settings}></MainContainer> : null}
    </Row>
  );
}

export default App;
