import React, { useCallback, useMemo, useState } from "react";
import type { TableProps } from "antd";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  DatePicker,
  Empty,
  Input,
  message,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Typography,
} from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { Link, useNavigate, useParams } from "react-router-dom";

import styles from "../FileTemplateManagement/FileTemplateManagementPage.module.css";
import { categories, templateFormsMock, type TemplateCategory, type TemplateFormItem } from "../FileTemplateManagement/templateConstants";

const { RangePicker } = DatePicker;

type FormStatus = TemplateFormItem["status"];

interface FilterState {
  keyword: string;
  status: "全部" | FormStatus;
  createdAtRange: [string, string] | null;
}

const initialFilters: FilterState = {
  keyword: "",
  status: "全部",
  createdAtRange: null,
};

const statusOptions = ["全部", "发布中", "草稿", "已结束"];
const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

interface FormListPageProps {
  categoryId?: TemplateCategory["id"];
  hideHeader?: boolean;
}

const FormListPage: React.FC<FormListPageProps> = ({ categoryId: categoryIdProp, hideHeader = false }) => {
  const navigate = useNavigate();
  const { categoryId: categoryIdFromParams } = useParams<{ categoryId: TemplateCategory["id"] }>();
  const categoryId = categoryIdProp ?? categoryIdFromParams;

  const category = useMemo(
    () => categories.find((item) => item.id === categoryId),
    [categoryId],
  );

  const [formList, setFormList] = useState<TemplateFormItem[]>(
    templateFormsMock.filter((item) => item.categoryId === categoryId),
  );
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(initialFilters);
  const [tableLoading, setTableLoading] = useState(false);
  const [actionLoadingIds, setActionLoadingIds] = useState<Record<string, boolean>>({});
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [originalName, setOriginalName] = useState("");

  React.useEffect(() => {
    setFormList(templateFormsMock.filter((item) => item.categoryId === categoryId));
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
  }, [categoryId]);

  const setActionLoading = useCallback((id: string, loading: boolean) => {
    setActionLoadingIds((prev) => ({ ...prev, [id]: loading }));
  }, []);

  const navigateTo = useCallback(
    (path: string) => {
      navigate(path);
    },
    [navigate],
  );

  const goToEditPage = useCallback(
    (record: TemplateFormItem) => {
      const isDepartmentWorkModule =
        categoryId === "department" && record.name.includes("部门工作模块");
      if (isDepartmentWorkModule) {
        navigateTo(`/template/${categoryId}/form/create?preset=work-module`);
        return;
      }
      navigateTo(`/template/${categoryId}/form/edit/${record.id}`);
    },
    [categoryId, navigateTo],
  );

  const openInNewTab = useCallback((path: string) => {
    window.open(`${window.location.origin}${path}`, "_blank", "noopener,noreferrer");
  }, []);

  const handleCopyForm = useCallback((record: TemplateFormItem) => {
    const now = new Date();
    const newForm: TemplateFormItem = {
      ...record,
      id: `form-copy-${Date.now()}`,
      name: `${record.name} - 副本`,
      status: "草稿",
      submissionCount: 0,
      createdAt: now.toISOString().slice(0, 19).replace("T", " "),
      creator: "当前单位",
      lastUpdated: now.toISOString().slice(0, 19).replace("T", " "),
    };
    setFormList((prev) => [newForm, ...prev]);
    setEditingRowId(newForm.id);
    setEditingName(newForm.name);
    setOriginalName(record.name);
  }, []);

  const validateCopyName = useCallback(
    (name: string): string | null => {
      const trimmedName = name.trim();
      if (!trimmedName) {
        return "表单名称不能为空";
      }
      if (trimmedName === originalName) {
        return "复制表单的名称不能与原表单相同，请修改";
      }
      const isDuplicate = formList.some((item) => item.id !== editingRowId && item.name === trimmedName);
      if (isDuplicate) {
        return "该表单名称已存在，请重新输入";
      }
      return null;
    },
    [editingRowId, formList, originalName],
  );

  const handleSaveCopy = useCallback(() => {
    const error = validateCopyName(editingName);
    if (error) {
      message.error(error);
      return;
    }
    const trimmedName = editingName.trim();
    setFormList((prev) => prev.map((item) => (item.id === editingRowId ? { ...item, name: trimmedName } : item)));
    setEditingRowId(null);
    setEditingName("");
    setOriginalName("");
    message.success("复制表单已保存");
  }, [editingName, editingRowId, validateCopyName]);

  const handleCancelCopy = useCallback(() => {
    if (!editingRowId) {
      return;
    }
    setFormList((prev) => prev.filter((item) => item.id !== editingRowId));
    setEditingRowId(null);
    setEditingName("");
    setOriginalName("");
  }, [editingRowId]);

  const displayList = useMemo(() => {
    const keyword = appliedFilters.keyword.trim().toLowerCase();

    return formList.filter((item) => {
      const matchKeyword =
        keyword.length === 0 ||
        item.name.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword);

      const matchStatus =
        appliedFilters.status === "全部" || item.status === appliedFilters.status;

      const range = appliedFilters.createdAtRange;
      if (!range) {
        return matchKeyword && matchStatus;
      }

      const createdDate = item.createdAt.slice(0, 10);
      return matchKeyword && matchStatus && createdDate >= range[0] && createdDate <= range[1];
    });
  }, [appliedFilters, formList]);

  const handleQuery = useCallback(async () => {
    setTableLoading(true);
    await wait(300);
    setAppliedFilters(filters);
    setTableLoading(false);
  }, [filters]);

  const handleReset = useCallback(async () => {
    setFilters(initialFilters);
    setTableLoading(true);
    await wait(300);
    setAppliedFilters(initialFilters);
    setTableLoading(false);
  }, []);

  const handleDelete = useCallback(
    async (record: TemplateFormItem) => {
      setActionLoading(record.id, true);

      try {
        await wait(350);
        setFormList((prev) => prev.filter((item) => item.id !== record.id));
        message.success("表单删除成功");
      } catch {
        message.error("删除失败，请稍后重试");
      } finally {
        setActionLoading(record.id, false);
      }
    },
    [setActionLoading],
  );

  const columns: TableProps<TemplateFormItem>["columns"] = [
    {
      title: "文件名称",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      width: 380,
      render: (_value, record) => {
        if (record.id === editingRowId) {
          const hasError = Boolean(validateCopyName(editingName));
          return (
            <Input
              autoFocus
              value={editingName}
              status={hasError ? "error" : ""}
              onChange={(event) => setEditingName(event.target.value)}
              onPressEnter={handleSaveCopy}
            />
          );
        }
        return (
          <Button type="link" className={styles.nameLink} onClick={() => openInNewTab(`/template/${categoryId}/form/preview/${record.id}`)}>
            {record.name}
          </Button>
        );
      },
    },
    {
      title: "创建单位",
      dataIndex: "creator",
      key: "creator",
      width: 180,
    },
    {
      title: "填写次数",
      dataIndex: "submissionCount",
      key: "submissionCount",
      width: 120,
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
    },
    {
      title: "操作",
      key: "actions",
      width: 320,
      fixed: "right",
      render: (_value, record) => {
        const isDepartmentWorkModule =
          categoryId === "department" && record.name.includes("部门工作模块");
        if (record.id === editingRowId) {
          return (
            <Space size={0}>
              <Button
                type="link"
                icon={<CheckOutlined />}
                className={styles.actionBtn}
                style={{ color: "#52c41a" }}
                onClick={handleSaveCopy}
              >
                保存
              </Button>
              <Button
                type="link"
                icon={<CloseOutlined />}
                className={styles.actionBtn}
                onClick={handleCancelCopy}
              >
                取消
              </Button>
            </Space>
          );
        }

        return (
          <Space size={1} wrap className={styles.actionSpace}>
            <Button type="link" className={styles.actionBtn} onClick={() => goToEditPage(record)}>
              编辑
            </Button>
            <Button type="link" className={styles.actionBtn} onClick={() => openInNewTab(`/template/${categoryId}/form/preview/${record.id}`)}>
              预览
            </Button>
            {isDepartmentWorkModule ? (
              <Button danger type="link" className={styles.actionBtn} disabled>
                删除
              </Button>
            ) : (
              <Popconfirm
                title="确认删除该表单吗？删除后不可恢复。"
                okText="删除"
                cancelText="取消"
                onConfirm={() => handleDelete(record)}
              >
                <Button danger type="link" className={styles.actionBtn} loading={Boolean(actionLoadingIds[record.id])}>
                  删除
                </Button>
              </Popconfirm>
            )}
            <Button type="link" className={styles.actionBtn} onClick={() => handleCopyForm(record)}>
              复制模板
            </Button>
          </Space>
        );
      },
    },
  ];

  if (!category) {
    return (
      <div className={styles.page}>
        <Card>
          <Empty description="未找到对应分类" />
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Card className={styles.card}>
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          {!hideHeader && (
            <div>
              <Breadcrumb
                items={[
                  { title: <Link to="/template">文件模板管理</Link> },
                  { title: category.title },
                ]}
              />
              <Typography.Title level={5} style={{ margin: "12px 0 0" }}>
                {category.title} - 表单列表
              </Typography.Title>
            </div>
          )}

          <Row gutter={[12, 12]} align="middle" className={styles.filterRow}>
            <Col xs={24} sm={24} md={12} lg={8} xl={7}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ whiteSpace: "nowrap" }}>关键词：</span>
                <Input.Search
                  allowClear
                  value={filters.keyword}
                  placeholder="请输入表单名称或描述"
                  onChange={(e) => setFilters((prev) => ({ ...prev, keyword: e.target.value }))}
                  onSearch={handleQuery}
                />
              </div>
            </Col>

            <Col xs={24} sm={12} md={6} lg={4} xl={3}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ whiteSpace: "nowrap" }}>状态：</span>
                <Select
                  className={styles.fullWidth}
                  value={filters.status}
                  options={statusOptions.map((option) => ({ label: option, value: option }))}
                  onChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
                />
              </div>
            </Col>

            <Col xs={24} sm={24} md={12} lg={6} xl={5}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ whiteSpace: "nowrap" }}>创建时间：</span>
                <RangePicker
                  className={styles.fullWidth}
                  format="YYYY-MM-DD"
                  value={
                    filters.createdAtRange
                      ? [dayjs(filters.createdAtRange[0], "YYYY-MM-DD"), dayjs(filters.createdAtRange[1], "YYYY-MM-DD")]
                      : null
                  }
                  onChange={(dates) => {
                    const start = dates?.[0];
                    const end = dates?.[1];

                    if (!start || !end) {
                      setFilters((prev) => ({ ...prev, createdAtRange: null }));
                      return;
                    }

                    setFilters((prev) => ({
                      ...prev,
                      createdAtRange: [start.format("YYYY-MM-DD"), end.format("YYYY-MM-DD")],
                    }));
                  }}
                />
              </div>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={9}>
              <div className={styles.topActions}>
                <Space wrap>
                  <Button type="primary" loading={tableLoading} onClick={handleQuery}>
                    查询
                  </Button>
                  <Button onClick={handleReset}>重置</Button>
                </Space>
              </div>
            </Col>
          </Row>

          <div>
            <Button type="primary" onClick={() => navigateTo(`/template/${categoryId}/form/create`)}>
              创建表单
            </Button>
          </div>

          <Table<TemplateFormItem>
            rowKey="id"
            columns={columns}
            dataSource={displayList}
            loading={tableLoading}
            scroll={{ x: 1300 }}
            locale={{ emptyText: "当前分类暂无表单数据" }}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              pageSizeOptions: ["10", "20", "50", "100"],
              showTotal: (total) => `共 ${total} 条`,
              defaultPageSize: 10,
            }}
          />
        </Space>
      </Card>
    </div>
  );
};

export default FormListPage;

