import React, { useMemo, useState } from "react";
import { Button, Col, Input, Row, Select, Space, Table, Tag, Typography, message } from "antd";
import type { ColumnsType } from "antd/es/table";

import PositionFormModal, { type PositionFormValues } from "./PositionFormModal";
import { roleList } from "../RoleManage/roleMockData";

type PositionStatus = "enabled" | "disabled";

type PositionItem = {
  id: string;
  name: string;
  description: string;
  roles: string[];
  status: PositionStatus;
  createdAt: string;
};

const initialPositions: PositionItem[] = [
  {
    id: "pos-001",
    name: "数据专员",
    description: "负责数据报送、审核与质量校验。",
    roles: ["数据填报", "数据审核", "统计分析"],
    status: "enabled",
    createdAt: "2025-12-01 09:30:12",
  },
  {
    id: "pos-002",
    name: "系统管理员",
    description: "负责系统配置、用户与权限管理。",
    roles: ["系统管理", "权限配置"],
    status: "enabled",
    createdAt: "2025-11-18 14:05:44",
  },
  {
    id: "pos-003",
    name: "业务负责人",
    description: "负责业务流程把控与审批。",
    roles: ["流程审批", "业务监管", "数据复核", "报表查看"],
    status: "disabled",
    createdAt: "2025-10-05 17:20:08",
  },
];

const PositionManagePage: React.FC = () => {
  const [positions, setPositions] = useState<PositionItem[]>(initialPositions);
  const [query, setQuery] = useState({ keyword: "", status: "all" as "all" | PositionStatus });
  const [appliedQuery, setAppliedQuery] = useState(query);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editing, setEditing] = useState<PositionItem | null>(null);

  const filteredList = useMemo(() => {
    const kw = appliedQuery.keyword.trim().toLowerCase();
    return positions.filter((item) => {
      const matchKw = !kw || item.name.toLowerCase().includes(kw) || item.description.toLowerCase().includes(kw);
      const matchStatus = appliedQuery.status === "all" || item.status === appliedQuery.status;
      return matchKw && matchStatus;
    });
  }, [positions, appliedQuery]);

  const columns: ColumnsType<PositionItem> = [
    {
      title: "序号",
      key: "index",
      width: 80,
      render: (_value, _record, index) => index + 1,
    },
    {
      title: "职务名称",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (value: string) => <span style={{ fontWeight: 600, color: "#333" }}>{value}</span>,
    },
    {
      title: "职务描述",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "关联角色",
      dataIndex: "roles",
      key: "roles",
      width: 260,
      render: (roles: string[]) => (
        <Space size={[6, 6]} wrap>
          {roles.map((role) => (
            <Tag key={role} color="blue" style={{ marginInlineEnd: 0 }}>
              {role}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center",
      render: (status: PositionStatus) => (
        <Tag color={status === "enabled" ? "green" : "default"}>
          {status === "enabled" ? "启用" : "禁用"}
        </Tag>
      ),
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      align: "center",
    },
    {
      title: "操作",
      key: "actions",
      width: 220,
      align: "center",
      render: (_value, record) => (
        <Space size={0}>
          <Button
            type="link"
            style={{ paddingInline: 4 }}
            onClick={() => {
              setFormMode("edit");
              setEditing(record);
              setFormOpen(true);
            }}
          >
            编辑
          </Button>
          <Button
            type="link"
            style={{ paddingInline: 4, color: record.status === "enabled" ? "#52c41a" : "#999" }}
            onClick={() => {
              setPositions((prev) =>
                prev.map((item) =>
                  item.id === record.id
                    ? { ...item, status: item.status === "enabled" ? "disabled" : "enabled" }
                    : item,
                ),
              );
            }}
          >
            {record.status === "enabled" ? "禁用" : "启用"}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ height: "100%", overflow: "auto", background: "#f3f6fb", padding: 20 }}>
      <Typography.Title level={5} style={{ marginTop: 0 }}>
        职务管理
      </Typography.Title>

      <div style={{ background: "#fafafa", borderRadius: 8, padding: "16px 20px", marginBottom: 12 }}>
        <Row gutter={[12, 12]} align="middle">
          <Col span={9}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ whiteSpace: "nowrap" }}>职务关键词：</span>
              <Input.Search
                allowClear
                placeholder="搜索职务名称或描述"
                value={query.keyword}
                onChange={(e) => setQuery((prev) => ({ ...prev, keyword: e.target.value }))}
                onSearch={() => setAppliedQuery(query)}
              />
            </div>
          </Col>
          <Col span={6}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ whiteSpace: "nowrap" }}>状态：</span>
              <Select
                style={{ width: "100%" }}
                value={query.status}
                options={[
                  { label: "全部状态", value: "all" },
                  { label: "启用", value: "enabled" },
                  { label: "禁用", value: "disabled" },
                ]}
                onChange={(value) => setQuery((prev) => ({ ...prev, status: value }))}
              />
            </div>
          </Col>
          <Col span={9}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Space>
                <Button type="primary" onClick={() => setAppliedQuery(query)}>
                  查询
                </Button>
                <Button
                  onClick={() => {
                    const reset = { keyword: "", status: "all" as const };
                    setQuery(reset);
                    setAppliedQuery(reset);
                  }}
                >
                  重置
                </Button>
              </Space>
            </div>
          </Col>
        </Row>
      </div>

      <div style={{ marginBottom: 12 }}>
        <Button
          type="primary"
          onClick={() => {
            setFormMode("create");
            setEditing(null);
            setFormOpen(true);
          }}
        >
          新增职务
        </Button>
      </div>

      <Table<PositionItem>
        rowKey="id"
        columns={columns}
        dataSource={filteredList}
        scroll={{ x: 1200 }}
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
      />

      <PositionFormModal
        open={formOpen}
        mode={formMode}
        roleOptions={roleList.map((role) => role.name)}
        existingNames={positions.map((item) => item.name)}
        editingName={editing?.name ?? ""}
        initialValues={
          editing
            ? {
                name: editing.name,
                description: editing.description,
                roles: editing.roles,
                status: editing.status,
              }
            : undefined
        }
        onCancel={() => setFormOpen(false)}
        onSubmit={(values: PositionFormValues) => {
          if (formMode === "create") {
            if (positions.some((item) => item.name === values.name)) {
              message.error("职务名称已存在");
              return;
            }
            const next: PositionItem = {
              id: `pos-${Date.now()}`,
              name: values.name,
              description: values.description ?? "",
              roles: values.roles,
              status: values.status,
              createdAt: new Date().toISOString().slice(0, 19).replace("T", " "),
            };
            setPositions((prev) => [next, ...prev]);
            message.success("新增成功");
          } else if (editing) {
            if (positions.some((item) => item.name === values.name && item.id !== editing.id)) {
              message.error("职务名称已存在");
              return;
            }
            setPositions((prev) =>
              prev.map((item) =>
                item.id === editing.id
                  ? { ...item, name: values.name, description: values.description ?? "", roles: values.roles, status: values.status }
                  : item,
              ),
            );
            message.success("编辑成功");
          }
          setFormOpen(false);
        }}
      />
    </div>
  );
};

export default PositionManagePage;
