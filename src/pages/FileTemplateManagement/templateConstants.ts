export interface TemplateCategory {
  id: "department" | "town" | "soe" | "theme";
  title: string;
  description: string;
  color: string;
  count: number;
}

export interface TemplateFormItem {
  id: string;
  categoryId: TemplateCategory["id"];
  name: string;
  description: string;
  createdAt: string;
  creator: string;
  permissions: string[];
  submissionCount: number;
  status: "发布中" | "草稿" | "已结束";
  lastUpdated: string;
}

export const categories: TemplateCategory[] = [
  {
    id: "department",
    title: "部门工作模块",
    description: "管理各委办部门相关的工作表单模板",
    color: "#1890ff",
    count: 12,
  },
  {
    id: "town",
    title: "镇街工作模块",
    description: "管理各镇街相关的工作表单模板",
    color: "#52c41a",
    count: 8,
  },
  {
    id: "soe",
    title: "国企工作模块",
    description: "管理各国有企业相关的工作表单模板",
    color: "#fa8c16",
    count: 5,
  },
  {
    id: "theme",
    title: "主题库",
    description: "管理重大项目及专班相关的专题表单模板",
    color: "#722ed1",
    count: 15,
  },
];

export const templateFormsMock: TemplateFormItem[] = [
  {
    id: "form-001",
    categoryId: "department",
    name: "2024年度部门工作总结汇报",
    description: "收集各部门2024年度工作总结和计划",
    createdAt: "2024-01-15 10:30:00",
    creator: "张三",
    permissions: ["区大数据局", "区发改委"],
    submissionCount: 125,
    status: "发布中",
    lastUpdated: "2024-03-01 14:00:00",
  },
  {
    id: "form-002",
    categoryId: "town",
    name: "镇街重点工作进展填报",
    description: "镇街按周填报重点工作推进情况",
    createdAt: "2024-02-01 09:20:00",
    creator: "李四",
    permissions: ["镇街A", "镇街B"],
    submissionCount: 83,
    status: "发布中",
    lastUpdated: "2024-03-05 11:20:00",
  },
  {
    id: "form-003",
    categoryId: "soe",
    name: "国企月度运营数据采集",
    description: "采集国企月度经营指标与风险情况",
    createdAt: "2024-02-12 13:15:00",
    creator: "王五",
    permissions: ["国企A", "国企B"],
    submissionCount: 41,
    status: "草稿",
    lastUpdated: "2024-03-02 08:45:00",
  },
  {
    id: "form-004",
    categoryId: "theme",
    name: "重大项目专题调度",
    description: "重大项目专班按月调度进展与问题",
    createdAt: "2024-01-28 16:40:00",
    creator: "赵六",
    permissions: ["区住建委", "区交通局"],
    submissionCount: 210,
    status: "已结束",
    lastUpdated: "2024-03-06 10:05:00",
  },
];
