import type { ReactNode } from "react";

export type ReportStatus = "completed" | "generating" | "failed";

export interface ReportItem {
  id: string;
  title: string;
  topic: string;
  status: ReportStatus;
  generatedAt: string;
  relativeTime: string;
  duration: string | null;
  knowledgeBases: string[];
}

export interface InlineSource {
  text: string;
  source: string;
}

export interface SummaryParagraph {
  text: string;
  sources: InlineSource[];
}

export interface StatisticItem {
  title: string;
  value: number;
  suffix: string;
  trend: "up" | "down" | "flat";
  trendValue: string;
  source: string;
}

export interface CategoryAnalysisItem {
  title: string;
  content: string;
  sources: InlineSource[];
}

export interface KeyProjectItem {
  name: string;
  unit: string;
  status: "green" | "blue" | "red";
  description: string;
  sources: InlineSource[];
}

export interface RiskItem {
  level: "error" | "warning" | "info";
  title: string;
  description: string;
  suggestions: string;
  sources: InlineSource[];
}

export interface SuggestionItem {
  title: string;
  content: string;
  target: string;
}

export interface DataSourceItem {
  id: number;
  name: string;
  type: "system" | "unit" | "theme";
  fileCount: number | "-";
  dateRange: string;
}

export interface ReportContentData {
  title: string;
  generatedAt: string;
  dataRange: string;
  sourceCount: string;
  summary: SummaryParagraph[];
  statistics: StatisticItem[];
  unitRanking: Array<{
    rank: number;
    name: string;
    taskCount: number;
    completionRate: number;
    reportRate: number;
    score: number;
  }>;
  categoryAnalysis: {
    department: CategoryAnalysisItem;
    town: CategoryAnalysisItem;
    soe: CategoryAnalysisItem;
  };
  keyProjects: KeyProjectItem[];
  risks: RiskItem[];
  suggestions: SuggestionItem[];
  dataSources: DataSourceItem[];
}

export const reportList: ReportItem[] = [
  {
    id: "report-001",
    title: "全区各部门2024年3月工作情况总结报告",
    topic: "请帮我总结全区各部门本月的工作情况",
    status: "completed",
    generatedAt: "2024-03-20 10:30:00",
    relativeTime: "刚刚",
    duration: "2分15秒",
    knowledgeBases: ["区大数据局", "区发改委", "区文旅局", "主题库-智慧城市"],
  },
  {
    id: "report-002",
    title: "2024年第一季度重点项目推进情况分析",
    topic: "分析全区第一季度重点项目的推进情况",
    status: "completed",
    generatedAt: "2024-03-18 14:00:00",
    relativeTime: "2天前",
    duration: "3分08秒",
    knowledgeBases: ["主题库-重点项目", "区发改委", "区住建局"],
  },
  {
    id: "report-003",
    title: "营商环境优化工作进展报告",
    topic: "总结近期营商环境优化的工作进展",
    status: "generating",
    generatedAt: "2024-03-20 11:00:00",
    relativeTime: "刚刚",
    duration: null,
    knowledgeBases: ["区发改委", "区市场监管局"],
  },
  {
    id: "report-004",
    title: "安全生产隐患排查情况月报",
    topic: "汇总本月安全生产隐患排查情况",
    status: "failed",
    generatedAt: "2024-03-15 09:00:00",
    relativeTime: "5天前",
    duration: null,
    knowledgeBases: ["区应急管理局"],
  },
];

