export type ChatSource = {
  text: string;
  source: string;
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
  sources?: ChatSource[];
};

export type ChatSession = {
  id: string;
  title: string;
  createdAt: string;
  relativeTime: string;
  messages: ChatMessage[];
};

export type KnowledgeBase = {
  id: string;
  name: string;
  orgType: 'department' | 'town' | 'soe' | null;
  orgName: string | null;
  kbType: 'unit' | 'theme';
};

export type SearchResultItem = {
  id: string;
  fileName: string;
  kbName: string;
  kbType: 'unit' | 'theme';
  orgName: string;
  summary: string;
  reportTime: string;
  fileType: 'xlsx' | 'docx' | 'pdf' | 'png';
  fileSize: string;
};

export type FilePreviewItem = {
  fileName: string;
  kbName: string;
  kbType: 'unit' | 'theme';
  orgName: string;
  owner: string;
  reportTime: string;
  updateFrequency: string;
  fileType: 'xlsx' | 'docx' | 'pdf' | 'png';
  fileSize: string;
  content:
    | {
        type: 'table';
        headers: string[];
        rows: string[][];
      }
    | {
        type: 'text';
        text: string;
      }
    | {
        type: 'image';
        url: string;
      };
};

export const hotQuestions = [
  '全区本月工作完成情况如何？',
  '哪些部门数据上报逾期了？',
  '重点项目最新进展是什么？',
  '本季度GDP数据是多少？',
];

export const defaultRecentSearches = [
  '区大数据局本月工作总结',
  '智慧城市项目进展',
  '安全生产隐患排查',
];

export const sessionList: ChatSession[] = [
  {
    id: 'session-001',
    title: '全区本月工作完成情况',
    createdAt: '2024-03-20 10:00:00',
    relativeTime: '刚刚',
    messages: [
      { id: 'msg-001', role: 'user', content: '全区本月工作完成情况如何？', time: '10:00' },
      {
        id: 'msg-002',
        role: 'assistant',
        content:
          '截至3月20日，全区共完成工作任务128项，按时完成率89.2%，较上月提升3.1个百分点。其中，区大数据局、区发改委、新塘镇表现突出，综合评分位列前三。但区市场监管局完成率仅55.3%，为全区最低，需重点关注。',
        sources: [
          { text: '128项', source: '采集任务系统-任务完成统计' },
          { text: '89.2%', source: '采集任务系统-按时完成率统计' },
          { text: '55.3%', source: '采集任务系统-区市场监管局任务明细' },
        ],
        time: '10:00',
      },
    ],
  },
  {
    id: 'session-002',
    title: '重点项目最新进展',
    createdAt: '2024-03-18 14:30:00',
    relativeTime: '2天前',
    messages: [
      { id: 'msg-003', role: 'user', content: '重点项目最新进展是什么？', time: '14:30' },
      {
        id: 'msg-004',
        role: 'assistant',
        content:
          '当前全区共有8个重点项目在推进中。其中，智慧城市一期项目进展顺利，政务云迁移率达85%，超额完成阶段目标。增城大道改扩建工程征地拆迁完成92%，施工单位已进场。但旧城改造二期存在延期风险，剩余37户未签约，建议加大协调力度。',
        sources: [
          { text: '85%', source: '区大数据局知识库-智慧城市一期项目月报' },
          { text: '92%', source: '区交通局知识库-增城大道项目进展报告' },
          { text: '37户', source: '区住建局知识库-旧城改造二期征迁台账' },
        ],
        time: '14:30',
      },
    ],
  },
];

