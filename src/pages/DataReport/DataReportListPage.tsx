import React, { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Col,
  DatePicker,
  Descriptions,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Steps,
  Table,
  Tabs,
  Tag,
  Typography,
  message,
} from "antd";
import type { StepsProps, TableProps } from "antd";
import { BellFilled, ClockCircleOutlined, RollbackOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useLocation, useNavigate } from "react-router-dom";

import RejectReasonModal from "./RejectReasonModal";
import styles from "./DataReport.module.css";
import { pendingStatusMap, reviewStatusMap, taskStatusMap, urgencyMap } from "./reportConstants";
import { pendingReportList, submittedReportList, type PendingReportItem, type SubmittedReportItem } from "./reportMockData";
import { workModuleOverviewMock, workModuleStatusMap } from "./workModuleColumnMock";

const now = dayjs("2024-03-21 12:00:00");

const DataReportListPage: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const basePath = pathname.startsWith("/report/structured") ? "/report/structured" : "/report";
  const [tab, setTab] = useState<"pending" | "submitted">("pending");
  const [pendingList, setPendingList] = useState<PendingReportItem[]>(pendingReportList);
  const [submittedList, setSubmittedList] = useState<SubmittedReportItem[]>(submittedReportList);
  const [query, setQuery] = useState({
    keyword: "",
    urgency: undefined as PendingReportItem["urgency"] | undefined,
    reportStatus: undefined as PendingReportItem["status"] | SubmittedReportItem["reviewStatus"] | undefined,
    deadlineRange: null as [string, string] | null,
  });
  const [appliedQuery, setAppliedQuery] = useState(query);
  const [rejectModal, setRejectModal] = useState<{ open: boolean; record?: PendingReportItem }>({ open: false });
  const [withdrawModal, setWithdrawModal] = useState<{ open: boolean; record?: SubmittedReportItem }>({ open: false });
  const [withdrawReason, setWithdrawReason] = useState("");
  const [revokeReasonModal, setRevokeReasonModal] = useState<{ open: boolean; record?: PendingReportItem }>({
    open: false,
  });
  const [auditDetailOpen, setAuditDetailOpen] = useState(false);
  const [auditDetailTarget, setAuditDetailTarget] = useState<SubmittedReportItem | null>(null);
  const workModuleStatusMeta = workModuleStatusMap[workModuleOverviewMock.currentStatus];

  const openWorkModuleColumn = (period: string, taskId: string) => {
    navigate(`${basePath}/work-module?period=${period}&taskId=${taskId}`);
  };

  const openWithdrawModal = (record: SubmittedReportItem) => {
    setWithdrawReason("");
    setWithdrawModal({ open: true, record });
  };

  const handleWithdraw = () => {
    const record = withdrawModal.record;
    if (!record || record.reviewStatus !== "pending_review") return;
    if (!withdrawReason.trim()) {
      message.warning("请填写撤回原因");
      return;
    }
    setSubmittedList((prev) => prev.filter((item) => item.id !== record.id));
    setPendingList((prev) => [
      {
        id: record.id,
        taskName: record.taskName,
        issuer: record.issuer,
        urgency: "normal",
        formCount: record.formCount,
        deadline: dayjs().add(7, "day").format("YYYY-MM-DD HH:mm:ss"),
        status: "cancelled",
        urgeCount: 0,
        lastUrgeTime: null,
        rejectReason: null,
        rejectTime: null,
        rejectBy: null,
        withdrawTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        withdrawBy: "张三",
        withdrawReason: withdrawReason.trim(),
        createdAt: record.createdAt,
        description: "已撤回。",
        attachment: null,
      },
      ...prev,
    ]);
    setWithdrawModal({ open: false, record: undefined });
    message.success("已撤回，任务已变更为已撤销");
  };

  const filteredPending = useMemo(() => {
    return pendingList.filter((item) => {
      const keyword = appliedQuery.keyword.trim().toLowerCase();
      const keywordMatch = !keyword || item.taskName.toLowerCase().includes(keyword);
      const statusMatch = !appliedQuery.reportStatus || item.status === appliedQuery.reportStatus;
      const urgencyMatch = !appliedQuery.urgency || item.urgency === appliedQuery.urgency;
      const rangeMatch =
        !appliedQuery.deadlineRange ||
        (item.deadline.slice(0, 10) >= appliedQuery.deadlineRange[0] &&
          item.deadline.slice(0, 10) <= appliedQuery.deadlineRange[1]);
      return keywordMatch && statusMatch && urgencyMatch && rangeMatch;
    });
  }, [appliedQuery, pendingList]);

  const filteredSubmitted = useMemo(() => {
    return [...submittedList]
      .filter((item) => {
        const keyword = appliedQuery.keyword.trim().toLowerCase();
        const keywordMatch = !keyword || item.taskName.toLowerCase().includes(keyword);
        const statusMatch = !appliedQuery.reportStatus || item.reviewStatus === appliedQuery.reportStatus;
        const rangeMatch =
          !appliedQuery.deadlineRange ||
          (item.submitTime.slice(0, 10) >= appliedQuery.deadlineRange[0] &&
            item.submitTime.slice(0, 10) <= appliedQuery.deadlineRange[1]);
        return keywordMatch && statusMatch && rangeMatch;
      })
      .sort((a, b) => dayjs(b.submitTime).valueOf() - dayjs(a.submitTime).valueOf());
  }, [appliedQuery, submittedList]);

  const getAuditDetailSteps = (target: SubmittedReportItem | null): StepsProps["items"] => {
    const submitTime = target?.submitTime ?? "-";
    const auditTime = "2024-03-20 10:00:00";
    const auditStatus = target?.reviewStatus === "approved" ? "通过" : "待审核";
    return [
      {
        title: "数据专员",
        status: "finish",
        description: (
          <div style={{ fontSize: 13, color: "#666" }}>
            <div>审核状态：通过</div>
            <div>审核备注：-</div>
            <div>审核时间：{submitTime}</div>
          </div>
        ),
      },
      {
        title: "单位管理员",
        status: "error",
        description: (
          <div style={{ fontSize: 13, color: "#666" }}>
            <div>审核状态：{auditStatus}</div>
            <div>审核备注：-</div>
            <div>审核时间：{auditTime}</div>
          </div>
        ),
      },
      {
        title: "区委办公室",
        status: "process",
        description: (
          <div style={{ fontSize: 13, color: "#666" }}>
            <div>审核状态：待审核</div>
            <div>审核备注：-</div>
            <div>审核时间：-</div>
          </div>
        ),
      },
    ];
  };

  const pendingColumns: TableProps<PendingReportItem>["columns"] = [
    {
      title: "任务名称",
      dataIndex: "taskName",
      key: "taskName",
      width: 320,
      render: (_value, record) => (
        <Space size={0}>
          {record.status === "rejected" ? <RollbackOutlined style={{ color: "#fa8c16" }} /> : null}
          {record.urgeCount > 0 ? <BellFilled style={{ color: "#ff4d4f" }} /> : null}
          <Tag color={urgencyMap[record.urgency].color}>{urgencyMap[record.urgency].label}</Tag>
          <Button
            type="link"
            className={styles.taskNameLink}
            onClick={() => {
              const targetId = record.id === "task-000" ? "task-001" : record.id;
              navigate(`${basePath}/fill/${targetId}`);
            }}
          >
            {record.taskName}
          </Button>
        </Space>
      ),
    },
    { title: "下发单位", dataIndex: "issuer", key: "issuer", width: 140 },
    {
      title: "任务状态",
      dataIndex: "taskStatus",
      key: "status",
      width: 110,
      render: (v: PendingReportItem["taskStatus"]) => (
        <Tag color={taskStatusMap[v].color}>{taskStatusMap[v].label}</Tag>
      ),
    },
    { title: "关联表单数", dataIndex: "formCount", key: "formCount", width: 110, render: (v: number) => `${v}` },
    { title: "开始时间", dataIndex: "createdAt", key: "createdAt", width: 180 },
    {
      title: "截止时间",
      dataIndex: "deadline",
      key: "deadline",
      width: 190,
      render: (value: string) => {
        const deadline = dayjs(value);
        if (deadline.isBefore(now)) {
          const days = now.diff(deadline, "day") || 1;
          return <span style={{ color: "#ff4d4f" }}>已逾期{days}天</span>;
        }
        const diffDays = deadline.diff(now, "day", true);
        if (diffDays <= 3) {
          return (
            <span style={{ color: "#fa8c16" }}>
              <ClockCircleOutlined /> {value}
            </span>
          );
        }
        return value;
      },
    },
    {
      title: "催办次数",
      dataIndex: "urgeCount",
      key: "urgeCount",
      width: 100,
      render: (v: number) => <span style={v > 0 ? { color: "#ff4d4f", fontWeight: 600 } : {}}>{v}</span>,
    },
    {
      title: "上报状态",
      dataIndex: "status",
      key: "reportStatus",
      width: 110,
      render: (v: PendingReportItem["status"]) => <Tag color={pendingStatusMap[v].color}>{pendingStatusMap[v].label}</Tag>,
    },
    {
      title: "操作",
      key: "actions",
      width: 220,
      render: (_value, record) => (
        <Space size={0}>
          <Button
            type="primary"
            size="small"
            disabled={record.taskStatus === "pending" || record.taskStatus === "finished"}
            onClick={() => {
              const targetId = record.id === "task-000" ? "task-001" : record.id;
              navigate(`${basePath}/fill/${targetId}`);
            }}
          >
            {record.status === "rejected"
              ? "重新上报"
              : record.status === "cancelled"
                ? "重新上报"
                : "去上报"}
          </Button>
          {record.status === "rejected" ? (
            <Button type="link" onClick={() => setRejectModal({ open: true, record })}>
              查看退回原因
            </Button>
          ) : null}
          {record.status === "cancelled" ? (
            <Button type="link" onClick={() => setRevokeReasonModal({ open: true, record })}>
              查看撤销原因
            </Button>
          ) : null}
        </Space>
      ),
    },
  ];

  const submittedColumns: TableProps<SubmittedReportItem>["columns"] = [
    {
      title: "任务名称",
      dataIndex: "taskName",
      key: "taskName",
      width: 320,
      render: (v, r) => (
        <Space size={0}>
          <Tag color={urgencyMap.normal.color}>{urgencyMap.normal.label}</Tag>
          <Button type="link" className={styles.taskNameLink} onClick={() => navigate(`${basePath}/view/${r.id}`)}>
            {v}
          </Button>
        </Space>
      ),
    },
    { title: "下发单位", dataIndex: "issuer", key: "issuer", width: 140 },
    { title: "关联表单数", dataIndex: "formCount", key: "formCount", width: 110, render: (v: number) => `${v}` },
    { title: "上报时间", dataIndex: "submitTime", key: "submitTime", width: 180 },
    { title: "上报人", dataIndex: "submitter", key: "submitter", width: 110 },
    {
      title: "上报状态",
      dataIndex: "reviewStatus",
      key: "reviewStatus",
      width: 110,
      render: (v: SubmittedReportItem["reviewStatus"]) => (
        <Tag color={reviewStatusMap[v].color}>{reviewStatusMap[v].label}</Tag>
      ),
    },
    {
      title: "操作",
      key: "actions",
      width: 180,
      render: (_value, record) => (
        <Space size={0} className={styles.actionInline}>
          <Button
            type="link"
            onClick={() =>
              navigate(`${basePath}/view/${record.id}`, {
                state: { reportStatusText: reviewStatusMap[record.reviewStatus].label },
              })
            }
          >
            查看详情
          </Button>
          {record.reviewStatus === "pending_review" ? (
            <Button type="link" onClick={() => openWithdrawModal(record)}>
              撤回
            </Button>
          ) : null}
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.titleRow}>
        <Typography.Title level={5} style={{ margin: 0 }}>
          数据上报
        </Typography.Title>
      </div>

      <div className={styles.workModuleEntryCard}>
        <div className={styles.workModuleEntryHeader}>
          <div>
            <h3 className={styles.workModuleEntryTitle}>工作模块</h3>
            <div className={styles.workModuleEntrySubTitle}>按季度更新｜用于持续维护各单位工作模块内容</div>
          </div>
          <Space>
            <Button type="primary" onClick={() => navigate(`${basePath}/fill/${workModuleOverviewMock.currentTaskId}`)}>
              去上报
            </Button>
            <Button onClick={() => openWorkModuleColumn(workModuleOverviewMock.currentPeriod, workModuleOverviewMock.currentTaskId)}>
              进入专栏
            </Button>
          </Space>
        </div>

        <div className={styles.workModuleEntryBody}>
          <div className={styles.workModuleMainInfo} style={{ minWidth: "100%" }}>
            <div className={`${styles.workModuleInfoGrid} ${styles.workModuleInfoGridFour}`}>
              <div className={styles.workModuleInfoItem}>
                当前期次：<span>{workModuleOverviewMock.currentPeriod}</span>
              </div>
              <div className={styles.workModuleInfoItem}>
                状态：
                <span>
                  <Tag color={workModuleStatusMeta.color} style={{ marginLeft: 6 }}>
                    {workModuleStatusMeta.label}
                  </Tag>
                </span>
              </div>
              <div className={styles.workModuleInfoItem}>
                截止时间：<span>{workModuleOverviewMock.deadlineTime}</span>
              </div>
              <div className={styles.workModuleInfoItem}>
                下发单位：<span>{workModuleOverviewMock.issuerOrgName}</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      <Tabs
        activeKey={tab}
        onChange={(key) => setTab(key as "pending" | "submitted")}
        items={[
          {
            key: "pending",
            label: (
              <Space size={4}>
                <span>待上报</span>
                <Badge count={pendingList.length} color="#ff4d4f" />
              </Space>
            ),
          },
          {
            key: "submitted",
            label: (
              <Space size={4}>
                <span>已上报</span>
                <Badge count={submittedList.length} color="#d9d9d9" />
              </Space>
            ),
          },
        ]}
      />

      <div className={styles.filterWrap}>
        <Row gutter={[12, 12]} align="middle">
          <Col span={6}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ whiteSpace: "nowrap" }}>任务名称：</span>
              <Input.Search
                allowClear
                placeholder="搜索任务名称"
                value={query.keyword}
                onChange={(e) => setQuery((prev) => ({ ...prev, keyword: e.target.value }))}
                onSearch={() => setAppliedQuery(query)}
              />
            </div>
          </Col>
          <Col span={6}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ whiteSpace: "nowrap" }}>{tab === "submitted" ? "上报时间：" : "截止时间："}</span>
              <DatePicker.RangePicker
                style={{ width: "100%" }}
                placeholder={tab === "submitted" ? ["上报开始", "上报结束"] : ["截止开始", "截止结束"]}
                onChange={(value) => {
                  const start = value?.[0]?.format("YYYY-MM-DD");
                  const end = value?.[1]?.format("YYYY-MM-DD");
                  setQuery((prev) => ({ ...prev, deadlineRange: start && end ? [start, end] : null }));
                }}
              />
            </div>
          </Col>
          {tab === "pending" ? (
            <Col span={4}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ whiteSpace: "nowrap" }}>紧急程度：</span>
                <Select
                  allowClear
                  placeholder="紧急程度"
                  style={{ width: "100%" }}
                  value={query.urgency}
                  options={[
                    { label: "全部", value: undefined },
                    { label: "普通", value: "normal" },
                    { label: "紧急", value: "urgent" },
                    { label: "特急", value: "very_urgent" },
                  ]}
                  onChange={(value) => setQuery((prev) => ({ ...prev, urgency: value }))}
                />
              </div>
            </Col>
          ) : null}
          <Col span={5}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ whiteSpace: "nowrap" }}>上报状态：</span>
              <Select
                allowClear
                placeholder="上报状态"
                style={{ width: "100%" }}
                value={query.reportStatus}
                options={
                  tab === "submitted"
                    ? Object.entries(reviewStatusMap).map(([value, meta]) => ({ label: meta.label, value }))
                    : Object.entries(pendingStatusMap).map(([value, meta]) => ({ label: meta.label, value }))
                }
                onChange={(value) => setQuery((prev) => ({ ...prev, reportStatus: value }))}
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
                    const reset = { keyword: "", urgency: undefined, reportStatus: undefined, deadlineRange: null };
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

      {tab === "pending" ? (
        <Table<PendingReportItem>
          rowKey="id"
          columns={pendingColumns}
          dataSource={filteredPending}
          pagination={{ showQuickJumper: true, showSizeChanger: true }}
          rowClassName={(record) => {
            const classNames: string[] = [];
            if (record.urgeCount > 0) {
              classNames.push(styles.urgeLine);
            }
            if (record.taskStatus === "overdue") {
              classNames.push(styles.overdueRow);
            }
            return classNames.join(" ");
          }}
        />
      ) : (
        <Table<SubmittedReportItem>
          rowKey="id"
          columns={submittedColumns}
          dataSource={filteredSubmitted}
          pagination={{ showQuickJumper: true, showSizeChanger: true }}
        />
      )}

      <Modal
        title="撤回原因"
        open={withdrawModal.open}
        okText="确认撤回"
        cancelText="取消"
        onCancel={() => setWithdrawModal({ open: false, record: undefined })}
        onOk={handleWithdraw}
      >
        <div style={{ color: "#666", marginBottom: 12 }}>
          撤回后，该上报状态将变为“已撤销”，上级单位无需再对该任务进行审核，您可根据需要重新进行上报。
        </div>
        <Input.TextArea
          value={withdrawReason}
          onChange={(e) => setWithdrawReason(e.target.value)}
          placeholder="请输入撤回原因"
          rows={4}
          maxLength={200}
          showCount
        />
      </Modal>

      <Modal
        open={revokeReasonModal.open}
        width={480}
        title="撤销详情"
        footer={null}
        onCancel={() => setRevokeReasonModal({ open: false })}
      >
        <Descriptions column={1} layout="vertical" size="small">
          <Descriptions.Item label="撤销时间">{revokeReasonModal.record?.withdrawTime || "-"}</Descriptions.Item>
          <Descriptions.Item label="撤销人">{revokeReasonModal.record?.withdrawBy || "-"}</Descriptions.Item>
          <Descriptions.Item label="撤销原因">{revokeReasonModal.record?.withdrawReason || "-"}</Descriptions.Item>
        </Descriptions>
      </Modal>

      <Modal
        title="审核详情"
        open={auditDetailOpen}
        onCancel={() => setAuditDetailOpen(false)}
        width={600}
        footer={[
          <Button key="close" onClick={() => setAuditDetailOpen(false)}>
            关闭
          </Button>,
        ]}
      >
        <div style={{ marginTop: 36 }}>
          <Steps direction="vertical" size="small" items={getAuditDetailSteps(auditDetailTarget)} />
        </div>
      </Modal>

      <RejectReasonModal
        open={rejectModal.open}
        onClose={() => setRejectModal({ open: false })}
        rejectTime={rejectModal.record?.rejectTime}
        rejectBy={rejectModal.record?.rejectBy}
        rejectReason={rejectModal.record?.rejectReason}
      />
    </div>
  );
};

export default DataReportListPage;