export const reportContent: ReportContentData = {
  title: "全区各部门2024年3月工作情况总结报告",
  generatedAt: "2024年3月20日",
  dataRange: "2024年3月1日 - 2024年3月20日",
  sourceCount: "12个单位库、3个主题库",
  summary: [
    {
      text: "2024年3月，全区15个部门、6个镇街、5个国企围绕区委区政府年度重点工作部署，扎实推进各项任务。截至3月20日，全区共完成工作任务128项，按时完成率89.2%，较上月提升3.1个百分点；数据上报完成率92.5%，较上月下降1.2个百分点。",
      sources: [
        { text: "89.2%", source: "采集任务系统-任务完成统计" },
        { text: "92.5%", source: "数据上报模块-上报完成率统计" },
      ],
    },
    {
      text: "本月工作呈现以下特点：一是数字政府建设加速推进，智慧城市一期项目政务云迁移率达85%，超额完成阶段目标；二是经济运行总体平稳，第一季度GDP预计同比增长6.2%；三是民生领域持续发力，区级医共体信息化建设稳步推进。但同时也存在部分单位数据上报不及时、个别重点项目推进滞后、跨部门协同效率有待提升等问题，需在下一阶段重点关注和改进。",
      sources: [
        { text: "85%", source: "区大数据局知识库-智慧城市一期项目月报" },
        { text: "6.2%", source: "区发改委知识库-2024年Q1经济运行分析" },
      ],
    },
    {
      text: "综合评估，全区3月份工作完成质量整体良好，但距离年度目标仍有差距，建议各单位进一步压实责任、加快进度。",
      sources: [],
    },
  ],
  statistics: [
    { title: "任务完成总数", value: 128, suffix: "项", trend: "up", trendValue: "12.3%", source: "采集任务系统-任务完成统计" },
    { title: "按时完成率", value: 89.2, suffix: "%", trend: "up", trendValue: "3.1%", source: "采集任务系统-按时完成率统计" },
    { title: "参与部门数", value: 15, suffix: "个", trend: "flat", trendValue: "0", source: "组织机构管理-活跃单位统计" },
    { title: "数据上报完成率", value: 92.5, suffix: "%", trend: "down", trendValue: "1.2%", source: "数据上报模块-上报完成率统计" },
    { title: "重点项目推进数", value: 8, suffix: "个", trend: "up", trendValue: "2个", source: "主题库-重点项目专题库" },
    { title: "待解决问题数", value: 5, suffix: "个", trend: "up", trendValue: "2个", source: "本报告第五章-问题与风险提示汇总" },
  ],
  unitRanking: [
    { rank: 1, name: "区大数据局", taskCount: 15, completionRate: 96.5, reportRate: 100, score: 95.2 },
    { rank: 2, name: "区发改委", taskCount: 18, completionRate: 94.1, reportRate: 100, score: 93.8 },
    { rank: 3, name: "新塘镇", taskCount: 12, completionRate: 92.3, reportRate: 95.5, score: 91.5 },
    { rank: 4, name: "区教育局", taskCount: 14, completionRate: 88.7, reportRate: 90.0, score: 87.3 },
    { rank: 5, name: "区卫健委", taskCount: 16, completionRate: 85.2, reportRate: 88.5, score: 84.6 },
    { rank: 6, name: "区城投集团", taskCount: 10, completionRate: 82.0, reportRate: 85.0, score: 81.2 },
    { rank: 7, name: "区交通局", taskCount: 11, completionRate: 72.5, reportRate: 70.0, score: 68.9 },
    { rank: 8, name: "区市场监管局", taskCount: 9, completionRate: 55.3, reportRate: 60.0, score: 52.1 },
  ],
  categoryAnalysis: {
    department: {
      title: "委办部门分析",
      content:
        "本月10个委办部门共承担工作任务86项，完成78项，整体完成率90.7%。其中，区大数据局和区发改委表现突出，综合评分均超过93分，连续三个月位列前两名。区教育局和区卫健委受春季开学和流感防控等阶段性工作影响，任务完成率较上月有所下降，但仍保持在85%以上的合理区间。需要重点关注的是区市场监管局，受机构调整影响，本月完成率仅55.3%，为全区最低，建议给予专项支持。",
      sources: [
        { text: "90.7%", source: "采集任务系统-部门维度统计" },
        { text: "55.3%", source: "采集任务系统-区市场监管局任务明细" },
      ],
    },
    town: {
      title: "镇街分析",
      content:
        "本月6个镇街共承担工作任务32项，完成28项，整体完成率87.5%。新塘镇作为经济体量最大的镇街，在任务量最多的情况下仍保持92.3%的高完成率，值得肯定。永宁街道和荔湖街道因城市更新项目集中推进，人力资源紧张，完成率略低于平均水平。朱村街道因行政区划调整处于过渡期，本月暂未纳入考核。",
      sources: [
        { text: "87.5%", source: "采集任务系统-镇街维度统计" },
        { text: "92.3%", source: "采集任务系统-新塘镇任务明细" },
      ],
    },
    soe: {
      title: "国企分析",
      content:
        "本月5个区属国企共承担工作任务10项，完成8项，整体完成率80.0%。区城投集团在城市基础设施建设方面持续发力，完成率82.0%。区水投集团因重组整合暂停部分业务，本月未产生新增任务。整体来看，国企板块的数据上报规范性仍有提升空间，建议加强对国企信息化管理的指导。",
      sources: [{ text: "80.0%", source: "采集任务系统-国企维度统计" }],
    },
  },
  keyProjects: [
    {
      name: "智慧城市一期项目",
      unit: "区大数据局",
      status: "green",
      description:
        "本月完成数据中台核心模块部署，政务云平台迁移率从上月的62%提升至85%，超额完成本月75%的阶段目标。已完成12个部门业务系统的云上迁移，剩余3个部门计划于4月底前完成。同时，城市运行管理中心大屏系统完成第一版开发，已接入交通、环保、城管三个领域的实时数据。下一步将重点推进数据治理标准制定和跨部门数据共享接口开发。",
      sources: [
        { text: "85%", source: "区大数据局知识库-智慧城市一期项目月报" },
        { text: "实时数据", source: "区大数据局知识库-城市运行中心建设周报" },
      ],
    },
    {
      name: "增城大道改扩建工程",
      unit: "区交通局",
      status: "blue",
      description:
        "征地拆迁工作已完成总量的92%，剩余8%涉及3户商业用地的补偿协商，预计4月上旬可全部完成。施工单位已于3月15日正式进场，目前正在进行临时施工道路铺设和管线迁改前期准备。项目总投资4.2亿元，已完成投资0.8亿元，占总投资的19%。按照当前进度，预计可在年底前完成主体工程。",
      sources: [
        { text: "92%", source: "区交通局知识库-增城大道项目进展报告" },
        { text: "19%", source: "区发改委知识库-重点项目投资台账" },
      ],
    },
    {
      name: "区级医共体信息化建设",
      unit: "区卫健委",
      status: "blue",
      description:
        "系统开发整体完成60%，其中电子病历共享模块已完成开发并进入内部测试阶段，远程会诊模块完成45%。本月重点推进了基层医疗机构的网络改造工作，已完成8家社区卫生服务中心的网络升级，剩余4家计划于4月中旬完成。硬件设备采购已完成招标，预计4月初到货安装。项目总体进度符合预期，但需关注基层医务人员的系统操作培训工作。",
      sources: [
        { text: "60%", source: "区卫健委知识库-医共体信息化建设月报" },
        { text: "8家", source: "区卫健委知识库-基层网络改造进度表" },
      ],
    },
    {
      name: "旧城改造二期",
      unit: "区住建局",
      status: "red",
      description:
        "项目涉及征迁户数共计326户，目前已签约289户，签约率88.7%。剩余37户中，有12户对补偿方案提出异议，主要集中在商业用房的评估价格方面。本月已组织3次协调会，但未取得实质性突破。项目进度较原计划滞后约2周，如4月中旬前无法完成全部签约，将影响下半年的施工计划。建议由分管区领导牵头，组织住建、城管、属地镇街联合推进。",
      sources: [
        { text: "88.7%", source: "区住建局知识库-旧城改造二期征迁台账" },
        { text: "滞后约2周", source: "区发改委知识库-重点项目进度跟踪表" },
      ],
    },
  ],
  risks: [
    {
      level: "error",
      title: "区交通局数据上报连续2个月逾期",
      description:
        "区交通局在2月和3月的月度数据采集任务中均未按时提交，分别逾期5天和3天。经了解，主要原因为该局信息化专员岗位人员变动，新接手人员对系统操作不熟悉。该问题已影响全区数据汇总的时效性，导致2月份全区月报延迟2天发布。",
      suggestions:
        "①由区大数据局安排专人对区交通局进行系统操作培训；②将数据上报及时率纳入该局月度绩效考核；③建议该局指定AB岗，避免因人员变动导致工作断档。",
      sources: [
        { text: "逾期5天和3天", source: "数据上报模块-区交通局上报记录" },
        { text: "延迟2天发布", source: "采集任务系统-全区月报发布记录" },
      ],
    },
    {
      level: "error",
      title: "区市场监管局任务完成率低于60%",
      description:
        "区市场监管局本月任务完成率仅55.3%，为全区最低，且较上月下降12个百分点。经分析，主要原因为该局正在进行内部机构调整，原食品安全监管科和产品质量监管科合并重组，期间部分工作交接不畅。",
      suggestions:
        "①建议该局尽快完成机构调整，明确各科室职责分工；②对本月未完成的任务进行梳理，制定补完计划；③区政府办可考虑在过渡期适当减少该局的非核心任务量。",
      sources: [{ text: "55.3%", source: "采集任务系统-区市场监管局任务完成趋势" }],
    },
    {
      level: "warning",
      title: "旧城改造二期项目存在延期风险",
      description:
        "该项目剩余37户未签约，其中12户存在较大分歧。如不能在4月中旬前完成全部签约，将直接影响下半年的施工进度，可能导致项目整体延期3-6个月，并产生额外的过渡安置费用约800万元。",
      suggestions:
        "①由分管区领导牵头召开专题协调会；②对争议较大的12户制定一户一策方案；③必要时引入第三方评估机构重新评估商业用房价格。",
      sources: [
        { text: "37户", source: "区住建局知识库-旧城改造二期征迁台账" },
        { text: "800万元", source: "区住建局知识库-旧城改造二期预算评估报告" },
      ],
    },
    {
      level: "warning",
      title: "部分镇街基层减负效果不明显",
      description:
        "通过数据分析发现，永宁街道和荔湖街道本月接收的数据采集任务数量分别为18项和16项，较上月增加40%以上。其中存在多个任务采集内容重叠的情况，如人口数据在3个不同任务中重复采集。基层工作人员反映填报负担较重。",
      suggestions:
        "①由区大数据局牵头梳理各采集任务的数据项，合并重复采集内容；②推动一数一源机制，已有数据通过系统自动回填，减少重复填报；③建立采集任务发布前的审核机制，避免过度采集。",
      sources: [
        { text: "18项和16项", source: "采集任务系统-镇街任务分发统计" },
        { text: "3个不同任务", source: "文件模板管理-表单字段重复分析" },
      ],
    },
    {
      level: "info",
      title: "国企板块数据上报规范性待提升",
      description:
        "5个区属国企中，有3个在数据上报时存在格式不规范的问题，主要表现为：数值字段填写文本、日期格式不统一、必填字段漏填等。虽然不影响数据的完整性，但增加了后续数据治理的工作量。",
      suggestions:
        "①在表单模板中增加更严格的字段校验规则；②由区大数据局组织一次面向国企的系统操作培训；③编制《数据填报规范指南》并下发各国企。",
      sources: [{ text: "3个", source: "数据上报模块-国企上报数据质量检测" }],
    },
  ],
  suggestions: [
    {
      title: "加强数据上报时效性管控",
      content:
        "建议将数据上报及时率纳入各单位月度考核指标体系，设定90%为达标线。对连续两个月逾期的单位，由区政府办发函督办；连续三个月逾期的，纳入年度考核扣分项。同时，优化系统的自动催办功能，在截止时间前3天、1天分别发送提醒通知。",
      target: "区大数据局、区政府办",
    },
    {
      title: "加大重点项目协调力度",
      content:
        "针对旧城改造二期等存在风险的项目，建议由分管区领导牵头，每两周召开一次专题推进会，建立问题台账和销号机制。对于涉及多部门协同的项目，明确牵头单位和配合单位的职责边界，避免推诿扯皮。",
      target: "区住建局、区政府办",
    },
    {
      title: "优化数据采集流程，切实推进基层减负",
      content:
        "建议由区大数据局牵头，对当前所有在执行的采集任务进行全面梳理，合并数据项重叠的任务，推动一数一源、一源多用。对于已在系统中存在的数据，通过接口自动回填，减少基层重复填报。目标是在下季度将各镇街月均接收任务数量控制在12项以内。",
      target: "区大数据局",
    },
    {
      title: "加强跨部门数据共享与协同",
      content:
        "当前多个部门在数据采集中存在各采各的现象，建议加快推进全区统一数据共享交换平台建设，制定数据共享目录和交换标准。优先推动人口、法人、地理信息等基础数据的跨部门共享，减少重复建设和重复采集。",
      target: "区大数据局、各相关部门",
    },
    {
      title: "加大对机构调整单位的支持力度",
      content:
        "区市场监管局和朱村街道目前均处于机构调整过渡期，工作受到一定影响。建议在过渡期内适当调整这些单位的任务量和考核标准，同时安排专人协助做好工作交接和系统权限变更，确保业务连续性。",
      target: "区政府办、区大数据局",
    },
    {
      title: "提升国企信息化管理水平",
      content:
        "针对国企板块数据上报规范性不足的问题，建议分两步推进：短期内，由区大数据局编制《数据填报规范指南》并组织专题培训；中长期，推动各国企建立内部数据管理制度，指定专职数据管理员，逐步将国企纳入全区统一的数据治理体系。",
      target: "区大数据局、区国资局",
    },
  ],
  dataSources: [
    { id: 1, name: "采集任务系统", type: "system", fileCount: "-", dateRange: "2024.03.01 - 2024.03.20" },
    { id: 2, name: "数据上报模块", type: "system", fileCount: "-", dateRange: "2024.03.01 - 2024.03.20" },
    { id: 3, name: "文件模板管理", type: "system", fileCount: "-", dateRange: "2024.03.01 - 2024.03.20" },
    { id: 4, name: "组织机构管理", type: "system", fileCount: "-", dateRange: "2024.03.01 - 2024.03.20" },
    { id: 5, name: "区大数据局知识库", type: "unit", fileCount: 15, dateRange: "2024.03.01 - 2024.03.20" },
    { id: 6, name: "区发改委知识库", type: "unit", fileCount: 12, dateRange: "2024.03.01 - 2024.03.20" },
    { id: 7, name: "区交通局知识库", type: "unit", fileCount: 6, dateRange: "2024.03.01 - 2024.03.20" },
    { id: 8, name: "区卫健委知识库", type: "unit", fileCount: 8, dateRange: "2024.03.01 - 2024.03.20" },
    { id: 9, name: "区住建局知识库", type: "unit", fileCount: 5, dateRange: "2024.03.01 - 2024.03.20" },
    { id: 10, name: "区文旅局知识库", type: "unit", fileCount: 8, dateRange: "2024.03.01 - 2024.03.20" },
    { id: 11, name: "新塘镇知识库", type: "unit", fileCount: 10, dateRange: "2024.03.01 - 2024.03.20" },
    { id: 12, name: "智慧城市专题库", type: "theme", fileCount: 6, dateRange: "2024.01.01 - 2024.03.20" },
    { id: 13, name: "重点项目专题库", type: "theme", fileCount: 9, dateRange: "2024.01.01 - 2024.03.20" },
  ],
};

