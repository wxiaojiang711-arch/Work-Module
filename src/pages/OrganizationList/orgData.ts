export type OrgType = "department" | "town" | "soe";
export type OrgStatus = "active" | "stopped";

export interface OrganizationItem {
  id: string;
  fullName: string;
  shortName: string;
  code: string;
  type: OrgType;
  leader: string;
  phone: string;
  memberCount: number;
  sort: number;
  status: OrgStatus;
  remark: string;
  createdAt: string;
}

export const orgTypeLabelMap: Record<OrgType, string> = {
  department: "部门",
  town: "镇街",
  soe: "国企",
};

export const statusMap: Record<OrgStatus, { label: string; color: string }> = {
  active: { label: "启用", color: "green" },
  stopped: { label: "停用", color: "red" },
};

export const departmentList: OrganizationItem[] = [
  { id: "dept-001", fullName: "广州市XX区大数据发展管理局", shortName: "区大数据局", code: "ORG-DEPT-001", type: "department", leader: "张三", phone: "020-88880001", memberCount: 28, sort: 1, status: "active", remark: "负责全区数字政府建设统筹工作", createdAt: "2024-01-01 10:00:00" },
  { id: "dept-002", fullName: "广州市XX区发展和改革委员会", shortName: "区发改委", code: "ORG-DEPT-002", type: "department", leader: "李四", phone: "020-88880002", memberCount: 35, sort: 2, status: "active", remark: "", createdAt: "2024-01-01 10:30:00" },
  { id: "dept-003", fullName: "广州市XX区文化广电旅游体育局", shortName: "区文旅局", code: "ORG-DEPT-003", type: "department", leader: "王五", phone: "020-88880003", memberCount: 22, sort: 3, status: "active", remark: "", createdAt: "2024-01-02 08:00:00" },
  { id: "dept-004", fullName: "广州市XX区住房和城乡建设局", shortName: "区住建局", code: "ORG-DEPT-004", type: "department", leader: "赵六", phone: "020-88880004", memberCount: 18, sort: 4, status: "active", remark: "", createdAt: "2024-01-02 09:00:00" },
  { id: "dept-005", fullName: "广州市XX区交通运输局", shortName: "区交通局", code: "ORG-DEPT-005", type: "department", leader: "钱七", phone: "020-88880005", memberCount: 15, sort: 5, status: "active", remark: "", createdAt: "2024-01-03 10:00:00" },
  { id: "dept-006", fullName: "广州市XX区教育局", shortName: "区教育局", code: "ORG-DEPT-006", type: "department", leader: "孙八", phone: "020-88880006", memberCount: 42, sort: 6, status: "active", remark: "", createdAt: "2024-01-03 11:00:00" },
  { id: "dept-007", fullName: "广州市XX区卫生健康委员会", shortName: "区卫健委", code: "ORG-DEPT-007", type: "department", leader: "周九", phone: "020-88880007", memberCount: 38, sort: 7, status: "active", remark: "", createdAt: "2024-01-04 08:00:00" },
  { id: "dept-008", fullName: "广州市XX区市场监督管理局", shortName: "区市场监管局", code: "ORG-DEPT-008", type: "department", leader: "吴十", phone: "020-88880008", memberCount: 30, sort: 8, status: "stopped", remark: "机构调整中", createdAt: "2024-01-04 09:00:00" },
  { id: "dept-009", fullName: "广州市XX区生态环境局", shortName: "区生态环境局", code: "ORG-DEPT-009", type: "department", leader: "郑一", phone: "020-88880009", memberCount: 20, sort: 9, status: "active", remark: "", createdAt: "2024-01-05 10:00:00" },
  { id: "dept-010", fullName: "广州市XX区人力资源和社会保障局", shortName: "区人社局", code: "ORG-DEPT-010", type: "department", leader: "冯二", phone: "020-88880010", memberCount: 25, sort: 10, status: "active", remark: "", createdAt: "2024-01-05 11:00:00" },
];

export const townList: OrganizationItem[] = [
  { id: "town-001", fullName: "广州市XX区新塘镇人民政府", shortName: "新塘镇", code: "ORG-TOWN-001", type: "town", leader: "陈三", phone: "020-88990001", memberCount: 55, sort: 1, status: "active", remark: "", createdAt: "2024-01-01 11:00:00" },
  { id: "town-002", fullName: "广州市XX区石滩镇人民政府", shortName: "石滩镇", code: "ORG-TOWN-002", type: "town", leader: "林四", phone: "020-88990002", memberCount: 42, sort: 2, status: "active", remark: "", createdAt: "2024-01-01 11:30:00" },
  { id: "town-003", fullName: "广州市XX区中新镇人民政府", shortName: "中新镇", code: "ORG-TOWN-003", type: "town", leader: "黄五", phone: "020-88990003", memberCount: 38, sort: 3, status: "active", remark: "", createdAt: "2024-01-02 08:00:00" },
  { id: "town-004", fullName: "广州市XX区永宁街道办事处", shortName: "永宁街道", code: "ORG-TOWN-004", type: "town", leader: "刘六", phone: "020-88990004", memberCount: 30, sort: 4, status: "active", remark: "", createdAt: "2024-01-02 09:00:00" },
  { id: "town-005", fullName: "广州市XX区荔湖街道办事处", shortName: "荔湖街道", code: "ORG-TOWN-005", type: "town", leader: "杨七", phone: "020-88990005", memberCount: 25, sort: 5, status: "active", remark: "", createdAt: "2024-01-03 10:00:00" },
  { id: "town-006", fullName: "广州市XX区朱村街道办事处", shortName: "朱村街道", code: "ORG-TOWN-006", type: "town", leader: "吕八", phone: "020-88990006", memberCount: 22, sort: 6, status: "stopped", remark: "行政区划调整中", createdAt: "2024-01-03 11:00:00" },
];

export const soeList: OrganizationItem[] = [
  { id: "soe-001", fullName: "广州市XX区城市建设投资集团有限公司", shortName: "区城投集团", code: "ORG-SOE-001", type: "soe", leader: "马一", phone: "020-88770001", memberCount: 120, sort: 1, status: "active", remark: "负责全区城市基础设施投资建设", createdAt: "2024-01-01 14:00:00" },
  { id: "soe-002", fullName: "广州市XX区交通投资集团有限公司", shortName: "区交投集团", code: "ORG-SOE-002", type: "soe", leader: "谢二", phone: "020-88770002", memberCount: 85, sort: 2, status: "active", remark: "", createdAt: "2024-01-01 14:30:00" },
  { id: "soe-003", fullName: "广州市XX区产业投资集团有限公司", shortName: "区产投集团", code: "ORG-SOE-003", type: "soe", leader: "韩三", phone: "020-88770003", memberCount: 65, sort: 3, status: "active", remark: "", createdAt: "2024-01-02 10:00:00" },
  { id: "soe-004", fullName: "广州市XX区文化旅游发展集团有限公司", shortName: "区文旅集团", code: "ORG-SOE-004", type: "soe", leader: "唐四", phone: "020-88770004", memberCount: 45, sort: 4, status: "active", remark: "", createdAt: "2024-01-02 11:00:00" },
  { id: "soe-005", fullName: "广州市XX区水务投资集团有限公司", shortName: "区水投集团", code: "ORG-SOE-005", type: "soe", leader: "宋五", phone: "020-88770005", memberCount: 50, sort: 5, status: "stopped", remark: "重组整合中", createdAt: "2024-01-03 09:00:00" },
];
