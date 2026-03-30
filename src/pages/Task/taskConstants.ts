import type { Dayjs } from "dayjs";

export type TaskStatus = "pending" | "collecting" | "finished";
export type FillStatus = "submitted" | "pending" | "rejected" | "approved" | "urged";

export interface TaskItem {
  id: string;
  name: string;
  formCount: number;
  status: TaskStatus;
  progress: { completed: number; total: number };
  startTime: string;
  deadline: string;
  creator: string;
  createdAt: string;
  description?: string;
}

export interface TemplateItem {
  id: string;
  name: string;
  category: "department" | "town" | "soe" | "theme";
}

export interface UnitProgressItem {
  unitId: string;
  unitName: string;
  fillStatus: FillStatus;
  submitTime: string | null;
  auditTime?: string | null;
  auditReason?: string;
  auditRemark?: string;
  submitter: string | null;
}

export interface TaskConfig {
  name: string;
  urgency: "normal" | "urgent" | "very_urgent";
  timeRange: [Dayjs | null, Dayjs | null];
  description: string;
  attachments: any[];
  selectedTemplates: string[];
  fillPermissions: string[];
  fillUnitScope?: string;
  fillUnitCustom?: string[];
  fillRoles?: string[];
  fillPermissionTypes?: string[];
  fillTimeWindow?: [Dayjs | null, Dayjs | null];
  allowOverdueFill?: boolean;
  needReview?: boolean;
  reviewers?: string[];
  reviewPermissions?: string[];
}

export const taskStatusTextMap: Record<TaskStatus, string> = {
  pending: "待开始",
  collecting: "采集中",
  finished: "已结束",
};

export const taskStatusColorMap: Record<TaskStatus, string> = {
  pending: "processing",
  collecting: "success",
  finished: "default",
};

export const fillStatusTextMap: Record<FillStatus, string> = {
  submitted: "待审核",
  pending: "待提交",
  rejected: "已退回",
  approved: "已通过",
  urged: "已催办",
};

export const fillStatusColorMap: Record<FillStatus, string> = {
  submitted: "success",
  pending: "warning",
  rejected: "error",
  approved: "processing",
  urged: "volcano",
};

export const permissionTreeData = [
  {
    title: "委办部门",
    value: "gov_departments",
    key: "gov_departments",
    selectable: false,
    children: [
      { title: "区大数据局", value: "dept_bigdata", key: "dept_bigdata" },
      { title: "区发改委", value: "dept_fagai", key: "dept_fagai" },
      { title: "区文旅委", value: "dept_wenlv", key: "dept_wenlv" },
      { title: "区住建委", value: "dept_zhujian", key: "dept_zhujian" },
      { title: "区交通局", value: "dept_jiaotong", key: "dept_jiaotong" },
      { title: "区教育局", value: "dept_jiaoyu", key: "dept_jiaoyu" },
      { title: "区卫健委", value: "dept_weijian", key: "dept_weijian" },
      { title: "区市场监管局", value: "dept_shichangjianguan", key: "dept_shichangjianguan" },
      { title: "区生态环境局", value: "dept_shengtai", key: "dept_shengtai" },
      { title: "区人社局", value: "dept_renshe", key: "dept_renshe" },
    ],
  },
  {
    title: "镇街",
    value: "towns",
    key: "towns",
    selectable: false,
    children: [{ title: "（由接口动态加载）", value: "placeholder_towns", key: "placeholder_towns", disabled: true }],
  },
  {
    title: "国企",
    value: "soe",
    key: "soe",
    selectable: false,
    children: [{ title: "（由接口动态加载）", value: "placeholder_soe", key: "placeholder_soe", disabled: true }],
  },
];

export const availableTemplates: TemplateItem[] = [
  { id: "tpl-001", name: "2024年度部门工作总结汇报", category: "department" },
  { id: "tpl-002", name: "智慧城市建设需求调研", category: "theme" },
  { id: "tpl-003", name: "镇街人口数据月报", category: "town" },
  { id: "tpl-004", name: "国企经营数据季报", category: "soe" },
  { id: "tpl-005", name: "重大项目推进周报", category: "department" },
];

export const taskTemplateMap: Record<string, string[]> = {
  "task-001": ["tpl-001"],
  "task-002": ["tpl-002"],
  "task-003": ["tpl-001", "tpl-005"],
  "task-004": ["tpl-002"],
  "task-005": ["tpl-001", "tpl-002"],
  "task-006": ["tpl-005"],
  "task-007": ["tpl-001", "tpl-003", "tpl-004"],
  "task-008": ["tpl-003", "tpl-005"],
};

