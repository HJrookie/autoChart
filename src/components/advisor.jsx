import { Advisor } from '@antv/ava';

const myAdvisor = new Advisor();

// 图表推荐
const data = [
  { tax: 100, tag: 'A' },
  { tax: 200, tag: 'B' },
];
const results = myAdvisor.advise({ data });

// 图表优化
const spec = { someAntVSpec }; // 查看 G2 v5 的图表描述 Specification
const errors = myAdvisor.lint({ spec });