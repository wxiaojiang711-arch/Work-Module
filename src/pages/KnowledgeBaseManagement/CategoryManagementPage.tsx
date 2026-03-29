import React, { useMemo, useState } from "react";
import { Breadcrumb, Button, Form, Input, Modal, Space, Table, Tag, Typography, message } from "antd";
import type { TableColumnsType } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Link, useLocation, useParams } from "react-router-dom";

import styles from "./CategoryManagementPage.module.css";

interface CategoryItem {
  id: string;
  name: string;
  description: string;
  fileCount: number;
  updatedAt: string;
}

const mockCategories: CategoryItem[] = [
  {
    id: "cat-001",
    name: "工作汇报",
    description: "部门月度/季度工作进展与成果",
    fileCount: 18,
    updatedAt: "2026-03-18 09:15:43",
  },
  {
    id: "cat-002",
    name: "会议纪要",
    description: "各类会议记录与纪要文件",
    fileCount: 12,
    updatedAt: "2026-03-17 14:08:12",
  },
  {
    id: "cat-003",
    name: "临时材料",
    description: "临时资料与待归档文件",
    fileCount: 6,
    updatedAt: "2026-03-12 10:22:05",
  },
];

const CategoryManagementPage: React.FC = () => {
  const { kbId } = useParams<{ kbId: string }>();
  const location = useLocation() as {
    state?: { kbName?: string; kbType?: "unit" | "theme"; visibility?: string };
  };
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<CategoryItem[]>(mockCategories);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CategoryItem | null>(null);

  const kbName = location.state?.kbName ?? `知识库-${kbId ?? ""}`;
  const kbType = location.state?.kbType ?? "unit";
  const kbTypeLabel = useMemo(() => (kbType === "theme" ? "主题库" : "单位库"), [kbType]);

  const openCreateModal = () => {
    setEditingItem(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEditModal = (item: CategoryItem) => {
    setEditingItem(item);
    form.setFieldsValue({ name: item.name, description: item.description });
    setModalOpen(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingItem) {
        setCategories((prev) =>
          prev.map((item) =>
            item.id === editingItem.id ? { ...item, name: values.name, description: values.description || "" } : item
          )
        );
        message.success("分类已更新");
      } else {
        const newItem: CategoryItem = {
          id: `cat-${Date.now()}`,
          name: values.name,
          description: values.description || "",
          fileCount: 0,
          updatedAt: "2026-03-29 10:30:00",
        };
        setCategories((prev) => [newItem, ...prev]);
        message.success("分类已创建");
      }
      setModalOpen(false);
    } catch {
      message.error("请完善必填项");
    }
  };

  const columns: TableColumnsType<CategoryItem> = [
    { title: "分类名称", dataIndex: "name", key: "name", width: 200 },
    { title: "分类描述", dataIndex: "description", key: "description", width: 360 },
    { title: "文件数量", dataIndex: "fileCount", key: "fileCount", width: 120 },
    { title: "最近更新", dataIndex: "updatedAt", key: "updatedAt", width: 180 },
    {
      title: "操作",
      key: "actions",
      width: 200,
      render: (_value, record) => (
        <Space>
          <Button type="link" onClick={() => openEditModal(record)}>{"编辑"}</Button>
          <Button
            type="link"
            danger
            onClick={() => {
              setCategories((prev) => prev.filter((item) => item.id !== record.id));
              message.success("分类已删除");
            }}
          >
            {"删除"}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <Breadcrumb
        className={styles.breadcrumb}
        items={[
          { title: <Link to="/knowledge/base-management">{"知识库管理"}</Link> },
          { title: <Link to="/knowledge/base-management">{kbTypeLabel}</Link> },
          { title: kbName },
          { title: "分类管理" },
        ]}
      />

      <div className={styles.headerRow}>
        <div className={styles.titleWrap}>
          <Typography.Title level={5} style={{ marginBottom: 0 }}>
            {kbName}
          </Typography.Title>
        </div>
        <div className={styles.actions}>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>{"新建分类"}</Button>
        </div>
      </div>

      <div className={styles.tableWrap}>
        <Table<CategoryItem>
          rowKey="id"
          columns={columns}
          dataSource={categories}
          pagination={{ pageSize: 10, showSizeChanger: true, showQuickJumper: true }}
        />
      </div>

      <Modal
        open={modalOpen}
        title={editingItem ? "编辑分类" : "新建分类"}
        onCancel={() => setModalOpen(false)}
        onOk={handleModalOk}
        okText={editingItem ? "保存" : "创建"}
        cancelText="取消"
        okButtonProps={{ style: { height: 40, borderRadius: 6, background: "#2b5cd6", borderColor: "#2b5cd6", padding: "0 24px" } }}
        cancelButtonProps={{ style: { height: 40, borderRadius: 6, padding: "0 24px" } }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="分类名称"
            rules={[{ required: true, message: "请输入分类名称" }]}
          >
            <Input className={styles.modalInput} placeholder="请输入分类名称" />
          </Form.Item>
          <Form.Item name="description" label="分类描述">
            <Input.TextArea className={styles.modalTextArea} placeholder="请输入分类描述（选填）" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryManagementPage;
