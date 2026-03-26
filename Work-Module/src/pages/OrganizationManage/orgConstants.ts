export type OrgType = "department" | "town" | "soe";
export type OrgStatus = "active" | "inactive";

export interface OrgNode {
  key: string;
  title: string;
  fullName: string;
  code: string;
  type: OrgType;
  leader: string;
  phone: string;
  sort: number;
  status: OrgStatus;
  remark: string;
  createdAt: string;
  children: OrgNode[];
}

export const orgTypeLabelMap: Record<OrgType, string> = {
  department: "部门",
  town: "镇街",
  soe: "国企",
};

export const orgStatusTagMap: Record<OrgStatus, { text: string; color: string }> = {
  active: { text: "启用", color: "green" },
  inactive: { text: "停用", color: "red" },
};

export const departmentTreeData: OrgNode[] = [
  {
    key: "dept-001",
    title: "区大数据发展管理局",
    fullName: "广州市XX区大数据发展管理局",
    code: "ORG-DEPT-001",
    type: "department",
    leader: "张三",
    phone: "020-88880001",
    sort: 1,
    status: "active",
    remark: "负责全区数字政府建设统筹工作",
    createdAt: "2024-01-01 10:00:00",
    children: [
      {
        key: "dept-001-01",
        title: "数据资源管理科",
        fullName: "区大数据发展管理局数据资源管理科",
        code: "ORG-DEPT-001-01",
        type: "department",
        leader: "李四",
        phone: "020-88880011",
        sort: 1,
        status: "active",
        remark: "",
        createdAt: "2024-01-05 09:00:00",
        children: [],
      },
      {
        key: "dept-001-02",
        title: "政务服务管理科",
        fullName: "区大数据发展管理局政务服务管理科",
        code: "ORG-DEPT-001-02",
        type: "department",
        leader: "王五",
        phone: "020-88880012",
        sort: 2,
        status: "active",
        remark: "",
        createdAt: "2024-01-05 09:30:00",
        children: [],
      },
    ],
  },
  {
    key: "dept-002",
    title: "区发展和改革委员会",
    fullName: "广州市XX区发展和改革委员会",
    code: "ORG-DEPT-002",
    type: "department",
    leader: "赵六",
    phone: "020-88880002",
    sort: 2,
    status: "active",
    remark: "负责全区国民经济和社会发展规划",
    createdAt: "2024-01-01 10:30:00",
    children: [],
  },
  {
    key: "dept-003",
    title: "区文化广电旅游体育局",
    fullName: "广州市XX区文化广电旅游体育局",
    code: "ORG-DEPT-003",
    type: "department",
    leader: "钱七",
    phone: "020-88880003",
    sort: 3,
    status: "active",
    remark: "",
    createdAt: "2024-01-02 08:00:00",
    children: [],
  },
];

export const townTreeData: OrgNode[] = [
  {
    key: "town-001",
    title: "新塘镇",
    fullName: "广州市XX区新塘镇人民政府",
    code: "ORG-TOWN-001",
    type: "town",
    leader: "孙八",
    phone: "020-88990001",
    sort: 1,
    status: "active",
    remark: "",
    createdAt: "2024-01-01 11:00:00",
    children: [
      {
        key: "town-001-01",
        title: "党政综合办公室",
        fullName: "新塘镇党政综合办公室",
        code: "ORG-TOWN-001-01",
        type: "town",
        leader: "周九",
        phone: "020-88990011",
        sort: 1,
        status: "active",
        remark: "",
        createdAt: "2024-01-10 09:00:00",
        children: [],
      },
    ],
  },
  {
    key: "town-002",
    title: "石滩镇",
    fullName: "广州市XX区石滩镇人民政府",
    code: "ORG-TOWN-002",
    type: "town",
    leader: "吴十",
    phone: "020-88990002",
    sort: 2,
    status: "active",
    remark: "",
    createdAt: "2024-01-01 11:30:00",
    children: [],
  },
];

export const soeTreeData: OrgNode[] = [
  {
    key: "soe-001",
    title: "区城投集团",
    fullName: "广州市XX区城市建设投资集团有限公司",
    code: "ORG-SOE-001",
    type: "soe",
    leader: "郑一",
    phone: "020-88770001",
    sort: 1,
    status: "active",
    remark: "负责全区城市基础设施投资建设",
    createdAt: "2024-01-01 14:00:00",
    children: [
      {
        key: "soe-001-01",
        title: "工程建设部",
        fullName: "区城投集团工程建设部",
        code: "ORG-SOE-001-01",
        type: "soe",
        leader: "冯二",
        phone: "020-88770011",
        sort: 1,
        status: "active",
        remark: "",
        createdAt: "2024-02-01 09:00:00",
        children: [],
      },
    ],
  },
  {
    key: "soe-002",
    title: "区交投集团",
    fullName: "广州市XX区交通投资集团有限公司",
    code: "ORG-SOE-002",
    type: "soe",
    leader: "陈三",
    phone: "020-88770002",
    sort: 2,
    status: "active",
    remark: "",
    createdAt: "2024-01-01 14:30:00",
    children: [],
  },
];