export const allKnowledgeBases: KnowledgeBase[] = [
  { id: 'kb-001', name: '区大数据局知识库', orgType: 'department', orgName: '区大数据局', kbType: 'unit' },
  { id: 'kb-002', name: '区发改委知识库', orgType: 'department', orgName: '区发改委', kbType: 'unit' },
  { id: 'kb-003', name: '区文旅局知识库', orgType: 'department', orgName: '区文旅局', kbType: 'unit' },
  { id: 'kb-004', name: '区交通局知识库', orgType: 'department', orgName: '区交通局', kbType: 'unit' },
  { id: 'kb-005', name: '区卫健委知识库', orgType: 'department', orgName: '区卫健委', kbType: 'unit' },
  { id: 'kb-006', name: '区住建局知识库', orgType: 'department', orgName: '区住建局', kbType: 'unit' },
  { id: 'kb-007', name: '新塘镇知识库', orgType: 'town', orgName: '新塘镇', kbType: 'unit' },
  { id: 'kb-008', name: '石滩镇知识库', orgType: 'town', orgName: '石滩镇', kbType: 'unit' },
  { id: 'kb-009', name: '区城投集团知识库', orgType: 'soe', orgName: '区城投集团', kbType: 'unit' },
  { id: 'kb-010', name: '区交投集团知识库', orgType: 'soe', orgName: '区交投集团', kbType: 'unit' },
  { id: 'kb-011', name: '智慧城市专题库', orgType: null, orgName: null, kbType: 'theme' },
  { id: 'kb-012', name: '重点项目专题库', orgType: null, orgName: null, kbType: 'theme' },
];

export const searchResults: SearchResultItem[] = [
  {
    id: 'file-001',
    fileName: '2024年3月全区工作任务完成情况统计表',
    kbName: '区大数据局知识库',
    kbType: 'unit',
    orgName: '区大数据局',
    summary:
      '本表统计了2024年3月全区各部门、镇街、国企的工作任务完成情况，包括任务总数、完成数、完成率、按时完成率等核心指标。',
    reportTime: '2024-03-20 10:00:00',
    fileType: 'xlsx',
    fileSize: '1.2MB',
  },
  {
    id: 'file-002',
    fileName: '智慧城市一期项目2024年3月进展月报',
    kbName: '智慧城市专题库',
    kbType: 'theme',
    orgName: '区大数据局',
    summary:
      '本月完成数据中台核心模块部署，政务云平台迁移率从上月的62%提升至85%，超额完成本月75%的阶段目标。已完成12个部门业务系统的云上迁移。',
    reportTime: '2024-03-18 14:00:00',
    fileType: 'docx',
    fileSize: '3.5MB',
  },
  {
    id: 'file-003',
    fileName: '增城大道改扩建工程征地拆迁进展报告',
    kbName: '区交通局知识库',
    kbType: 'unit',
    orgName: '区交通局',
    summary:
      '征地拆迁工作已完成总量的92%，剩余8%涉及3户商业用地的补偿协商。施工单位已于3月15日正式进场，目前正在进行临时施工道路铺设。',
    reportTime: '2024-03-15 09:30:00',
    fileType: 'pdf',
    fileSize: '2.8MB',
  },
  {
    id: 'file-004',
    fileName: '旧城改造二期征迁台账',
    kbName: '区住建局知识库',
    kbType: 'unit',
    orgName: '区住建局',
    summary:
      '项目涉及征迁户数共计326户，目前已签约289户，签约率88.7%。剩余37户中，有12户对补偿方案提出异议，主要集中在商业用房评估价格方面。',
    reportTime: '2024-03-16 11:00:00',
    fileType: 'xlsx',
    fileSize: '856KB',
  },
  {
    id: 'file-005',
    fileName: '2024年第一季度经济运行情况分析报告',
    kbName: '区发改委知识库',
    kbType: 'unit',
    orgName: '区发改委',
    summary:
      '2024年第一季度，全区实现地区生产总值（GDP）约328.5亿元，同比增长6.2%。第一产业增加值12.3亿元，第二产业增加值158.7亿元。',
    reportTime: '2024-03-10 16:00:00',
    fileType: 'docx',
    fileSize: '4.1MB',
  },
  {
    id: 'file-006',
    fileName: '区市场监管局2024年3月工作任务完成明细',
    kbName: '区市场监管局知识库',
    kbType: 'unit',
    orgName: '区市场监管局',
    summary:
      '本月区市场监管局共承担工作任务9项，完成5项，完成率55.3%。未完成任务主要集中在食品安全专项检查和企业信用监管领域。',
    reportTime: '2024-03-19 15:00:00',
    fileType: 'docx',
    fileSize: '1.8MB',
  },
  {
    id: 'file-007',
    fileName: '医共体信息化建设2024年3月月报',
    kbName: '区卫健委知识库',
    kbType: 'unit',
    orgName: '区卫健委',
    summary: '系统开发整体完成60%，其中电子病历共享模块已完成开发并进入内部测试阶段，远程会诊模块完成45%。',
    reportTime: '2024-03-17 10:30:00',
    fileType: 'pdf',
    fileSize: '2.1MB',
  },
  {
    id: 'file-008',
    fileName: '新塘镇2024年3月工作情况汇报',
    kbName: '新塘镇知识库',
    kbType: 'unit',
    orgName: '新塘镇',
    summary: '本月新塘镇共承担工作任务12项，完成11项，完成率92.3%。重点推进了镇域经济发展、城市更新、民生保障等方面工作。',
    reportTime: '2024-03-18 09:00:00',
    fileType: 'docx',
    fileSize: '2.5MB',
  },
  {
    id: 'file-009',
    fileName: '区城投集团2024年第一季度经营数据报告',
    kbName: '区城投集团知识库',
    kbType: 'unit',
    orgName: '区城投集团',
    summary:
      '2024年第一季度，区城投集团实现营业收入3.2亿元，同比增长8.5%。重点推进了城市基础设施建设项目5个，完成投资额1.8亿元。',
    reportTime: '2024-03-12 14:00:00',
    fileType: 'xlsx',
    fileSize: '1.5MB',
  },
  {
    id: 'file-010',
    fileName: '安全生产隐患排查治理月度报告',
    kbName: '区应急管理局知识库',
    kbType: 'unit',
    orgName: '区应急管理局',
    summary:
      '本月全区共排查安全生产隐患326处，已整改完成298处，整改率91.4%。其中重大隐患2处，均已制定整改方案并落实责任人。',
    reportTime: '2024-03-19 11:00:00',
    fileType: 'pdf',
    fileSize: '3.2MB',
  },
];

