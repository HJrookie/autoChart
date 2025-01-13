function isJsonString(str) {
  try {
    if (typeof JSON.parse(str) === "object") {
      return true;
    }
  } catch (e) { }
  return false;
}

export function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
//
const isSingleKV = (obj) => {
  let kc = 0;
  for (let [k, v] of Object.entries(obj)) {
    kc++;
  }
  // 值里面的 必须要包含数字 
  if (kc === 1 && Object.values(obj).some(item => /[0-9]+/.test(item))) {
    return true;
  }
  return false
};
//  {刘小庆:71}  =====>  [ { NAME: "刘小庆", sign_in_count: 71 }]
const mapSingleKv = (obj) => {
  const k = Object.keys(obj)[0];
  if (!k) {
    return [];
  }
  return { 数据项: k, 数值: obj[k] };
  // return [{ 'key': k, value: obj[k] }];
};

// data transfer
export const parseSqlResult = (data) => {
  const fallbackResult = { _data: [], desc: '', recommend: [] };
  if (data.message?.includes('暂未')) {
    return fallbackResult;
  }
  if (data.message !== 'Success') {
    return fallbackResult
  }
  const answer = data.result
  // const answer ='{"text":[{"在校班次数量":37}],"describe":"上周在校班次数量为37个，表明在2024年12月23日至2024年12月29日期间，共有37个班次在进行培训。","recommend":[{"项目名称":"国网安徽电力2020年党支部书记培训班","培训质量满意率":100,"综合服务满意率":100,"培训课程满意率":100,"典型意见":"收获满满"},{"项目名称":"国家电网有限公司2020年省级培训中心负责人培训班","培训质量满意率":100,"综合服务满意率":100,"培训课程满意率":100,"典型意见":"帮助很大,思想境界获得了提升"},{"项目名称":"直属单位综合管理人员培训（第一期）","培训质量满意率":95.38,"综合服务满意率":97.12,"培训课程满意率":100,"典型意见":"印象深刻,高水平一流的师资力量"},{"项目名称":"南瑞集团中层干部培训班（第三期）","培训质量满意率":98.75,"综合服务满意率":100,"培训课程满意率":96.18,"典型意见":"高培讲坛汇编材料质量很高！价值很大！建议持续收录更新并发放。"},{"项目名称":"国网华中分部2020年职员培训班","培训质量满意率":100,"综合服务满意率":100,"培训课程满意率":98.25,"典型意见":"高质量的课程安排。"},{}]}'
  if (!answer || answer?.length === 0) {
    return fallbackResult;
  }
  // const answer = '{"text":[{"male_count": 0, "female_count": 0, "male_ratio": 0.0, "female_ratio": 0.0}]}'
  if (answer.includes("查询失败") || answer.includes("请提供您需要转换成 SQL 查询的自然语言描述")) {
    return fallbackResult;
  } else {
    // answer = answer.replace('"text":"[', '"text":[').replace(']"}', "]}");
    // is  not json  (return [])
    if (!isJsonString(answer)) {
      return fallbackResult;
    }
    // parse json
    const json = JSON.parse(answer);
    const parsedData = json?.text ?? [];
    const desc = json?.describe ?? ''
    const recommend = json?.recommend ?? []
    // 对数组长度为 1 的 单独处理 
    if (parsedData.length === 1) {
      // check 是否是 单独的 k,v ===>  上周在校班次数量: 53 ,如果是的话 
      const obj = parsedData[0] ?? []
      // 如果值里 有数字 
      if (Object.values(obj).some(item => /[0-9]+/.test(item))) {
        return {
          _data: [...Object.entries(obj)].map(item => {
            const [k, v] = item;
            return { 数据项: k, 值: v }
          }),
          desc,
          recommend
        }
      }
    }
    // if (isSingleKV(parsedData?.[0] ?? {})) {
    //   return {
    //     _data: parsedData.map(item => mapSingleKv(item)),
    //     desc
    //   }
    // }
    // 标准 response, 直接返回 
    return { _data: parsedData, desc, recommend };
  }
};

