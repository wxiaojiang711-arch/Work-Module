export type OrgType = "department" | "town" | "soe";

export interface OrganizationItem {
  id: string;
  fullName: string;
  type: OrgType;
  leader: string;
  phone: string;
  memberCount: number;
  sort: number;
  remark: string;
  createdAt: string;
}

export const orgTypeLabelMap: Record<OrgType, string> = {
  department: "部门",
  town: "镇街",
  soe: "国企",
};

export const departmentList: OrganizationItem[] = [
  { id: "dept-001", fullName: "区大数据局", type: "department", leader: "张三", phone: "023-88080001", memberCount: 28, sort: 1, remark: "负责全区数字政府建设统筹工作", createdAt: "2024-01-01 10:00:00" },
  { id: "dept-002", fullName: "区发改委", type: "department", leader: "李四", phone: "023-88080002", memberCount: 35, sort: 2, remark: "", createdAt: "2024-01-01 10:30:00" },
  { id: "dept-003", fullName: "区文旅委", type: "department", leader: "王五", phone: "023-88080003", memberCount: 22, sort: 3, remark: "", createdAt: "2024-01-02 08:00:00" },
  { id: "dept-004", fullName: "区住建委", type: "department", leader: "赵六", phone: "023-88080004", memberCount: 18, sort: 4, remark: "", createdAt: "2024-01-02 09:00:00" },
  { id: "dept-005", fullName: "区交通局", type: "department", leader: "钱七", phone: "023-88080005", memberCount: 15, sort: 5, remark: "", createdAt: "2024-01-03 10:00:00" },
  { id: "dept-006", fullName: "区教委", type: "department", leader: "孙八", phone: "023-88080006", memberCount: 42, sort: 6, remark: "", createdAt: "2024-01-03 11:00:00" },
  { id: "dept-007", fullName: "区卫健委", type: "department", leader: "周九", phone: "023-88080007", memberCount: 38, sort: 7, remark: "", createdAt: "2024-01-04 08:00:00" },
  { id: "dept-008", fullName: "区市场监督管理局", type: "department", leader: "吴十", phone: "023-88080008", memberCount: 30, sort: 8, remark: "", createdAt: "2024-01-04 09:00:00" },
  { id: "dept-009", fullName: "区生态环境局", type: "department", leader: "郑一", phone: "023-88080009", memberCount: 20, sort: 9, remark: "", createdAt: "2024-01-05 10:00:00" },
  { id: "dept-010", fullName: "区人社局", type: "department", leader: "冯二", phone: "023-88080010", memberCount: 25, sort: 10, remark: "", createdAt: "2024-01-05 11:00:00" },
];

export const townList: OrganizationItem[] = [
  { id: "town-001", fullName: "渝州路街道", type: "town", leader: "陈三", phone: "023-88990001", memberCount: 55, sort: 1, remark: "", createdAt: "2024-01-01 11:00:00" },
  { id: "town-002", fullName: "石桥铺街道", type: "town", leader: "林四", phone: "023-88990002", memberCount: 42, sort: 2, remark: "", createdAt: "2024-01-01 11:30:00" },
  { id: "town-003", fullName: "二郎街道", type: "town", leader: "黄五", phone: "023-88990003", memberCount: 38, sort: 3, remark: "", createdAt: "2024-01-02 08:00:00" },
  { id: "town-004", fullName: "杨家坪街道", type: "town", leader: "刘六", phone: "023-88990004", memberCount: 30, sort: 4, remark: "", createdAt: "2024-01-02 09:00:00" },
  { id: "town-005", fullName: "黄桷坪街道", type: "town", leader: "杨七", phone: "023-88990005", memberCount: 25, sort: 5, remark: "", createdAt: "2024-01-03 10:00:00" },
  { id: "town-006", fullName: "谢家湾街道", type: "town", leader: "吕八", phone: "023-88990006", memberCount: 22, sort: 6, remark: "", createdAt: "2024-01-03 11:00:00" },
  { id: "town-007", fullName: "石坪桥街道", type: "town", leader: "何九", phone: "023-88990007", memberCount: 20, sort: 7, remark: "", createdAt: "2024-01-04 09:00:00" },
  { id: "town-008", fullName: "中梁山街道", type: "town", leader: "张十", phone: "023-88990008", memberCount: 19, sort: 8, remark: "", createdAt: "2024-01-04 10:00:00" },
  { id: "town-009", fullName: "九龙街道", type: "town", leader: "李一", phone: "023-88990009", memberCount: 18, sort: 9, remark: "", createdAt: "2024-01-05 09:00:00" },
  { id: "town-010", fullName: "华岩镇", type: "town", leader: "王二", phone: "023-88990010", memberCount: 21, sort: 10, remark: "", createdAt: "2024-01-05 10:00:00" },
  { id: "town-011", fullName: "陶家镇", type: "town", leader: "赵三", phone: "023-88990011", memberCount: 23, sort: 11, remark: "", createdAt: "2024-01-06 09:00:00" },
  { id: "town-012", fullName: "西彭镇", type: "town", leader: "钱四", phone: "023-88990012", memberCount: 26, sort: 12, remark: "", createdAt: "2024-01-06 10:00:00" },
  { id: "town-013", fullName: "铜罐驿镇", type: "town", leader: "孙五", phone: "023-88990013", memberCount: 24, sort: 13, remark: "", createdAt: "2024-01-07 09:00:00" },
];

export const soeList: OrganizationItem[] = [
  { id: "soe-001", fullName: "重庆九龙城市开发集团有限公司", type: "soe", leader: "马一", phone: "023-88770001", memberCount: 120, sort: 1, remark: "负责全区城市基础设施投资建设", createdAt: "2024-01-01 14:00:00" },
  { id: "soe-002", fullName: "重庆九龙现代产业发展集团有限公司", type: "soe", leader: "谢二", phone: "023-88770002", memberCount: 85, sort: 2, remark: "", createdAt: "2024-01-01 14:30:00" },
  { id: "soe-003", fullName: "重庆九龙城乡运营集团有限公司", type: "soe", leader: "韩三", phone: "023-88770003", memberCount: 65, sort: 3, remark: "", createdAt: "2024-01-02 10:00:00" },
];