export const filePreviewData: Record<string, FilePreviewItem> = {
  'file-001': {
    fileName: '2024年3月全区工作任务完成情况统计表',
    kbName: '区大数据局知识库',
    kbType: 'unit',
    orgName: '区大数据局',
    owner: '张三',
    reportTime: '2024-03-20 10:00:00',
    updateFrequency: '每月更新',
    fileType: 'xlsx',
    fileSize: '1.2MB',
    content: {
      type: 'table',
      headers: ['单位名称', '任务总数', '完成数', '完成率', '按时完成率'],
      rows: [
        ['区大数据局', '15', '15', '100%', '96.5%'],
        ['区发改委', '18', '17', '94.4%', '94.1%'],
        ['新塘镇', '12', '11', '91.7%', '92.3%'],
        ['区教育局', '14', '12', '85.7%', '88.7%'],
        ['区卫健委', '16', '14', '87.5%', '85.2%'],
        ['区城投集团', '10', '8', '80.0%', '82.0%'],
        ['区交通局', '11', '8', '72.7%', '72.5%'],
        ['区市场监管局', '9', '5', '55.6%', '55.3%'],
      ],
    },
  },
  'file-005': {
    fileName: '2024年第一季度经济运行情况分析报告',
    kbName: '区发改委知识库',
    kbType: 'unit',
    orgName: '区发改委',
    owner: '李四',
    reportTime: '2024-03-10 16:00:00',
    updateFrequency: '每季度更新',
    fileType: 'docx',
    fileSize: '4.1MB',
    content: {
      type: 'text',
      text: '一、总体情况\n\n2024年第一季度，全区实现地区生产总值（GDP）约328.5亿元，同比增长6.2%。其中，第一产业增加值12.3亿元，同比增长3.1%；第二产业增加值158.7亿元，同比增长7.5%；第三产业增加值157.5亿元，同比增长5.3%。\n\n二、工业经济\n\n规模以上工业增加值同比增长8.2%，高于全市平均水平1.5个百分点。重点行业中，电子信息制造业增长12.3%，汽车制造业增长9.8%，新能源产业增长15.6%。\n\n三、固定资产投资\n\n全区固定资产投资同比增长10.5%，其中基础设施投资增长18.2%，工业投资增长12.8%，房地产开发投资下降3.2%。重点项目投资完成率达到28.5%，高于时序进度3.5个百分点。',
    },
  },
  'file-003': {
    fileName: '增城大道改扩建工程征地拆迁进展报告',
    kbName: '区交通局知识库',
    kbType: 'unit',
    orgName: '区交通局',
    owner: '王五',
    reportTime: '2024-03-15 09:30:00',
    updateFrequency: '每周更新',
    fileType: 'pdf',
    fileSize: '2.8MB',
    content: {
      type: 'text',
      text: '征地拆迁工作已完成总量的92%，剩余8%涉及3户商业用地的补偿协商，预计4月上旬可完成。施工单位已于3月15日正式进场，目前正在进行临时施工道路铺设和管线迁改前期准备。',
    },
  },
  'file-010': {
    fileName: '安全生产隐患排查治理月度报告',
    kbName: '区应急管理局知识库',
    kbType: 'unit',
    orgName: '区应急管理局',
    owner: '赵六',
    reportTime: '2024-03-19 11:00:00',
    updateFrequency: '每月更新',
    fileType: 'png',
    fileSize: '3.2MB',
    content: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1505673542671-1d117719f1b5?auto=format&fit=crop&w=900&q=60',
    },
  },
};

