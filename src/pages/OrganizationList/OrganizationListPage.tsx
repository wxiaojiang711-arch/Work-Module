import React, { useMemo, useState } from "react";
import {
  Button,
  Col,
  Input,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";
import type { TableProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import OrgFormModal, { type OrgFormValues } from "./OrgFormModal";
import {
  departmentList,
  orgTypeLabelMap,
  soeList,
  statusMap,
  townList,
  type OrgStatus,
  type OrgType,
  type OrganizationItem,
} from "./orgData";

const OrganizationListPage: React.FC = () => {
  const [activeType, setActiveType] = useState<OrgType>("department");
  const [orgMap, setOrgMap] = useState<Record<OrgType, OrganizationItem[]>>({
    department: departmentList,
    town: townList,
    soe: soeList,
  });
  const [query, setQuery] = useState({
    name: "",
    status: undefined as OrgStatus | undefined,
    leader: "",
  });
  const [appliedQuery, setAppliedQuery] = useState(query);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingRecord, setEditingRecord] = useState<OrganizationItem | null>(null);

  const activeList = orgMap[activeType];
  const filteredList = useMemo(() => {
    return activeList.filter((item) => {
      const matchName =
        !appliedQuery.name.trim() ||
        item.fullName.toLowerCase().includes(appliedQuery.name.trim().toLowerCase()) ||
        item.shortName.toLowerCase().includes(appliedQuery.name.trim().toLowerCase());
      const matchStatus = !appliedQuery.status || item.status === appliedQuery.status;
      const matchLeader = !appliedQuery.leader.trim() || item.leader.includes(appliedQuery.leader.trim());
      return matchName && matchStatus && matchLeader;
    });
  }, [activeList, appliedQuery]);

  const columns: TableProps<OrganizationItem>["columns"] = [
    {
      title: "序号",
      key: "index",
      width: 80,
      render: (_value, _record, index) => index + 1,
    },
    { title: "组织全称", dataIndex: "fullName", key: "fullName", width: 280 },
    { title: "组织简称", dataIndex: "shortName", key: "shortName", width: 160 },
    { title: "组织编码", dataIndex: "code", key: "code", width: 160 },
    { title: "负责人", dataIndex: "leader", key: "leader", width: 110 },
    { title: "联系电话", dataIndex: "phone", key: "phone", width: 140 },
    { title: "人员数量", dataIndex: "memberCount", key: "memberCount", width: 100 },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (value: OrgStatus) => <Tag color={statusMap[value].color}>{statusMap[value].label}</Tag>,
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      sorter: (a, b) => dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf(),
    },
    {
      title: "操作",
      key: "actions",
      width: 260,
      fixed: "right",
      render: (_value, record) => (
        <Space size={0}>
          <Button
            type="link"
            style={{ paddingInline: 4 }}
            onClick={() => {
              setModalMode("edit");
              setEditingRecord(record);
              setModalOpen(true);
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title={`确认${record.status === "active" ? "停用" : "启用"}该组织？`}
            description={
              record.status === "active"
                ? "停用后该组织下的用户将无法登录系统"
                : "启用后该组织下用户可恢复正常登录"
            }
            okText="确认"
            cancelText="取消"
            onConfirm={() => {
              setOrgMap((prev) => ({
                ...prev,
                [activeType]: prev[activeType].map((item) =>
                  item.id === record.id
                    ? { ...item, status: item.status === "active" ? "stopped" : "active" }
                    : item,
                ),
              }));
              message.success("状态已更新");
            }}
          >
            <Button type="link" style={{ paddingInline: 4 }}>
              {record.status === "active" ? "停用" : "启用"}
            </Button>
          </Popconfirm>
          <Tooltip title={record.memberCount > 0 ? "该组织下存在用户，无法删除" : ""}>
            <Popconfirm
              title="确认删除该组织吗？"
              okText="删除"
              cancelText="取消"
              disabled={record.memberCount > 0}
              onConfirm={() => {
                setOrgMap((prev) => ({
                  ...prev,
                  [activeType]: prev[activeType].filter((item) => item.id !== record.id),
                }));
                message.success("已删除");
              }}
            >
              <Button type="link" danger disabled={record.memberCount > 0} style={{ paddingInline: 4 }}>
                删除
              </Button>
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ height: "100%", overflow: "auto", background: "#f3f6fb", padding: 20 }}>
      <Typography.Title level={5} style={{ marginTop: 0 }}>组织机构管理</Typography.Title>

      <Tabs
        activeKey={activeType}
        onChange={(key) => {
          const next = key as OrgType;
          setActiveType(next);
          const reset = { name: "", status: undefined, leader: "" };
          setQuery(reset);
          setAppliedQuery(reset);
        }}
        items={(Object.keys(orgTypeLabelMap) as OrgType[]).map((type) => ({
          key: type,
          label: <span>{orgTypeLabelMap[type]}</span>,
        }))}
      />

      <div style={{ background: "#fafafa", borderRadius: 8, padding: "16px 20px", maxWidth: 900, marginBottom: 12 }}>
        <Row gutter={[12, 12]} align="middle">
          <Col span={6}>
            <Input.Search
              allowClear
              placeholder="搜索组织名称"
              value={query.name}
              onChange={(e) => setQuery((prev) => ({ ...prev, name: e.target.value }))}
              onSearch={() => setAppliedQuery(query)}
            />
          </Col>
          <Col span={4}>
            <Select
              allowClear
              placeholder="组织状态"
              value={query.status}
              style={{ width: "100%" }}
              options={[
                { label: "全部", value: undefined },
                { label: "启用", value: "active" },
                { label: "停用", value: "stopped" },
              ]}
              onChange={(value) => setQuery((prev) => ({ ...prev, status: value }))}
            />
          </Col>
          <Col span={4}>
            <Input
              allowClear
              placeholder="负责人"
              value={query.leader}
              onChange={(e) => setQuery((prev) => ({ ...prev, leader: e.target.value }))}
            />
          </Col>
          <Col span={6}>
            <Space>
              <Button type="primary" onClick={() => setAppliedQuery(query)}>
                查询
              </Button>
              <Button
                onClick={() => {
                  const reset = { name: "", status: undefined, leader: "" };
                  setQuery(reset);
                  setAppliedQuery(reset);
                }}
              >
                重置
              </Button>
            </Space>
          </Col>
          <Col span={4} style={{ textAlign: "right" }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setModalMode("create");
                setEditingRecord(null);
                setModalOpen(true);
              }}
            >
              新增组织
            </Button>
          </Col>
        </Row>
      </div>

      <Table<OrganizationItem>
        rowKey="id"
        columns={columns}
        dataSource={filteredList}
        scroll={{ x: 1550 }}
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
      />

      <OrgFormModal
        open={modalOpen}
        mode={modalMode}
        currentType={activeType}
        record={editingRecord}
        onCancel={() => setModalOpen(false)}
        onSubmit={(values: OrgFormValues) => {
          if (modalMode === "create") {
            const next: OrganizationItem = {
              id: `${activeType}-${Date.now()}`,
              fullName: values.fullName,
              shortName: values.shortName,
              code: values.code,
              type: activeType,
              leader: values.leader ?? "",
              phone: values.phone ?? "",
              memberCount: 0,
              sort: values.sort ?? orgMap[activeType].length + 1,
              status: values.status,
              remark: values.remark ?? "",
              createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            };
            setOrgMap((prev) => ({ ...prev, [activeType]: [next, ...prev[activeType]] }));
            message.success("新增成功");
          } else if (editingRecord) {
            setOrgMap((prev) => ({
              ...prev,
              [activeType]: prev[activeType].map((item) =>
                item.id === editingRecord.id
                  ? {
                      ...item,
                      fullName: values.fullName,
                      shortName: values.shortName,
                      leader: values.leader ?? "",
                      phone: values.phone ?? "",
                      sort: values.sort ?? item.sort,
                      status: values.status,
                      remark: values.remark ?? "",
                    }
                  : item,
              ),
            }));
            message.success("编辑成功");
          }
          setModalOpen(false);
        }}
      />
    </div>
  );
};

export default OrganizationListPage;
