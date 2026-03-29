import React, { useMemo, useState } from "react";
import {
  Button,
  Col,
  Input,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";
import type { TableProps } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import OrgTreePanel from "./OrgTreePanel";
import UserFormDrawer, { type UserFormValues } from "./UserFormDrawer";
import UserPositionAssignModal from "./UserPositionAssignModal";
import styles from "./UserManagePage.module.css";
import {
  calcDataScopeText,
  orgNameMap,
  orgTreeMap,
  positionOptions,
  roleOptions,
  statusMap,
  userListMock,
  type OrgTreeNode,
  type OrgType,
  type UserItem,
  type UserStatus,
  type UserPositionAssignment,
} from "./userData";

const findPath = (nodes: OrgTreeNode[], key: string, path: string[] = []): string[] => {
  for (const node of nodes) {
    const next = [...path, node.title];
    if (node.key === key) {
      return next;
    }
    const inChildren = findPath(node.children ?? [], key, next);
    if (inChildren.length) {
      return inChildren;
    }
  }
  return [];
};

const collectKeys = (nodes: OrgTreeNode[]): string[] => {
  const keys: string[] = [];
  const walk = (list: OrgTreeNode[]) => {
    list.forEach((node) => {
      keys.push(node.key);
      if (node.children?.length) {
        walk(node.children);
      }
    });
  };
  walk(nodes);
  return keys;
};

const renderPositionTags = (positions: UserPositionAssignment[]) => {
  if (!positions.length) {
    return <span style={{ color: "#999" }}>-</span>;
  }
  const sorted = [...positions].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));
  const visible = sorted.slice(0, 2);
  const hidden = sorted.slice(2);
  const fullList = sorted.map((item) => item.name).join("、");

  return (
    <Space size={[4, 4]} wrap>
      {visible.map((item) => (
        <Tag
          key={item.id}
          style={{
            marginInlineEnd: 0,
            background: item.isPrimary ? "#e6f7e6" : "#e6f0ff",
            color: item.isPrimary ? "#52c41a" : "#2b5cd6",
            border: "none",
            borderRadius: 4,
            padding: "4px 12px",
            fontSize: 13,
          }}
        >
          {item.name}
        </Tag>
      ))}
      {hidden.length ? (
        <Tooltip title={fullList}>
          <Tag style={{ marginInlineEnd: 0 }}>+{hidden.length}</Tag>
        </Tooltip>
      ) : null}
    </Space>
  );
};

