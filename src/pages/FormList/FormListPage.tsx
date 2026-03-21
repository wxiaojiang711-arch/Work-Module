import React, { useCallback, useMemo, useState } from "react";
import type { MenuProps, TableProps } from "antd";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  DatePicker,
  Dropdown,
  Empty,
  Input,
  message,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { Link, useNavigate, useParams } from "react-router-dom";

import styles from "../FileTemplateManagement/FileTemplateManagementPage.module.css";
import { categories, templateFormsMock, type TemplateCategory, type TemplateFormItem } from "../FileTemplateManagement/templateConstants";

const { RangePicker } = DatePicker;

type FormPermission = string;
type FormStatus = TemplateFormItem["status"];

interface FilterState {
  keyword: string;
  status: "全部" | FormStatus;
  permissions: FormPermission[];
  createdAtRange: [string, string] | null;
}

const initialFilters: FilterState = {
  keyword: "",
  status: "全部",
  permissions: [],
  createdAtRange: null,
};

const statusOptions = ["全部", "发布中", "草稿", "已结束"];
const permissionOptions = [
  "区大数据局",
  "区发改委",
  "区委办公室",
  "区文旅委",
  "区住建委",
  "区交通局",
  "区教育局",
  "区卫健委",
  "区市场监管局",
  "区生态环境局",
  "区人社局",
  "镇街A",
  "镇街B",
  "国企A",
  "国企B",
];

const statusColorMap: Record<FormStatus, string> = {
  发布中: "success",
  草稿: "processing",
  已结束: "default",
};

const getPermissionColor = (permission: string): string => {
  if (permission.startsWith("区")) {
    return "blue";
  }
  if (permission.startsWith("镇街")) {
    return "green";
  }
  if (permission.startsWith("国企")) {
    return "orange";
  }
  return "default";
};

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

interface FormListPageProps {
  categoryId?: TemplateCategory["id"];
}

