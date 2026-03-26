import React from "react";
import { Empty, Row, Col, Typography } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import MessageBubble from "./MessageBubble";
import type { RecallSession } from "../recallMockData";

type ComparePanelProps = {
  currentSession: RecallSession | null;
  onOpenSetting: () => void;
};

const renderCard = (
  title: string,
  color: string,
  rows: RecallSession["messages"],
  side: "before" | "after",
  loading: boolean,
) => (
  <div
    style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      border: "1px solid #f0f0f0",
      borderRadius: 8,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        background: color,
        padding: "15px 16px",
        textAlign: "center",
        color: "#fff",
        fontSize: 16,
        fontWeight: 500,
      }}
    >
      {title}
    </div>
    <div
      style={{
        flex: 1,
        minHeight: 0,
        padding: 16,
        overflowY: "auto",
        background: "#fafafa",
      }}
    >
      {rows.length === 0 ? (
        <div style={{ flex: 1, minHeight: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<span style={{ color: "#bfbfbf", fontSize: 13 }}>暂无对话</span>}
          />
        </div>
      ) : (
        rows.map((item) => (
          <React.Fragment key={`${item.id}-${side}`}>
            <MessageBubble role="user" content={item.question} time={item.time} />
            <MessageBubble
              role="assistant"
              content={side === "before" ? item.beforeTreatment : item.afterTreatment}
              time={item.answerTime || item.time}
              source={item.afterSource}
              side={side}
              loading={loading && Boolean(item.loading)}
            />
          </React.Fragment>
        ))
      )}
    </div>
  </div>
);

const ComparePanel: React.FC<ComparePanelProps> = ({ currentSession, onOpenSetting }) => {
  const title = currentSession?.title || "新会话";
  const rows = currentSession?.messages || [];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
      <div
        style={{
          height: 52,
          padding: "0 20px",
          borderBottom: "1px solid #f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#fff",
          flexShrink: 0,
        }}
      >
        <Typography.Text style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>{title}</Typography.Text>
        <SettingOutlined
          style={{ fontSize: 18, color: "#999", cursor: "pointer" }}
          onClick={onOpenSetting}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#1890ff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#999";
          }}
        />
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
        <Row gutter={16} style={{ height: "100%" }}>
          <Col span={12} style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
            {renderCard("数据治理前", "#1890ff", rows, "before", true)}
          </Col>
          <Col span={12} style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
            {renderCard("数据治理后", "#52c41a", rows, "after", true)}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ComparePanel;
