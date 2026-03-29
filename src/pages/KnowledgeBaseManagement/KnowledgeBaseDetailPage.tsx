import React, { useMemo, useRef, useState } from "react";
import {
  Alert,
  Breadcrumb,
  Button,
  Col,
  DatePicker,
  Input,
  Modal,
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
import type { TableColumnsType, TablePaginationConfig } from "antd";
import {
  FileExcelOutlined,
  FileImageOutlined,
  FilePdfOutlined,
  FilePptOutlined,
  FileUnknownOutlined,
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

type UploadStatus = "pending" | "uploading" | "success" | "error";

type GovernanceStatus = "pending" | "processing" | "success" | "failed";

interface FileAsset {
  id: string;
  fileName: string;
  fileType: FileType;
  description: string | null;
  sourceUnit: string;
  reporter: string;
  reportTime: string;
  updateFrequency: UpdateFrequency;
  issueDate: string;
  lastUpdated: string;
  visibility: string;
  kbType: "unit" | "theme";
  fileCategory: "work_report" | "meeting_minutes";
  governanceStatus: GovernanceStatus;
}

interface UploadItem {
  id: string;
  file: File;
  name: string;
  sizeText: string;
  status: UploadStatus;
  progress: number;
  error?: string;
}

const fileListMock: FileAsset[] = [
  {
    id: "file-001",
    fileName: "部门简介",
    fileType: "docx",
    description: "区大数据局部门职能及组织架构介绍",
    sourceUnit: "区大数据发展管理局",
    reporter: "张三",
    reportTime: "2026-03-16 14:20:35",
    updateFrequency: "irregular",
    issueDate: "2023-12-01 09:00:00",
    lastUpdated: "2026-03-16 14:20:35",
    visibility: "组织内公开",
    kbType: "unit",
    fileCategory: "work_report",
    governanceStatus: "success",
  },
  {
    id: "file-002",
    fileName: "工作体系架构图",
    fileType: "png",
    description: null,
    sourceUnit: "区大数据发展管理局",
    reporter: "张三",
    reportTime: "2026-03-15 18:05:22",
    updateFrequency: "irregular",
    issueDate: "2023-11-15 10:30:00",
    lastUpdated: "2026-03-15 18:05:22",
    visibility: "组织内公开",
    kbType: "unit",
    fileCategory: "meeting_minutes",
    governanceStatus: "processing",
  },
  {
    id: "file-003",
    fileName: "核心业务",
    fileType: "pdf",
    description: "数字政府核心业务流程及规范文档",
    sourceUnit: "区大数据发展管理局",
    reporter: "赵刚",
    reportTime: "2026-03-17 09:12:48",
    updateFrequency: "monthly",
    issueDate: "2023-10-20 14:15:00",
    lastUpdated: "2026-03-17 09:12:48",
    visibility: "组织内公开",
    kbType: "unit",
    fileCategory: "work_report",
    governanceStatus: "pending",
  },
  {
    id: "file-004",
    fileName: "特色优势",
    fileType: "xlsx",
    description: null,
    sourceUnit: "区大数据发展管理局",
    reporter: "李伟",
    reportTime: "2026-03-12 11:30:17",
    updateFrequency: "weekly",
    issueDate: "2023-09-10 11:00:00",
    lastUpdated: "2026-03-12 11:30:17",
    visibility: "指定部门可见",
    kbType: "unit",
    fileCategory: "meeting_minutes",
    governanceStatus: "failed",
  },
  {
    id: "file-005",
    fileName: "标志性成果打造情况",
    fileType: "docx",
    description: "2024年度标志性成果建设进展与成效汇总",
    sourceUnit: "区大数据发展管理局",
    reporter: "刘洋",
    reportTime: "2026-03-11 16:44:05",
    updateFrequency: "monthly",
    issueDate: "2023-08-25 08:45:00",
    lastUpdated: "2026-03-11 16:44:05",
    visibility: "组织内公开",
    kbType: "theme",
    fileCategory: "work_report",
    governanceStatus: "success",
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

const categoryLabelMap: Record<FileAsset["fileCategory"], string> = {
  work_report: "工作汇报",
  meeting_minutes: "会议纪要",
};

const governanceStatusMap: Record<GovernanceStatus, { label: string; color: string }> = {
  pending: { label: "未处理", color: "default" },
  processing: { label: "处理中", color: "blue" },
  success: { label: "已完成", color: "green" },
  failed: { label: "失败", color: "red" },
};

interface QueryState {
  sourceUnit?: string;
  reporter?: string;
  category?: FileAsset["fileCategory"];
  dateRange: [string, string] | null;
  keyword: string;
}

const defaultQuery: QueryState = {
  sourceUnit: undefined,
  reporter: undefined,
  category: undefined,
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

  const categorySeed = [
    { label: "政策文件", value: "政策文件" },
    { label: "工作汇报", value: "工作汇报" },
    { label: "会议纪要", value: "会议纪要" },
    { label: "图片资料", value: "图片资料" },
  ];

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
  const reporterOptions = [
    { label: "张三", value: "张三" },
    { label: "赵刚", value: "赵刚" },
    { label: "李伟", value: "李伟" },
    { label: "刘洋", value: "刘洋" },
  ];
  const [query, setQuery] = useState<QueryState>(defaultQuery);
  const [appliedQuery, setAppliedQuery] = useState<QueryState>(defaultQuery);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadItems, setUploadItems] = useState<UploadItem[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [categoryOptions, setCategoryOptions] = useState(categorySeed);
  const [categoryValue, setCategoryValue] = useState<string | undefined>(undefined);
  const [categorySearch, setCategorySearch] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const uploadTimers = useRef<Record<string, number>>({});
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
      const matchSourceUnit = !appliedQuery.sourceUnit || item.sourceUnit === appliedQuery.sourceUnit;
      const matchReporter = !appliedQuery.reporter || item.reporter.includes(appliedQuery.reporter);
      const matchCategory = !appliedQuery.category || item.fileCategory === appliedQuery.category;

      const matchDate =
        !appliedQuery.dateRange ||
        (item.reportTime.slice(0, 10) >= appliedQuery.dateRange[0] && item.reportTime.slice(0, 10) <= appliedQuery.dateRange[1]);

      const matchKeyword =
        !keyword ||
        item.fileName.toLowerCase().includes(keyword) ||
        (item.description?.toLowerCase().includes(keyword) ?? false);

      return matchSourceUnit && matchReporter && matchCategory && matchDate && matchKeyword;
    });
  }, [appliedQuery, fileList]);

  const kbTypeLabel = kbType === "theme" ? "主题库" : "单位库";

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  const acceptedExts = [
    "pdf",
    "doc",
    "docx",
    "xls",
    "xlsx",
    "ppt",
    "pptx",
    "jpg",
    "jpeg",
    "png",
    "gif",
  ];

  const getFileExt = (name: string) => {
    const parts = name.split(".");
    if (parts.length < 2) return "";
    return parts[parts.length - 1].toLowerCase();
  };

  const getFileIcon = (fileName: string) => {
    const ext = getFileExt(fileName);
    if (ext === "pdf") return { icon: <FilePdfOutlined />, color: "#f5222d" };
    if (ext === "doc" || ext === "docx") return { icon: <FileWordOutlined />, color: "#2b5cd6" };
    if (ext === "xls" || ext === "xlsx") return { icon: <FileExcelOutlined />, color: "#52c41a" };
    if (ext === "ppt" || ext === "pptx") return { icon: <FilePptOutlined />, color: "#fa8c16" };
    if (["jpg", "jpeg", "png", "gif"].includes(ext)) return { icon: <FileImageOutlined />, color: "#722ed1" };
    return { icon: <FileUnknownOutlined />, color: "#8c8c8c" };
  };

  const resetUploadForm = () => {
    setUploadItems([]);
    setUploadError(null);
    setCategoryOptions(categorySeed);
    setCategoryValue(undefined);
    setCategorySearch("");
    setDragActive(false);
    setIsUploading(false);
  };

  const openUploadModal = () => {
    resetUploadForm();
    setUploadOpen(true);
  };

  const closeUploadModal = () => {
    Object.values(uploadTimers.current).forEach((timer) => window.clearInterval(timer));
    uploadTimers.current = {};
    setUploadOpen(false);
  };

  const validateAndAppendFiles = (files: FileList | File[]) => {
    const list = Array.from(files);
    if (!list.length) return;

    let errorMessage: string | null = null;

    setUploadItems((prev) => {
      const next = [...prev];

      list.forEach((file) => {
        const ext = getFileExt(file.name);
        const isSupported = acceptedExts.includes(ext);
        const isTooLarge = file.size > 100 * 1024 * 1024;
        const isDuplicate = next.some(
          (item) =>
            item.file.name === file.name &&
            item.file.size === file.size &&
            item.file.lastModified === file.lastModified
        );

        if (!isSupported) {
          errorMessage = "该文件格式不支持，请选择支持的格式";
          return;
        }
        if (isTooLarge) {
          errorMessage = "文件大小超过100MB，请选择较小的文件";
          return;
        }
        if (isDuplicate) {
          errorMessage = "该文件已选择，请勿重复选择";
          return;
        }

        next.push({
          id: `${file.name}-${file.size}-${file.lastModified}`,
          file,
          name: file.name,
          sizeText: formatFileSize(file.size),
          status: "pending",
          progress: 0,
        });
      });

      return next;
    });

    if (errorMessage) {
      setUploadError(errorMessage);
    } else {
      setUploadError(null);
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      validateAndAppendFiles(event.target.files);
    }
    event.target.value = "";
  };

  const handleDeleteUploadItem = (id: string) => {
    setUploadItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCategoryEnter = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" || !categorySearch.trim()) return;
    const trimmed = categorySearch.trim();
    if (!categoryOptions.some((opt) => opt.value === trimmed)) {
      setCategoryOptions((prev) => [...prev, { label: trimmed, value: trimmed }]);
    }
    setCategoryValue(trimmed);
    setCategorySearch("");
  };

  const startUploadForItem = (id: string) => {
    let progress = 0;
    setUploadItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "uploading", progress: 0, error: undefined } : item
      )
    );

    const timer = window.setInterval(() => {
      progress = Math.min(100, progress + Math.floor(Math.random() * 14) + 6);
      setUploadItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                progress,
                status: progress >= 100 ? "success" : "uploading",
              }
            : item
        )
      );

      if (progress >= 100) {
        window.clearInterval(timer);
        delete uploadTimers.current[id];
      }
    }, 350);

    uploadTimers.current[id] = timer;
  };

  const handleSubmitUpload = () => {
    if (uploadItems.length === 0) {
      setUploadError("请至少选择一个文件");
      return;
    }
    setUploadError(null);
    setIsUploading(true);

    uploadItems.forEach((item) => startUploadForItem(item.id));

    const checkDone = window.setInterval(() => {
      setUploadItems((prev) => {
        const allDone = prev.length > 0 && prev.every((item) => item.status === "success");
        if (allDone) {
          window.clearInterval(checkDone);
          setIsUploading(false);
          message.success("上传完成，已刷新文件列表");
          closeUploadModal();
        }
        return prev;
      });
    }, 500);
  };

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
    {
      title: "文件分类",
      dataIndex: "fileCategory",
      key: "fileCategory",
      width: 120,
      render: (value: FileAsset["fileCategory"]) => categoryLabelMap[value] ?? "其他",
    },
    {
      title: "数据治理状态",
      dataIndex: "governanceStatus",
      key: "governanceStatus",
      width: 140,
      render: (value: GovernanceStatus) => {
        const status = governanceStatusMap[value];
        return <Tag color={status.color}>{status.label}</Tag>;
      },
    },
    { title: "文件来源单位", dataIndex: "sourceUnit", key: "sourceUnit", width: 180 },
    { title: "上报人", dataIndex: "reporter", key: "reporter", width: 100 },
    {
      title: "上报时间",
      dataIndex: "reportTime",
      key: "reportTime",
      sorter: (a, b) => dayjs(a.reportTime).valueOf() - dayjs(b.reportTime).valueOf(),
      width: 180,
    },
    {
      title: "操作",
      key: "actions",
      width: 220,
      fixed: "right",
      render: (_value, record) => {
        return (
          <div className={styles.actions}>
            <Button type="link" onClick={() => message.info("预览（示例）")}>预览</Button>
            <Button type="link" onClick={() => message.success("下载任务已加入队列")}>下载</Button>
            <Popconfirm
              title="确认删除该文件吗？"
              okText="删除"
              cancelText="取消"
              onConfirm={() => {
                setFileList((prev) => prev.filter((item) => item.id !== record.id));
                message.success("已删除");
              }}
            >
              <Button type="link" danger>删除</Button>
            </Popconfirm>
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
        <Row gutter={[0, 12]} style={{ columnGap: 24 }}>
          <Col span={4}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ whiteSpace: "nowrap" }}>文件名：</span>
              <Input
                size="middle"
                value={query.keyword}
                placeholder="请输入文件名关键词"
                onChange={(event) => setQuery((prev) => ({ ...prev, keyword: event.target.value }))}
                onPressEnter={() => setAppliedQuery(query)}
              />
            </div>
          </Col>
          <Col span={3}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ whiteSpace: "nowrap" }}>文件分类：</span>
              <Select
                allowClear
                size="middle"
                placeholder="请选择文件分类"
                value={query.category}
                style={{ width: "100%" }}
                options={[
                  { label: "全部", value: undefined },
                  { label: "工作汇报", value: "work_report" },
                  { label: "会议纪要", value: "meeting_minutes" },
                ]}
                onChange={(value) => setQuery((prev) => ({ ...prev, category: value }))}
              />
            </div>
          </Col>
          <Col span={4}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ whiteSpace: "nowrap" }}>文件来源单位：</span>
              <Select
                showSearch
                allowClear
                size="middle"
                placeholder="请选择文件来源单位"
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
            </div>
          </Col>
          <Col span={3}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ whiteSpace: "nowrap" }}>上报人：</span>
              <Select
                showSearch
                allowClear
                size="middle"
                value={query.reporter}
                placeholder="请选择上报人"
                style={{ width: "100%" }}
                options={[{ label: "全部", value: undefined }, ...reporterOptions]}
                onChange={(value) => setQuery((prev) => ({ ...prev, reporter: value }))}
              />
            </div>
          </Col>
          <Col span={5}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ whiteSpace: "nowrap" }}>上报时间：</span>
              <DatePicker.RangePicker
                size="middle"
                style={{ width: "100%" }}
                placeholder={["上报开始", "上报结束"]}
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
            </div>
          </Col>
          <Col flex="auto" style={{ textAlign: "right" }}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
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
            </div>
          </Col>
        </Row>
        </div>
      </div>

      <Row justify="space-between" align="middle" className={styles.operationBar}>
        <Col>
          <Space>
            <Button type="primary" icon={<UploadOutlined />} onClick={openUploadModal}>上传文件</Button>
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

      <Modal
        open={uploadOpen}
        title="上传文件"
        centered
        width={700}
        footer={null}
        onCancel={closeUploadModal}
        className={styles.uploadModal}
      >
        <div className={styles.uploadBody}>
          <div className={styles.kbInfoCard}>
            <div className={styles.kbInfoRow}>知识库名称：{kbName}</div>
            <div className={styles.kbInfoRow}>知识库类型：{kbTypeLabel}</div>
            <div className={styles.kbInfoRow}>可见范围：{visibilityText}</div>
          </div>

          <div className={styles.formBlock}>
            <div className={styles.fieldLabel}>
              <span className={styles.required}>*</span> 选择文件
            </div>
            <div
              className={`${styles.uploadArea} ${dragActive ? styles.uploadAreaActive : ""}`}
              role="presentation"
              onClick={() => document.getElementById("kb-upload-input")?.click()}
              onDragOver={(event) => {
                event.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(event) => {
                event.preventDefault();
                setDragActive(false);
                if (event.dataTransfer.files) {
                  validateAndAppendFiles(event.dataTransfer.files);
                }
              }}
            >
              <div className={styles.uploadIcon}>⭳</div>
              <div className={styles.uploadText}>点击或拖拽文件到此区域上传</div>
              <div className={styles.uploadHint}>支持 PDF、Word、Excel、图片等格式，单个文件不超过100MB</div>
              <input
                id="kb-upload-input"
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif"
                className={styles.hiddenInput}
                onChange={handleFileInputChange}
              />
            </div>
            {uploadError ? <div className={styles.fieldError}>{uploadError}</div> : null}
          </div>

          {uploadItems.length > 0 ? (
            <div className={styles.formBlock}>
              <div className={styles.sectionTitle}>已选文件</div>
              <div className={styles.uploadList}>
                {uploadItems.map((item) => {
                  const icon = getFileIcon(item.name);
                  const statusLabel =
                    item.status === "pending"
                      ? "待上传"
                      : item.status === "uploading"
                        ? `上传中 ${item.progress}%`
                        : item.status === "success"
                          ? "✓ 上传成功"
                          : "✗ 上传失败";
                  const statusClass =
                    item.status === "success"
                      ? styles.statusSuccess
                      : item.status === "error"
                        ? styles.statusError
                        : item.status === "uploading"
                          ? styles.statusUploading
                          : styles.statusPending;

                  return (
                    <div key={item.id} className={styles.uploadItem}>
                      <div className={styles.uploadItemMain}>
                        <div className={styles.uploadItemTitle}>
                          <span className={styles.fileIcon} style={{ color: icon.color }}>{icon.icon}</span>
                          <Tooltip title={item.name}>
                            <span className={styles.fileName}>{item.name}</span>
                          </Tooltip>
                        </div>
                        <div className={styles.uploadMetaRow}>
                          <span className={styles.fileSize}>{item.sizeText}</span>
                          <span className={statusClass}>{statusLabel}</span>
                        </div>
                        {item.status === "uploading" ? (
                          <div className={styles.progressRow}>
                            <div className={styles.progressBar}>
                              <div className={styles.progressFill} style={{ width: `${item.progress}%` }} />
                            </div>
                            <span className={styles.progressText}>{item.progress}%</span>
                          </div>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        className={styles.deleteBtn}
                        onClick={() => handleDeleteUploadItem(item.id)}
                        aria-label="删除文件"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className={styles.formBlock}>
            <div className={styles.fieldLabel}>文件分类</div>
            <Select
              showSearch
              allowClear
              placeholder="请选择文件分类"
              value={categoryValue}
              options={categoryOptions}
              onChange={(value) => setCategoryValue(value)}
              onSearch={(value) => setCategorySearch(value)}
              onInputKeyDown={handleCategoryEnter}
              className={styles.fullWidth}
            />
            <div className={styles.helpText}>为文件选择分类可以更好地组织和查找文件</div>
          </div>

          {uploadItems.some((item) => item.status === "error") ? (
            <Alert
              type="error"
              showIcon
              message="部分文件上传失败，请检查后重试"
              className={styles.alertBox}
            />
          ) : null}
        </div>

        <div className={styles.modalFooter}>
          <Button className={styles.cancelBtn} onClick={closeUploadModal} disabled={isUploading}>
            取消
          </Button>
          <Button type="primary" className={styles.uploadBtn} onClick={handleSubmitUpload} loading={isUploading}>
            上传
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default KnowledgeBaseDetailPage;


