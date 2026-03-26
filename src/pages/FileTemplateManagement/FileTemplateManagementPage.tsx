import React, { useCallback, useMemo, useState } from "react";
import type { MenuProps, TableProps } from "antd";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Dropdown,
  Input,
  message,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

import styles from "./FileTemplateManagementPage.module.css";
import type { FilterState, FormPermission, FormStatus, FormTemplateItem } from "./types";

const { RangePicker } = DatePicker;

const defaultData: FormTemplateItem[] = [
  {
    id: "form-001",
    name: "2024年度部门工作总结汇报",
    description: "收集各部门2024年度工作总结和计划",
    createdAt: "2024-01-15 10:30:00",
    creator: "张三",
    permissions: ["区大数据局", "区发改委"],
    submissionCount: 125,
    status: "发布中",
    lastUpdated: "2024-03-01 14:00:00",
  },
  {
    id: "form-002",
    name: "智慧城市建设需求调研",
    description: "面向市民和企业征集智慧城市建设意见",
    createdAt: "2023-11-20 09:00:00",
    creator: "李四",
    permissions: ["区发改委", "区文旅委"],
    submissionCount: 876,
    status: "已结束",
    lastUpdated: "2024-01-10 16:00:00",
  },
  {
    id: "form-003",
    name: "员工培训反馈收集",
    description: "收集培训后满意度和改进建议",
    createdAt: "2024-02-01 13:30:00",
    creator: "王五",
    permissions: ["区委办公室", "区大数据局"],
    submissionCount: 58,
    status: "草稿",
    lastUpdated: "2024-02-02 09:18:00",
  },
];

const decisionLibraryData: FormTemplateItem[] = [
  {
    id: "decision-001",
    name: "数字化转型决策方案",
    description: "企业数字化转型路径与实施方案",
    createdAt: "2024-02-10 09:00:00",
    creator: "赵六",
    permissions: ["区大数据局", "区发改委"],
    submissionCount: 45,
    status: "发布中",
    lastUpdated: "2024-03-15 10:30:00",
  },
  {
    id: "decision-002",
    name: "智慧政务服务优化建议",
    description: "基于用户反馈的政务服务流程优化方案",
    createdAt: "2024-01-25 14:20:00",
    creator: "孙七",
    permissions: ["区委办公室", "区大数据局"],
    submissionCount: 78,
    status: "发布中",
    lastUpdated: "2024-03-10 16:45:00",
  },
  {
    id: "decision-003",
    name: "数据安全管理策略",
    description: "数据分类分级与安全防护措施",
    createdAt: "2024-03-01 11:15:00",
    creator: "周八",
    permissions: ["区大数据局"],
    submissionCount: 23,
    status: "草稿",
    lastUpdated: "2024-03-05 09:30:00",
  },
];

const initialFilters: FilterState = {
  keyword: "",
  status: "全部",
  permissions: [],
  createdAtRange: null,
};

const statusOptions = ["全部", "发布中", "草稿", "已结束"];
const permissionOptions: FormPermission[] = ["区大数据局", "区发改委", "区委办公室", "区文旅委"];

const statusColorMap: Record<FormStatus, string> = {
  发布中: "success",
  草稿: "processing",
  已结束: "default",
};

const permissionColorMap: Record<FormPermission, string> = {
  区大数据局: "blue",
  区发改委: "green",
  区委办公室: "purple",
  区文旅委: "orange",
};

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

const FileTemplateManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [formList, setFormList] = useState<FormTemplateItem[]>(defaultData);
  const [decisionList, setDecisionList] = useState<FormTemplateItem[]>(decisionLibraryData);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(initialFilters);
  const [tableLoading, setTableLoading] = useState(false);
  const [decisionTableLoading, setDecisionTableLoading] = useState(false);
  const [actionLoadingIds, setActionLoadingIds] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<"form" | "decision">("form");

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

  const handleToggleStatus = useCallback(async (record: FormTemplateItem) => {
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
  }, [setActionLoading]);

  const handleDelete = useCallback(async (record: FormTemplateItem) => {
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
  }, [setActionLoading]);

  const handleMoreAction = useCallback((key: string, record: FormTemplateItem) => {
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

  const columns: TableProps<FormTemplateItem>["columns"] = [
    {
      title: "文件名称",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      render: (_value, record) => (
        <Button type="link" className={styles.nameLink} onClick={() => openInNewTab(`/form/preview/${record.id}`)}>
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
      width: 170,
      render: (value: FormPermission[]) => (
        <Space size={4} wrap>
          {value.map((department) => (
            <Tag key={department} color={permissionColorMap[department]}>
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
            <Button type="link" className={styles.actionBtn} onClick={() => navigateTo(`/form/edit/${record.id}`)}>
              编辑
            </Button>
            <Button type="link" className={styles.actionBtn} onClick={() => openInNewTab(`/form/preview/${record.id}`)}>
              预览
            </Button>
            <Button type="link" className={styles.actionBtn} onClick={() => navigateTo(`/form/data/${record.id}`)}>
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

  const currentList = activeTab === "form" ? displayList : decisionList;
  const currentLoading = activeTab === "form" ? tableLoading : decisionTableLoading;

  return (
    <div className={styles.page}>
      <div className={styles.tabContainer}>
        <div
          className={`${styles.tabItem} ${activeTab === "form" ? styles.tabItemActive : ""}`}
          onClick={() => setActiveTab("form")}
        >
          文件模板管理
        </div>
        <div
          className={`${styles.tabItem} ${activeTab === "decision" ? styles.tabItemActive : ""}`}
          onClick={() => setActiveTab("decision")}
        >
          决策库工作模块
        </div>
        <div className={styles.tabItem} style={{ visibility: "hidden" }}>
          占位
        </div>
      </div>

      <Card className={styles.card}>
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

          <Col xs={24} sm={12} md={6} lg={4} xl={4}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ whiteSpace: "nowrap" }}>表单权限：</span>
              <Select
                mode="multiple"
                allowClear
                className={styles.fullWidth}
                value={filters.permissions}
                options={permissionOptions.map((option) => ({ label: option, value: option }))}
                placeholder="表单权限"
                onChange={(value) =>
                  setFilters((prev) => ({ ...prev, permissions: value as FormPermission[] }))
                }
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

          <Col xs={24} sm={24} md={24} lg={24} xl={5}>
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

        <div style={{ marginBottom: 12 }}>
          <Button type="primary" onClick={() => navigateTo("/form/create")}>
            创建表单
          </Button>
        </div>

        <Table<FormTemplateItem>
          rowKey="id"
          columns={columns}
          dataSource={currentList}
          loading={currentLoading}
          scroll={{ x: 1200 }}
          locale={{ emptyText: activeTab === "form" ? "暂无表单数据，请先创建表单" : "暂无决策库数据" }}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            showTotal: (total) => `共 ${total} 条`,
            defaultPageSize: 10,
          }}
        />
      </Card>
    </div>
  );
};

export default FileTemplateManagementPage;

