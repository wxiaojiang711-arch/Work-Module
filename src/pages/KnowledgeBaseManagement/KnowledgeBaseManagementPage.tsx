import React, { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Dropdown,
  Empty,
  Form,
  Input,
  Modal,
  Select,
  Tabs,
  Tag,
  Typography,
  message,
} from "antd";
import type { MenuProps } from "antd";
import {
  AppstoreOutlined,
  BookOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
  FileTextOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import type { KnowledgeBase, KnowledgeBaseType, UnitCategory, Visibility } from "./types";
import styles from "./KnowledgeBaseManagementPage.module.css";

const mockData: KnowledgeBase[] = [
  {
    id: "kb-001",
    title: "检验检查报告解读",
    lastUpdated: "2026-03-03 15:46:43",
    description: "临床检验检查与体检报告解读",
    visibility: "组织内公开",
    itemCount: 9,
    type: "unit",
    unitCategory: "department",
    tags: ["医疗", "检验检查"],
  },
  {
    id: "kb-002",
    title: "医共体知识馆",
    lastUpdated: "2026-02-09 00:51:35",
    description: "医共体共享协同与运行监管",
    visibility: "组织内公开",
    itemCount: 9,
    type: "unit",
    unitCategory: "town",
    tags: ["医共体", "协同"],
  },
  {
    id: "kb-003",
    title: "财政预算管理",
    lastUpdated: "2026-03-12 09:15:22",
    description: "财政预算编制、执行与绩效评估知识沉淀",
    visibility: "仅管理员可见",
    itemCount: 12,
    type: "unit",
    unitCategory: "soe",
    tags: ["财政", "预算"],
  },
  {
    id: "kb-004",
    title: "智慧城市治理知识库",
    lastUpdated: "2026-03-10 08:30:00",
    description: "城市治理数字化转型相关政策、标准与案例汇编",
    visibility: "完全公开",
    itemCount: 23,
    type: "theme",
    tags: ["智慧城市", "数字化转型"],
  },
  {
    id: "kb-005",
    title: "疫情防控知识库",
    lastUpdated: "2026-03-15 11:20:00",
    description: "公共卫生应急响应与疫情防控知识体系",
    visibility: "组织内公开",
    itemCount: 17,
    type: "theme",
    tags: ["公共卫生", "疫情防控"],
  },
  {
    id: "kb-006",
    title: "双碳目标与绿色发展",
    lastUpdated: "2026-03-01 16:40:00",
    description: "碳达峰碳中和政策解读与绿色低碳实践案例",
    visibility: "完全公开",
    itemCount: 8,
    type: "theme",
    tags: ["双碳", "绿色发展"],
  },
];

const visibilityColorMap: Record<Visibility, string> = {
  组织内公开: "blue",
  部分公开: "gold",
  仅管理员可见: "orange",
  完全公开: "green",
};

const typeLabel: Record<KnowledgeBaseType, string> = {
  unit: "单位库",
  theme: "主题库",
};

const typeColor: Record<KnowledgeBaseType, string> = {
  unit: "purple",
  theme: "cyan",
};

const unitCategoryLabelMap: Record<UnitCategory, string> = {
  department: "部门",
  town: "镇街",
  soe: "国企",
};

const KnowledgeBaseManagementPage: React.FC = () => {
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>(mockData);
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | KnowledgeBaseType>("all");
  const [activeUnitTab, setActiveUnitTab] = useState<UnitCategory>("department");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingKb, setEditingKb] = useState<KnowledgeBase | null>(null);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const filteredList = useMemo(() => {
    return knowledgeBases.filter((kb) => {
      const matchTab = activeTab === "all" || kb.type === activeTab;
      const matchUnitCategory =
        activeTab !== "unit" || kb.unitCategory === activeUnitTab;
      const matchSearch =
        !searchText ||
        kb.title.toLowerCase().includes(searchText.toLowerCase()) ||
        kb.description.toLowerCase().includes(searchText.toLowerCase());
      return matchTab && matchUnitCategory && matchSearch;
    });
  }, [knowledgeBases, activeTab, activeUnitTab, searchText]);

  const handleCreate = () => {
    setEditingKb(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (kb: KnowledgeBase) => {
    setEditingKb(kb);
    form.setFieldsValue({
      title: kb.title,
      description: kb.description,
      type: kb.type,
      visibility: kb.visibility,
      tags: kb.tags,
      unitCategory: kb.unitCategory,
    });
    setModalOpen(true);
  };

  const handleDelete = (kb: KnowledgeBase) => {
    Modal.confirm({
      title: "确认删除",
      content: `确定要删除知识库「${kb.title}」吗？此操作不可恢复。`,
      okText: "删除",
      okType: "danger",
      cancelText: "取消",
      onOk: () => {
        setKnowledgeBases((prev) => prev.filter((item) => item.id !== kb.id));
        message.success("已删除");
      },
    });
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      if (editingKb) {
        setKnowledgeBases((prev) =>
          prev.map((item) =>
            item.id === editingKb.id
              ? {
                  ...item,
                  ...values,
                  lastUpdated: new Date().toLocaleString("sv-SE").replace("T", " "),
                }
              : item,
          ),
        );
        message.success("已更新");
      } else {
        const newKb: KnowledgeBase = {
          id: `kb-${Date.now()}`,
          title: values.title,
          description: values.description,
          type: values.type,
          visibility: values.visibility,
          unitCategory: values.type === "unit" ? values.unitCategory ?? "department" : undefined,
          itemCount: 0,
          lastUpdated: new Date().toLocaleString("sv-SE").replace("T", " "),
          tags: values.tags ?? [],
        };
        setKnowledgeBases((prev) => [newKb, ...prev]);
        message.success("已创建");
      }
      setModalOpen(false);
      form.resetFields();
    });
  };

  const getCardActions = (kb: KnowledgeBase): MenuProps["items"] => [
    {
      key: "edit",
      icon: <EditOutlined />,
      label: "编辑",
      onClick: (info) => {
        info.domEvent.stopPropagation();
        handleEdit(kb);
      },
    },
    {
      key: "view",
      icon: <EyeOutlined />,
      label: "查看详情",
      onClick: (info) => {
        info.domEvent.stopPropagation();
        navigate(`/knowledge/base-management/${kb.id}`, {
          state: {
            kbName: kb.title,
            kbType: kb.type,
            unitCategory: kb.unitCategory,
            visibility: kb.visibility,
          },
        });
      },
    },
    { type: "divider" },
    {
      key: "delete",
      icon: <DeleteOutlined />,
      label: "删除",
      danger: true,
      onClick: (info) => {
        info.domEvent.stopPropagation();
        handleDelete(kb);
      },
    },
  ];

  const getTypeTagText = (kb: KnowledgeBase): string => {
    if (kb.type === "unit" && kb.unitCategory) {
      return `${typeLabel.unit}-${unitCategoryLabelMap[kb.unitCategory]}`;
    }
    return typeLabel[kb.type];
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Typography.Title level={5} className={styles.title}>
            知识库管理
          </Typography.Title>
          <Input.Search
            allowClear
            className={styles.searchBar}
            placeholder="搜索知识库名称或描述"
            onSearch={setSearchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          新建知识库
        </Button>
      </div>

      <Tabs
        className={styles.tabs}
        activeKey={activeTab}
        onChange={(key) => {
          setActiveTab(key as "all" | KnowledgeBaseType);
          if (key !== "unit") {
            setActiveUnitTab("department");
          }
        }}
        items={[
          { key: "all", label: `全部 (${knowledgeBases.length})` },
          {
            key: "unit",
            label: `单位库 (${knowledgeBases.filter((k) => k.type === "unit").length})`,
          },
          {
            key: "theme",
            label: `主题库 (${knowledgeBases.filter((k) => k.type === "theme").length})`,
          },
        ]}
      />

      {activeTab === "unit" ? (
        <Tabs
          className={styles.subTabs}
          activeKey={activeUnitTab}
          onChange={(key) => setActiveUnitTab(key as UnitCategory)}
          items={[
            {
              key: "department",
              label: `部门 (${knowledgeBases.filter((k) => k.type === "unit" && k.unitCategory === "department").length})`,
            },
            {
              key: "town",
              label: `镇街 (${knowledgeBases.filter((k) => k.type === "unit" && k.unitCategory === "town").length})`,
            },
            {
              key: "soe",
              label: `国企 (${knowledgeBases.filter((k) => k.type === "unit" && k.unitCategory === "soe").length})`,
            },
          ]}
        />
      ) : null}

      {filteredList.length === 0 ? (
        <div className={styles.emptyWrap}>
          <Empty description="暂无匹配的知识库" />
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredList.map((kb) => (
            <Card
              key={kb.id}
              className={styles.kbCard}
              hoverable
              onClick={() =>
                navigate(`/knowledge/base-management/${kb.id}`, {
                  state: {
                    kbName: kb.title,
                    kbType: kb.type,
                    unitCategory: kb.unitCategory,
                    visibility: kb.visibility,
                  },
                })
              }
            >
              <div className={styles.cardTop}>
                <Typography.Title level={5} className={styles.cardTitle}>
                  <BookOutlined style={{ marginRight: 8, color: "#4096ff" }} />
                  {kb.title}
                </Typography.Title>
                <Dropdown menu={{ items: getCardActions(kb) }} trigger={["click"]}>
                  <Button
                    type="text"
                    size="small"
                    icon={<EllipsisOutlined />}
                    onClick={(e) => e.stopPropagation()}
                  />
                </Dropdown>
              </div>

              <Typography.Paragraph type="secondary" className={styles.cardDesc}>
                {kb.description}
              </Typography.Paragraph>

              <div className={styles.cardFooter}>
                <div className={styles.cardMeta}>
                  <Tag color={typeColor[kb.type]} icon={<AppstoreOutlined />}>
                    {getTypeTagText(kb)}
                  </Tag>
                  <Tag color={visibilityColorMap[kb.visibility]}>{kb.visibility}</Tag>
                </div>
                <Badge count={kb.itemCount} overflowCount={999} style={{ backgroundColor: "#4096ff" }} />
              </div>

              <div className={styles.cardMeta} style={{ marginTop: 10 }}>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  <ClockCircleOutlined style={{ marginRight: 4 }} />
                  {kb.lastUpdated}
                </Typography.Text>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  <FileTextOutlined style={{ marginRight: 4 }} />
                  {kb.itemCount} 条知识
                </Typography.Text>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        title={editingKb ? "编辑知识库" : "新建知识库"}
        open={modalOpen}
        onOk={handleModalOk}
        onCancel={() => setModalOpen(false)}
        okText={editingKb ? "保存" : "创建"}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="title" label="知识库名称" rules={[{ required: true, message: "请输入知识库名称" }]}>
            <Input placeholder="请输入知识库名称" />
          </Form.Item>
          <Form.Item name="description" label="描述" rules={[{ required: true, message: "请输入描述" }]}>
            <Input.TextArea rows={3} placeholder="请输入知识库描述" />
          </Form.Item>
          <Form.Item name="type" label="类型" rules={[{ required: true, message: "请选择类型" }]}>
            <Select
              placeholder="请选择类型"
              options={[
                { value: "unit", label: "单位库" },
                { value: "theme", label: "主题库" },
              ]}
            />
          </Form.Item>
          <Form.Item noStyle shouldUpdate>
            {({ getFieldValue }) =>
              getFieldValue("type") === "unit" ? (
                <Form.Item
                  name="unitCategory"
                  label="单位分类"
                  rules={[{ required: true, message: "请选择单位分类" }]}
                >
                  <Select
                    placeholder="请选择单位分类"
                    options={[
                      { value: "department", label: "部门" },
                      { value: "town", label: "镇街" },
                      { value: "soe", label: "国企" },
                    ]}
                  />
                </Form.Item>
              ) : null
            }
          </Form.Item>
          <Form.Item name="visibility" label="可见范围" rules={[{ required: true, message: "请选择可见范围" }]}>
            <Select
              placeholder="请选择可见范围"
              options={[
                { value: "组织内公开", label: "组织内公开" },
                { value: "部分公开", label: "部分公开" },
                { value: "仅管理员可见", label: "仅管理员可见" },
                { value: "完全公开", label: "完全公开" },
              ]}
            />
          </Form.Item>
          <Form.Item name="tags" label="标签">
            <Select mode="tags" placeholder="输入标签后回车" tokenSeparators={[","]} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default KnowledgeBaseManagementPage;
