import React from "react";
import { Button, Modal, Popconfirm, Space, Typography } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import type { RecallSession } from "../recallMockData";

type SessionPanelProps = {
  sessions: RecallSession[];
  activeId: string;
  onNew: () => void;
  onClearAll: () => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
};

const SessionPanel: React.FC<SessionPanelProps> = ({ sessions, activeId, onNew, onClearAll, onSelect, onDelete }) => {
  return (
    <div
      style={{
        width: 280,
        minWidth: 280,
        background: "#fff",
        borderRight: "1px solid #f0f0f0",
        display: "flex",
        flexDirection: "column",
        padding: "16px 12px",
        height: "100%",
        overflowY: "auto",
      }}
    >
      <Space direction="vertical" size={8} style={{ width: "100%", marginBottom: 12 }}>
        <Button
          type="primary"
          block
          icon={<PlusOutlined />}
          style={{ borderRadius: 20, height: 42, fontSize: 16 }}
          onClick={onNew}
        >
          新建会话
        </Button>
        <Button
          type="text"
          block
          icon={<DeleteOutlined />}
          style={{ color: "#999" }}
          onClick={() => {
            Modal.confirm({
              title: "确认清空所有会话记录？",
              okText: "确认",
              cancelText: "取消",
              onOk: onClearAll,
            });
          }}
        >
          清空会话
        </Button>
      </Space>

      {sessions.map((item) => {
        const active = item.id === activeId;
        return (
          <div
            key={item.id}
            style={{
              position: "relative",
              padding: "12px 14px",
              borderRadius: 8,
              cursor: "pointer",
              marginBottom: 6,
              transition: "background 0.2s",
              background: active ? "#e6f7ff" : "transparent",
              borderLeft: active ? "3px solid #1890ff" : "3px solid transparent",
              paddingLeft: active ? 11 : 14,
            }}
            onClick={() => onSelect(item.id)}
            onMouseEnter={(e) => {
              if (!active) e.currentTarget.style.background = "#f5f5f5";
              const btn = e.currentTarget.querySelector(".session-delete-btn") as HTMLElement | null;
              if (btn) btn.style.display = "inline-flex";
            }}
            onMouseLeave={(e) => {
              if (!active) e.currentTarget.style.background = "transparent";
              const btn = e.currentTarget.querySelector(".session-delete-btn") as HTMLElement | null;
              if (btn) btn.style.display = "none";
            }}
          >
            <Typography.Text
              style={{ display: "block", fontSize: 14, color: "#333", fontWeight: 500, marginBottom: 4 }}
              ellipsis={{ tooltip: item.title }}
            >
              {item.title}
            </Typography.Text>
            <Typography.Text style={{ fontSize: 12, color: "#bfbfbf" }}>{item.relativeTime}</Typography.Text>

            <Popconfirm
              title="确认删除该会话？"
              okText="删除"
              cancelText="取消"
              onConfirm={(e) => {
                e?.stopPropagation();
                onDelete(item.id);
              }}
            >
              <Button
                className="session-delete-btn"
                type="text"
                size="small"
                icon={<DeleteOutlined />}
                style={{
                  display: "none",
                  position: "absolute",
                  right: 6,
                  top: 8,
                  color: "#999",
                }}
                onClick={(e) => e.stopPropagation()}
              />
            </Popconfirm>
          </div>
        );
      })}
    </div>
  );
};

export default SessionPanel;
