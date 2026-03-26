import React from "react";
import { Button, Empty, Space, Spin, Typography } from "antd";

type MessageBubbleProps = {
  role: "user" | "assistant";
  content?: string;
  time: string;
  loading?: boolean;
  source?: string;
  side?: "before" | "after";
};

const MessageBubble: React.FC<MessageBubbleProps> = ({ role, content, time, loading = false, source, side = "before" }) => {
  if (role === "user") {
    return (
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4 }}>
          <Typography.Text style={{ fontSize: 12, color: "#999" }}>我 · {time}</Typography.Text>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div
            style={{
              background: "#1890ff",
              color: "#fff",
              borderRadius: "12px 12px 0 12px",
              padding: "10px 14px",
              maxWidth: "80%",
              whiteSpace: "pre-wrap",
            }}
          >
            {content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 4 }}>
        <Typography.Text style={{ fontSize: 12, color: "#999" }}>系统 · {time}</Typography.Text>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-start" }}>
        <div
          style={{
            background: "#f5f5f5",
            color: "#333",
            borderRadius: "12px 12px 12px 0",
            padding: "10px 14px",
            maxWidth: "80%",
            whiteSpace: "pre-wrap",
          }}
        >
          {loading ? (
            <Space size={8}>
              <Spin size="small" />
              <span>召回中...</span>
            </Space>
          ) : (
            <>
              <div>{content || <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无回复" />}</div>
              {side === "after" && source ? (
                <Button type="link" style={{ paddingInline: 0, marginTop: 6, color: "#999", fontSize: 12 }}>
                  {source}
                </Button>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
