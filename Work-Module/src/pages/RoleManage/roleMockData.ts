export type RoleType = 'preset' | 'custom';

export type RoleItem = {
  id: string;
  name: string;
  code: string;
  description: string;
  type: RoleType;
  color: string;
  userCount: number;
  permissionModules: string[];
  permissions: string[];
};

export type PermissionTreeNode = {
  key: string;
  title: string;
  icon: string;
  children: Array<{ key: string; title: string }>;
};

export type RoleUser = {
  id: string;
  name: string;
  account: string;
  orgName: string;
  phone: string;
  addedAt: string;
};

export type PlatformUser = {
  id: string;
  name: string;
  account: string;
  orgId: string;
  orgName: string;
  roles: string[];
};

export type OrgTreeNode = {
  key: string;
  title: string;
  children?: OrgTreeNode[];
};

export const roleList: RoleItem[] = [
  {
    id: 'role-001',
    name: '系统管理员',
    code: 'system_admin',
    description: '平台最高权限，负责系统配置、组织管理、用户管理、角色分配等全局管理工作。',
    type: 'preset',
    color: '#ff4d4f',
    userCount: 2,
    permissionModules: ['知识库管理', '采集任务管理', '数据上报', '智能报告', '数据召回', '系统管理'],
    permissions: ['all'],
  },
  {
    id: 'role-002',
    name: '单位管理员',
    code: 'unit_admin',
    description: '负责本单位的知识库管理、用户管理（仅限本单位用户）、采集任务创建与管理。',
    type: 'preset',
    color: '#1890ff',
    userCount: 15,
    permissionModules: ['知识库管理', '采集任务管理', '数据上报', '智能报告', '数据召回', '系统管理'],
    permissions: [
      'kb_view_own', 'kb_view_authorized', 'kb_create_own', 'kb_edit_own', 'kb_upload_own', 'kb_delete_file_own', 'kb_set_scope_own', 'kb_view_theme',
      'task_create', 'task_edit_own', 'task_view_own', 'task_urge_own', 'task_review_own', 'task_export_own',
      'report_view_pending', 'report_submit', 'report_draft', 'report_withdraw', 'report_view_submitted', 'report_export',
      'ai_report_generate', 'ai_report_view_own', 'ai_report_view_unit', 'ai_report_export', 'ai_report_delete_unit',
      'recall_use', 'recall_scope_authorized',
      'sys_manage_unit_users', 'sys_reset_password_unit', 'sys_view_log_unit',
    ],
  },
  {
    id: 'role-003',
    name: '数据专员',
    code: 'data_officer',
    description: '负责本单位的数据上报、采集任务填报、文件上传等数据操作工作。',
    type: 'preset',
    color: '#52c41a',
    userCount: 28,
    permissionModules: ['知识库管理', '数据上报', '智能报告', '数据召回'],
    permissions: [
      'kb_view_own', 'kb_view_authorized', 'kb_upload_own', 'kb_view_theme',
      'report_view_pending', 'report_submit', 'report_draft', 'report_withdraw', 'report_view_submitted', 'report_export',
      'ai_report_generate', 'ai_report_view_own', 'ai_report_export',
      'recall_use', 'recall_scope_authorized',
    ],
  },
  {
    id: 'role-004',
    name: '普通用户',
    code: 'user',
    description: '仅可查看本单位有权限的知识库和数据，不可编辑和上报。',
    type: 'preset',
    color: '#999999',
    userCount: 86,
    permissionModules: ['知识库管理', '数据上报', '数据召回'],
    permissions: [
      'kb_view_own', 'kb_view_authorized', 'kb_view_theme',
      'report_view_pending', 'report_view_submitted',
      'recall_use', 'recall_scope_authorized',
    ],
  },
  {
    id: 'role-005',
    name: '审计员',
    code: 'auditor',
    description: '负责查看全区操作日志和数据变更记录，进行合规审计，不可修改任何业务数据。',
    type: 'custom',
    color: '#722ed1',
    userCount: 3,
    permissionModules: ['知识库管理', '数据上报', '系统管理'],
    permissions: ['kb_view_all', 'kb_view_theme', 'report_view_pending', 'report_view_submitted', 'sys_view_log_all'],
  },
];

