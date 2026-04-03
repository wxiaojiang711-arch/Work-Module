import React, { useMemo, useState } from "react";
import {
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
  Typography,
  Upload,
  message,
} from "antd";
import type { TableColumnsType, TablePaginationConfig } from "antd";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import {
  FileExcelOutlined,
  FileImageOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  InboxOutlined,
  ReloadOutlined,
  SearchOutlined,
  UploadOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { Link, useLocation, useParams } from "react-router-dom";

import styles from "./KnowledgeBaseDetailPage.module.css";
import { knowledgeBaseFileListMock, type KnowledgeBaseFileAsset } from "./knowledgeBaseMockData";

type UpdateFrequency = "daily" | "weekly" | "monthly" | "irregular";

type FileType = "docx" | "xlsx" | "pdf" | "png" | "jpg" | "mp4";

type GovernanceStatus = "pending" | "processing" | "success";

type FileAsset = KnowledgeBaseFileAsset;


interface QueryState {
  sourceUnit?: string;
  reporter?: string;
  category?: FileAsset["fileCategory"];
  dateRange: [string, string] | null;
  keyword: string;
}

const fileListMock: FileAsset[] = knowledgeBaseFileListMock;

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
};

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
  const [uploadFileList, setUploadFileList] = useState<UploadFile[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [categoryOptions, setCategoryOptions] = useState(categorySeed);
  const [categoryValue, setCategoryValue] = useState<string | undefined>(undefined);
  const [categorySearch, setCategorySearch] = useState("");
  const [isUploading, setIsUploading] = useState(false);
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

  const resetUploadForm = () => {
    setUploadFileList([]);
    setUploadError(null);
    setCategoryOptions(categorySeed);
    setCategoryValue(undefined);
    setCategorySearch("");
    setIsUploading(false);
  };

  const openUploadModal = () => {
    resetUploadForm();
    setUploadOpen(true);
  };

  const closeUploadModal = () => {
    setUploadOpen(false);
  };

  const beforeUpload: UploadProps["beforeUpload"] = (file) => {
    const ext = getFileExt(file.name);
    const isSupported = acceptedExts.includes(ext);
    const isTooLarge = file.size > 100 * 1024 * 1024;
    const isDuplicate = uploadFileList.some(
      (item) =>
        item.name === file.name &&
        item.size === file.size &&
        item.lastModified === file.lastModified
    );

    if (!isSupported) {
      setUploadError("该文件格式不支持，请选择支持的格式");
      return Upload.LIST_IGNORE;
    }
    if (isTooLarge) {
      setUploadError("文件大小超过100MB，请选择较小的文件");
      return Upload.LIST_IGNORE;
    }
    if (isDuplicate) {
      setUploadError("该文件已选择，请勿重复选择");
      return Upload.LIST_IGNORE;
    }
    setUploadError(null);
    return false;
  };

  const handleUploadChange: UploadProps["onChange"] = ({ fileList }) => {
    setUploadFileList(fileList);
  };

  const handleCategoryEnter: React.KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event) => {
    if (event.key !== "Enter" || !categorySearch.trim()) return;
    const trimmed = categorySearch.trim();
    if (!categoryOptions.some((opt) => opt.value === trimmed)) {
      setCategoryOptions((prev) => [...prev, { label: trimmed, value: trimmed }]);
    }
    setCategoryValue(trimmed);
    setCategorySearch("");
  };

  const handleSubmitUpload = () => {
    if (uploadFileList.length === 0) {
      setUploadError("请至少选择一个文件");
      return;
    }
    setUploadError(null);
    setIsUploading(true);
    window.setTimeout(() => {
      setIsUploading(false);
      message.success("上传完成，已刷新文件列表");
      closeUploadModal();
    }, 600);
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
        const status = governanceStatusMap[value] ?? governanceStatusMap.pending;
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

        <Col />
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
          {kbType === "theme" ? (
            <div className={styles.kbNotice}>
              注：上传至主题库的文件将同步至对应单位库；后续若删除主题库内文件，不影响单位库文件。
            </div>
          ) : null}
          <div className={styles.kbInfoCard}>
            <div className={styles.kbInfoRow}>知识库名称：{kbName}</div>
            <div className={styles.kbInfoRow}>知识库类型：{kbTypeLabel}</div>
            <div className={styles.kbInfoRow}>可见范围：{visibilityText}</div>
          </div>

          <div className={styles.formBlock}>
            <div className={styles.fieldLabel}>
              <span className={styles.required}>*</span> 选择文件
            </div>
            <Upload.Dragger
              multiple
              fileList={uploadFileList}
              beforeUpload={beforeUpload}
              onChange={handleUploadChange}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif"
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
              <p className="ant-upload-hint">支持 PDF、Word、Excel、图片等格式，单个文件不超过100MB</p>
            </Upload.Dragger>
            {uploadError ? <div className={styles.fieldError}>{uploadError}</div> : null}
          </div>

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



