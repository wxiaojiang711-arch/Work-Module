import React from "react";
import { Alert, Button, Card, Col, Progress, Row, Space, Tag, Typography } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

import { generatingSteps } from "../smartReportMockData";

type Props = {
  topic: string;
  progress: number;
  elapsed: number;
  currentStep: number;
  metrics: Array<{ name: string; value: number; color: string }>;
  onRefresh: () => void;
  onClose: () => void;
};

const ReportGenerating: React.FC<Props> = ({ topic, progress, elapsed, currentStep, metrics, onRefresh, onClose }) => {
  const logs = generatingSteps.slice(0, Math.max(1, currentStep));

  return (
    <div style={{ flex: 1, overflow: "auto", background: "#fff" }}>
      <div style={{ background: "#e6f7ff", borderRadius: 8, padding: "16px 20px", margin: 16 }}>
        <Typography.Title level={5} style={{ margin: 0, color: "#1890ff" }}>正在生成报告：{topic}</Typography.Title>
        <Typography.Text style={{ fontSize: 13, color: "#fa8c16" }}>
          温馨提示：报告正在后台生成中，可关闭当前窗口，若长时间报告未生成成功，请点击刷新按钮。
        </Typography.Text>
      </div>

      <div style={{ padding: "0 16px" }}>
        <Row gutter={16}>
          <Col flex="200px">
            <Space direction="vertical" size={12} style={{ width: "100%" }}>
              <Card>
                <div style={{ textAlign: "center" }}>
                  <Space direction="vertical" size={10}>
                    <Space>
                      <Tag color="blue">正在生成报告</Tag>
                      <Typography.Text type="secondary">{elapsed}s</Typography.Text>
                    </Space>
                    <Progress type="circle" percent={progress} size={120} />
                    <Typography.Text>整体进度</Typography.Text>
                  </Space>
                </div>
              </Card>

              <Card title="分析指标">
                <Row gutter={[8, 8]}>
                  {metrics.map((m) => (
                    <Col span={12} key={m.name}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 6, height: Math.max(10, m.value), borderRadius: 4, background: m.color }} />
                        <div>
                          <div style={{ fontSize: 12, color: "#999" }}>{m.name}</div>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{m.value}</div>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card>
            </Space>
          </Col>

          <Col flex="auto">
            <div style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#1890ff", display: "inline-block" }} />
              <Typography.Text style={{ color: "#1890ff" }}>执行第{currentStep}步，共10步</Typography.Text>
            </div>

            <div style={{ background: "#1e1e1e", borderRadius: 8, padding: 16, minHeight: 420, color: "#d4d4d4", fontFamily: "'Courier New', monospace", fontSize: 13 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f56" }} />
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ffbd2e" }} />
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#27c93f" }} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {logs.map((l, idx) => {
                  const isCurrent = idx === logs.length - 1;
                  const color = isCurrent ? "#58a6ff" : "#3fb950";
                  return (
                    <div key={l.step} style={{ color }}>
                      {!isCurrent ? "✓ " : ""}[{`0${l.step}`.slice(-2)}] {l.description}
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: 14, color: "#58a6ff" }}>
                当前执行任务：{generatingSteps[Math.max(0, currentStep - 1)]?.description}
              </div>
              <Progress percent={progress} strokeColor="#58a6ff" showInfo={false} style={{ marginTop: 8 }} />
            </div>
          </Col>
        </Row>
      </div>

      <div style={{ padding: 16, display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Button type="primary" icon={<ReloadOutlined />} onClick={onRefresh}>刷新</Button>
        <Button onClick={onClose}>关闭</Button>
      </div>
    </div>
  );
};

export default ReportGenerating;