const UserManagePage: React.FC = () => {
  const [activeType, setActiveType] = useState<OrgType>("department");
  const [selectedOrgId, setSelectedOrgId] = useState("all");
  const [orgSearch, setOrgSearch] = useState("");

  const [query, setQuery] = useState({
    keyword: "",
    roles: [] as string[],
    status: undefined as UserStatus | undefined,
  });
  const [appliedQuery, setAppliedQuery] = useState(query);
  const [users, setUsers] = useState<UserItem[]>(userListMock);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [focusSection, setFocusSection] = useState<"basic" | "org" | "permission">("basic");

  const [assignOpen, setAssignOpen] = useState(false);
  const [assignUser, setAssignUser] = useState<UserItem | null>(null);

  const tree = orgTreeMap[activeType];
  const orgKeysByType = useMemo(() => collectKeys(tree), [tree]);
  const currentPath = useMemo(() => findPath(tree, selectedOrgId).join(" > "), [selectedOrgId, tree]);

  const currentLoginUser = users.find((item) => item.account === "zhangsan") ?? users[0];
  const canAssignSystemAdmin = currentLoginUser?.roles.includes("system_admin") ?? false;

  const roleFilterOptions = useMemo(
    () => [{ label: "全部", value: "__all__" }, ...roleOptions.map((role) => ({ label: role.name, value: role.code }))],
    [],
  );

  const filteredUsers = useMemo(() => {
    return users.filter((item) => {
      const orgMatch = selectedOrgId === "all" ? orgKeysByType.includes(item.orgId) : item.orgId === selectedOrgId;
      const keyword = appliedQuery.keyword.trim().toLowerCase();
      const keywordMatch = !keyword || item.name.toLowerCase().includes(keyword) || item.account.toLowerCase().includes(keyword);
      const roleMatch = !appliedQuery.roles.length || appliedQuery.roles.some((role) => item.roles.includes(role));
      const statusMatch = !appliedQuery.status || item.status === appliedQuery.status;
      return orgMatch && keywordMatch && roleMatch && statusMatch;
    });
  }, [users, selectedOrgId, orgKeysByType, appliedQuery]);

  const columns: TableProps<UserItem>["columns"] = [
    { title: "序号", key: "index", width: 70, render: (_value, _record, index) => index + 1 },
    { title: "姓名", dataIndex: "name", key: "name", width: 100 },
    { title: "账号", dataIndex: "account", key: "account", width: 120 },
    { title: "所属组织", dataIndex: "orgName", key: "orgName", width: 140 },
    {
      title: "手机号",
      dataIndex: "phone",
      key: "phone",
      width: 130,
      render: (phone: string) => phone.replace("****", "0000"),
    },
    {
      title: "职务",
      dataIndex: "positions",
      key: "positions",
      width: 170,
      render: (positions: UserPositionAssignment[] = []) => renderPositionTags(positions),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 90,
      render: (value: UserStatus) => <Tag color={statusMap[value].color}>{statusMap[value].label}</Tag>,
    },
    {
      title: "最后登录时间",
      dataIndex: "lastLoginAt",
      key: "lastLoginAt",
      width: 170,
      sorter: (a, b) => dayjs(a.lastLoginAt).valueOf() - dayjs(b.lastLoginAt).valueOf(),
    },
    {
      title: "操作",
      key: "actions",
      width: 240,
      render: (_value, record) => (
        <Space size={0}>
          <Button
            type="link"
            style={{ paddingInline: 4 }}
            onClick={() => {
              setAssignUser(record);
              setAssignOpen(true);
            }}
          >
            分配职务
          </Button>

          <Popconfirm
            title={`确认${record.status === "active" ? "停用" : "启用"}该用户？`}
            okText="确认"
            cancelText="取消"
            onConfirm={() => {
              setUsers((prev) =>
                prev.map((item) =>
                  item.id === record.id
                    ? {
                        ...item,
                        status: item.status === "active" ? "disabled" : "active",
                      }
                    : item,
                ),
              );
              message.success("用户状态已更新");
            }}
          >
            <Button type="link" style={{ paddingInline: 4 }}>
              {record.status === "active" ? "停用" : "启用"}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const resetFilters = () => {
    const reset = { keyword: "", roles: [], status: undefined };
    setQuery(reset);
    setAppliedQuery(reset);
  };

  const handleSaveUser = (values: UserFormValues & { replaceDataOfficerUserId?: string }) => {
    const roles = Array.from(new Set(values.roles));
    const finalRoles = values.isDataOfficer && !roles.includes("data_officer") ? [...roles, "data_officer"] : roles;
    const orgName = orgNameMap[values.orgId] ?? "未知组织";

    setUsers((prev) => {
      let next = [...prev];

      if (values.replaceDataOfficerUserId) {
        next = next.map((user) => {
          if (user.id !== values.replaceDataOfficerUserId) {
            return user;
          }
          return {
            ...user,
            isDataOfficer: false,
            roles: user.roles.filter((role) => role !== "data_officer"),
            dataScope: calcDataScopeText({
              roles: user.roles.filter((role) => role !== "data_officer"),
              orgName: user.orgName,
              extraDataAuth: user.extraDataAuth,
            }),
          };
        });
      }

      if (formMode === "create") {
        const newUser: UserItem = {
          id: `user-${Date.now()}`,
          name: values.name,
          account: values.account,
          orgId: values.orgId,
          orgName,
          phone: values.phone,
          email: values.email ?? "",
          position: values.position ?? "",
          status: "active",
          roles: finalRoles,
          extraDataAuth: values.extraDataAuth ?? [],
          isDataOfficer: values.isDataOfficer,
          dataScope: calcDataScopeText({ roles: finalRoles, orgName, extraDataAuth: values.extraDataAuth ?? [] }),
          lastLoginAt: "-",
        };
        next = [newUser, ...next];
      } else if (editingUser) {
        next = next.map((user) => {
          if (user.id !== editingUser.id) {
            return user;
          }

          return {
            ...user,
            name: values.name,
            orgId: values.orgId,
            orgName,
            phone: values.phone,
            email: values.email ?? "",
            position: values.position ?? "",
            roles: finalRoles,
            extraDataAuth: values.extraDataAuth ?? [],
            isDataOfficer: values.isDataOfficer,
            dataScope: calcDataScopeText({ roles: finalRoles, orgName, extraDataAuth: values.extraDataAuth ?? [] }),
          };
        });
      }

      return next;
    });

    if (formMode === "create") {
      message.success("用户创建成功");
    } else {
      message.success("用户信息已更新");
    }

    setFormOpen(false);
    setEditingUser(null);
  };

  return (
    <div className={styles.page}>
      <Typography.Title level={5} style={{ marginTop: 0 }}>
        用户管理
      </Typography.Title>

      <div className={styles.layout}>
        <div className={styles.leftPanel}>
          <OrgTreePanel
            activeType={activeType}
            selectedOrgId={selectedOrgId}
            searchText={orgSearch}
            onTypeChange={(type) => {
              setActiveType(type);
              setSelectedOrgId("all");
              setOrgSearch("");
              resetFilters();
            }}
            onSearchChange={setOrgSearch}
            onSelectOrg={setSelectedOrgId}
          />
        </div>

        <div className={styles.rightPanel}>
          <Typography.Text className={styles.pathText}>当前组织：{currentPath || "全部"}</Typography.Text>

          <div className={styles.filterWrap}>
            <Row gutter={[12, 12]} align="middle">
              <Col span={5}>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ whiteSpace: "nowrap" }}>姓名/账号：</span>
                  <Input.Search
                    allowClear
                    placeholder="姓名/账号"
                    value={query.keyword}
                    onChange={(event) => setQuery((prev) => ({ ...prev, keyword: event.target.value }))}
                    onSearch={() => setAppliedQuery(query)}
                  />
                </div>
              </Col>
              <Col span={7}>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ whiteSpace: "nowrap" }}>用户角色：</span>
                  <Select
                    mode="multiple"
                    allowClear
                    maxTagCount={2}
                    placeholder="用户角色"
                    style={{ width: "100%" }}
                    value={query.roles}
                    options={roleFilterOptions}
                    onChange={(value: string[]) => {
                      if (value.includes("__all__")) {
                        setQuery((prev) => ({ ...prev, roles: [] }));
                        return;
                      }
                      setQuery((prev) => ({ ...prev, roles: value }));
                    }}
                  />
                </div>
              </Col>
              <Col span={4}>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ whiteSpace: "nowrap" }}>用户状态：</span>
                  <Select
                    allowClear
                    placeholder="用户状态"
                    style={{ width: "100%" }}
                    value={query.status}
                    options={[
                      { label: "全部", value: undefined },
                      { label: "启用", value: "active" },
                      { label: "停用", value: "disabled" },
                    ]}
                    onChange={(value) => setQuery((prev) => ({ ...prev, status: value }))}
                  />
                </div>
              </Col>
              <Col span={8} style={{ textAlign: "right" }}>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Space>
                    <Button type="primary" onClick={() => setAppliedQuery(query)}>
                      查询
                    </Button>
                    <Button onClick={resetFilters}>重置</Button>
                  </Space>
                </div>
              </Col>
            </Row>
          </div>

          <div style={{ marginBottom: 12 }}>
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => {
                Modal.confirm({
                  title: "确认同步",
                  content: "是否确定同步协同平台的用户数据？",
                  okText: "确定",
                  cancelText: "取消",
                  onOk: () => {
                    message.success("已触发同步任务");
                  },
                });
              }}
            >
              同步用户
            </Button>
          </div>

          <Table<UserItem>
            rowKey="id"
            columns={columns}
            dataSource={filteredUsers}
            pagination={{
              showQuickJumper: true,
              showSizeChanger: true,
              showTotal: (total) => `共 ${total} 条`,
            }}
          />
        </div>
      </div>

      <UserFormDrawer
        open={formOpen}
        mode={formMode}
        record={editingUser}
        users={users}
        canAssignSystemAdmin={canAssignSystemAdmin}
        focusSection={focusSection}
        onClose={() => {
          setFormOpen(false);
          setEditingUser(null);
        }}
        onSubmit={handleSaveUser}
      />

      <UserPositionAssignModal
        open={assignOpen}
        userName={assignUser?.name ?? ""}
        orgName={assignUser?.orgName ?? ""}
        orgId={assignUser?.orgId ?? ""}
        positions={assignUser?.positions ?? []}
        positionOptions={positionOptions}
        orgOptions={Object.entries(orgNameMap)
          .filter(([key]) => key.startsWith("dept-") || key.startsWith("town-") || key.startsWith("soe-"))
          .map(([key, label]) => ({ value: key, label }))}
        onCancel={() => {
          setAssignOpen(false);
          setAssignUser(null);
        }}
        onSave={(nextPositions) => {
          if (!assignUser) return;
          setUsers((prev) =>
            prev.map((item) =>
              item.id === assignUser.id ? { ...item, positions: nextPositions } : item,
            ),
          );
          setAssignUser((prev) => (prev ? { ...prev, positions: nextPositions } : prev));
        }}
      />
    </div>
  );
};

export default UserManagePage;