export const currentUser = {
  name: '张三',
  orgName: '区大数据局',
  avatar: null,
};

export const kbTypeMeta = {
  unit: { label: '单位库', color: '#52c41a' },
  theme: { label: '主题库', color: '#722ed1' },
};

export const orgTypeOptions = [
  { label: '全部', value: 'all' },
  { label: '部门', value: 'department' },
  { label: '镇街', value: 'town' },
  { label: '国企', value: 'soe' },
] as const;

export const kbTypeOptions = [
  { label: '全部', value: 'all' },
  { label: '单位库', value: 'unit' },
  { label: '主题库', value: 'theme' },
] as const;

export type OrgTypeFilter = (typeof orgTypeOptions)[number]['value'];
export type KbTypeFilter = (typeof kbTypeOptions)[number]['value'];

export const getFilteredKnowledgeBases = (orgType: OrgTypeFilter, kbType: KbTypeFilter): KnowledgeBase[] => {
  let result = allKnowledgeBases;

  if (orgType !== 'all') {
    result = result.filter((kb) => kb.orgType === orgType || kb.kbType === 'theme');
  }

  if (kbType !== 'all') {
    result = result.filter((kb) => kb.kbType === kbType);
  }

  if (kbType === 'theme') {
    result = allKnowledgeBases.filter((kb) => kb.kbType === 'theme');
  }

  return result;
};

export const getMockAssistantReply = (question: string): { content: string; sources: ChatSource[] } => {
  if (question.includes('逾期')) {
    return {
      content:
        '近期逾期上报主要集中在区交通局，2月和3月分别逾期5天、3天。建议优先补齐信息化专员培训并设置AB岗，避免再次影响全区汇总时效。',
      sources: [
        { text: '逾期5天、3天', source: '数据上报模块-区交通局上报记录' },
        { text: '影响全区汇总时效', source: '采集任务系统-全区月报发布记录' },
      ],
    };
  }

  if (question.includes('GDP')) {
    return {
      content:
        '2024年第一季度全区GDP约328.5亿元，同比增长6.2%。其中第二产业增加值158.7亿元，增速7.5%，是本季度主要拉动项。',
      sources: [
        { text: '328.5亿元', source: '区发改委知识库-2024年第一季度经济运行情况分析报告' },
        { text: '6.2%', source: '区发改委知识库-2024年第一季度经济运行情况分析报告' },
      ],
    };
  }

  return {
    content:
      '截至3月20日，全区共完成工作任务128项，按时完成率89.2%，较上月提升3.1个百分点。重点项目中智慧城市一期进展较快，政务云迁移率达85%。',
    sources: [
      { text: '128项', source: '采集任务系统-任务完成统计' },
      { text: '89.2%', source: '采集任务系统-按时完成率统计' },
      { text: '85%', source: '区大数据局知识库-智慧城市一期项目月报' },
    ],
  };
};
