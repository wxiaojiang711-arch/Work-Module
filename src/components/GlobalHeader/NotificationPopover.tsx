import React from "react";
import { Badge, Button, List, Space, Typography } from "antd";
import { BellFilled, InfoCircleFilled, RollbackOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import type { NotificationItem } from "./headerMockData";

const typeMap = {
  urge: { icon: <BellFilled />, color: "#ff4d4f" },
  reject: { icon: <RollbackOutlined />, color: "#fa8c16" },
  system: { icon: <InfoCircleFilled />, color: "#1890ff" },
} as const;

interface NotificationPopoverProps {
  list: NotificationItem[];
  onMarkAllRead: () => void;
  onViewAll: () => void;
}

const NotificationPopover: React.FC<NotificationPopoverProps> = ({
  list,
  onMarkAllRead,
  onViewAll,
}) => {
  const latestFive = list.slice(0, 5);

  const formatRelative = (time: string) => {
    const diffMin = dayjs().diff(dayjs(time), "minute");
    if (diffMin < 60) {
      return `${Math.max(1, diffMin)}分钟前`;
    }
    const diffHour = dayjs().diff(dayjs(time), "hour");
    if (diffHour < 24) {
      return `${diffHour}小时前`;
    }
    return dayjs(time).format("MM-DD HH:mm");
  };

  return (
    <div style={{ width: 360 }}>
      <Space style={{ width: "100%", justifyContent: "space-between", marginBottom: 8 }}>
        <Typography.Text strong>通知中心</Typography.Text>
        <Button type="link" size="small" onClick={onMarkAllRead} style={{ padding: 0 }}>
          全部已读
        </Button>
      </Space>
      <List
        size="small"
        dataSource={latestFive}
        renderItem={(item) => (
          <List.Item
            style={{
              alignItems: "flex-start",
              background: item.isRead ? "#fff" : "#e6f7ff",
              borderRadius: 6,
              padding: "8px 10px",
              marginBottom: 6,
            }}
          >
            <Space align="start" size={8} style={{ width: "100%" }}>
              <span style={{ color: typeMap[item.type].color, marginTop: 2 }}>{typeMap[item.type].icon}</span>
              {!item.isRead ? <Badge dot /> : <span style={{ width: 8 }} />}
              <div style={{ minWidth: 0, flex: 1 }}>
                <Typography.Text ellipsis style={{ width: "100%", display: "block" }}>
                  {item.title}
                </Typography.Text>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  {formatRelative(item.time)}
                </Typography.Text>
              </div>
            </Space>
          </List.Item>
        )}
      />
      <div style={{ textAlign: "center", paddingTop: 4 }}>
        <Button type="link" onClick={onViewAll}>
          查看全部通知
        </Button>
      </div>
    </div>
  );
};

export default NotificationPopover;
