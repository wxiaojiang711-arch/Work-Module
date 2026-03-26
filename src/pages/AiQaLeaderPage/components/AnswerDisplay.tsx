import React from "react";
import {
  Button,
  Card,
  Collapse,
  Descriptions,
  Empty,
  List,
  Row,
  Col,
  Space,
  Skeleton,
  Statistic,
  Table,
  Tag,
} from "antd";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CopyOutlined,
  FileSearchOutlined,
  FileTextOutlined,
  FormOutlined,
  MessageOutlined,
} from "@ant-design/icons";

import type { QaAnswer } from "../types";
import styles from "./AnswerDisplay.module.css";

interface AnswerDisplayProps {
  answer: QaAnswer | null;
  loading: boolean;
  onGenerateReport: () => void;
  onGenerateTask: (riskId?: string) => void;
  onContinueAsk: () => void;
  onCopySummary: () => void;
  onShowEvidence: () => void;
  onTaskLinkClick: (taskId: string) => void;
}

const AnswerDisplay: React.FC<AnswerDisplayProps> = ({
  answer,
  loading,
  onGenerateReport,
  onGenerateTask,
  onContinueAsk,
  onCopySummary,
  onShowEvidence,
  onTaskLinkClick,
}) => {
  if (loading) {
    return (
      <div className={styles.answerArea}>
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  if (!answer) {
    return (
      <div className={styles.answerArea}>
        <div className={styles.emptyWrapper}>
          <Empty description="请输入问题或点击推荐问题开始" />
        </div>
      </div>
    );
  }

  const riskColumns = [
    { title: "风险标题", dataIndex: "title", key: "title", width: 220 },
    {
      title: "等级",
      dataIndex: "level",
      key: "level",
      width: 100,
      render: (level: "red" | "yellow") => (
        <Tag color={level === "red" ? "error" : "warning"}>{level === "red" ? "红灯" : "黄灯"}</Tag>
      ),
    },
    { title: "影响范围", dataIndex: "impact", key: "impact" },
    { title: "建议动作", dataIndex: "suggestion", key: "suggestion" },
    {
      title: "状态",
      key: "status",
      width: 180,
      render: (_: unknown, record: QaAnswer["risks"][number]) =>
        record.taskId ? (
          <Button type="link" size="small" onClick={() => onTaskLinkClick(record.taskId as string)}>
            已生成任务 {record.taskId}
          </Button>
        ) : (
          <span>待生成</span>
        ),
    },
    {
      title: "操作",
      key: "action",
      width: 120,
      render: (_: unknown, record: QaAnswer["risks"][number]) => (
        <Button size="small" onClick={() => onGenerateTask(record.id)}>
          生成任务
        </Button>
      ),
    },
  ];

  return (
    <div className={styles.answerArea}>
      <Space style={{ marginBottom: 16 }} wrap>
        <Button icon={<FileTextOutlined />} onClick={onGenerateReport}>
          生成领导简报
        </Button>
        <Button type="primary" icon={<FormOutlined />} onClick={() => onGenerateTask()}>
          生成数据上报任务
        </Button>
        <Button icon={<MessageOutlined />} onClick={onContinueAsk}>
          继续追问
        </Button>
        <Button icon={<CopyOutlined />} onClick={onCopySummary}>
          复制要点
        </Button>
        <Button icon={<FileSearchOutlined />} onClick={onShowEvidence}>
          查看依据
        </Button>
      </Space>

      <Card title="结论摘要" style={{ marginBottom: 16 }}>
        <List
          dataSource={answer.summary}
          renderItem={(item, index) => (
            <List.Item>
              {index + 1}. {item}
            </List.Item>
          )}
        />
      </Card>

      <Card title="关键指标" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          {answer.kpis.map((kpi) => (
            <Col span={6} lg={6} md={8} sm={12} xs={24} key={kpi.key}>
              <Statistic
                title={kpi.label}
                value={kpi.value}
                suffix={kpi.unit}
                prefix={kpi.trend === "up" ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              />
              <Tag color={kpi.status === "red" ? "error" : kpi.status === "yellow" ? "warning" : "success"}>
                {kpi.status === "red" ? "红灯" : kpi.status === "yellow" ? "黄灯" : "绿灯"}
              </Tag>
            </Col>
          ))}
        </Row>
      </Card>

      <Card title="趋势与对比" style={{ marginBottom: 16 }}>
        <div style={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
          图表占位区域（可后续接入 @ant-design/charts）
        </div>
      </Card>

      <Card title="风险与影响面" style={{ marginBottom: 16 }}>
        <Table rowKey="id" dataSource={answer.risks} columns={riskColumns} pagination={false} size="small" />
      </Card>

      <Card title="处置建议" style={{ marginBottom: 16 }}>
        <List dataSource={answer.actions} renderItem={(item) => <List.Item>{item.text}</List.Item>} />
      </Card>

      <Card title="指标口径摘要" style={{ marginBottom: 16 }}>
        <Collapse
          items={answer.evidence.definitions.map((def) => ({
            key: def.id,
            label: def.name,
            children: (
              <Descriptions column={1}>
                <Descriptions.Item label="内容">{def.content}</Descriptions.Item>
                <Descriptions.Item label="责任单位">{def.responsible}</Descriptions.Item>
                <Descriptions.Item label="更新时间">{def.updatedAt}</Descriptions.Item>
              </Descriptions>
            ),
          }))}
        />
      </Card>

      <Card title="规则命中TOP5" style={{ marginBottom: 16 }}>
        <Table
          rowKey="id"
          dataSource={answer.evidence.rules.slice(0, 5)}
          columns={[
            { title: "规则名称", dataIndex: "name", key: "name" },
            { title: "规则描述", dataIndex: "content", key: "content" },
            { title: "更新时间", dataIndex: "updatedAt", key: "updatedAt", width: 120 },
          ]}
          pagination={false}
          size="small"
        />
      </Card>

      <Card title="血缘影响摘要" style={{ marginBottom: 16 }}>
        {answer.evidence.lineage.map((item) => (
          <Descriptions key={item.id} column={1} bordered size="small" style={{ marginBottom: 10 }}>
            <Descriptions.Item label="血缘关系">{item.content}</Descriptions.Item>
          </Descriptions>
        ))}
      </Card>
    </div>
  );
};

export default AnswerDisplay;
