export type OrgType = "department" | "town" | "soe";
export type UserStatus = "active" | "disabled";

export type RoleCode = "system_admin" | "unit_admin" | "data_officer" | "user" | (string & {});

export interface OrgTreeNode {
  key: string;
  title: string;
  children?: OrgTreeNode[];
}

export interface RoleOption {
  id: string;
  name: string;
  code: RoleCode;
  color: string;
  description: string;
}

export interface UserItem {
  id: string;
  name: string;
  account: string;
  orgId: string;
  orgName: string;
  phone: string;
  email: string;
  position: string;
  status: UserStatus;
  roles: RoleCode[];
  extraDataAuth: string[];
  dataScope: string;
  isDataOfficer: boolean;
  lastLoginAt: string;
}

export interface AccessibleKnowledgeBase {
  name: string;
  type: "unit" | "theme";
  permission: "edit" | "view";
  reason?: string;
}

export interface MergedPermissionItem {
  key: string;
  title: string;
  granted: boolean;
  fromRole: string | null;
}

export interface UserPermissionDetail {
  userId: string;
  name: string;
  account: string;
  orgName: string;
  position: string;
  roles: RoleCode[];
  status: UserStatus;
  dataScope: {
    base: string;
    extra: string[];
  };
  accessibleKnowledgeBases: AccessibleKnowledgeBase[];
  mergedPermissions: MergedPermissionItem[];
}

export type PermissionTreeNode = {
  key: string;
  title: string;
  children: Array<{ key: string; title: string }>;
};

export const roleOptions: RoleOption[] = [
  { id: "role-001", name: "系统管理员", code: "system_admin", color: "#ff4d4f", description: "平台最高权限" },
  { id: "role-002", name: "单位管理员", code: "unit_admin", color: "#1890ff", description: "负责本单位管理" },
  { id: "role-003", name: "数据专员", code: "data_officer", color: "#52c41a", description: "负责数据上报" },
  { id: "role-004", name: "普通用户", code: "user", color: "#999999", description: "仅查看权限" },
  { id: "role-005", name: "审计员", code: "auditor", color: "#722ed1", description: "合规审计" },
];

export const roleNameMap: Record<string, string> = roleOptions.reduce<Record<string, string>>((acc, role) => {
  acc[role.code] = role.name;
  return acc;
}, {});

export const roleColorMap: Record<string, string> = roleOptions.reduce<Record<string, string>>((acc, role) => {
  acc[role.code] = role.color;
  return acc;
}, {});

export const statusMap: Record<UserStatus, { label: string; color: string }> = {
  active: { label: "启用", color: "green" },
  disabled: { label: "停用", color: "default" },
};

export const orgTypeLabelMap: Record<OrgType, string> = {
  department: "部门",
  town: "镇街",
  soe: "国企",
};

export const orgTree: OrgTreeNode[] = [
  {
    key: "root",
    title: "全部",
    children: [
      {
        key: "dept",
        title: "委办部门",
        children: [
          { key: "dept-001", title: "区大数据局" },
          { key: "dept-002", title: "区发改委" },
          { key: "dept-003", title: "区文旅局" },
          { key: "dept-004", title: "区住建局" },
          { key: "dept-005", title: "区交通局" },
          { key: "dept-006", title: "区教育局" },
          { key: "dept-007", title: "区卫健委" },
          { key: "dept-008", title: "区市场监管局" },
          { key: "dept-009", title: "区生态环境局" },
          { key: "dept-010", title: "区人社局" },
        ],
      },
      {
        key: "town",
        title: "镇街",
        children: [
          { key: "town-001", title: "新塘镇" },
          { key: "town-002", title: "石滩镇" },
          { key: "town-003", title: "中新镇" },
          { key: "town-004", title: "永宁街道" },
          { key: "town-005", title: "荔湖街道" },
          { key: "town-006", title: "朱村街道" },
        ],
      },
      {
        key: "soe",
        title: "国企",
        children: [
          { key: "soe-001", title: "区城投集团" },
          { key: "soe-002", title: "区交投集团" },
          { key: "soe-003", title: "区水投集团" },
        ],
      },
    ],
  },
];

const rootChildren = orgTree[0].children ?? [];
const byKey = (key: string) => rootChildren.find((item) => item.key === key)?.children ?? [];

export const orgTreeMap: Record<OrgType, OrgTreeNode[]> = {
  department: [{ key: "all", title: "全部", children: byKey("dept") }],
  town: [{ key: "all", title: "全部", children: byKey("town") }],
  soe: [{ key: "all", title: "全部", children: byKey("soe") }],
};