export const permissionTree: PermissionTreeNode[] = [
  {
    key: 'kb',
    title: '知识库管理',
    icon: 'DatabaseOutlined',
    children: [
      { key: 'kb_view_all', title: '查看所有知识库列表' },
      { key: 'kb_view_own', title: '查看本单位知识库' },
      { key: 'kb_view_authorized', title: '查看被授权的其他单位知识库' },
      { key: 'kb_create_own', title: '创建知识库' },
      { key: 'kb_edit_own', title: '编辑知识库信息' },
      { key: 'kb_delete', title: '删除知识库' },
      { key: 'kb_upload_own', title: '上传文件到知识库' },
      { key: 'kb_delete_file_own', title: '删除知识库中的文件' },
      { key: 'kb_set_scope_own', title: '设置知识库公开范围' },
      { key: 'kb_view_theme', title: '查看主题库' },
      { key: 'kb_manage_theme', title: '创建/编辑/删除主题库' },
    ],
  },
  {
    key: 'task',
    title: '采集任务管理',
    icon: 'ScheduleOutlined',
    children: [
      { key: 'task_create', title: '创建采集任务' },
      { key: 'task_edit_own', title: '编辑/删除采集任务' },
      { key: 'task_view_all', title: '查看所有采集任务' },
      { key: 'task_view_own', title: '查看本单位下发的采集任务' },
      { key: 'task_urge_own', title: '催办' },
      { key: 'task_review_own', title: '审核/退回填报数据' },
      { key: 'task_export_own', title: '导出采集数据' },
    ],
  },
  {
    key: 'report',
    title: '数据上报',
    icon: 'CloudUploadOutlined',
    children: [
      { key: 'report_view_pending', title: '查看本单位待上报任务' },
      { key: 'report_submit', title: '填写并提交上报数据' },
      { key: 'report_draft', title: '暂存草稿' },
      { key: 'report_withdraw', title: '撤回已提交的数据' },
      { key: 'report_view_submitted', title: '查看已上报数据详情' },
      { key: 'report_export', title: '导出已上报数据' },
    ],
  },
  {
    key: 'ai_report',
    title: '智能报告',
    icon: 'FileTextOutlined',
    children: [
      { key: 'ai_report_generate', title: '生成智能报告' },
      { key: 'ai_report_view_own', title: '查看自己生成的报告' },
      { key: 'ai_report_view_unit', title: '查看本单位所有报告' },
      { key: 'ai_report_view_all', title: '查看全区所有报告' },
      { key: 'ai_report_export', title: '导出报告' },
      { key: 'ai_report_delete_unit', title: '删除报告' },
    ],
  },
  {
    key: 'recall',
    title: '数据召回',
    icon: 'SearchOutlined',
    children: [
      { key: 'recall_use', title: '使用数据召回功能' },
      { key: 'recall_scope_all', title: '召回范围：全区所有知识库' },
      { key: 'recall_scope_authorized', title: '召回范围：本单位+被授权的知识库' },
    ],
  },
  {
    key: 'sys',
    title: '系统管理',
    icon: 'SettingOutlined',
    children: [
      { key: 'sys_org_manage', title: '组织机构管理' },
      { key: 'sys_view_all_users', title: '查看所有用户' },
      { key: 'sys_manage_unit_users', title: '管理本单位用户' },
      { key: 'sys_reset_password_unit', title: '重置用户密码' },
      { key: 'sys_template_manage', title: '文件模板管理' },
      { key: 'sys_role_manage', title: '角色管理' },
      { key: 'sys_config', title: '系统配置' },
      { key: 'sys_view_log_unit', title: '操作日志查看（本单位）' },
      { key: 'sys_view_log_all', title: '操作日志查看（全区）' },
    ],
  },
];