export const knowledgeBaseOptions = [
  { label: "区大数据局", value: "kb-dept-001" },
  { label: "区发改委", value: "kb-dept-002" },
  { label: "区文旅局", value: "kb-dept-003" },
  { label: "区住建局", value: "kb-dept-004" },
  { label: "区交通局", value: "kb-dept-005" },
  { label: "区教育局", value: "kb-dept-006" },
  { label: "区卫健委", value: "kb-dept-007" },
  { label: "区市场监管局", value: "kb-dept-008" },
  { label: "新塘镇", value: "kb-town-001" },
  { label: "石滩镇", value: "kb-town-002" },
  { label: "区城投集团", value: "kb-soe-001" },
  { label: "智慧城市专题库", value: "kb-theme-001" },
  { label: "重点项目专题库", value: "kb-theme-002" },
];

export const generatingSteps = [
  { step: 1, description: "解析报告主题，提取关键分析维度..." },
  { step: 2, description: "检索知识库，获取各部门月度工作数据..." },
  { step: 3, description: "获取采集任务完成情况统计数据..." },
  { step: 4, description: "获取重点项目进展数据..." },
  { step: 5, description: "进行数据清洗与结构化处理..." },
  { step: 6, description: "执行多维度数据分析与对比..." },
  { step: 7, description: "识别异常数据与潜在风险..." },
  { step: 8, description: "生成报告概要与核心结论..." },
  { step: 9, description: "生成各模块详细内容..." },
  { step: 10, description: "报告质量评估与格式优化..." },
];

export const reportStatusMap: Record<ReportStatus, { label: string; color: string }> = {
  completed: { label: "已完成", color: "green" },
  generating: { label: "生成中", color: "blue" },
  failed: { label: "生成失败", color: "red" },
};

export const sourceTypeMap = {
  system: { label: "系统数据", color: "blue" },
  unit: { label: "单位库", color: "green" },
  theme: { label: "主题库", color: "purple" },
};
