import dayjs from 'dayjs';

export const taskInfo = {
  id: 'task-001',
  name: '2024年第一季度工作总结报告',
  issuer: '区政府办',
  urgency: 'urgent',
  deadline: '2024-03-31 23:59:59',
  description:
    '请各单位提交2024年第一季度工作完成情况总结，包括重点工作完成情况、特色亮点、存在问题及下季度工作计划。',
  attachment: { name: '上报模板.docx', size: '256KB' },
};

export const reportFillTaskList = [
  {
    id: 'task-001',
    name: '2024年第一季度工作总结报告',
    issuer: '区政府办',
    urgency: 'urgent',
    deadline: '2024-03-31 23:59:59',
    status: 'pending',
  },
  {
    id: 'task-002',
    name: '2024年第一季度重点项目推进情况上报',
    issuer: '区发改委',
    urgency: 'normal',
    deadline: '2024-04-05 18:00:00',
    status: 'pending',
  },
  {
    id: 'task-003',
    name: '2024年第一季度营商环境指标上报',
    issuer: '区政务服务数据管理局',
    urgency: 'very_urgent',
    deadline: '2024-03-28 18:00:00',
    status: 'pending',
  },
];

export const currentUser = {
  name: '张三',
  orgName: '区大数据局',
};

export const aiParsedData = {
  reportPeriod: '2024-Q1',
  keyWorkCompletion:
    '2024年第一季度，我局围绕数字政府建设年度目标，扎实推进各项重点工作。一是政务云平台迁移工作取得重大进展，完成12个部门业务系统的云上迁移，迁移率从年初的45%提升至85%，超额完成季度目标。二是“一网通办”平台持续优化，新增上线政务服务事项126项，网上可办率提升至96.8%。三是数据共享交换平台完成升级改造，新增数据接口47个，日均数据交换量达到150万条。',
  quantitativeIndicators:
    '1. 政务云迁移率：85%（目标75%，超额完成）\n2. 网上可办率：96.8%（目标95%，超额完成）\n3. 数据接口新增数：47个（目标40个，超额完成）\n4. 日均数据交换量：150万条（同比增长35%）\n5. 12345热线工单处理及时率：98.2%（目标95%）\n6. 政务系统安全事件：0起',
  keyProjectProgress:
    '智慧城市一期项目：本季度完成数据中台核心模块部署，城市运行管理中心大屏系统完成第一版开发，已接入交通、环保、城管三个领域的实时数据。项目总投资1.2亿元，已完成投资0.45亿元，占总投资的37.5%，进度符合预期。',
  budgetExecution:
    '本季度部门预算总额1200万元，实际支出680万元，预算执行率56.7%。主要支出方向：政务云平台运维费用280万元，智慧城市项目建设费用220万元，数据安全防护费用100万元，人员培训及差旅费用80万元。预算执行进度与时序进度基本匹配。',
  innovationHighlights:
    '一是在全市率先推出“免证办”服务模式，通过电子证照共享，实现32类高频事项“零材料”办理，累计服务群众1.2万人次，获得省政务服务中心通报表扬。二是创新开发“数据体检”工具，自动检测各部门数据质量问题，累计发现并修复数据质量问题3600余条，数据准确率提升至99.2%。三是建立“首席数据官”制度，在全区15个部门设立首席数据官，推动数据资源统筹管理。',
  honorsAndAwards:
    '1. “免证办”服务模式获评省级政务服务创新案例\n2. 政务云平台建设经验在全市数字政府建设推进会上作典型发言\n3. 数据共享交换平台获评市级优秀信息化项目',
  mainProblems:
    '一是部分部门对数据共享的积极性不高，存在“数据壁垒”现象，跨部门数据共享推进难度较大。二是基层信息化人才短缺，部分镇街缺乏专职信息化管理人员，影响系统推广应用效果。三是网络安全形势日趋严峻，本季度共拦截网络攻击1.2万次，较去年同期增长40%，安全防护压力持续加大。',
  causeAnalysis:
    '数据共享推进困难的主要原因：一是缺乏强制性的数据共享制度约束；二是部分部门担心数据安全风险；三是各部门数据标准不统一，对接成本较高。基层信息化人才短缺的原因：一是镇街编制有限，难以设置专职岗位；二是信息化岗位薪酬缺乏竞争力，人才流失严重。网络安全压力加大的原因：一是政务系统暴露面持续扩大；二是攻击手段日趋复杂化、专业化。',
  keyWorkPlan:
    '一是加快推进智慧城市一期项目建设，力争二季度完成城市运行管理中心全部功能开发，接入不少于10个领域的实时数据。二是深化“一网通办”改革，新增上线政务服务事项100项以上，推动50项高频事项实现“秒批秒办”。三是启动全区统一数据共享交换平台二期建设，制定数据共享目录和交换标准，力争年底前实现15个部门核心业务数据的互联互通。四是组织开展全区信息化人才培训计划，计划培训基层信息化管理人员200人次。五是升级网络安全防护体系，部署AI智能威胁检测系统，提升主动防御能力。',
  resourceSupport:
    '一是智慧城市一期项目二季度需追加建设资金300万元，用于城市运行管理中心硬件采购和系统集成。二是数据共享交换平台二期建设需申请专项资金500万元。三是建议区委组织部在镇街增设信息化管理岗位编制，或通过政府购买服务方式解决基层信息化人才不足问题。',
  coordinationMatters:
    '一是请区政府办牵头，推动出台《增城区政务数据共享管理办法》，明确各部门数据共享的责任和义务，破解“数据壁垒”问题。二是请区财政局支持智慧城市项目和数据共享平台的资金需求，纳入二季度预算调整方案。三是请区委网信办协调省市网络安全资源，对全区政务系统开展一次全面的安全评估和渗透测试。',
};

