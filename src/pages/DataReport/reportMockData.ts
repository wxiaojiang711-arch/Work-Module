import type { PendingStatus, ReviewStatus, Urgency } from "./reportConstants";

export interface PendingReportItem {
  id: string;
  taskName: string;
  issuer: string;
  urgency: Urgency;
  formCount: number;
  deadline: string;
  status: PendingStatus;
  urgeCount: number;
  lastUrgeTime: string | null;
  rejectReason: string | null;
  rejectTime: string | null;
  rejectBy: string | null;
  createdAt: string;
  description?: string;
  attachment?: { name: string; url: string } | null;
}

export interface SubmittedReportItem {
  id: string;
  taskName: string;
  issuer: string;
  formCount: number;
  submitTime: string;
  submitter: string;
  reviewStatus: ReviewStatus;
  createdAt: string;
}

export const pendingReportList: PendingReportItem[] = [
  {
    id: "task-001",
    taskName: "2024年第一季度经济运行数据采集",
    issuer: "区发改委",
    urgency: "urgent",
    formCount: 3,
    deadline: "2024-03-25 23:59:59",
    status: "pending",
    urgeCount: 2,
    lastUrgeTime: "2024-03-20 09:00:00",
    rejectReason: null,
    rejectTime: null,
    rejectBy: null,
    createdAt: "2024-03-01 10:00:00",
    description: "请按季度填报经济运行指标。",
    attachment: { name: "填报说明.docx", url: "#" },
  },
  {
    id: "task-002",
    taskName: "智慧城市建设需求调研",
    issuer: "区大数据局",
    urgency: "normal",
    formCount: 1,
    deadline: "2024-04-15 23:59:59",
    status: "draft",
    urgeCount: 0,
    lastUrgeTime: null,
    rejectReason: null,
    rejectTime: null,
    rejectBy: null,
    createdAt: "2024-03-10 14:00:00",
    description: "请结合单位实际报送需求清单。",
    attachment: null,
  },
  {
    id: "task-003",
    taskName: "安全生产隐患排查月报",
    issuer: "区应急管理局",
    urgency: "very_urgent",
    formCount: 2,
    deadline: "2024-03-22 18:00:00",
    status: "urging",
    urgeCount: 3,
    lastUrgeTime: "2024-03-21 15:00:00",
    rejectReason: null,
    rejectTime: null,
    rejectBy: null,
    createdAt: "2024-03-05 09:00:00",
    description: "请于每月20日前完成隐患台账上报。",
    attachment: { name: "隐患分类说明.pdf", url: "#" },
  },
  {
    id: "task-004",
    taskName: "2024年度部门预算执行情况报告",
    issuer: "区财政局",
    urgency: "urgent",
    formCount: 4,
    deadline: "2024-03-18 23:59:59",
    status: "rejected",
    urgeCount: 1,
    lastUrgeTime: "2024-03-15 10:00:00",
    rejectReason: '第二张表"财政拨款支出"中，2月份数据与一月份累计数据不一致，请核实后重新填报。',
    rejectTime: "2024-03-18 10:30:00",
    rejectBy: "王五（区财政局）",
    createdAt: "2024-02-28 08:00:00",
    description: "请按预算科目逐项填写执行情况。",
    attachment: { name: "预算执行口径说明.xlsx", url: "#" },
  },
  {
    id: "task-005",
    taskName: "营商环境优化工作进展季报",
    issuer: "区发改委",
    urgency: "normal",
    formCount: 2,
    deadline: "2024-04-10 23:59:59",
    status: "pending",
    urgeCount: 0,
    lastUrgeTime: null,
    rejectReason: null,
    rejectTime: null,
    rejectBy: null,
    createdAt: "2024-03-15 11:00:00",
    description: "按季度汇总营商环境改革事项推进情况。",
    attachment: null,
  },
];

export const submittedReportList: SubmittedReportItem[] = [
  {
    id: "task-101",
    taskName: "2023年度工作总结与2024年工作计划",
    issuer: "区政府办",
    formCount: 2,
    submitTime: "2024-01-20 16:30:00",
    submitter: "李四",
    reviewStatus: "approved",
    createdAt: "2024-01-05 09:00:00",
  },
  {
    id: "task-102",
    taskName: "数字政府建设年度评估自评表",
    issuer: "区大数据局",
    formCount: 1,
    submitTime: "2024-02-28 17:45:00",
    submitter: "李四",
    reviewStatus: "approved",
    createdAt: "2024-02-01 10:00:00",
  },
  {
    id: "task-103",
    taskName: "2024年第一季度人才引进情况统计",
    issuer: "区人社局",
    formCount: 3,
    submitTime: "2024-03-19 14:20:00",
    submitter: "王五",
    reviewStatus: "pending_review",
    createdAt: "2024-03-01 08:00:00",
  },
  {
    id: "task-104",
    taskName: "公共文化服务体系建设进展报告",
    issuer: "区文旅局",
    formCount: 1,
    submitTime: "2024-03-15 11:00:00",
    submitter: "李四",
    reviewStatus: "rejected",
    createdAt: "2024-03-01 09:00:00",
  },
];

export const issuerOptions = ["区大数据局", "区发改委", "区财政局", "区应急管理局", "区文旅局", "区人社局", "区政府办"];

export const reportFormTemplatesByTask: Record<
  string,
  Array<{
    id: string;
    name: string;
    formSchema: Array<{
      id: string;
      type: "input" | "textarea" | "number" | "select";
      label: string;
      required?: boolean;
      options?: string[];
      placeholder?: string;
    }>;
  }>
> = {
  "task-001": [
    {
      id: "f-001",
      name: "经济运行指标表",
      formSchema: [
        { id: "a1", type: "input", label: "指标名称", required: true, placeholder: "请输入指标名称" },
        { id: "a2", type: "number", label: "本季度数值", required: true, placeholder: "请输入数值" },
        { id: "a3", type: "textarea", label: "情况说明", placeholder: "请输入说明" },
      ],
    },
    {
      id: "f-002",
      name: "重点项目进展表",
      formSchema: [
        { id: "b1", type: "input", label: "项目名称", required: true, placeholder: "请输入项目名称" },
        { id: "b2", type: "select", label: "进展状态", required: true, options: ["正常", "滞后", "完成"] },
      ],
    },
  ],
  "task-002": [
    {
      id: "f-003",
      name: "需求征集表",
      formSchema: [
        { id: "c1", type: "textarea", label: "需求内容", required: true, placeholder: "请输入需求内容" },
        { id: "c2", type: "textarea", label: "建议措施", placeholder: "请输入建议措施" },
      ],
    },
  ],
};