export const orgNameMap: Record<string, string> = {};
const collectOrgMap = (nodes: OrgTreeNode[]) => {
  nodes.forEach((node) => {
    orgNameMap[node.key] = node.title;
    if (node.children?.length) {
      collectOrgMap(node.children);
    }
  });
};
collectOrgMap(orgTree);

export const userListMock: UserItem[] = [
  {
    id: "user-001",
    name: "张三",
    account: "zhangsan",
    orgId: "dept-001",
    orgName: "区大数据局",
    phone: "138****1001",
    email: "zhangsan@gov.cn",
    position: "信息化专员",
    status: "active",
    roles: ["system_admin"],
    extraDataAuth: [],
    dataScope: "全区",
    isDataOfficer: false,
    lastLoginAt: "2024-03-20 09:15:00",
  },
  {
    id: "user-002",
    name: "李四",
    account: "lisi",
    orgId: "dept-001",
    orgName: "区大数据局",
    phone: "138****1002",
    email: "lisi@gov.cn",
    position: "副局长",
    status: "active",
    roles: ["unit_admin"],
    extraDataAuth: [],
    dataScope: "区大数据局",
    isDataOfficer: false,
    lastLoginAt: "2024-03-19 14:30:00",
  },
  {
    id: "user-003",
    name: "王五",
    account: "wangwu",
    orgId: "dept-001",
    orgName: "区大数据局",
    phone: "138****1003",
    email: "wangwu@gov.cn",
    position: "科员",
    status: "active",
    roles: ["user"],
    extraDataAuth: [],
    dataScope: "区大数据局",
    isDataOfficer: false,
    lastLoginAt: "2024-03-18 16:45:00",
  },
  {
    id: "user-004",
    name: "赵六",
    account: "zhaoliu",
    orgId: "dept-002",
    orgName: "区发改委",
    phone: "138****1004",
    email: "zhaoliu@gov.cn",
    position: "数据管理员",
    status: "active",
    roles: ["unit_admin", "data_officer"],
    extraDataAuth: [],
    dataScope: "区发改委",
    isDataOfficer: true,
    lastLoginAt: "2024-03-20 08:00:00",
  },
  {
    id: "user-005",
    name: "钱七",
    account: "qianqi",
    orgId: "dept-002",
    orgName: "区发改委",
    phone: "138****1005",
    email: "qianqi@gov.cn",
    position: "科员",
    status: "disabled",
    roles: ["user"],
    extraDataAuth: [],
    dataScope: "区发改委",
    isDataOfficer: false,
    lastLoginAt: "2024-02-15 10:00:00",
  },
  {
    id: "user-006",
    name: "孙八",
    account: "sunba",
    orgId: "dept-003",
    orgName: "区文旅局",
    phone: "138****1006",
    email: "sunba@gov.cn",
    position: "局长",
    status: "active",
    roles: ["unit_admin"],
    extraDataAuth: ["dept-001", "dept-002"],
    dataScope: "区文旅局 +2",
    isDataOfficer: false,
    lastLoginAt: "2024-03-17 11:20:00",
  },
  {
    id: "user-007",
    name: "周九",
    account: "zhoujiu",
    orgId: "dept-003",
    orgName: "区文旅局",
    phone: "138****1007",
    email: "zhoujiu@gov.cn",
    position: "信息化专员",
    status: "active",
    roles: ["data_officer"],
    extraDataAuth: [],
    dataScope: "区文旅局",
    isDataOfficer: true,
    lastLoginAt: "2024-03-19 09:30:00",
  },
  {
    id: "user-008",
    name: "吴十",
    account: "wushi",
    orgId: "town-001",
    orgName: "新塘镇",
    phone: "138****1008",
    email: "wushi@gov.cn",
    position: "党政办主任",
    status: "active",
    roles: ["unit_admin", "data_officer"],
    extraDataAuth: [],
    dataScope: "新塘镇",
    isDataOfficer: true,
    lastLoginAt: "2024-03-20 10:00:00",
  },
  {
    id: "user-009",
    name: "郑一",
    account: "zhengyi",
    orgId: "soe-001",
    orgName: "区城投集团",
    phone: "138****1009",
    email: "zhengyi@gov.cn",
    position: "综合部经理",
    status: "active",
    roles: ["unit_admin"],
    extraDataAuth: [],
    dataScope: "区城投集团",
    isDataOfficer: false,
    lastLoginAt: "2024-03-18 14:00:00",
  },
  {
    id: "user-010",
    name: "冯二",
    account: "fenger",
    orgId: "soe-001",
    orgName: "区城投集团",
    phone: "138****1010",
    email: "fenger@gov.cn",
    position: "数据专员",
    status: "active",
    roles: ["data_officer"],
    extraDataAuth: [],
    dataScope: "区城投集团",
    isDataOfficer: true,
    lastLoginAt: "2024-03-19 16:00:00",
  },
];

