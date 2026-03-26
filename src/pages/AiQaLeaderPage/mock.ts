import type { QaAnswer, QaSession, ReportTaskPayload, ReportTaskResult, TimeRange } from "./types";

export const mockSessions: QaSession[] = [
  {
    id: "session-001",
    title: "本周数据质量红黄灯情况",
    createdAt: "2025-01-15T10:30:00Z",
    lastUpdatedAt: "2025-01-15T10:35:00Z",
    lastQuestion: "本周数据质量红黄灯情况？",
    lastAnswerId: "answer-001",
  },
  {
    id: "session-002",
    title: "各区县指标排名与变化",
    createdAt: "2025-01-14T14:20:00Z",
    lastUpdatedAt: "2025-01-14T14:25:00Z",
    lastQuestion: "各区县指标排名与变化？",
    lastAnswerId: "answer-002",
  },
];

export const mockAnswer: QaAnswer = {
  id: "answer-001",
  question: "本周数据质量红黄灯情况？",
  timeRange: "7d",
  summary: [
    "本周全市数据质量总体稳定，综合得分92.3分，环比上升1.2分",
    "红灯预警2项：A区县常住人口重复率异常升高（15.3%），B区县法人数据及时率低于阈值（78%）",
    "黄灯提示3项：C区县政务服务数据完整率波动、D区县信用数据口径不一致、E区县共享接口调用失败率偏高",
    "建议优先处理A区县重复率问题，已影响人口主题报表准确性",
  ],
  kpis: [
    { key: "coverage", label: "数据覆盖率", value: 96.5, unit: "%", delta: 0.8, trend: "up", status: "green" },
    { key: "completeness", label: "完整率", value: 94.2, unit: "%", delta: -0.3, trend: "down", status: "yellow" },
    { key: "duplicate", label: "重复率", value: 8.7, unit: "%", delta: 2.1, trend: "up", status: "red" },
    { key: "timeliness", label: "及时率", value: 89.3, unit: "%", delta: -1.5, trend: "down", status: "yellow" },
    { key: "abnormalRules", label: "异常规则数", value: 12, unit: "条", delta: 3, trend: "up", status: "red" },
    { key: "sharingCalls", label: "共享调用量", value: 15420, unit: "次", delta: 1230, trend: "up", status: "green" },
    { key: "taskCompletion", label: "上报任务完成率", value: 87.5, unit: "%", delta: 2.3, trend: "up", status: "green" },
  ],
  charts: {
    trendData: [
      { date: "01-09", value: 91.2 },
      { date: "01-10", value: 91.5 },
      { date: "01-11", value: 90.8 },
      { date: "01-12", value: 91.9 },
      { date: "01-13", value: 92.1 },
      { date: "01-14", value: 92.0 },
      { date: "01-15", value: 92.3 },
    ],
    rankData: [
      { name: "A区县", value: 88.5 },
      { name: "B区县", value: 90.2 },
      { name: "C区县", value: 93.1 },
      { name: "D区县", value: 94.5 },
      { name: "E区县", value: 95.8 },
    ],
  },
  risks: [
    {
      id: "risk-001",
      title: "A区县常住人口重复率异常升高",
      level: "red",
      impact: "影响人口主题报表、一网通办实有人口核验接口",
      reason: "疑似采集源重复上报，或去重规则失效",
      suggestion: "建议A区县数据治理专员核查采集链路，并补充身份证号字段用于精准去重",
    },
    {
      id: "risk-002",
      title: "B区县法人数据及时率低于阈值",
      level: "red",
      impact: "影响企业服务专题、信用联合奖惩应用",
      reason: "上报任务延迟3天未完成，疑似系统故障或人工操作延迟",
      suggestion: "建议B区县尽快完成上报任务，并说明延迟原因",
    },
    {
      id: "risk-003",
      title: "C区县政务服务数据完整率波动",
      level: "yellow",
      impact: "影响政务服务效能分析报表",
      reason: "部分字段缺失率上升，疑似表单改版后字段映射未更新",
      suggestion: "建议C区县核查字段映射规则，补齐缺失字段",
    },
  ],
  actions: [
    { id: "action-001", text: "建议A区县数据治理专员核查采集链路", linkedRiskId: "risk-001" },
    { id: "action-002", text: "建议B区县尽快完成上报任务", linkedRiskId: "risk-002" },
    { id: "action-003", text: "建议发起口径统一协调会", linkedRiskId: "risk-003" },
  ],
  evidence: {
    definitions: [
      {
        id: "def-001",
        name: "常住人口-指标定义",
        type: "definition",
        content: "常住人口指在本地居住半年以上的人口，统计口径为公安人口库+流动人口库去重后汇总",
        updatedAt: "2024-12-01",
        responsible: "市公安局",
      },
      {
        id: "def-002",
        name: "法人数据-指标定义",
        type: "definition",
        content: "法人数据包含企业、个体工商户、社会组织等，统计口径为市场监管局+民政局数据融合",
        updatedAt: "2024-11-15",
        responsible: "市市场监管局",
      },
    ],
    rules: [
      {
        id: "rule-001",
        name: "重复率检测规则-R001",
        type: "rule",
        content: "基于身份证号+姓名+出生日期三字段联合去重，重复率阈值10%",
        updatedAt: "2025-01-10",
        responsible: "市数据局",
      },
      {
        id: "rule-002",
        name: "及时率检测规则-R005",
        type: "rule",
        content: "数据更新时间距离统计时点不超过T+3，及时率阈值85%",
        updatedAt: "2025-01-08",
        responsible: "市数据局",
      },
    ],
    lineage: [
      {
        id: "lineage-001",
        name: "常住人口数据血缘",
        type: "lineage",
        content: "上游：公安人口库、流动人口库；下游：人口主题报表、一网通办实有人口核验接口、社区网格化管理应用",
        updatedAt: "2025-01-05",
        responsible: "市数据局",
      },
    ],
    changes: [
      {
        id: "change-001",
        name: "常住人口口径调整记录",
        type: "change",
        content: "2024年12月1日起，常住人口统计口径新增流动人口库，去重规则由二字段改为三字段",
        updatedAt: "2024-12-01",
        responsible: "市公安局",
      },
    ],
  },
  trust: {
    consistency: "conflict",
    conflictDetails: "D区县信用数据口径与市级定义存在差异",
    freshness: "T+1",
    completeness: "incomplete",
    incompleteReason: "A区县常住人口数据缺少身份证号字段，影响精准去重",
  },
  createdAt: "2025-01-15T10:35:00Z",
};