export const roleUsers: Record<string, RoleUser[]> = {
  'role-003': [
    { id: 'user-001', name: '张三', account: 'zhangsan', orgName: '区大数据局', phone: '138****1001', addedAt: '2024-01-15 10:00:00' },
    { id: 'user-005', name: '赵六', account: 'zhaoliu', orgName: '区发改委', phone: '138****1005', addedAt: '2024-01-20 14:00:00' },
    { id: 'user-008', name: '孙七', account: 'sunqi', orgName: '新塘镇', phone: '138****1008', addedAt: '2024-02-01 09:00:00' },
    { id: 'user-012', name: '周八', account: 'zhouba', orgName: '区卫健委', phone: '138****1012', addedAt: '2024-02-10 11:00:00' },
    { id: 'user-015', name: '吴九', account: 'wujiu', orgName: '区城投集团', phone: '138****1015', addedAt: '2024-02-15 16:00:00' },
  ],
};

export const allUsers: PlatformUser[] = [
  { id: 'user-001', name: '张三', account: 'zhangsan', orgId: 'dept-001', orgName: '区大数据局', roles: ['data_officer'] },
  { id: 'user-002', name: '李四', account: 'lisi', orgId: 'dept-001', orgName: '区大数据局', roles: ['unit_admin'] },
  { id: 'user-003', name: '王五', account: 'wangwu', orgId: 'dept-001', orgName: '区大数据局', roles: ['user'] },
  { id: 'user-004', name: '陈十', account: 'chenshi', orgId: 'dept-002', orgName: '区发改委', roles: ['unit_admin'] },
  { id: 'user-005', name: '赵六', account: 'zhaoliu', orgId: 'dept-002', orgName: '区发改委', roles: ['data_officer'] },
  { id: 'user-006', name: '钱七', account: 'qianqi', orgId: 'dept-002', orgName: '区发改委', roles: ['user'] },
  { id: 'user-007', name: '刘八', account: 'liuba', orgId: 'dept-003', orgName: '区文旅局', roles: ['unit_admin', 'data_officer'] },
  { id: 'user-008', name: '孙七', account: 'sunqi', orgId: 'town-001', orgName: '新塘镇', roles: ['data_officer'] },
  { id: 'user-009', name: '郑九', account: 'zhengjiu', orgId: 'town-001', orgName: '新塘镇', roles: ['user'] },
  { id: 'user-010', name: '冯十', account: 'fengshi', orgId: 'town-002', orgName: '石滩镇', roles: ['data_officer'] },
  { id: 'user-011', name: '褚一', account: 'chuyi', orgId: 'dept-004', orgName: '区交通局', roles: ['user'] },
  { id: 'user-012', name: '周八', account: 'zhouba', orgId: 'dept-005', orgName: '区卫健委', roles: ['data_officer'] },
  { id: 'user-013', name: '卫二', account: 'weier', orgId: 'dept-005', orgName: '区卫健委', roles: ['user'] },
  { id: 'user-014', name: '蒋三', account: 'jiangsan', orgId: 'soe-001', orgName: '区城投集团', roles: ['unit_admin'] },
  { id: 'user-015', name: '吴九', account: 'wujiu', orgId: 'soe-001', orgName: '区城投集团', roles: ['data_officer'] },
];

export const orgTree: OrgTreeNode[] = [
  {
    key: 'dept',
    title: '委办部门',
    children: [
      { key: 'dept-001', title: '区大数据局' },
      { key: 'dept-002', title: '区发改委' },
      { key: 'dept-003', title: '区文旅局' },
      { key: 'dept-004', title: '区交通局' },
      { key: 'dept-005', title: '区卫健委' },
    ],
  },
  {
    key: 'town',
    title: '镇街',
    children: [
      { key: 'town-001', title: '新塘镇' },
      { key: 'town-002', title: '石滩镇' },
    ],
  },
  {
    key: 'soe',
    title: '国企',
    children: [{ key: 'soe-001', title: '区城投集团' }],
  },
];