export const templateCategoryTextMap: Record<TemplateItem["category"], string> = {
  department: "部门工作模块",
  town: "镇街工作模块",
  soe: "国企工作模块",
  theme: "主题库",
};

export const taskListMock: TaskItem[] = [
  {
    id: "task-001",
    name: "部门简介",
    formCount: 1,
    status: "collecting",
    progress: { completed: 8, total: 12 },
    startTime: "2024-03-01 00:00:00",
    deadline: "2024-03-31 23:59:59",
    creator: "张三",
    createdAt: "2024-02-20 10:00:00",
    description: "请各单位按要求填报部门简介。",
  },
  {
    id: "task-002",
    name: "工作体系架构图",
    formCount: 1,
    status: "pending",
    progress: { completed: 0, total: 15 },
    startTime: "2024-04-01 00:00:00",
    deadline: "2024-04-15 23:59:59",
    creator: "李四",
    createdAt: "2024-03-18 14:30:00",
    description: "采集各单位工作体系架构图。",
  },
  {
    id: "task-003",
    name: "核心业务",
    formCount: 2,
    status: "finished",
    progress: { completed: 10, total: 10 },
    startTime: "2024-02-01 00:00:00",
    deadline: "2024-02-29 23:59:59",
    creator: "王五",
    createdAt: "2024-01-25 09:20:00",
    description: "核心业务情况采集。",
  },
  {
    id: "task-004",
    name: "特色优势",
    formCount: 1,
    status: "collecting",
    progress: { completed: 5, total: 12 },
    startTime: "2024-03-10 00:00:00",
    deadline: "2024-04-10 23:59:59",
    creator: "张三",
    createdAt: "2024-03-05 10:00:00",
    description: "采集各单位特色优势。",
  },
  {
    id: "task-005",
    name: "标志性成果打造情况",
    formCount: 2,
    status: "pending",
    progress: { completed: 0, total: 12 },
    startTime: "2024-04-05 00:00:00",
    deadline: "2024-04-30 23:59:59",
    creator: "李四",
    createdAt: "2024-03-20 11:00:00",
    description: "采集标志性成果打造情况。",
  },
  {
    id: "task-006",
    name: "存在的主要问题",
    formCount: 1,
    status: "collecting",
    progress: { completed: 3, total: 12 },
    startTime: "2024-03-15 00:00:00",
    deadline: "2024-04-20 23:59:59",
    creator: "王五",
    createdAt: "2024-03-10 09:00:00",
    description: "采集各单位存在的主要问题。",
  },
  {
    id: "task-007",
    name: "主要指标数据表",
    formCount: 3,
    status: "pending",
    progress: { completed: 0, total: 15 },
    startTime: "2024-04-01 00:00:00",
    deadline: "2024-04-25 23:59:59",
    creator: "张三",
    createdAt: "2024-03-18 15:00:00",
    description: "采集主要指标数据表。",
  },
  {
    id: "task-008",
    name: "季度主要目标任务分解表",
    formCount: 2,
    status: "collecting",
    progress: { completed: 6, total: 12 },
    startTime: "2024-03-01 00:00:00",
    deadline: "2024-03-31 23:59:59",
    creator: "李四",
    createdAt: "2024-02-25 10:00:00",
    description: "采集季度主要目标任务分解表。",
  },
];

export const unitProgressMock: UnitProgressItem[] = [
  {
    unitId: "u-001",
    unitName: "区大数据局",
    fillStatus: "submitted",
    submitTime: "2024-03-15 10:00:00",
    submitter: "王五",
  },
  {
    unitId: "u-007",
    unitName: "区统计局",
    fillStatus: "submitted",
    submitTime: "2024-03-15 16:30:00",
    submitter: "赵六",
  },
  {
    unitId: "u-006",
    unitName: "区市场监管局",
    fillStatus: "pending",
    submitTime: null,
    submitter: null,
  },
  {
    unitId: "u-003",
    unitName: "区文旅委",
    fillStatus: "rejected",
    submitTime: null,
    auditTime: "2024-03-19 09:20:00",
    auditReason: "数据填写不完整，请补充完整信息",
    auditRemark: "请补充关键指标",
    submitter: null,
  },
  {
    unitId: "u-004",
    unitName: "区住建委",
    fillStatus: "approved",
    submitTime: "2024-03-16 11:10:00",
    auditTime: "2024-03-18 15:40:00",
    auditRemark: "数据完整，审核通过",
    submitter: "李四",
  },
];
