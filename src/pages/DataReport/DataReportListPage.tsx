import React, { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Col,
  DatePicker,
  Input,
  Row,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
  Typography,
  message,
} from "antd";
import type { TableProps } from "antd";
import { BellFilled, ClockCircleOutlined, RollbackOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

import RejectReasonModal from "./RejectReasonModal";
import styles from "./DataReport.module.css";
import { pendingStatusMap, urgencyMap } from "./reportConstants";
import {
  issuerOptions,
  pendingReportList,
  submittedReportList,
  type PendingReportItem,
  type SubmittedReportItem,
} from "./reportMockData";
import { workModuleOverviewMock, workModuleStatusMap } from "./workModuleColumnMock";

const now = dayjs("2024-03-21 12:00:00");

const DataReportListPage: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"pending" | "submitted">("pending");
  const [pendingList] = useState<PendingReportItem[]>(pendingReportList);
  const [submittedList] = useState<SubmittedReportItem[]>(submittedReportList);
  const [query, setQuery] = useState({
    keyword: "",
    issuer: undefined as string | undefined,
    urgency: undefined as PendingReportItem["urgency"] | undefined,
    deadlineRange: null as [string, string] | null,
  });
  const [appliedQuery, setAppliedQuery] = useState(query);
  const [rejectModal, setRejectModal] = useState<{ open: boolean; record?: PendingReportItem }>({ open: false });
  const workModuleStatusMeta = workModuleStatusMap[workModuleOverviewMock.currentStatus];

  const openWorkModuleColumn = (period: string, taskId: string) => {
    navigate(`/report/work-module?period=${period}&taskId=${taskId}`);
  };

  const filteredPending = useMemo(() => {
    return pendingList.filter((item) => {
      const keyword = appliedQuery.keyword.trim().toLowerCase();
      const keywordMatch = !keyword || item.taskName.toLowerCase().includes(keyword);
      const issuerMatch = !appliedQuery.issuer || item.issuer === appliedQuery.issuer;
      const urgencyMatch = !appliedQuery.urgency || item.urgency === appliedQuery.urgency;
      const rangeMatch =
        !appliedQuery.deadlineRange ||
        (item.deadline.slice(0, 10) >= appliedQuery.deadlineRange[0] &&
          item.deadline.slice(0, 10) <= appliedQuery.deadlineRange[1]);
      return keywordMatch && issuerMatch && urgencyMatch && rangeMatch;
    });
  }, [appliedQuery, pendingList]);

  const filteredSubmitted = useMemo(() => {
    return [...submittedList]
      .filter((item) => {
        const keyword = appliedQuery.keyword.trim().toLowerCase();
        const keywordMatch = !keyword || item.taskName.toLowerCase().includes(keyword);
        const issuerMatch = !appliedQuery.issuer || item.issuer === appliedQuery.issuer;
        const rangeMatch =
          !appliedQuery.deadlineRange ||
          (item.submitTime.slice(0, 10) >= appliedQuery.deadlineRange[0] &&
            item.submitTime.slice(0, 10) <= appliedQuery.deadlineRange[1]);
        return keywordMatch && issuerMatch && rangeMatch;
      })
      .sort((a, b) => dayjs(b.submitTime).valueOf() - dayjs(a.submitTime).valueOf());
  }, [appliedQuery, submittedList]);

  const pendingColumns: TableProps<PendingReportItem>["columns"] = [
    {
      title: "任务名称",
      dataIndex: "taskName",
      key: "taskName",
      width: 320,
      render: (_value, record) => (
        <Space size={6}>
          {record.status === "rejected" ? <RollbackOutlined style={{ color: "#fa8c16" }} /> : null}
          {record.urgeCount > 0 ? <BellFilled style={{ color: "#ff4d4f" }} /> : null}
          <Button
            type="link"
            className={styles.taskNameLink}
            onClick={() =>
              record.taskName === "工作模块"
                ? openWorkModuleColumn(workModuleOverviewMock.currentPeriod, record.id)
                : navigate(`/report/fill/${record.id}`)
            }
          >
            {record.taskName}
          </Button>
        </Space>
      ),
    },
    { title: "下发单位", dataIndex: "issuer", key: "issuer", width: 140 },
    {
      title: "紧急程度",
      dataIndex: "urgency",
      key: "urgency",
      width: 100,
      render: (v: PendingReportItem["urgency"]) => <Tag color={urgencyMap[v].color}>{urgencyMap[v].label}</Tag>,
    },
    { title: "关联表单数", dataIndex: "formCount", key: "formCount", width: 110, render: (v: number) => `${v}个表单` },
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
      title: "任务状态",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (v: PendingReportItem["status"]) => <Tag color={pendingStatusMap[v].color}>{pendingStatusMap[v].label}</Tag>,
    },
    {
      title: "催办次数",
      dataIndex: "urgeCount",
      key: "urgeCount",
      width: 100,
      render: (v: number) => <span style={v > 0 ? { color: "#ff4d4f", fontWeight: 600 } : {}}>{v}</span>,
    },
    {
      title: "操作",
      key: "actions",
      width: 220,
      render: (_value, record) => (
        <Space size={0}>
          <Button type="primary" size="small" onClick={() => navigate(`/report/fill/${record.id}`)}>
            {record.status === "rejected" ? "重新上报" : "去上报"}
          </Button>
          {record.status === "rejected" ? (
            <Button type="link" onClick={() => setRejectModal({ open: true, record })}>
              查看退回原因
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
        <Button type="link" className={styles.taskNameLink} onClick={() => navigate(`/report/view/${r.id}`)}>
          {v}
        </Button>
      ),
    },
    { title: "下发单位", dataIndex: "issuer", key: "issuer", width: 140 },
    { title: "关联表单数", dataIndex: "formCount", key: "formCount", width: 110, render: (v: number) => `${v}个表单` },
    { title: "提交时间", dataIndex: "submitTime", key: "submitTime", width: 180 },
    { title: "提交人", dataIndex: "submitter", key: "submitter", width: 110 },
    {
      title: "操作",
      key: "actions",
      width: 180,
      render: (_value, record) => (
        <Space size={0}>
          <Button type="link" onClick={() => navigate(`/report/view/${record.id}`)}>
            查看详情
          </Button>
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
            <h3 className={styles.workModuleEntryTitle}>工作模块（定期）</h3>
            <div className={styles.workModuleEntrySubTitle}>按季度更新｜用于持续维护各单位工作模块内容</div>
          </div>
          <Space>
            <Button type="primary" onClick={() => navigate(`/report/fill/${workModuleOverviewMock.currentTaskId}`)}>
              去填报
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
          <Col span={5}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ whiteSpace: "nowrap" }}>下发单位：</span>
              <Select
                allowClear
                showSearch
                placeholder="下发单位"
                style={{ width: "100%" }}
                value={query.issuer}
                options={issuerOptions.map((item) => ({ label: item, value: item }))}
                onChange={(value) => setQuery((prev) => ({ ...prev, issuer: value }))}
              />
            </div>
          </Col>
          <Col span={6}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ whiteSpace: "nowrap" }}>截止时间：</span>
              <DatePicker.RangePicker
                style={{ width: "100%" }}
                placeholder={["截止开始", "截止结束"]}
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
          <Col flex="auto" style={{ textAlign: "right" }}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Space>
                <Button type="primary" onClick={() => setAppliedQuery(query)}>
                  查询
                </Button>
                <Button
                  onClick={() => {
                    const reset = { keyword: "", issuer: undefined, urgency: undefined, deadlineRange: null };
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
            if (record.status === "rejected") {
              classNames.push(styles.rejectRow);
            }
            if (dayjs(record.deadline).isBefore(now)) {
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

