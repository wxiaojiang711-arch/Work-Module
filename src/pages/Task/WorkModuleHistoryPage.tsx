import React from "react";
import { Breadcrumb, Button, Table, Tag, Progress, Typography, Space } from "antd";
import type { TableProps } from "antd";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";

interface HistoryItem {
  id: string;
  period: string;
  status: "completed" | "expired" | "inProgress";
  progress: { completed: number; total: number };
  startTime: string;
  deadline: string;
}

const statusConfig: Record<HistoryItem["status"], { color: string; text: string }> = {
  completed: { color: "green", text: "已完成" },
  expired: { color: "red", text: "已截止" },
  inProgress: { color: "blue", text: "进行中" },
};

const historyMock: HistoryItem[] = [
  {
    id: "wm-2025-q4",
    period: "2025年四季度",
    status: "completed",
    progress: { completed: 12, total: 12 },
    startTime: "2025-10-01 00:00:00",
    deadline: "2025-12-31 23:59:59",
  },
  {
    id: "wm-2025-q3",
    period: "2025年三季度",
    status: "completed",
    progress: { completed: 12, total: 12 },
    startTime: "2025-07-01 00:00:00",
    deadline: "2025-09-30 23:59:59",
  },
  {
    id: "wm-2025-q2",
    period: "2025年二季度",
    status: "completed",
    progress: { completed: 11, total: 12 },
    startTime: "2025-04-01 00:00:00",
    deadline: "2025-06-30 23:59:59",
  },
  {
    id: "wm-2025-q1",
    period: "2025年一季度",
    status: "completed",
    progress: { completed: 12, total: 12 },
    startTime: "2025-01-01 00:00:00",
    deadline: "2025-03-31 23:59:59",
  },
  {
    id: "wm-2024-q4",
    period: "2024年四季度",
    status: "completed",
    progress: { completed: 10, total: 10 },
    startTime: "2024-10-01 00:00:00",
    deadline: "2024-12-31 23:59:59",
  },
];

const WorkModuleHistoryPage: React.FC = () => {
  const navigate = useNavigate();

  const columns: TableProps<HistoryItem>["columns"] = [
    {
      title: "任务期次",
      dataIndex: "period",
      key: "period",
      width: 150,
      render: (text) => <Typography.Text strong>{text}</Typography.Text>,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: HistoryItem["status"]) => (
        <Tag color={statusConfig[status].color}>{statusConfig[status].text}</Tag>
      ),
    },
    {
      title: "填报进度",
      key: "progress",
      width: 200,
      render: (_, record) => {
        const percent = Math.round((record.progress.completed / record.progress.total) * 100);
        return (
          <Space direction="vertical" size={0} style={{ width: "100%" }}>
            <Progress percent={percent} size="small" strokeColor={percent === 100 ? "#52c41a" : "#2b5cd6"} />
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              已完成{record.progress.completed}/{record.progress.total}个单位
            </Typography.Text>
          </Space>
        );
      },
    },
    {
      title: "开始时间",
      dataIndex: "startTime",
      key: "startTime",
      width: 140,
      render: (value: string) => value,
    },
    {
      title: "截止时间",
      dataIndex: "deadline",
      key: "deadline",
      width: 140,
      render: (value: string) => value,
    },
    {
      title: "操作",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="link" style={{ padding: 0 }} onClick={() => navigate(`/task/detail/${record.id}`)}>
            查看详情
          </Button>
          <Button type="link" style={{ padding: 0 }} onClick={() => navigate(`/task/work-module/export/${record.id}`)}>
            导出数据
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20, background: "#f3f6fb", minHeight: "100%" }}>
      <Breadcrumb
        style={{ marginBottom: 16 }}
        items={[
          { title: <a onClick={() => navigate("/task")}>采集任务</a> },
          { title: "工作模块历史期次" },
        ]}
      />

      <div
        style={{
          background: "#fff",
          borderRadius: 8,
          padding: "20px 24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/task")}>
              返回
            </Button>
            <Typography.Title level={5} style={{ margin: 0 }}>
              工作模块-历史期次
            </Typography.Title>
          </Space>
        </div>

        <Table<HistoryItem>
          rowKey="id"
          columns={columns}
          dataSource={historyMock}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </div>
    </div>
  );
};

export default WorkModuleHistoryPage;