const FormListPage: React.FC<FormListPageProps> = ({ categoryId: categoryIdProp }) => {
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

  const openInNewTab = useCallback((path: string) => {
    window.open(`${window.location.origin}${path}`, "_blank", "noopener,noreferrer");
  }, []);

  const displayList = useMemo(() => {
    const keyword = appliedFilters.keyword.trim().toLowerCase();

    return formList.filter((item) => {
      const matchKeyword =
        keyword.length === 0 ||
        item.name.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword);

      const matchStatus =
        appliedFilters.status === "全部" || item.status === appliedFilters.status;

      const matchPermissions =
        appliedFilters.permissions.length === 0 ||
        appliedFilters.permissions.some((department) => item.permissions.includes(department));

      const range = appliedFilters.createdAtRange;
      if (!range) {
        return matchKeyword && matchStatus && matchPermissions;
      }

      const createdDate = item.createdAt.slice(0, 10);
      return matchKeyword && matchStatus && matchPermissions && createdDate >= range[0] && createdDate <= range[1];
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

  const handleToggleStatus = useCallback(
    async (record: TemplateFormItem) => {
      setActionLoading(record.id, true);

      try {
        await wait(350);
        const nextStatus: FormStatus = record.status === "发布中" ? "草稿" : "发布中";
        setFormList((prev) =>
          prev.map((item) =>
            item.id === record.id
              ? { ...item, status: nextStatus, lastUpdated: dayjs().format("YYYY-MM-DD HH:mm:ss") }
              : item,
          ),
        );
        message.success(nextStatus === "发布中" ? "表单已发布" : "表单已暂停");
      } catch {
        message.error("状态切换失败，请稍后重试");
      } finally {
        setActionLoading(record.id, false);
      }
    },
    [setActionLoading],
  );

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

  const handleMoreAction = useCallback((key: string, record: TemplateFormItem) => {
    if (key === "copy") {
      message.success(`已复制表单：${record.name}`);
      return;
    }
    if (key === "export") {
      message.success(`已导出配置：${record.name}`);
      return;
    }
    if (key === "share") {
      message.success(`已生成分享链接：${record.name}`);
      return;
    }
    message.warning("暂不支持该操作");
  }, []);

  const columns: TableProps<TemplateFormItem>["columns"] = [
    {
      title: "文件名称",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      render: (_value, record) => (
        <Button type="link" className={styles.nameLink} onClick={() => openInNewTab(`/template/${categoryId}/form/preview/${record.id}`)}>
          {record.name}
        </Button>
      ),
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
    },
    {
      title: "创建人",
      dataIndex: "creator",
      key: "creator",
      width: 120,
    },
    {
      title: "表单权限",
      dataIndex: "permissions",
      key: "permissions",
      width: 200,
      render: (value: string[]) => (
        <Space size={4} wrap>
          {value.map((department) => (
            <Tag key={department} color={getPermissionColor(department)}>
              {department}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "填写次数",
      dataIndex: "submissionCount",
      key: "submissionCount",
      width: 120,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (value: FormStatus) => <Tag color={statusColorMap[value]}>{value}</Tag>,
    },
    {
      title: "操作",
      key: "actions",
      width: 430,
      fixed: "right",
      render: (_value, record) => {
        const moreMenu: MenuProps = {
          onClick: ({ key }) => handleMoreAction(String(key), record),
          items: [
            { key: "copy", label: "复制" },
            { key: "export", label: "导出配置" },
            { key: "share", label: "分享" },
          ],
        };

        return (
          <Space size={1} wrap className={styles.actionSpace}>
            <Button type="link" className={styles.actionBtn} onClick={() => navigateTo(`/template/${categoryId}/form/edit/${record.id}`)}>
              编辑
            </Button>
            <Button type="link" className={styles.actionBtn} onClick={() => openInNewTab(`/template/${categoryId}/form/preview/${record.id}`)}>
              预览
            </Button>
            <Button type="link" className={styles.actionBtn} onClick={() => navigateTo(`/template/${categoryId}/form/data/${record.id}`)}>
              数据
            </Button>
            <Popconfirm
              title={record.status === "发布中" ? "确认暂停该表单吗？" : "确认发布该表单吗？"}
              okText="确认"
              cancelText="取消"
              onConfirm={() => handleToggleStatus(record)}
            >
              <Button type="link" className={styles.actionBtn} loading={Boolean(actionLoadingIds[record.id])}>
                {record.status === "发布中" ? "暂停" : "发布"}
              </Button>
            </Popconfirm>
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
            <Dropdown menu={moreMenu} trigger={["click"]}>
              <Button type="link" className={styles.actionBtn}>更多</Button>
            </Dropdown>
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

          <Row gutter={[12, 12]} align="middle" className={styles.filterRow}>
            <Col xs={24} sm={24} md={12} lg={8} xl={7}>
              <Input.Search
                allowClear
                value={filters.keyword}
                placeholder="请输入表单名称或描述"
                onChange={(e) => setFilters((prev) => ({ ...prev, keyword: e.target.value }))}
                onSearch={handleQuery}
              />
            </Col>

            <Col xs={24} sm={12} md={6} lg={4} xl={3}>
              <Select
                className={styles.fullWidth}
                value={filters.status}
                options={statusOptions.map((option) => ({ label: option, value: option }))}
                onChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
              />
            </Col>

            <Col xs={24} sm={12} md={6} lg={4} xl={4}>
              <Select
                mode="multiple"
                allowClear
                className={styles.fullWidth}
                value={filters.permissions}
                options={permissionOptions.map((option) => ({ label: option, value: option }))}
                placeholder="表单权限"
                onChange={(value) => setFilters((prev) => ({ ...prev, permissions: value as string[] }))}
              />
            </Col>

            <Col xs={24} sm={24} md={12} lg={6} xl={5}>
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
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={5}>
              <div className={styles.topActions}>
                <Space wrap>
                  <Button type="primary" loading={tableLoading} onClick={handleQuery}>
                    查询
                  </Button>
                  <Button onClick={handleReset}>重置</Button>
                  <Button type="primary" onClick={() => navigateTo(`/template/${categoryId}/form/create`)}>
                    创建表单
                  </Button>
                </Space>
              </div>
            </Col>
          </Row>

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
