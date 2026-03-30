import React from "react";
import { Button, Divider, Input, Modal, Space, Spin, Tag, Tooltip, Typography } from "antd";
import { DeleteOutlined, DownloadOutlined, ThunderboltOutlined } from "@ant-design/icons";

import { reportStatusMap, type ReportItem } from "../smartReportMockData";

type Props = {
  topic: string;
  selectedKbIds: string[];
  kbOptions: Array<{ label: string; value: string }>;
  reports: ReportItem[];
  activeReportId: string;
  creating: boolean;
  onTopicChange: (value: string) => void;
  onKbChange: (value: string[]) => void;
  onGenerate: () => void;
  onClearAll: () => void;
  onSelectReport: (id: string) => void;
  onDeleteReport: (id: string) => void;
  onExportReport: (id: string) => void;
};

const renderStatus = (status: ReportItem["status"]) => {
  const cfg = reportStatusMap[status];
  if (status === "generating") {
    return (
      <Tag color={cfg.color}>
        <Spin size="small" style={{ marginRight: 4 }} />
        {cfg.label}
      </Tag>
    );
  }
  return <Tag color={cfg.color}>{cfg.label}</Tag>;
};

const ReportListPanel: React.FC<Props> = ({
  topic,
  selectedKbIds,
  kbOptions,
  reports,
  activeReportId,
  creating,
  onTopicChange,
  onKbChange,
  onGenerate,
  onClearAll,
  onSelectReport,
  onDeleteReport,
  onExportReport,
}) => {
  const canGenerate = topic.trim().length > 0;

  return (
    <div style={{ width: 300, minWidth: 300, background: "#fff", borderRight: "1px solid #f0f0f0", padding: 16, height: "100%", overflowY: "auto" }}>
      <Input.TextArea
        value={topic}
        placeholder="请输入报告主题，例如：请帮我总结全区各部门本月的工作情况"
        autoSize={{ minRows: 3, maxRows: 5 }}
        maxLength={200}
        showCount
        style={{ borderRadius: 8 }}
        onChange={(e) => onTopicChange(e.target.value)}
      />

      <Button
        type="primary"
        block
        size="large"
        icon={<ThunderboltOutlined />}
        disabled={!canGenerate}
        loading={creating}
        style={{ marginTop: 12, borderRadius: 8, height: 44, fontSize: 15 }}
        onClick={onGenerate}
      >
        {creating ? "生成中..." : "生成报告"}
      </Button>

      <Button
        block
        type="text"
        style={{ marginTop: 8, color: "#999" }}
        onClick={() => {
          Modal.confirm({
            title: "确认清空所有历史报告？此操作不可恢复。",
            okText: "确认",
            cancelText: "取消",
            onOk: onClearAll,
          });
        }}
      >
        清空会话
      </Button>

      <Divider style={{ margin: "16px 0" }} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <Typography.Text style={{ fontWeight: 500, fontSize: 14, color: "#333" }}>历史报告</Typography.Text>
        <Typography.Text style={{ color: "#999", fontSize: 12 }}>({reports.length})</Typography.Text>
      </div>

      {reports.map((item) => {
        const active = item.id === activeReportId;
        return (
          <div
            key={item.id}
            style={{
              position: "relative",
              padding: "12px 14px",
              borderRadius: 8,
              cursor: "pointer",
              marginBottom: 8,
              background: active ? "#e6f7ff" : "transparent",
              borderLeft: active ? "3px solid #1890ff" : "3px solid transparent",
              paddingLeft: active ? 11 : 14,
            }}
            onClick={() => onSelectReport(item.id)}
            onMouseEnter={(e) => {
              if (!active) e.currentTarget.style.background = "#f5f5f5";
              const actions = e.currentTarget.querySelector(".report-actions") as HTMLElement | null;
              if (actions) actions.style.opacity = "1";
            }}
            onMouseLeave={(e) => {
              if (!active) e.currentTarget.style.background = "transparent";
              const actions = e.currentTarget.querySelector(".report-actions") as HTMLElement | null;
              if (actions) actions.style.opacity = "0";
            }}
          >
            <Typography.Text style={{ display: "block", fontSize: 14, color: "#333", fontWeight: 500 }} ellipsis={{ tooltip: item.title }}>
              {item.title}
            </Typography.Text>
            <Space size={6} style={{ marginTop: 4 }}>
              {renderStatus(item.status)}
              <Typography.Text style={{ fontSize: 12, color: "#999" }}>{item.relativeTime}</Typography.Text>
            </Space>

            <div
              className="report-actions"
              style={{ position: "absolute", top: 8, right: 8, opacity: 0, transition: "opacity 0.2s", display: "flex", gap: 4 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Tooltip title="导出报告">
                <Button type="text" size="small" icon={<DownloadOutlined />} onClick={() => onExportReport(item.id)} />
              </Tooltip>
              <Tooltip title="删除报告">
                <Button
                  type="text"
                  size="small"
                  icon={<DeleteOutlined />}
                  danger
                  onClick={() => {
                    Modal.confirm({
                      title: "确认删除此报告？删除后不可恢复。",
                      okText: "删除",
                      okButtonProps: { danger: true },
                      cancelText: "取消",
                      onOk: () => onDeleteReport(item.id),
                    });
                  }}
                />
              </Tooltip>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReportListPanel;