export const permissionTree: PermissionTreeNode[] = [
  {
    key: "kb",
    title: "知识库管理",
    children: [
      { key: "kb_view_own", title: "查看本单位知识库" },
      { key: "kb_view_authorized", title: "查看被授权的其他单位知识库" },
      { key: "kb_create_own", title: "创建知识库" },
      { key: "kb_edit_own", title: "编辑知识库信息" },
      { key: "kb_delete", title: "删除知识库" },
      { key: "kb_upload_own", title: "上传文件到知识库" },
      { key: "kb_delete_file_own", title: "删除知识库中的文件" },
      { key: "kb_set_scope_own", title: "设置知识库公开范围" },
      { key: "kb_view_theme", title: "查看主题库" },
      { key: "kb_manage_theme", title: "创建/编辑/删除主题库" },
    ],
  },
  {
    key: "report",
    title: "数据上报",
    children: [
      { key: "report_submit", title: "填写并提交上报数据" },
      { key: "report_draft", title: "暂存草稿" },
      { key: "report_withdraw", title: "撤回已提交的数据" },
    ],
  },
  {
    key: "task",
    title: "采集任务管理",
    children: [
      { key: "task_create", title: "创建采集任务" },
      { key: "task_review_own", title: "审核/退回填报数据" },
    ],
  },
  {
    key: "sys",
    title: "系统管理",
    children: [
      { key: "sys_manage_unit_users", title: "管理本单位用户" },
      { key: "sys_view_log_unit", title: "操作日志查看（本单位）" },
      { key: "sys_view_log_all", title: "操作日志查看（全区）" },
    ],
  },
];

export const rolePermissionMap: Record<string, string[]> = {
  system_admin: ["*"],
  unit_admin: [
    "kb_view_own",
    "kb_view_authorized",
    "kb_create_own",
    "kb_edit_own",
    "kb_upload_own",
    "kb_delete_file_own",
    "kb_set_scope_own",
    "kb_view_theme",
    "report_submit",
    "report_draft",
    "report_withdraw",
    "task_create",
    "task_review_own",
    "sys_manage_unit_users",
    "sys_view_log_unit",
  ],
  data_officer: [
    "kb_view_own",
    "kb_view_authorized",
    "kb_upload_own",
    "kb_view_theme",
    "report_submit",
    "report_draft",
    "report_withdraw",
  ],
  user: ["kb_view_own", "kb_view_authorized", "kb_view_theme"],
  auditor: ["kb_view_own", "kb_view_authorized", "kb_view_theme", "sys_view_log_all"],
};

const permissionOrder = permissionTree.flatMap((module) => module.children.map((item) => item.key));

export const buildMergedPermissions = (roles: string[]): MergedPermissionItem[] => {
  const grantedMap = new Map<string, string>();
  const hasSystemAdmin = roles.includes("system_admin");

  for (const roleCode of roles) {
    const rolePerms = rolePermissionMap[roleCode] ?? [];
    if (rolePerms.includes("*")) {
      permissionOrder.forEach((perm) => {
        if (!grantedMap.has(perm)) {
          grantedMap.set(perm, roleNameMap[roleCode] ?? roleCode);
        }
      });
      continue;
    }
    rolePerms.forEach((perm) => {
      if (!grantedMap.has(perm)) {
        grantedMap.set(perm, roleNameMap[roleCode] ?? roleCode);
      }
    });
  }

  return permissionOrder.map((key) => {
    const node = permissionTree.flatMap((m) => m.children).find((item) => item.key === key);
    return {
      key,
      title: node?.title ?? key,
      granted: hasSystemAdmin ? true : grantedMap.has(key),
      fromRole: hasSystemAdmin ? "系统管理员" : grantedMap.get(key) ?? null,
    };
  });
};

export const calcDataScopeText = (user: Pick<UserItem, "roles" | "orgName" | "extraDataAuth">): string => {
  if (user.roles.includes("system_admin")) {
    return "全区";
  }
  if (!user.extraDataAuth.length) {
    return user.orgName;
  }
  return `${user.orgName} +${user.extraDataAuth.length}`;
};

