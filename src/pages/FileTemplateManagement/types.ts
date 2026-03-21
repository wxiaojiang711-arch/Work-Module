export type FormStatus = "发布中" | "草稿" | "已结束";

export type FormPermission = "区大数据局" | "区发改委" | "区委办公室" | "区文旅委";

export interface FormTemplateItem {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  creator: string;
  permissions: FormPermission[];
  submissionCount: number;
  status: FormStatus;
  lastUpdated: string;
}

export interface FilterState {
  keyword: string;
  status: "全部" | FormStatus;
  permissions: FormPermission[];
  createdAtRange: [string, string] | null;
}
