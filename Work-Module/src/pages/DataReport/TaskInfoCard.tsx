import React from "react";
import { Card, Descriptions, Tag, Typography } from "antd";

import type { TaskDetail } from "./ReportDetailPage";

interface TaskInfoCardProps {
  task: TaskDetail;
}

const TaskInfoCard: React.FC<TaskInfoCardProps> = ({ task }) => {
  return (
    <Card style={{ borderRadius: 8, marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <Typography.Title level={5} style={{ marginBottom: 0 }}>
          {task.name}
        </Typography.Title>
        <Tag color="green">已上报</Tag>
      </div>

      <Descriptions column={3} size="small" labelStyle={{ color: "#999" }} contentStyle={{ color: "#333" }}>
        <Descriptions.Item label="下发单位">{task.issuer}</Descriptions.Item>
        <Descriptions.Item label="截止时间">{task.deadline}</Descriptions.Item>
        <Descriptions.Item label="提交时间">{task.submittedAt}</Descriptions.Item>
        <Descriptions.Item label="提交人">{task.submitter}</Descriptions.Item>
        <Descriptions.Item label="关联表单数">{task.formCount}个表单</Descriptions.Item>
        <Descriptions.Item label="任务描述" span={3}>
          {task.description}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default TaskInfoCard;