export const userPermissionDetailMock: UserPermissionDetail = {
  userId: "user-004",
  name: "赵六",
  account: "zhaoliu",
  orgName: "区发改委",
  position: "数据管理员",
  roles: ["unit_admin", "data_officer"],
  status: "active",
  dataScope: {
    base: "区发改委",
    extra: [],
  },
  accessibleKnowledgeBases: [
    { name: "区发改委知识库", type: "unit", permission: "edit" },
    { name: "重点项目专题库", type: "theme", permission: "view" },
    { name: "智慧城市专题库", type: "theme", permission: "view" },
    { name: "区大数据局知识库", type: "unit", permission: "view", reason: "该知识库设置为组织内公开" },
    { name: "区文旅局知识库", type: "unit", permission: "view", reason: "该知识库设置为组织内公开" },
  ],
  mergedPermissions: [
    { key: "kb_view_own", title: "查看本单位知识库", granted: true, fromRole: "普通用户" },
    { key: "kb_view_authorized", title: "查看被授权的其他单位知识库", granted: true, fromRole: "普通用户" },
    { key: "kb_create_own", title: "创建知识库", granted: true, fromRole: "单位管理员" },
    { key: "kb_edit_own", title: "编辑知识库信息", granted: true, fromRole: "单位管理员" },
    { key: "kb_delete", title: "删除知识库", granted: false, fromRole: null },
    { key: "kb_upload_own", title: "上传文件到知识库", granted: true, fromRole: "数据专员" },
    { key: "kb_delete_file_own", title: "删除知识库中的文件", granted: true, fromRole: "单位管理员" },
    { key: "kb_set_scope_own", title: "设置知识库公开范围", granted: true, fromRole: "单位管理员" },
    { key: "kb_view_theme", title: "查看主题库", granted: true, fromRole: "普通用户" },
    { key: "kb_manage_theme", title: "创建/编辑/删除主题库", granted: false, fromRole: null },
    { key: "report_submit", title: "填写并提交上报数据", granted: true, fromRole: "数据专员" },
    { key: "report_draft", title: "暂存草稿", granted: true, fromRole: "数据专员" },
    { key: "report_withdraw", title: "撤回已提交的数据", granted: true, fromRole: "数据专员" },
    { key: "task_create", title: "创建采集任务", granted: true, fromRole: "单位管理员" },
    { key: "task_review_own", title: "审核/退回填报数据", granted: true, fromRole: "单位管理员" },
    { key: "sys_manage_unit_users", title: "管理本单位用户", granted: true, fromRole: "单位管理员" },
    { key: "sys_view_log_unit", title: "操作日志查看（本单位）", granted: true, fromRole: "单位管理员" },
    { key: "sys_view_log_all", title: "操作日志查看（全区）", granted: false, fromRole: null },
  ],
};

export const buildUserPermissionDetail = (user: UserItem): UserPermissionDetail => {
  const mergedPermissions = buildMergedPermissions(user.roles);
  const canEditOwnKb = mergedPermissions.some((item) => item.key === "kb_edit_own" && item.granted);
  const canViewTheme = mergedPermissions.some((item) => item.key === "kb_view_theme" && item.granted);

  const accessibleKnowledgeBases: AccessibleKnowledgeBase[] = [
    {
      name: `${user.orgName}知识库`,
      type: "unit",
      permission: canEditOwnKb ? "edit" : "view",
    },
    {
      name: "重点项目专题库",
      type: "theme",
      permission: canViewTheme ? "view" : "view",
    },
  ];

  user.extraDataAuth.forEach((orgId) => {
    const orgName = orgNameMap[orgId];
    if (orgName) {
      accessibleKnowledgeBases.push({
        name: `${orgName}知识库`,
        type: "unit",
        permission: "view",
        reason: "该单位数据被额外授权",
      });
    }
  });

  accessibleKnowledgeBases.push(
    { name: "区大数据局知识库", type: "unit", permission: "view", reason: "该知识库设置为组织内公开" },
    { name: "区文旅局知识库", type: "unit", permission: "view", reason: "该知识库设置为组织内公开" },
  );

  return {
    userId: user.id,
    name: user.name,
    account: user.account,
    orgName: user.orgName,
    position: user.position,
    roles: user.roles,
    status: user.status,
    dataScope: {
      base: user.orgName,
      extra: user.extraDataAuth,
    },
    accessibleKnowledgeBases,
    mergedPermissions,
  };
};
