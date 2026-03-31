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
    id: "task-000",
    taskName: "工作模块",
    issuer: "区委办公室",
    urgency: "normal",
    formCount: 1,
    deadline: "2024-04-30 23:59:59",
    status: "pending",
    urgeCount: 0,
    lastUrgeTime: null,
    rejectReason: null,
    rejectTime: null,
    rejectBy: null,
    createdAt: "2024-03-20 09:00:00",
    description: "请填报工作模块相关信息。",
    attachment: null,
  },
  {
    id: "task-001",
    taskName: "部门简介",
    issuer: "区委办公室",
    urgency: "normal",
    formCount: 1,
    deadline: "2024-03-25 23:59:59",
    status: "pending",
    urgeCount: 0,
    lastUrgeTime: null,
    rejectReason: null,
    rejectTime: null,
    rejectBy: null,
    createdAt: "2024-03-01 10:00:00",
    description: "请按要求填报部门简介。",
    attachment: { name: "填报说明.docx", url: "#" },
  },
  {
    id: "task-002",
    taskName: "工作体系架构图",
    issuer: "区委办公室",
    urgency: "normal",
    formCount: 1,
    deadline: "2024-04-15 23:59:59",
    status: "pending",
    urgeCount: 0,
    lastUrgeTime: null,
    rejectReason: null,
    rejectTime: null,
    rejectBy: null,
    createdAt: "2024-03-10 14:00:00",
    description: "请上传工作体系架构图。",
    attachment: null,
  },
  {
    id: "task-003",
    taskName: "核心业务",
    issuer: "区委办公室",
    urgency: "normal",
    formCount: 2,
    deadline: "2024-03-22 18:00:00",
    status: "pending",
    urgeCount: 0,
    lastUrgeTime: null,
    rejectReason: null,
    rejectTime: null,
    rejectBy: null,
    createdAt: "2024-03-05 09:00:00",
    description: "请填报核心业务情况。",
    attachment: { name: "填报模板.pdf", url: "#" },
  },
  {
    id: "task-004",
    taskName: "特色优势",
    issuer: "区委办公室",
    urgency: "normal",
    formCount: 1,
    deadline: "2024-03-18 23:59:59",
    status: "rejected",
    urgeCount: 1,
    lastUrgeTime: "2024-03-15 10:00:00",
    rejectReason: '内容不够详细，请补充具体案例和数据支撑。',
    rejectTime: "2024-03-18 10:30:00",
    rejectBy: "王五（区委办公室）",
    createdAt: "2024-02-28 08:00:00",
    description: "请填报本单位特色优势。",
    attachment: { name: "填报说明.xlsx", url: "#" },
  },
  {
    id: "task-005",
    taskName: "标志性成果打造情况",
    issuer: "区委办公室",
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
    description: "请填报标志性成果打造情况。",
    attachment: null,
  },
  {
    id: "task-006",
    taskName: "存在的主要问题",
    issuer: "区委办公室",
    urgency: "normal",
    formCount: 1,
    deadline: "2024-04-20 23:59:59",
    status: "pending",
    urgeCount: 0,
    lastUrgeTime: null,
    rejectReason: null,
    rejectTime: null,
    rejectBy: null,
    createdAt: "2024-03-18 09:00:00",
    description: "请填报存在的主要问题。",
    attachment: null,
  },
  {
    id: "task-007",
    taskName: "主要指标数据表",
    issuer: "区委办公室",
    urgency: "normal",
    formCount: 3,
    deadline: "2024-04-25 23:59:59",
    status: "pending",
    urgeCount: 0,
    lastUrgeTime: null,
    rejectReason: null,
    rejectTime: null,
    rejectBy: null,
    createdAt: "2024-03-10 08:00:00",
    description: "请填报主要指标数据表。",
    attachment: { name: "数据表模板.xlsx", url: "#" },
  },
  {
    id: "task-008",
    taskName: "季度主要目标任务分解表",
    issuer: "区委办公室",
    urgency: "normal",
    formCount: 2,
    deadline: "2024-03-28 23:59:59",
    status: "pending",
    urgeCount: 0,
    lastUrgeTime: null,
    rejectReason: null,
    rejectTime: null,
    rejectBy: null,
    createdAt: "2024-03-05 10:00:00",
    description: "请填报季度主要目标任务分解表。",
    attachment: { name: "任务分解模板.docx", url: "#" },
  },
];

export const submittedReportList: SubmittedReportItem[] = [
  {
    id: "task-101",
    taskName: "部门简介",
    issuer: "区委办公室",
    formCount: 1,
    submitTime: "2024-01-20 16:30:00",
    submitter: "李四",
    reviewStatus: "approved",
    createdAt: "2024-01-05 09:00:00",
  },
  {
    id: "task-102",
    taskName: "工作体系架构图",
    issuer: "区委办公室",
    formCount: 1,
    submitTime: "2024-02-28 17:45:00",
    submitter: "李四",
    reviewStatus: "approved",
    createdAt: "2024-02-01 10:00:00",
  },
  {
    id: "task-103",
    taskName: "核心业务",
    issuer: "区委办公室",
    formCount: 2,
    submitTime: "2024-03-19 14:20:00",
    submitter: "王五",
    reviewStatus: "pending_review",
    createdAt: "2024-03-01 08:00:00",
  },
  {
    id: "task-104",
    taskName: "特色优势",
    issuer: "区委办公室",
    formCount: 1,
    submitTime: "2024-03-15 11:00:00",
    submitter: "李四",
    reviewStatus: "rejected",
    createdAt: "2024-03-01 09:00:00",
  },
  {
    id: "task-105",
    taskName: "标志性成果打造情况",
    issuer: "区委办公室",
    formCount: 2,
    submitTime: "2024-03-10 10:30:00",
    submitter: "张三",
    reviewStatus: "approved",
    createdAt: "2024-02-25 08:00:00",
  },
  {
    id: "task-106",
    taskName: "存在的主要问题",
    issuer: "区委办公室",
    formCount: 1,
    submitTime: "2024-03-12 15:00:00",
    submitter: "王五",
    reviewStatus: "pending_review",
    createdAt: "2024-03-01 10:00:00",
  },
];

export const issuerOptions = ["区委办公室"];

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