export const formFieldsConfig = [
  { key: 'reportPeriod', label: '报告期间', group: '基本信息', required: true, type: 'picker', maxLength: 0 },
  { key: 'keyWorkCompletion', label: '重点工作完成情况', group: '本季度工作完成情况', required: true, type: 'textarea', maxLength: 2000 },
  { key: 'quantitativeIndicators', label: '量化指标完成情况', group: '本季度工作完成情况', required: true, type: 'textarea', maxLength: 1000 },
  { key: 'keyProjectProgress', label: '重点项目推进情况', group: '本季度工作完成情况', required: false, type: 'textarea', maxLength: 1500 },
  { key: 'budgetExecution', label: '经费使用情况', group: '本季度工作完成情况', required: true, type: 'textarea', maxLength: 1000 },
  { key: 'innovationHighlights', label: '创新举措与亮点', group: '特色亮点', required: true, type: 'textarea', maxLength: 1500 },
  { key: 'honorsAndAwards', label: '获得荣誉或表彰', group: '特色亮点', required: false, type: 'textarea', maxLength: 500 },
  { key: 'mainProblems', label: '主要问题与困难', group: '存在问题与困难', required: true, type: 'textarea', maxLength: 1500 },
  { key: 'causeAnalysis', label: '原因分析', group: '存在问题与困难', required: false, type: 'textarea', maxLength: 1000 },
  { key: 'keyWorkPlan', label: '重点工作计划', group: '下季度工作计划', required: true, type: 'textarea', maxLength: 2000 },
  { key: 'resourceSupport', label: '预计需要的资源支持', group: '下季度工作计划', required: false, type: 'textarea', maxLength: 1000 },
  { key: 'coordinationMatters', label: '需要协调解决的事项', group: '下季度工作计划', required: false, type: 'textarea', maxLength: 1000 },
] as const;

export const periodOptions = [
  [
    { label: '2024年第一季度', value: '2024-Q1' },
    { label: '2024年第二季度', value: '2024-Q2' },
    { label: '2024年第三季度', value: '2024-Q3' },
    { label: '2024年第四季度', value: '2024-Q4' },
  ],
];

export const periodLabelMap: Record<string, string> = {
  '2024-Q1': '2024年第一季度',
  '2024-Q2': '2024年第二季度',
  '2024-Q3': '2024年第三季度',
  '2024-Q4': '2024年第四季度',
};

export const urgencyMap = {
  normal: { label: '普通', color: 'default' as const },
  urgent: { label: '紧急', color: 'warning' as const },
  very_urgent: { label: '特急', color: 'danger' as const },
};

export type FormFieldKey = (typeof formFieldsConfig)[number]['key'];

export type ReportFormData = Record<FormFieldKey, string>;

export const buildInitialFormData = (): ReportFormData => ({
  reportPeriod: '',
  keyWorkCompletion: '',
  quantitativeIndicators: '',
  keyProjectProgress: '',
  budgetExecution: '',
  innovationHighlights: '',
  honorsAndAwards: '',
  mainProblems: '',
  causeAnalysis: '',
  keyWorkPlan: '',
  resourceSupport: '',
  coordinationMatters: '',
});

export const getDraftKey = (taskId: string) => `draft_report_${taskId}`;

export const getDeadlineState = (deadline: string) => {
  const now = dayjs();
  const end = dayjs(deadline);
  if (end.isBefore(now)) {
    return { type: 'overdue' as const, text: `已逾期${now.diff(end, 'day') || 1}天` };
  }

  const diffDays = end.diff(now, 'day', true);
  if (diffDays <= 3) {
    return { type: 'urgent' as const, text: `距截止不足${Math.max(1, Math.ceil(diffDays))}天` };
  }

  return { type: 'normal' as const, text: `截止时间：${deadline}` };
};
