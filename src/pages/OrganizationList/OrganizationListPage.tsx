import React, { useMemo, useState } from "react";
import { Button, Col, Input, Popconfirm, Row, Space, Table, Tabs, Tooltip, Typography, message } from "antd";
import type { TableProps } from "antd";
import dayjs from "dayjs";

import OrgFormModal, { type OrgFormValues } from "./OrgFormModal";
import {
  departmentList,
  orgTypeLabelMap,
  soeList,
  townList,
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
    leader: "",
  });
  const [appliedQuery, setAppliedQuery] = useState(query);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode] = useState<"create" | "edit">("create");
  const [editingRecord] = useState<OrganizationItem | null>(null);

  const activeList = orgMap[activeType];
  const filteredList = useMemo(() => {
    return activeList.filter((item) => {
      const matchName =
        !appliedQuery.name.trim() ||
        item.fullName.toLowerCase().includes(appliedQuery.name.trim().toLowerCase());
      const matchLeader = !appliedQuery.leader.trim() || item.leader.includes(appliedQuery.leader.trim());
      return matchName && matchLeader;
    });
  }, [activeList, appliedQuery]);

  const columns: TableProps<OrganizationItem>["columns"] = [
    {
      title: "序号",
      key: "index",
      width: 80,
      render: (_value, _record, index) => index + 1,
    },
    { title: "组织全称", dataIndex: "fullName", key: "fullName", width: 340 },
    { title: "负责人", dataIndex: "leader", key: "leader", width: 120 },
    { title: "联系电话", dataIndex: "phone", key: "phone", width: 140 },
    { title: "人员数量", dataIndex: "memberCount", key: "memberCount", width: 100 },
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
      width: 100,
      fixed: "right",
      render: (_value, record) => (
        <Space size={0}>
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
          const reset = { name: "", leader: "" };
          setQuery(reset);
          setAppliedQuery(reset);
        }}
        items={(Object.keys(orgTypeLabelMap) as OrgType[]).map((type) => ({
          key: type,
          label: <span>{orgTypeLabelMap[type]}</span>,
        }))}
      />

      <div style={{ background: "#fafafa", borderRadius: 8, padding: "16px 20px", marginBottom: 12 }}>
        <Row gutter={[12, 12]} align="middle">
          <Col span={8}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ whiteSpace: "nowrap" }}>组织名称：</span>
              <Input.Search
                allowClear
                placeholder="搜索组织名称"
                value={query.name}
                onChange={(e) => setQuery((prev) => ({ ...prev, name: e.target.value }))}
                onSearch={() => setAppliedQuery(query)}
              />
            </div>
          </Col>
          <Col span={6}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ whiteSpace: "nowrap" }}>负责人：</span>
              <Input
                allowClear
                placeholder="负责人"
                value={query.leader}
                onChange={(e) => setQuery((prev) => ({ ...prev, leader: e.target.value }))}
              />
            </div>
          </Col>
          <Col flex="auto" style={{ textAlign: "right" }}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Space>
                <Button type="primary" onClick={() => setAppliedQuery(query)}>
                  查询
                </Button>
                <Button
                  onClick={() => {
                    const reset = { name: "", leader: "" };
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
            setModalOpen(true);
          }}
        >
          同步组织
        </Button>
      </div>

      <Table<OrganizationItem>
        rowKey="id"
        columns={columns}
        dataSource={filteredList}
        scroll={{ x: 1120 }}
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
              type: activeType,
              leader: values.leader ?? "",
              phone: values.phone ?? "",
              memberCount: 0,
              sort: values.sort ?? orgMap[activeType].length + 1,
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
                      leader: values.leader ?? "",
                      phone: values.phone ?? "",
                      sort: values.sort ?? item.sort,
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

