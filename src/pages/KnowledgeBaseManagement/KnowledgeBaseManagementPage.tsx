import React, { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Divider,
  Dropdown,
  Empty,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Space,
  Tabs,
  Tag,
  Tree,
  Typography,
  message,
} from "antd";
import type { MenuProps } from "antd";
import type { DataNode } from "antd/es/tree";
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
import { knowledgeBaseListMock } from "./knowledgeBaseMockData";
import styles from "./KnowledgeBaseManagementPage.module.css";

const mockData: KnowledgeBase[] = knowledgeBaseListMock;

const visibilityColorMap: Record<Visibility, string> = {
  组织内公开: "blue",
  部分公开: "gold",
  仅管理员可见: "orange",
  完全公开: "green",
};

const typeLabel: Record<KnowledgeBaseType, string> = {
  decision: "决策库",
  unit: "单位库",
  theme: "主题库",
};

const typeColor: Record<KnowledgeBaseType, string> = {
  decision: "cyan",
  unit: "purple",
  theme: "cyan",
};

const unitCategoryLabelMap: Record<UnitCategory, string> = {
  department: "部门",
  town: "镇街",
  soe: "国企",
};

const currentUnitName = "区大数据局";

interface UnitPermissionItem {
  unit: string;
  canView: boolean;
  canUpload: boolean;
}

const buildDefaultPermissions = (units: string[]): UnitPermissionItem[] =>
  units.map((unit) => ({
    unit,
    canView: unit === currentUnitName,
    canUpload: unit === currentUnitName,
  }));

const visibilityOptions: Array<{ value: Visibility; title: string; description: string }> = [
  {
    value: "组织内公开",
    title: "组织内公开",
    description: "本单位内所有用户可见，其他单位不可见",
  },
  {
    value: "部分公开",
    title: "部分公开",
    description: "仅指定单位可见，需配置授权单位列表",
  },
  {
    value: "完全公开",
    title: "完全公开",
    description: "全区所有单位、所有用户可见",
  },
];

const reportRoleOptions = [
  { label: "部门负责人", value: "dept_lead" },
  { label: "业务处室", value: "biz_office" },
  { label: "信息员", value: "info_staff" },
  { label: "审核人", value: "reviewer" },
  { label: "管理员", value: "admin" },
  { label: "填报人员", value: "reporter" },
];

