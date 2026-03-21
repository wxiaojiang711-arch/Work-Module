import React, { useMemo, useState } from "react";
import {
  Breadcrumb,
  Button,
  Col,
  DatePicker,
  Dropdown,
  Input,
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
import type { MenuProps, TableColumnsType, TablePaginationConfig } from "antd";
import {
  EllipsisOutlined,
  FileExcelOutlined,
  FileImageOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  ReloadOutlined,
  SearchOutlined,
  UploadOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { Link, useLocation, useParams } from "react-router-dom";

import styles from "./KnowledgeBaseDetailPage.module.css";

type UpdateFrequency = "daily" | "weekly" | "monthly" | "irregular";

type FileType = "docx" | "xlsx" | "pdf" | "png" | "jpg" | "mp4";

interface FileAsset {
  id: string;
  fileName: string;
  fileType: FileType;
  description: string | null;
  sourceUnit: string;
  owner: string;
  updateFrequency: UpdateFrequency;
  issueDate: string;
  lastUpdated: string;
  visibility: string;
  kbType: "unit" | "theme";
  fileCategory: "doc" | "report" | "image" | "video" | "other";
}

const fileListMock: FileAsset[] = [
  {
    id: "file-001",
    fileName: "部门简介",
    fileType: "docx",
    description: "区大数据局部门职能及组织架构介绍",
    sourceUnit: "区大数据发展管理局",
    owner: "张三",
    updateFrequency: "irregular",
    issueDate: "2023-12-01 09:00:00",
    lastUpdated: "2026-03-16 14:20:35",
    visibility: "组织内公开",
    kbType: "unit",
    fileCategory: "doc",
  },
  {
    id: "file-002",
    fileName: "工作体系架构图",
    fileType: "png",
    description: null,
    sourceUnit: "区大数据发展管理局",
    owner: "张三",
    updateFrequency: "irregular",
    issueDate: "2023-11-15 10:30:00",
    lastUpdated: "2026-03-15 18:05:22",
    visibility: "组织内公开",
    kbType: "unit",
    fileCategory: "image",
  },
  {
    id: "file-003",
    fileName: "核心业务",
    fileType: "pdf",
    description: "数字政府核心业务流程及规范文档",
    sourceUnit: "区大数据发展管理局",
    owner: "赵刚",
    updateFrequency: "monthly",
    issueDate: "2023-10-20 14:15:00",
    lastUpdated: "2026-03-17 09:12:48",
    visibility: "组织内公开",
    kbType: "unit",
    fileCategory: "report",
  },
  {
    id: "file-004",
    fileName: "特色优势",
    fileType: "xlsx",
    description: null,
    sourceUnit: "区大数据发展管理局",
    owner: "李伟",
    updateFrequency: "weekly",
    issueDate: "2023-09-10 11:00:00",
    lastUpdated: "2026-03-12 11:30:17",
    visibility: "指定部门可见",
    kbType: "unit",
    fileCategory: "report",
  },
  {
    id: "file-005",
    fileName: "标志性成果打造情况",
    fileType: "docx",
    description: "2024年度标志性成果建设进展与成效汇总",
    sourceUnit: "区大数据发展管理局",
    owner: "刘洋",
    updateFrequency: "monthly",
    issueDate: "2023-08-25 08:45:00",
    lastUpdated: "2026-03-11 16:44:05",
    visibility: "组织内公开",
    kbType: "theme",
    fileCategory: "doc",
  },
];

const fileTypeIconMap: Record<FileType, { icon: React.ReactNode; color: string }> = {
  docx: { icon: <FileWordOutlined />, color: "#2b579a" },
  xlsx: { icon: <FileExcelOutlined />, color: "#217346" },
  pdf: { icon: <FilePdfOutlined />, color: "#d63b31" },
  png: { icon: <FileImageOutlined />, color: "#f5a623" },
  jpg: { icon: <FileImageOutlined />, color: "#f5a623" },
  mp4: { icon: <VideoCameraOutlined />, color: "#722ed1" },
};

const frequencyMap: Record<UpdateFrequency, { label: string; color: string }> = {
  daily: { label: "每天更新", color: "green" },
  weekly: { label: "每周更新", color: "blue" },
  monthly: { label: "每月更新", color: "orange" },
  irregular: { label: "不定期更新", color: "default" },
};

interface QueryState {
  kbType?: "unit" | "theme";
  visibility?: string;
  updateFrequency?: UpdateFrequency;
  sourceUnit?: string;
  dateRange: [string, string] | null;
  keyword: string;
}

const defaultQuery: QueryState = {
  kbType: undefined,
  visibility: undefined,
  updateFrequency: undefined,
  sourceUnit: undefined,
  dateRange: null,
  keyword: "",
};

const KnowledgeBaseDetailPage: React.FC = () => {
  const { kbId } = useParams<{ kbId: string }>();
  const location = useLocation() as {
    state?: {
      kbName?: string;
      kbType?: "unit" | "theme";
      unitCategory?: "department" | "town" | "soe";
      visibility?: string;
    };
  };

  const kbName = location.state?.kbName ?? `知识库-${kbId ?? ""}`;
  const kbType = location.state?.kbType ?? "unit";
  const unitCategory = location.state?.unitCategory;
  const visibilityText = location.state?.visibility ?? "组织内公开";

  const kbTypeTagMap = {
    "unit-department": { label: "单位库 - 部门", color: "blue" },
    "unit-town": { label: "单位库 - 镇街", color: "cyan" },
    "unit-soe": { label: "单位库 - 国企", color: "orange" },
    theme: { label: "主题库", color: "purple" },
  } as const;

  const kbTypeTagKey =
    kbType === "theme"
      ? "theme"
      : (`unit-${unitCategory ?? "department"}` as "unit-department" | "unit-town" | "unit-soe");

  const kbTypeTag = kbTypeTagMap[kbTypeTagKey];

  const [fileList, setFileList] = useState<FileAsset[]>(fileListMock);
  const [query, setQuery] = useState<QueryState>(defaultQuery);
  const [appliedQuery, setAppliedQuery] = useState<QueryState>(defaultQuery);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => `共 ${total} 条记录`,
  });

  const filteredList = useMemo(() => {
    const keyword = appliedQuery.keyword.trim().toLowerCase();

    return fileList.filter((item) => {
      const matchKbType = !appliedQuery.kbType || item.kbType === appliedQuery.kbType;
      const matchVisibility = !appliedQuery.visibility || item.visibility === appliedQuery.visibility;
      const matchFrequency = !appliedQuery.updateFrequency || item.updateFrequency === appliedQuery.updateFrequency;
      const matchSourceUnit = !appliedQuery.sourceUnit || item.sourceUnit === appliedQuery.sourceUnit;

      const matchDate =
        !appliedQuery.dateRange ||
        (item.lastUpdated.slice(0, 10) >= appliedQuery.dateRange[0] && item.lastUpdated.slice(0, 10) <= appliedQuery.dateRange[1]);

      const matchKeyword =
        !keyword ||
        item.fileName.toLowerCase().includes(keyword) ||
        (item.description?.toLowerCase().includes(keyword) ?? false);

      return (
        matchKbType &&
        matchVisibility &&
        matchFrequency &&
        matchSourceUnit &&
        matchDate &&
        matchKeyword
      );
    });
  }, [appliedQuery, fileList]);

  const columns: TableColumnsType<FileAsset> = [
    {
      title: "文件名",
      dataIndex: "fileName",
      key: "fileName",
      width: 360,
      render: (_value, record) => {
        const iconInfo = fileTypeIconMap[record.fileType];

        return (
          <div className={styles.fileCell}>
            <span style={{ color: iconInfo.color, fontSize: 16, marginTop: 2 }}>{iconInfo.icon}</span>
            <div className={styles.fileMeta}>
              <Button type="link" className={styles.fileNameBtn} onClick={() => message.info(`预览文件：${record.fileName}`)}>
                {record.fileName}
              </Button>
              {record.description ? <div className={styles.fileDesc}>{record.description}</div> : null}
            </div>
          </div>
        );
      },
    },
    { title: "数据来源单位", dataIndex: "sourceUnit", key: "sourceUnit", width: 180 },
    { title: "负责人", dataIndex: "owner", key: "owner", width: 100 },
    {
      title: "更新频率",
      dataIndex: "updateFrequency",
      key: "updateFrequency",
      width: 120,
      render: (value: UpdateFrequency) => <Tag color={frequencyMap[value].color}>{frequencyMap[value].label}</Tag>,
    },
    {
      title: "文件下发时间",
      dataIndex: "issueDate",
      key: "issueDate",
      sorter: (a, b) => dayjs(a.issueDate).valueOf() - dayjs(b.issueDate).valueOf(),
      width: 180,
    },
    {
      title: "最近更新时间",
      dataIndex: "lastUpdated",
      key: "lastUpdated",
      sorter: (a, b) => dayjs(a.lastUpdated).valueOf() - dayjs(b.lastUpdated).valueOf(),
      width: 180,
    },
    {
      title: "操作",
      key: "actions",
      width: 220,
      fixed: "right",
      render: (_value, record) => {
        const menuItems: MenuProps["items"] = [
          { key: "meta", label: "编辑元数据", onClick: () => message.info("编辑元数据（示例）") },
          { key: "version", label: "查看版本记录", onClick: () => message.info("查看版本记录（示例）") },
          { key: "relation", label: "建立关联", onClick: () => message.info("建立关联（示例）") },
          { key: "move", label: "移动到其他知识库", onClick: () => message.info("移动到其他知识库（示例）") },
          {
            key: "delete",
            danger: true,
            label: (
              <Popconfirm
                title="确认删除该文件吗？"
                okText="删除"
                cancelText="取消"
                onConfirm={() => {
                  setFileList((prev) => prev.filter((item) => item.id !== record.id));
                  message.success("已删除");
                }}
              >
                <span>删除</span>
              </Popconfirm>
            ),
          },
        ];

        return (
          <div className={styles.actions}>
            <Button type="link" onClick={() => message.info("预览（示例）")}>预览</Button>
            <Button type="link" onClick={() => message.success("下载任务已加入队列")}>下载</Button>
            <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
              <Button type="link" icon={<EllipsisOutlined />} />
            </Dropdown>
          </div>
        );
      },
    },
  ];

  return (
    <div className={styles.page}>
      <Breadcrumb
        className={styles.breadcrumb}
        items={[
          { title: <Link to="/knowledge/base-management">知识库管理</Link> },
          { title: <Link to="/knowledge/base-management">{kbType === "unit" ? "单位库" : "主题库"}</Link> },
          { title: kbName },
        ]}
      />

      <Space align="center" style={{ marginBottom: 16 }}>
        <Typography.Title level={5} style={{ marginBottom: 0 }}>
          {kbName}
        </Typography.Title>
        <Tag color={kbTypeTag.color}>{kbTypeTag.label}</Tag>
        <Tag color="green">{visibilityText}</Tag>
      </Space>

      <div className={styles.filterWrap}>
        <div style={{ maxWidth: 1800 }}>
        <Row gutter={[12, 12]}>
          <Col span={3}>
            <Select
              allowClear
              size="middle"
              placeholder="知识库类型"
              value={query.kbType}
              style={{ width: "100%" }}
              options={[
                { label: "全部", value: undefined },
                { label: "单位库", value: "unit" },
                { label: "主题库", value: "theme" },
              ]}
              onChange={(value) => setQuery((prev) => ({ ...prev, kbType: value }))}
            />
          </Col>
          <Col span={3}>
            <Select
              allowClear
              size="middle"
              placeholder="公开方式"
              value={query.visibility}
              style={{ width: "100%" }}
              options={[
                { label: "全部", value: undefined },
                { label: "组织内公开", value: "组织内公开" },
                { label: "指定部门可见", value: "指定部门可见" },
                { label: "仅本人可见", value: "仅本人可见" },
              ]}
              onChange={(value) => setQuery((prev) => ({ ...prev, visibility: value }))}
            />
          </Col>
          <Col span={3}>
            <Select
              allowClear
              size="middle"
              placeholder="更新频率"
              value={query.updateFrequency}
              style={{ width: "100%" }}
              options={[
                { label: "全部", value: undefined },
                { label: "每天更新", value: "daily" },
                { label: "每周更新", value: "weekly" },
                { label: "每月更新", value: "monthly" },
                { label: "不定期更新", value: "irregular" },
              ]}
              onChange={(value) => setQuery((prev) => ({ ...prev, updateFrequency: value }))}
            />
          </Col>
          <Col span={4}>
            <Select
              showSearch
              allowClear
              size="middle"
              placeholder="数据来源单位"
              value={query.sourceUnit}
              style={{ width: "100%" }}
              options={[
                { label: "全部", value: undefined },
                { label: "区大数据发展管理局", value: "区大数据发展管理局" },
                { label: "区发改委", value: "区发改委" },
                { label: "镇街A", value: "镇街A" },
                { label: "国企B", value: "国企B" },
              ]}
              onChange={(value) => setQuery((prev) => ({ ...prev, sourceUnit: value }))}
            />
          </Col>
          <Col span={4}>
            <DatePicker.RangePicker
              size="middle"
              style={{ width: "100%" }}
              placeholder={["开始日期", "结束日期"]}
              onChange={(value) => {
                const start = value?.[0]?.format("YYYY-MM-DD");
                const end = value?.[1]?.format("YYYY-MM-DD");
                if (!start || !end) {
                  setQuery((prev) => ({ ...prev, dateRange: null }));
                  return;
                }
                setQuery((prev) => ({ ...prev, dateRange: [start, end] }));
              }}
            />
          </Col>
          <Col span={4}>
            <Input.Search
              size="middle"
              value={query.keyword}
              placeholder="文件名、摘要、关键词"
              enterButton="搜索"
              onChange={(event) => setQuery((prev) => ({ ...prev, keyword: event.target.value }))}
              onSearch={() => setAppliedQuery(query)}
            />
          </Col>
          <Col span={3}>
            <Space>
              <Button type="primary" icon={<SearchOutlined />} onClick={() => setAppliedQuery(query)}>查询</Button>
              <Button
                onClick={() => {
                  setQuery(defaultQuery);
                  setAppliedQuery(defaultQuery);
                }}
              >
                重置
              </Button>
            </Space>
          </Col>
        </Row>
        </div>
      </div>

      <Row justify="space-between" align="middle" className={styles.operationBar}>
        <Col>
          <Space>
            <Button type="primary" icon={<UploadOutlined />}>上传文件</Button>
            {selectedRowKeys.length > 0 ? (
              <>
                <Button danger onClick={() => message.info(`批量删除 ${selectedRowKeys.length} 条（示例）`)}>批量删除</Button>
                <Button onClick={() => message.info(`批量下载 ${selectedRowKeys.length} 条（示例）`)}>批量下载</Button>
                <Button onClick={() => message.info(`批量移动 ${selectedRowKeys.length} 条（示例）`)}>批量移动</Button>
              </>
            ) : null}
          </Space>
        </Col>

        <Col>
          <Space>
            <Typography.Text type="secondary">共 {filteredList.length} 条记录</Typography.Text>
            <Tooltip title="刷新">
              <Button icon={<ReloadOutlined />} onClick={() => message.success("已刷新")} />
            </Tooltip>
          </Space>
        </Col>
      </Row>

      <Table<FileAsset>
        rowKey="id"
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        columns={columns}
        dataSource={filteredList}
        scroll={{ x: 1500 }}
        pagination={pagination}
        locale={{ emptyText: "暂无文件，请点击上方“上传文件”按钮添加" }}
        onChange={(nextPagination) => setPagination(nextPagination)}
      />
    </div>
  );
};

export default KnowledgeBaseDetailPage;

