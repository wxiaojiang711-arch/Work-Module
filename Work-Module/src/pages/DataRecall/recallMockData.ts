export interface PairMessage {
  id: string;
  role: "pair";
  question: string;
  beforeTreatment: string;
  afterTreatment: string;
  afterSource?: string;
  time: string;
  answerTime?: string;
  loading?: boolean;
}

export interface RecallSession {
  id: string;
  title: string;
  createdAt: string;
  relativeTime: string;
  messages: PairMessage[];
}

export const sessionList: RecallSession[] = [
  {
    id: "session-001",
    title: "新会话",
    createdAt: "2024-03-20 10:00:00",
    relativeTime: "刚刚",
    messages: [],
  },
  {
    id: "session-002",
    title: "增城区2024年GDP数据查询",
    createdAt: "2024-03-18 14:30:00",
    relativeTime: "2天前",
    messages: [
      {
        id: "msg-001",
        role: "pair",
        question: "增城区2024年第一季度GDP是多少？",
        beforeTreatment:
          '根据检索，未找到与"增城区2024年第一季度GDP"直接相关的文档。建议您查阅区统计局发布的季度经济运行分析报告。',
        afterTreatment:
          "根据《增城区2024年第一季度经济运行情况分析报告》，2024年第一季度增城区实现地区生产总值（GDP）约328.5亿元，同比增长6.2%。其中，第一产业增加值12.3亿元，第二产业增加值158.7亿元，第三产业增加值157.5亿元。",
        afterSource: "来源：《增城区2024年第一季度经济运行情况分析报告》第2页",
        time: "2024-03-18 14:30:00",
        answerTime: "2024-03-18 14:30:05",
      },
    ],
  },
  {
    id: "session-003",
    title: "安全生产相关政策查询",
    createdAt: "2024-03-15 09:00:00",
    relativeTime: "5天前",
    messages: [
      {
        id: "msg-003",
        role: "pair",
        question: "增城区关于安全生产的最新政策文件有哪些？",
        beforeTreatment:
          "关于安全生产政策，检索到部分相关内容，但文档版本较旧，可能不是最新政策。建议联系区应急管理局获取最新文件。",
        afterTreatment:
          "根据知识库检索，增城区关于安全生产的最新政策文件包括：\n1.《增城区2024年安全生产工作要点》（增安委〔2024〕1号）\n2.《增城区安全生产隐患排查治理实施方案》（增安委办〔2024〕5号）\n3.《关于加强岁末年初安全生产工作的通知》（增安委办〔2024〕12号）\n\n以上文件均可在区应急管理局知识库中查阅全文。",
        afterSource: "来源：区应急管理局知识库",
        time: "2024-03-15 09:00:00",
        answerTime: "2024-03-15 09:00:08",
      },
    ],
  },
];

export const mockGenerateResponse = (question: string) => ({
  beforeTreatment: `针对您的问题"${question}"，在原始数据中未检索到高度匹配的内容。原始数据可能存在格式不统一、关键词缺失等问题，导致召回效果不佳。`,
  afterTreatment:
    `针对您的问题"${question}"，经过数据治理后的知识库检索到以下相关内容：\n\n` +
    "[此处为模拟的治理后召回结果，实际内容由后端API返回。治理后的数据经过了格式标准化、关键词提取、语义增强等处理，召回准确率显著提升。]",
  afterSource: "来源：治理后知识库",
});