// get args from location http://a.test.com?a=1&b=2&c==3
export const getArgsFromLocation = (str) => {
  if (!str || str?.length === 0) {
    return {};
  }
  const sp_obj = str
    .split("&")
    .map((v) => v.split("="))
    .reduce((prev, cur) => {
      const [k, v] = cur;
      prev[k] = v;
      return prev;
    }, {});
  return sp_obj;
};

// doecodeUrI函数当参数中有% 会报错
export const replaceLocationPercent = (str) => {
  if (str.includes("%")) {
    str = str.replace(/%/g, "%25");
  }
  return str;
};

export const getChartDefaultConfig = () => {
  return {
    label: {
      style: {
        fontWeight: "bold",
      },
    },
    legend: {
      color: {
        title: false,
        position: "right",
        rowPadding: 5,
      },
    },
  };
};

export const getChartTypeStringFromAdvisorResult = (advisorStr) => {
  const index = advisorStr.indexOf("_");
  return advisorStr.slice(0, index);
};

// string line colume pie ...
export const getChartConfigByType = (type, data, xField, yField) => {
  if (type === "line") {
    return {
      data,
      ...getChartDefaultConfig(),
      xField,
      yField,
    };
  }
  if (type === "column") {
    return {
      data,
      ...getChartDefaultConfig(),
      xField,
      yField,
    };
  }
  if (type === "pie") {
    return {
      data,
      ...getChartDefaultConfig(),
      colorField: xField,
      radius: 0.8,
      angleField: yField,
    };
  }
  // 默认的
  return {
    data,
    xField,
    yField,
    ...getChartDefaultConfig(),
  };
};

