export type WorkModuleStatus = "pending" | "draft" | "submitted" | "rejected" | "overdue";

export interface WorkModuleRecentPeriod {
  period: string;
  taskId: string;
  status: WorkModuleStatus;
}

export interface WorkModuleOverview {
  currentPeriod: string;
  currentTaskId: string;
  currentStatus: WorkModuleStatus;
  deadlineTime: string;
  issuerOrgName: string;
  submittedCount: number;
  shouldSubmitCount: number;
  overdueCount: number;
  reminderCount: number;
  recentPeriods: WorkModuleRecentPeriod[];
}

export interface UnitProgressItem {
  unitId: string;
  unitName: string;
  period: string;
  taskId: string;
  status: WorkModuleStatus;
  submitTime: string | null;
}

export const workModuleStatusMap: Record<
  WorkModuleStatus,
  { label: string; color: string; primaryText: string }
> = {
  pending: { label: "待填写", color: "blue", primaryText: "去填报" },
  draft: { label: "待提交", color: "default", primaryText: "去填报" },
  submitted: { label: "已提交", color: "green", primaryText: "查看本期" },
  rejected: { label: "已退回", color: "orange", primaryText: "重新填报" },
  overdue: { label: "已逾期", color: "red", primaryText: "去填报" },
};

export const workModuleOverviewMock: WorkModuleOverview = {
  currentPeriod: "2026年一季度",
  currentTaskId: "task-000",
  currentStatus: "draft",
  deadlineTime: "2026-04-15 23:59:59",
  issuerOrgName: "区委办公室",
  submittedCount: 18,
  shouldSubmitCount: 35,
  overdueCount: 3,
  reminderCount: 2,
  recentPeriods: [
    { period: "2025年四季度", taskId: "task-wm-2025q4", status: "submitted" },
    { period: "2025年三季度", taskId: "task-wm-2025q3", status: "submitted" },
    { period: "2025年二季度", taskId: "task-wm-2025q2", status: "rejected" },
  ],
};

export const workModulePeriods = [
  {
    period: "2026年一季度",
    taskId: "task-000",
    status: "draft",
    deadlineTime: "2026-04-15 23:59:59",
    submitTime: "-",
    submitter: "-",
  },
  {
    period: "2025年四季度",
    taskId: "task-wm-2025q4",
    status: "submitted",
    deadlineTime: "2026-01-15 23:59:59",
    submitTime: "2026-01-10 14:20:00",
    submitter: "李四",
  },
  {
    period: "2025年三季度",
    taskId: "task-wm-2025q3",
    status: "submitted",
    deadlineTime: "2025-10-15 23:59:59",
    submitTime: "2025-10-09 10:08:00",
    submitter: "王五",
  },
  {
    period: "2025年二季度",
    taskId: "task-wm-2025q2",
    status: "rejected",
    deadlineTime: "2025-07-15 23:59:59",
    submitTime: "2025-07-13 18:00:00",
    submitter: "赵六",
  },
  {
    period: "2025年一季度",
    taskId: "task-wm-2025q1",
    status: "submitted",
    deadlineTime: "2025-04-15 23:59:59",
    submitTime: "2025-04-10 09:33:00",
    submitter: "张三",
  },
] as const;

export const workModuleUnitProgressMock: UnitProgressItem[] = [
  { unitId: "dept-001", unitName: "区大数据局", period: "2026年一季度", taskId: "task-000", status: "submitted", submitTime: "2026-04-02 10:22:00" },
  { unitId: "dept-002", unitName: "区发改委", period: "2026年一季度", taskId: "task-000", status: "draft", submitTime: null },
  { unitId: "dept-003", unitName: "区文旅委", period: "2026年一季度", taskId: "task-000", status: "pending", submitTime: null },
  { unitId: "dept-004", unitName: "区住建委", period: "2026年一季度", taskId: "task-000", status: "rejected", submitTime: null },
  { unitId: "dept-005", unitName: "区交通局", period: "2026年一季度", taskId: "task-000", status: "overdue", submitTime: null },
  { unitId: "dept-006", unitName: "区教育局", period: "2026年一季度", taskId: "task-000", status: "submitted", submitTime: "2026-04-03 09:00:00" },
  { unitId: "dept-007", unitName: "区卫健委", period: "2025年四季度", taskId: "task-wm-2025q4", status: "submitted", submitTime: "2026-01-05 11:20:00" },
  { unitId: "dept-008", unitName: "区市场监管局", period: "2025年三季度", taskId: "task-wm-2025q3", status: "submitted", submitTime: "2025-10-06 16:00:00" },
];

export const workModuleUserContextMock = {
  orgName: "区委办公室",
  role: "issuer" as "issuer" | "normal",
};
