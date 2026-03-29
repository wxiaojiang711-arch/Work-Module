import React, { useMemo, useRef, useState } from "react";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  DatePicker,
  Descriptions,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import type { TableProps } from "antd";
import { Link, useParams } from "react-router-dom";
import dayjs from "dayjs";

import {
  fillStatusColorMap,
  fillStatusTextMap,
  taskListMock,
  taskStatusColorMap,
  taskStatusTextMap,
  unitProgressMock,
  type FillStatus,
  type UnitProgressItem,
} from "./taskConstants";

const TaskDetailPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const task = useMemo(() => taskListMock.find((item) => item.id === taskId) ?? taskListMock[0], [taskId]);

  const [unitList, setUnitList] = useState<UnitProgressItem[]>(unitProgressMock);
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [auditResult, setAuditResult] = useState<"approve" | "reject" | "">("");
  const [auditReason, setAuditReason] = useState("");
  const [auditRemark, setAuditRemark] = useState("");
  const [auditTarget, setAuditTarget] = useState<UnitProgressItem | null>(null);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditResultError, setAuditResultError] = useState("");
  const [auditReasonError, setAuditReasonError] = useState("");
  const [auditRemarkError, setAuditRemarkError] = useState("");
  const [reasonFocused, setReasonFocused] = useState(false);
  const [remarkFocused, setRemarkFocused] = useState(false);
  const reasonRef = useRef<any>(null);
  const [auditDetailOpen, setAuditDetailOpen] = useState(false);
  const [auditDetailTarget, setAuditDetailTarget] = useState<UnitProgressItem | null>(null);
  const [query, setQuery] = useState({
    unitName: "",
    status: undefined as FillStatus | undefined,
    submitRange: null as [string, string] | null,
  });
  const [appliedQuery, setAppliedQuery] = useState(query);

  const completedCount = unitList.filter((item) => item.fillStatus === "submitted").length;
  const totalCount = unitList.length;
  const pendingCount = totalCount - completedCount;
  const percent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const filteredUnits = useMemo(() => {
    return unitList.filter((item) => {
      const nameMatch =
        !appliedQuery.unitName.trim() ||
        item.unitName.toLowerCase().includes(appliedQuery.unitName.trim().toLowerCase());
      const statusMatch = !appliedQuery.status || item.fillStatus === appliedQuery.status;
      const rangeMatch =
        !appliedQuery.submitRange ||
        (item.submitTime &&
          item.submitTime.slice(0, 10) >= appliedQuery.submitRange[0] &&
          item.submitTime.slice(0, 10) <= appliedQuery.submitRange[1]);
      return nameMatch && statusMatch && rangeMatch;
    });
  }, [unitList, appliedQuery]);

  const columns: TableProps<UnitProgressItem>["columns"] = [
    { title: "单位名称", dataIndex: "unitName", key: "unitName", width: 300 },
    {
      title: "上报人",
      dataIndex: "submitter",
      key: "submitter",
      width: 120,
      render: (value: string | null) => value ?? "-",
    },
    {
      title: "上报状态",
      dataIndex: "fillStatus",
      key: "fillStatus",
      width: 120,
      render: (value: FillStatus) => <Tag color={fillStatusColorMap[value]}>{fillStatusTextMap[value]}</Tag>,
    },
    {
      title: "上报时间",
      dataIndex: "submitTime",
      key: "submitTime",
      width: 170,
      render: (value: string | null) => value ?? "-",
    },
    {
      title: "审核时间",
      dataIndex: "auditTime",
      key: "auditTime",
      width: 170,
      render: (value: string | null | undefined) => value ?? "-",
    },
    {
      title: "操作",
      key: "actions",
      width: 320,
      render: (_value, record) => (
        <Space size={1}>
          <Link to={`/task/${task.id}/view/${record.unitId}`}>
            <Button
              type="link"
              style={{ paddingInline: 4 }}
              disabled={record.fillStatus !== "submitted"}
            >
              查看数据
            </Button>
          </Link>
          <Button
            type="link"
            style={{ paddingInline: 4 }}
            disabled={record.fillStatus !== "submitted"}
            onClick={() => {
              setAuditTarget(record);
              setAuditResult("");
              setAuditReason("");
              setAuditRemark("");
              setAuditResultError("");
              setAuditReasonError("");
              setAuditRemarkError("");
              setAuditModalOpen(true);
            }}
          >
            审核
          </Button>
          {record.fillStatus === "approved" || record.fillStatus === "rejected" ? (
            <Button
              type="link"
              style={{ paddingInline: 4 }}
              onClick={() => {
                setAuditDetailTarget(record);
                setAuditDetailOpen(true);
              }}
            >
              审核详情
            </Button>
          ) : null}
          <Button
            type="link"
            style={{ paddingInline: 4 }}
            disabled={record.fillStatus === "submitted"}
            onClick={() => message.success(`已向 ${record.unitName} 发送催办`)}
          >
            催办
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20, background: "#f3f6fb", height: "100%", overflow: "auto" }}>
      <Space direction="vertical" size={12} style={{ width: "100%" }}>
        <Breadcrumb
          items={[
            { title: <Link to="/task">采集任务</Link> },
            { title: task.name },
          ]}
        />

        <Card
          title="任务概览"
          extra={
            <Space>
              <Button onClick={() => message.success("已向未完成单位发送催办")}>一键催办</Button>
              <Button type="primary" onClick={() => message.success("已导出全部数据")}>导出全部数据</Button>
            </Space>
          }
        >
          <Descriptions column={3} bordered size="small">
            <Descriptions.Item label="任务名称">{task.name}</Descriptions.Item>
            <Descriptions.Item label="任务状态">
              <Tag color={taskStatusColorMap[task.status]}>{taskStatusTextMap[task.status]}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="创建人">{task.creator}</Descriptions.Item>
            <Descriptions.Item label="开始时间">{task.startTime}</Descriptions.Item>
            <Descriptions.Item label="截止时间">{task.deadline}</Descriptions.Item>
            <Descriptions.Item label="关联表单数">{task.formCount}</Descriptions.Item>
            <Descriptions.Item label="应填单位数">{totalCount}</Descriptions.Item>
            <Descriptions.Item label="已完成单位数">
              <span style={{ color: "#3f8600" }}>{completedCount}</span>
            </Descriptions.Item>
            <Descriptions.Item label="未完成单位数">
              <span style={{ color: "#cf1322" }}>{pendingCount}</span>
            </Descriptions.Item>
            <Descriptions.Item label="任务描述" span={3}>
              {task.description ?? "-"}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card title="各单位上报明细">
          <div style={{ background: "#fafafa", borderRadius: 8, padding: "12px 16px", marginBottom: 12 }}>
            <Row gutter={12} align="middle" wrap={false}>
              <Col flex="280px">
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ whiteSpace: "nowrap" }}>单位名称：</span>
                  <Input
                    value={query.unitName}
                    placeholder="请输入单位名称"
                    allowClear
                    onChange={(event) => setQuery((prev) => ({ ...prev, unitName: event.target.value }))}
                  />
                </div>
              </Col>
              <Col flex="220px">
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ whiteSpace: "nowrap" }}>上报状态：</span>
                  <Select
                    value={query.status}
                    placeholder="请选择"
                    allowClear
                    style={{ width: "100%" }}
                    onChange={(value) => setQuery((prev) => ({ ...prev, status: value }))}
                    options={Object.entries(fillStatusTextMap).map(([value, label]) => ({
                      value,
                      label,
                    }))}
                  />
                </div>
              </Col>
              <Col flex="360px">
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ whiteSpace: "nowrap" }}>上报时间：</span>
                  <DatePicker.RangePicker
                    style={{ width: "100%" }}
                    value={
                      query.submitRange
                        ? [dayjs(query.submitRange[0], "YYYY-MM-DD"), dayjs(query.submitRange[1], "YYYY-MM-DD")]
                        : null
                    }
                    onChange={(dates) => {
                      if (!dates || dates.length !== 2) {
                        setQuery((prev) => ({ ...prev, submitRange: null }));
                        return;
                      }
                      setQuery((prev) => ({
                        ...prev,
                        submitRange: [dates[0]!.format("YYYY-MM-DD"), dates[1]!.format("YYYY-MM-DD")],
                      }));
                    }}
                  />
                </div>
              </Col>
              <Col flex="auto" style={{ textAlign: "right", minWidth: 160 }}>
                <Space>
                  <Button type="primary" onClick={() => setAppliedQuery(query)}>
                    查询
                  </Button>
                  <Button
                    onClick={() => {
                      const nextQuery = { unitName: "", status: undefined, submitRange: null };
                      setQuery(nextQuery);
                      setAppliedQuery(nextQuery);
                    }}
                  >
                    重置
                  </Button>
                </Space>
              </Col>
            </Row>
          </div>
          <Table<UnitProgressItem>
            rowKey="unitId"
            columns={columns}
            dataSource={filteredUnits}
            pagination={{ pageSize: 10 }}
            tableLayout="fixed"
            locale={{ emptyText: "暂无单位进度数据" }}
          />
        </Card>
      </Space>

      <Modal
        title="上报数据审核"
        open={auditModalOpen}
        onCancel={() => setAuditModalOpen(false)}
        width={600}
        footer={null}
        destroyOnClose
        bodyStyle={{ maxHeight: "70vh", overflow: "auto", paddingInline: 24 }}
      >
        <div style={{ background: "#fafafa", borderRadius: 8, padding: 16, marginBottom: 24 }}>
          <div style={{ fontSize: 14, color: "#666" }}>上报单位：{auditTarget?.unitName ?? "-"}</div>
          <div style={{ fontSize: 14, color: "#666", marginTop: 8 }}>上报人：{auditTarget?.submitter ?? "-"}</div>
          <div style={{ fontSize: 14, color: "#666", marginTop: 8 }}>上报时间：{auditTarget?.submitTime ?? "-"}</div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#333", marginBottom: 12 }}>
            <span style={{ color: "#f5222d", marginRight: 4 }}>*</span>审核结果
          </div>
          <Space direction="vertical" size={16}>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="radio"
                name="auditResult"
                value="approve"
                checked={auditResult === "approve"}
                onChange={() => {
                  setAuditResult("approve");
                  setAuditResultError("");
                  setAuditReasonError("");
                }}
                style={{ width: 16, height: 16 }}
              />
              <span style={{ color: "#52c41a" }}>审核通过</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="radio"
                name="auditResult"
                value="reject"
                checked={auditResult === "reject"}
                onChange={() => {
                  setAuditResult("reject");
                  setAuditResultError("");
                }}
                style={{ width: 16, height: 16 }}
              />
              <span style={{ color: "#f5222d" }}>退回修改</span>
            </label>
          </Space>
          {auditResultError ? (
            <div style={{ color: "#f5222d", fontSize: 12, marginTop: 8 }}>{auditResultError}</div>
          ) : null}
        </div>

        {auditResult === "reject" ? (
          <>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#333", marginBottom: 8 }}>
                <span style={{ color: "#f5222d", marginRight: 4 }}>*</span>退回原因
              </div>
              <Input.TextArea
                ref={reasonRef}
                value={auditReason}
                onChange={(event) => {
                  setAuditReason(event.target.value);
                  setAuditReasonError("");
                }}
                onFocus={() => setReasonFocused(true)}
                onBlur={() => setReasonFocused(false)}
                placeholder="请输入退回原因，说明需要修改的内容"
                autoSize={{ minRows: 4, maxRows: 7 }}
                maxLength={500}
                style={{
                  borderRadius: 6,
                  borderColor: auditReasonError ? "#f5222d" : "#d9d9d9",
                  padding: 12,
                  boxShadow: reasonFocused ? "0 0 0 2px rgba(43,92,214,0.1)" : "none",
                }}
              />
              {auditReasonError ? (
                <div style={{ color: "#f5222d", fontSize: 12, marginTop: 8 }}>{auditReasonError}</div>
              ) : null}
              <div style={{ textAlign: "right", fontSize: 13, color: "#999", marginTop: 8, marginBottom: 12 }}>
                {auditReason.length}/500
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, color: "#666", marginBottom: 8 }}>常用退回原因</div>
              <Space size={[8, 8]} wrap>
                {[
                  "数据填写不完整，请补充完整信息",
                  "上传的文件格式不正确，请重新上传",
                  "数据内容与实际情况不符，请核实后修改",
                  "缺少必要的附件材料，请补充上传",
                  "数据填写有误，请仔细核对后修改",
                  "其他原因",
                ].map((text) => (
                  <Button
                    key={text}
                    type="default"
                    size="small"
                    style={{
                      borderRadius: 4,
                      borderColor: "#d9d9d9",
                      color: "#666",
                    }}
                    onClick={() => {
                      setAuditReason(text === "其他原因" ? "" : text);
                      setAuditReasonError("");
                      window.setTimeout(() => reasonRef.current?.focus(), 0);
                    }}
                  >
                    {text}
                  </Button>
                ))}
              </Space>
            </div>
          </>
        ) : null}

        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#333", marginBottom: 8 }}>审核备注</div>
          <Input.TextArea
            value={auditRemark}
            onChange={(event) => {
              setAuditRemark(event.target.value);
              setAuditRemarkError("");
            }}
            onFocus={() => setRemarkFocused(true)}
            onBlur={() => setRemarkFocused(false)}
            placeholder="可填写审核备注信息（可选）"
            autoSize={{ minRows: 3, maxRows: 6 }}
            maxLength={300}
            style={{
              borderRadius: 6,
              borderColor: auditRemarkError ? "#f5222d" : "#d9d9d9",
              padding: 12,
              boxShadow: remarkFocused ? "0 0 0 2px rgba(43,92,214,0.1)" : "none",
            }}
          />
          {auditRemarkError ? (
            <div style={{ color: "#f5222d", fontSize: 12, marginTop: 8 }}>{auditRemarkError}</div>
          ) : null}
          <div style={{ textAlign: "right", fontSize: 13, color: "#999", marginTop: 8 }}>
            {auditRemark.length}/300
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24 }}>
          <Button
            onClick={() => setAuditModalOpen(false)}
            style={{ width: 100, height: 40, color: "#666", borderColor: "#d9d9d9" }}
            disabled={auditLoading}
          >
            取消
          </Button>
          {auditResult === "approve" ? (
            <Button
              type="primary"
              loading={auditLoading}
              style={{ width: 120, height: 40, background: "#52c41a" }}
              onClick={() => {
                if (!auditResult) {
                  setAuditResultError("请选择审核结果");
                  return;
                }
                if (auditRemark.length > 300) {
                  setAuditRemarkError("审核备注最多300个字符");
                  return;
                }
                setAuditLoading(true);
                window.setTimeout(() => {
                  if (auditTarget) {
                    setUnitList((prev) =>
                      prev.map((item) =>
                        item.unitId === auditTarget.unitId
                          ? { ...item, fillStatus: "approved", auditTime: "2024-03-20 10:00:00", auditRemark }
                          : item,
                      ),
                    );
                  }
                  message.success("审核成功");
                  setAuditLoading(false);
                  setAuditModalOpen(false);
                }, 600);
              }}
            >
              审核通过
            </Button>
          ) : null}
          {auditResult === "reject" ? (
            <Button
              danger
              type="primary"
              loading={auditLoading}
              style={{ width: 120, height: 40 }}
              onClick={() => {
                if (!auditResult) {
                  setAuditResultError("请选择审核结果");
                  return;
                }
                const trimmed = auditReason.trim();
                if (!trimmed) {
                  setAuditReasonError("请输入退回原因");
                  return;
                }
                if (trimmed.length < 10) {
                  setAuditReasonError("退回原因至少10个字符");
                  return;
                }
                if (trimmed.length > 500) {
                  setAuditReasonError("退回原因最多500个字符");
                  return;
                }
                if (auditRemark.length > 300) {
                  setAuditRemarkError("审核备注最多300个字符");
                  return;
                }
                setAuditLoading(true);
                window.setTimeout(() => {
                  if (auditTarget) {
                    setUnitList((prev) =>
                      prev.map((item) =>
                        item.unitId === auditTarget.unitId
                          ? {
                              ...item,
                              fillStatus: "rejected",
                              submitTime: null,
                              submitter: null,
                              auditTime: "2024-03-20 10:00:00",
                              auditReason: auditReason.trim(),
                              auditRemark,
                            }
                          : item,
                      ),
                    );
                  }
                  message.success("审核成功");
                  setAuditLoading(false);
                  setAuditModalOpen(false);
                }, 600);
              }}
            >
              退回修改
            </Button>
          ) : null}
        </div>
      </Modal>

      <Modal
        title="审核详情"
        open={auditDetailOpen}
        onCancel={() => setAuditDetailOpen(false)}
        footer={[
          <Button key="close" onClick={() => setAuditDetailOpen(false)}>
            关闭
          </Button>,
        ]}
      >
        <Space direction="vertical" size={8} style={{ width: "100%" }}>
          <div>单位：{auditDetailTarget?.unitName ?? "-"}</div>
          <div>状态：{auditDetailTarget ? fillStatusTextMap[auditDetailTarget.fillStatus] : "-"}</div>
          <div>审核时间：{auditDetailTarget?.auditTime ?? "-"}</div>
          <div>退回原因：{auditDetailTarget?.auditReason ?? "-"}</div>
          <div>审核备注：{auditDetailTarget?.auditRemark ?? "-"}</div>
        </Space>
      </Modal>
    </div>
  );
};

export default TaskDetailPage;