export const getMockedData = (v = 1) => {
  const dataMap = {
    // 年 数据
    1: [
      {
        year: 1955,
        country: "Afghanistan",
        value: 10,
      },
      {
        year: 1956,
        country: "Afghanistan",
        value: 22,
      },
      {
        year: 1957,
        country: "Afghanistan",
        value: 31,
      },
      {
        year: 1958,
        country: "Afghanistan",
        value: 45,
      },
      {
        year: 1959,
        country: "Afghanistan",
        value: 52,
      },
      {
        year: 1960,
        country: "Afghanistan",
        value: 61,
      },
      {
        year: 1961,
        country: "Afghanistan",
        value: 77,
      },
      {
        year: 1962,
        country: "Afghanistan",
        value: 89,
      },
      {
        year: 1963,
        country: "Afghanistan",
        value: 94,
      },
      {
        year: 1964,
        country: "Afghanistan",
        value: 106,
      },
      {
        year: 1965,
        country: "Afghanistan",
        value: 120,
      },
      {
        year: 1966,
        country: "Afghanistan",
        value: 140,
      },
      {
        year: 1967,
        country: "Afghanistan",
        value: 162,
      },
      {
        year: 1968,
        country: "Afghanistan",
        value: 175,
      },
      {
        year: 1969,
        country: "Afghanistan",
        value: 185,
      },
      {
        year: 1970,
        country: "Afghanistan",
        value: 200,
      },
    ],
    // 月销售额
    2: [
      {
        月份: 1,
        销售额: 431,
      },
      {
        月份: 2,
        销售额: 556,
      },
      {
        月份: 3,
        销售额: 556,
      },
      {
        月份: 4,
        销售额: 456,
      },
      {
        月份: 5,
        销售额: 478,
      },
      {
        月份: 6,
        销售额: 842,
      },
      {
        月份: 7,
        销售额: 483,
      },
      {
        月份: 8,
        销售额: 285,
      },
      {
        月份: 9,
        销售额: 832,
      },
    ],
    // gp 签到
    3: [
      { NAME: "刘小庆", sign_in_count: 71 },
      { NAME: "段伟", sign_in_count: 24 },
      { NAME: "李鹏", sign_in_count: 23 },
      { NAME: "王印月", sign_in_count: 24 },
      { NAME: "高万虎", sign_in_count: 125 },
    ],
    // 不同角色人的数量
    4: [{ NAME: "刘小庆", sign_in_count: 71 }],
    // 主任人数: 21225, 副经理人数: 5187, 技术人员人数: 38, 安全员人数: 9427
    5: [
      { letter: "A", frequency: 0.08167 },
      { letter: "B", frequency: 0.01492 },
      { letter: "C", frequency: 0.02782 },
      { letter: "D", frequency: 0.04253 },
      { letter: "E", frequency: 0.12702 },
      { letter: "F", frequency: 0.02288 },
      { letter: "G", frequency: 0.02015 },
      { letter: "H", frequency: 0.06094 },
      { letter: "I", frequency: 0.06966 },
      { letter: "J", frequency: 0.00153 },
      { letter: "K", frequency: 0.00772 },
      { letter: "L", frequency: 0.04025 },
      { letter: "M", frequency: 0.02406 },
      { letter: "N", frequency: 0.06749 },
      { letter: "O", frequency: 0.07507 },
      { letter: "P", frequency: 0.01929 },
      { letter: "Q", frequency: 0.00095 },
      { letter: "R", frequency: 0.05987 },
      { letter: "S", frequency: 0.06327 },
      { letter: "T", frequency: 0.09056 },
      { letter: "U", frequency: 0.02758 },
      { letter: "V", frequency: 0.00978 },
      { letter: "W", frequency: 0.0236 },
      { letter: "X", frequency: 0.0015 },
      { letter: "Y", frequency: 0.01974 },
      { letter: "Z", frequency: 0.00074 },
    ],
    6: [
      { value: 1048, name: "Search Engine" },
      { value: 735, name: "Direct" },
      { value: 580, name: "Email" },
      { value: 484, name: "Union Ads" },
      { value: 300, name: "Video Ads" },
    ],
    7: [
      {
        "商品名称": "帐篷"
      },
      {
        "商品名称": "睡袋"
      },
      {
        "商品名称": "野营附件"
      },
      {
        "商品名称": "野餐垫"
      }
    ],
    8: [{
      key: '1',
      name: 'John Brown',
      gender: 'male',
      age: 32,
      email: 'John Brown@example.com',
      address: 'London No. 1 Lake Park',
      aaa: 'London No. 1 Lake Park',
      bbb: 'London No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      gender: 'female',
      age: 42,
      email: 'jimGreen@example.com',
      address: 'London No. 1 Lake Park',
      aaa: 'London No. 1 Lake Park',
      bbb: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      gender: 'female',
      age: 32,
      email: 'JoeBlack@example.com',
      address: 'Sidney No. 1 Lake Park',
      aaa: 'Sidney No. 1 Lake Park',
      bbb: 'Sidney No. 1 Lake Park',
    },
    {
      key: '4',
      name: 'George Hcc',
      gender: 'male',
      age: 20,
      email: 'george@example.com',
      address: 'Sidney No. 1 Lake Park',
      aaa: 'Sidney No. 1 Lake Park',
      bbb: 'Sidney No. 1 Lake Park',
    },
    {
      key: '5',
      name: 'George Hcc',
      gender: 'male',
      age: 20,
      email: 'george@example.com',
      address: 'Sidney No. 1 Lake Park',
      aaa: 'Sidney No. 1 Lake Park',
      bbb: 'Sidney No. 1 Lake Park',
    },
    {
      key: '6',
      name: 'George Hcc',
      gender: 'male',
      age: 20,
      email: 'george@example.com',
      address: 'Sidney No. 1 Lake Park',
      aaa: 'Sidney No. 1 Lake Park',
      bbb: 'Sidney No. 1 Lake Park',
    },
    {
      key: '7',
      name: 'George Hcc',
      gender: 'male',
      age: 20,
      email: 'george@example.com',
      address: 'Sidney No. 1 Lake Park',
      aaa: 'Sidney No. 1 Lake Park',
      bbb: 'Sidney No. 1 Lake Park',
    },
    {
      key: '8',
      name: 'George Hcc',
      gender: 'male',
      age: 20,
      email: 'george@example.com',
      address: 'Sidney No. 1 Lake Park',
      aaa: 'Sidney No. 1 Lake Park',
      bbb: 'Sidney No. 1 Lake Park',
    },],
    9:[
      {
        "date": "09月",
        "value": 23112
      },
      {
        "date": "10月",
        "value": 22101
      },
      {
        "date": "11月",
        "value": 21998
      },
      {
        "date": "12月",
        "value": 25123
      },
      {
        "date": "01月",
        "value": 19821
      },
    ]
  };
  return dataMap[v] ?? dataMap[1];
};

