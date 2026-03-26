import React, { useMemo } from "react";
import { Empty, List, Spin, Typography } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn";

import type { QaSession } from "../types";
import styles from "../AiQaLeaderPage.module.css";

dayjs.extend(relativeTime);
dayjs.locale("zh-cn");

interface HistorySidebarProps {
  sessions: QaSession[];
  onSelectSession: (sessionId: string) => void;
  loading: boolean;
  currentSessionId?: string;
}

type SessionGroupLabel = "今天" | "本周" | "更早";

const getGroupLabel = (time: string): SessionGroupLabel => {
  const now = dayjs();
  const target = dayjs(time);
  if (target.isSame(now, "day")) return "今天";
  if (target.isAfter(now.subtract(7, "day"))) return "本周";
  return "更早";
};

const HistorySidebar: React.FC<HistorySidebarProps> = ({ sessions, onSelectSession, loading, currentSessionId }) => {
  const groupedSessions = useMemo<Record<SessionGroupLabel, QaSession[]>>(() => {
    const result: Record<SessionGroupLabel, QaSession[]> = { 今天: [], 本周: [], 更早: [] };
    sessions.forEach((item) => {
      result[getGroupLabel(item.lastUpdatedAt)].push(item);
    });
    return result;
  }, [sessions]);

  if (loading) {
    return (
      <div className={styles.sidebarLoading}>
        <Spin />
      </div>
    );
  }

  if (!sessions.length) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无历史提问" />;
  }

  return (
    <div>
      <Typography.Title level={5} style={{ marginTop: 0 }}>
        历史会话
      </Typography.Title>
      {(["今天", "本周", "更早"] as const).map((group) => (
        <div key={group} style={{ marginBottom: 12 }}>
          <Typography.Text type="secondary">{group}</Typography.Text>
          <List
            size="small"
            dataSource={groupedSessions[group]}
            renderItem={(item) => (
              <List.Item
                className={`${styles.sessionItem} ${currentSessionId === item.id ? styles.sessionItemActive : ""}`}
                onClick={() => onSelectSession(item.id)}
              >
                <div className={styles.sessionTitle}>{item.title}</div>
                <Typography.Text type="secondary" className={styles.sessionTime}>
                  {dayjs(item.lastUpdatedAt).fromNow()}
                </Typography.Text>
              </List.Item>
            )}
          />
        </div>
      ))}
    </div>
  );
};

export default HistorySidebar;
