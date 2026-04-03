import React from "react";
import { Card, Steps, Tabs, Tag } from "antd";
import type { StepsProps } from "antd";

import type { TaskDetail } from "./ReportDetailPage";

interface TaskInfoCardProps {
  task: TaskDetail;
  reportStatusText?: string;
}

const TaskInfoCard: React.FC<TaskInfoCardProps> = ({ task, reportStatusText }) => {
  const getAuditDetailSteps = (): StepsProps["items"] => {
    const submitTime = task.submittedAt || "-";
    const auditTime = "2024-03-20 10:00:00";
    const auditStatus = task.status === "submitted" ? "通过" : "待审核";
    return [
      {
        title: "数据专员",
        status: "finish",
        description: (
          <div style={{ marginTop: 8, fontSize: 13, color: "#666" }}>
            <div>审核状态：通过</div>
            <div>审核备注：-</div>
            <div style={{ whiteSpace: "nowrap" }}>审核时间：{submitTime}</div>
          </div>
        ),
      },
      {
        title: "单位管理员",
        status: "error",
        description: (
          <div style={{ marginTop: 8, fontSize: 13, color: "#666" }}>
            <div>审核状态：{auditStatus}</div>
            <div>审核备注：-</div>
            <div style={{ whiteSpace: "nowrap" }}>审核时间：{auditTime}</div>
          </div>
        ),
      },
      {
        title: "区委办公室",
        status: "process",
        description: (
          <div style={{ marginTop: 8, fontSize: 13, color: "#666" }}>
            <div>审核状态：待审核</div>
            <div>审核备注：-</div>
            <div style={{ whiteSpace: "nowrap" }}>审核时间：-</div>
          </div>
        ),
      },
    ];
  };

  return (
    <Card style={{ borderRadius: 8, marginBottom: 16 }}>
      <Tabs
        style={{ marginTop: -8 }}
        tabBarStyle={{ margin: "0 0 4px" }}
        items={[
          {
            key: "report",
            label: <span style={{ fontSize: 15 }}>上报信息</span>,
            children: (
              <div style={{ paddingTop: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "10px 16px" }}>
                  <div style={{ fontSize: 14, color: "#666" }}>下发单位：{task.issuer}</div>
                  <div style={{ fontSize: 14, color: "#666" }}>关联表单数：{task.formCount}个表单</div>
                  <div style={{ fontSize: 14, color: "#666" }}>
                    紧急程度：
                    <Tag
                      color={
                        task.urgentLevel === "紧急"
                          ? "red"
                          : task.urgentLevel === "较紧急"
                            ? "orange"
                            : "default"
                      }
                      style={{ marginLeft: 6 }}
                    >
                      {task.urgentLevel}
                    </Tag>
                  </div>
                  <div style={{ fontSize: 14, color: "#666" }}>上报人：{task.submitter}</div>
                  <div style={{ fontSize: 14, color: "#666" }}>上报时间：{task.submittedAt}</div>
                  <div style={{ fontSize: 14, color: "#666" }}>
                    上报状态：
                    <span
                      style={
                        (reportStatusText ?? (task.status === "revoked" ? "已撤销" : "已上报")).includes("撤销")
                          ? { color: "#ff4d4f", fontWeight: 600 }
                          : {}
                      }
                    >
                      {reportStatusText ?? (task.status === "revoked" ? "已撤销" : "已上报")}
                    </span>
                  </div>
                </div>
                {task.status === "revoked" ? (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                      gap: "10px 16px",
                      marginTop: 10,
                    }}
                  >
                    <div style={{ fontSize: 14, color: "#666" }}>撤销时间：{task.revokedAt || "-"}</div>
                    <div style={{ fontSize: 14, color: "#666" }}>撤销原因：{task.revokedReason || "-"}</div>
                  </div>
                ) : null}
              </div>
            ),
          },
          {
            key: "audit",
            label: <span style={{ fontSize: 15 }}>审核信息</span>,
            children: (
              <div style={{ maxWidth: 1440, paddingTop: 12 }}>
                <Steps direction="horizontal" size="small" items={getAuditDetailSteps()} />
              </div>
            ),
          },
        ]}
      />
    </Card>
  );
};

export default TaskInfoCard;