export const parseTryIns = () => {
  const value = localStorage.getItem("tryIns");
  // 如果没有设置的话 那么返回默认值true 也就是默认情况下使用insight 去洞察数据
  if (value === null || value === undefined) {
    return true;
  }
  if (value === "" || value?.trim() === "") {
    return false;
  }
  if (value === "false") {
    return false;
  }
  if (value === "f") {
    return false;
  }
  if (value === "0") {
    return false;
  }
  return Boolean(value);
};

const chartSortWeight = {
  column_chart: 1,
  bar_chart: 99,
  scatter_plot: 100,
};

// data : Array
export const transformChartAdviseResult = (adviseResult, tableData) => {
  let result = [...adviseResult].sort((a, b) => (chartSortWeight[a.type] ?? 5) - (chartSortWeight[b.type] ?? 5));
  // 过滤那些不好显示的图
  result = result.filter((item) => {
    if (
      [
        "percent_stacked_area_chart",
        "percent_stacked_bar_chart",
        "percent_stacked_column_chart",
        "stacked_area_chart",
        "stacked_bar_chart",
        "stacked_column_chart",
      ].includes(item.type)
    ) {
      return false;
    }
    return true;
  });

  // 看有没有 "donut_chart" 也就是 中间空心的饼图
  const donutChart = result.find((item) => item.type === "donut_chart");
  if (!donutChart) {
    const first = { ...(result[0] ?? {}) };
    const defaultDonutChart = {
      type: "donut_chart",
      spec: {
        encode: { color: first?.spec?.encode?.x || first?.spec?.encode?.color, y: first?.spec?.encode?.y },
        data: [...first.spec.data],
        type: "interval",
        coordinate: {
          type: "theta",
          innerRadius: 0.6,
        },
        transform: [
          {
            type: "stackY",
          },
        ],
      },
    };
    result = [defaultDonutChart, ...result];
  }

  // 看有没有 column_chart 也就是柱状图
  const columnChart = result.find((item) => item.type === "column_chart");
  if (!columnChart) {
    const first = { ...(result[0] ?? {}) };
    const defaultColumnChart = {
      type: "column_chart",
      spec: {
        encode: { x: first.spec.encode.x || first.spec.encode.color, y: first.spec.encode.y },
        data: [...first.spec.data],
        type: "interval",
        style: { maxWidth: 100 },
      },
    };
    // 把柱状图放到第一个
    result = [defaultColumnChart, ...result];
  } else {
    // 如果有柱状图的话 加一个 style 样式
    columnChart.spec = {
      ...columnChart.spec,
      style: { maxWidth: 100 },
    };
  }
  return result;
  //

  // let first = { ...(result[0] ?? {}) };
  // if (first.type === "scatter_plot") {
  //   // 散点图 变成折线图
  //   first.spec = { ...first.spec, type: "line" };
  // }
  // if (tableData.length === 1) {
  //   // 如果长度只有 1 显示柱状图
  //   first = {
  //     type: "column_chart",
  //     spec: {
  //       encode: { x: first.spec.encode.x || first.spec.encode.color, y: first.spec.encode.y },
  //       data: [...first.spec.data],
  //       type: "interval",
  //       style: { maxWidth: 100 },
  //     },
  //   };
  // }
  return result;
};


export const defaultSettings = {
  tryInsightFirst: false
}