const KnowledgeBaseManagementPage: React.FC = () => {
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>(mockData);
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | KnowledgeBaseType>("all");
  const [activeUnitTab, setActiveUnitTab] = useState<UnitCategory>("department");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingKb, setEditingKb] = useState<KnowledgeBase | null>(null);
  const [unitPermissions, setUnitPermissions] = useState<UnitPermissionItem[]>([]);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const watchedVisibility = Form.useWatch("visibility", form) as Visibility | undefined;
  const watchedType = Form.useWatch("type", form) as KnowledgeBaseType | undefined;

  const organizationUnitsByCategory = useMemo(() => {
    const grouped: Record<UnitCategory, string[]> = {
      department: [],
      town: [],
      soe: [],
    };
    knowledgeBases
      .filter((kb): kb is KnowledgeBase & { type: "unit"; unitCategory: UnitCategory } => kb.type === "unit" && Boolean(kb.unitCategory))
      .forEach((kb) => {
        if (!grouped[kb.unitCategory].includes(kb.title)) {
          grouped[kb.unitCategory].push(kb.title);
        }
      });
    if (!grouped.department.includes(currentUnitName)) {
      grouped.department.unshift(currentUnitName);
    }
    return grouped;
  }, [knowledgeBases]);

  const allUnits = useMemo(() => {
    const list = [
      ...organizationUnitsByCategory.department,
      ...organizationUnitsByCategory.town,
      ...organizationUnitsByCategory.soe,
    ];
    return Array.from(new Set(list));
  }, [organizationUnitsByCategory]);

  const allUnitOptions = useMemo(
    () => allUnits.filter((name) => name !== currentUnitName).map((name) => ({ label: name, value: name })),
    [allUnits],
  );

  const unitPermissionMap = useMemo(() => {
    return unitPermissions.reduce<Record<string, UnitPermissionItem>>((acc, item) => {
      acc[item.unit] = item;
      return acc;
    }, {});
  }, [unitPermissions]);

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
    setUnitPermissions(buildDefaultPermissions(allUnits));
    form.setFieldsValue({
      type: "unit",
      ownerUnit: undefined,
      title: "",
      description: "",
      visibility: "组织内公开",
      authorizedUnits: [],
      reportRoles: [],
    });
    setModalOpen(true);
  };

  const handleEdit = (kb: KnowledgeBase) => {
    setEditingKb(kb);
    setUnitPermissions(buildDefaultPermissions(allUnits));
    const normalizedVisibility: Visibility = kb.visibility === "仅管理员可见" ? "部分公开" : kb.visibility;
    const initialAuthorizedUnits = kb.visibility === "仅管理员可见" ? ["区委办公室"] : [];
    form.setFieldsValue({
      title: kb.title,
      description: kb.description,
      type: kb.type,
      ownerUnit: currentUnitName,
      visibility: normalizedVisibility,
      unitCategory: kb.unitCategory,
      authorizedUnits: initialAuthorizedUnits,
      reportRoles: [],
    });
    applyVisibilityToTree(normalizedVisibility, initialAuthorizedUnits);
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

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const hasAnyView = unitPermissions.some((item) => item.canView);
      if (!hasAnyView) {
        message.error("请至少为一个单位配置查看权限");
        return;
      }

      if (editingKb) {
        setKnowledgeBases((prev) =>
          prev.map((item) =>
            item.id === editingKb.id
              ? {
                  ...item,
                  title: values.title,
                  description: values.description || "",
                  type: values.type,
                  visibility: values.visibility,
                  unitCategory: values.type === "unit" ? item.unitCategory ?? "department" : undefined,
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
          description: values.description || "",
          type: values.type,
          visibility: values.visibility,
          unitCategory: values.type === "unit" ? "department" : undefined,
          itemCount: 0,
          lastUpdated: new Date().toLocaleString("sv-SE").replace("T", " "),
          tags: values.type === "unit" ? ["单位库"] : values.type === "theme" ? ["主题库"] : ["决策库"],
        };
        setKnowledgeBases((prev) => [newKb, ...prev]);
        message.success("已创建");
      }
      setModalOpen(false);
      form.resetFields();
    } catch (error: any) {
      const firstError = error?.errorFields?.[0];
      if (firstError?.name) {
        form.scrollToField(firstError.name, { behavior: "smooth", block: "center" });
      }
      message.error("请先完善必填项");
    }
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
      {
        key: "category",
        icon: <FileTextOutlined />,
        label: "分类管理",
        onClick: (info) => {
          info.domEvent.stopPropagation();
          navigate(`/knowledge/base-management/${kb.id}/categories`, {
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

  const syncFormByPermissionList = (list: UnitPermissionItem[]) => {
    const viewUnits = list.filter((item) => item.canView).map((item) => item.unit);

    if (viewUnits.length === allUnits.length) {
      form.setFieldValue("visibility", "完全公开");
      form.setFieldValue("authorizedUnits", []);
    } else if (viewUnits.length === 1 && viewUnits[0] === currentUnitName) {
      form.setFieldValue("visibility", "组织内公开");
      form.setFieldValue("authorizedUnits", []);
    } else {
      form.setFieldValue("visibility", "部分公开");
      form.setFieldValue("authorizedUnits", viewUnits.filter((unit) => unit !== currentUnitName));
    }
  };

  const applyVisibilityToTree = (visibility: Visibility, authorizedUnits: string[]) => {
    setUnitPermissions((prev) => {
      const baseMap = prev.reduce<Record<string, UnitPermissionItem>>((acc, item) => {
        acc[item.unit] = item;
        return acc;
      }, {});

      return allUnits.map((unit) => {
        const current = baseMap[unit] ?? { unit, canView: false, canUpload: false };
        const isCurrent = unit === currentUnitName;
        const canView =
          visibility === "完全公开"
            ? true
            : visibility === "组织内公开"
              ? isCurrent
              : isCurrent || authorizedUnits.includes(unit);

        return { ...current, canView };
      });
    });
  };

  const updateCategoryPermission = (category: UnitCategory, key: "canView" | "canUpload", checked: boolean) => {
    const units = organizationUnitsByCategory[category];
    setUnitPermissions((prev) => {
      const map = prev.reduce<Record<string, UnitPermissionItem>>((acc, item) => {
        acc[item.unit] = item;
        return acc;
      }, {});
      const next = allUnits.map((unit) => {
        const current = map[unit] ?? { unit, canView: false, canUpload: false };
        if (!units.includes(unit)) return current;
        return { ...current, [key]: checked };
      });
      syncFormByPermissionList(next);
      return next;
    });
  };

  const updateUnitPermission = (unit: string, key: "canView" | "canUpload", checked: boolean) => {
    setUnitPermissions((prev) => {
      const exist = prev.find((item) => item.unit === unit);
      const next = exist
        ? prev.map((item) => (item.unit === unit ? { ...item, [key]: checked } : item))
        : [...prev, { unit, canView: key === "canView" ? checked : false, canUpload: key === "canUpload" ? checked : false }];
      syncFormByPermissionList(next);
      return next;
    });
  };

  const permissionTreeData = useMemo<DataNode[]>(() => {
    const categoryOrder: UnitCategory[] = ["department", "town", "soe"];
    return categoryOrder.map((category) => ({
      key: `category-${category}`,
      title: (
        <div className={styles.permissionCategoryRow}>
          <span className={styles.permissionCategoryTitle}>{unitCategoryLabelMap[category]}</span>
          <div className={styles.permissionChecks}>
            <Checkbox
              checked={organizationUnitsByCategory[category].every((unit) => Boolean(unitPermissionMap[unit]?.canView))}
              onClick={(event) => event.stopPropagation()}
              onChange={(event) => updateCategoryPermission(category, "canView", event.target.checked)}
            >
              全选
            </Checkbox>
            <Checkbox
              checked={organizationUnitsByCategory[category].every((unit) => Boolean(unitPermissionMap[unit]?.canUpload))}
              onClick={(event) => event.stopPropagation()}
              onChange={(event) => updateCategoryPermission(category, "canUpload", event.target.checked)}
            >
              全选
            </Checkbox>
          </div>
        </div>
      ),
      selectable: false,
      children: organizationUnitsByCategory[category].map((unit) => {
        const permission = unitPermissionMap[unit] ?? { unit, canView: false, canUpload: false };
        return {
          key: `unit-${unit}`,
          selectable: false,
          title: (
            <div className={styles.permissionUnitRow}>
              <span className={styles.permissionUnitName}>{unit}</span>
              <div className={styles.permissionChecks}>
                <Checkbox
                  checked={permission.canView}
                  onClick={(event) => event.stopPropagation()}
                  onChange={(event) => updateUnitPermission(unit, "canView", event.target.checked)}
                >
                  查看
                </Checkbox>
                <Checkbox
                  checked={permission.canUpload}
                  onClick={(event) => event.stopPropagation()}
                  onChange={(event) => updateUnitPermission(unit, "canUpload", event.target.checked)}
                >
                  上传
                </Checkbox>
              </div>
            </div>
          ),
        };
      }),
    }));
  }, [organizationUnitsByCategory, unitPermissionMap, allUnits]);

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
            key: "decision",
            label: `决策库 (${knowledgeBases.filter((k) => k.type === "decision").length})`,
          },
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
                  {kb.itemCount} 个文件
                </Typography.Text>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        title={editingKb ? "编辑知识库" : "新增知识库"}
        open={modalOpen}
        onOk={handleModalOk}
        onCancel={() => setModalOpen(false)}
        okText="保存"
        cancelText="取消"
        width={800}
        styles={{ body: { maxHeight: "80vh", overflowY: "scroll", paddingTop: 8 } }}
        okButtonProps={{ style: { height: 40, borderRadius: 6, background: "#2b5cd6", borderColor: "#2b5cd6", padding: "0 24px" } }}
        cancelButtonProps={{ style: { height: 40, borderRadius: 6, padding: "0 24px" } }}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 8 }}
          onValuesChange={(changedValues) => {
            if (Object.prototype.hasOwnProperty.call(changedValues, "visibility")) {
              const visibility = changedValues.visibility as Visibility;
              if (visibility !== "部分公开") {
                form.setFieldValue("authorizedUnits", []);
              }
              const authorizedUnits = (form.getFieldValue("authorizedUnits") as string[] | undefined) ?? [];
              applyVisibilityToTree(visibility, authorizedUnits);
            }
            if (Object.prototype.hasOwnProperty.call(changedValues, "authorizedUnits")) {
              const visibility = (form.getFieldValue("visibility") as Visibility | undefined) ?? "组织内公开";
              if (visibility === "部分公开") {
                applyVisibilityToTree(visibility, (changedValues.authorizedUnits as string[]) || []);
              }
            }
            if (Object.prototype.hasOwnProperty.call(changedValues, "ownerUnit")) {
              const ownerUnit = changedValues.ownerUnit as string;
              const type = form.getFieldValue("type") as KnowledgeBaseType;
              if (ownerUnit) {
                form.setFieldValue("description", `汇集${ownerUnit}业务流程、工作规范、制度文件等资料`);
                if (type === "unit") {
                  form.setFieldValue("title", `${ownerUnit}知识库`);
                }
              }
            }
            if (Object.prototype.hasOwnProperty.call(changedValues, "type")) {
              const ownerUnit = form.getFieldValue("ownerUnit") as string;
              if (changedValues.type === "unit" && ownerUnit) {
                form.setFieldValue("title", `${ownerUnit}知识库`);
              }
            }
          }}
        >
          <div className={styles.modalSectionTitle}>基本信息</div>
          <div className={styles.modalSection}>
            <Form.Item name="type" label="知识库类型" rules={[{ required: true, message: "请选择知识库类型" }]}>
              <Select
                className={styles.modalInput}
                placeholder="请选择知识库类型"
                options={[
                  { value: "unit", label: "单位库" },
                  { value: "theme", label: "主题库" },
                  { value: "decision", label: "决策库" },
                ]}
              />
            </Form.Item>
            {watchedType === "unit" ? (
              <Form.Item name="ownerUnit" label="所属单位" rules={[{ required: true, message: "请选择所属单位" }]}>
                <Select
                  className={styles.modalInput}
                  placeholder="请选择所属单位"
                  showSearch
                  options={[{ label: currentUnitName, value: currentUnitName }, ...allUnitOptions]}
                />
              </Form.Item>
            ) : null}
            <Form.Item name="title" label="知识库名称" rules={[{ required: true, message: "请输入知识库名称" }]}>
              <Input className={styles.modalInput} placeholder="请输入知识库名称" />
            </Form.Item>
            <Form.Item name="description" label="知识库描述">
              <Input.TextArea rows={3} placeholder="请输入知识库描述（选填）" />
            </Form.Item>
          </div>

          <div className={styles.modalSectionTitle} style={{ marginTop: 24 }}>
            权限配置
            <span style={{ color: "#999", fontSize: 13, fontWeight: 400 }}>（设置知识库的查看权限和上传权限）</span>
          </div>
          <Divider style={{ margin: "0 0 16px" }} />

          <div className={styles.modalSection}>
            <Typography.Text className={styles.fieldHint} style={{ marginTop: 0, marginBottom: 8 }}>
              区委办公室可查看所有单位的知识库，无需额外配置
            </Typography.Text>

            <Form.Item name="visibility" required rules={[{ required: true, message: "请选择可见范围" }]}>
              <Radio.Group className={styles.visibilityGroup}>
                <Space size={12} style={{ width: "100%" }} className={styles.visibilityInline}>
                  {visibilityOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`${styles.visibilityCard} ${watchedVisibility === option.value ? styles.visibilityCardActive : ""}`}
                    >
                      <Radio value={option.value} className={styles.visibilityRadio}>
                        <div className={styles.visibilityTitle}>{option.title}</div>
                        <div className={styles.visibilityDesc}>{option.description}</div>
                      </Radio>
                    </div>
                  ))}
                </Space>
              </Radio.Group>
            </Form.Item>

            <Form.Item label="各单位具体的权限配置">
              <div className={styles.permissionTreeWrap}>
                <div className={styles.permissionTreeHeader}>
                  <span>单位名称</span>
                  <span>查看权限</span>
                  <span>上传权限</span>
                </div>
                <Tree
                  blockNode
                  defaultExpandAll
                  selectable={false}
                  treeData={permissionTreeData}
                  className={styles.permissionTree}
                />
                <Typography.Text className={styles.fieldHint}>
                  支持在组织树中按单位直接勾选查看/上传权限；与上方可见范围保持联动。
                </Typography.Text>
              </div>
            </Form.Item>

            <Form.Item
              name="reportRoles"
              label={
                <span>
                  <span style={{ color: "#ff4d4f", marginRight: 4 }}>*</span>
                  上传角色范围
                </span>
              }
            >
              <Select
                mode="multiple"
                allowClear
                placeholder="请选择上传角色"
                className={`${styles.modalInput} ${styles.roleSelect}`}
                options={reportRoleOptions}
              />
              <Typography.Text className={styles.fieldHint}>
                支持按角色配置上传权限，仅所选角色对应的用户可以进行文件上传。
              </Typography.Text>
            </Form.Item>

          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default KnowledgeBaseManagementPage;