export const askQuestion = async (
  question: string,
  timeRange: TimeRange,
  customRange?: [string, string],
): Promise<QaAnswer> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...mockAnswer,
        id: `answer-${Date.now()}`,
        question,
        timeRange,
        customTimeRange: customRange,
        createdAt: new Date().toISOString(),
      });
    }, 1500);
  });
};

export const getHistorySessions = async (): Promise<QaSession[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockSessions), 300);
  });
};

export const getSessionDetail = async (_sessionId: string): Promise<QaAnswer> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ ...mockAnswer }), 500);
  });
};

export const createReportTask = async (_payload: ReportTaskPayload): Promise<ReportTaskResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const now = new Date();
      const taskId = `TASK-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
        now.getDate(),
      ).padStart(2, "0")}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`;
      resolve({ success: true, taskId, message: "数据上报任务已生成" });
    }, 800);
  });
};

export const mockOrgTree = [
  {
    title: "A区县",
    value: "org-a",
    children: [
      { title: "A区数据局", value: "org-a-data" },
      { title: "A区公安局", value: "org-a-police" },
    ],
  },
  {
    title: "B区县",
    value: "org-b",
    children: [
      { title: "B区数据局", value: "org-b-data" },
      { title: "B区市场监管局", value: "org-b-market" },
    ],
  },
  {
    title: "C区县",
    value: "org-c",
    children: [{ title: "C区数据局", value: "org-c-data" }],
  },
  { title: "D区县", value: "org-d" },
  { title: "E区县", value: "org-e" },
];

export const mockTopics = [
  { label: "人口主题", value: "topic-population" },
  { label: "法人主题", value: "topic-legal" },
  { label: "政务服务主题", value: "topic-service" },
  { label: "信用主题", value: "topic-credit" },
  { label: "共享交换主题", value: "topic-sharing" },
];
