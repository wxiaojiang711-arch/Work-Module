import React from "react";
import {
  Alert,
  Button,
  Card,
  Collapse,
  Divider,
  Modal,
  Progress,
  Row,
  Col,
  Space,
  Statistic,
  Table,
  Tag,
  Timeline,
  Typography,
  message,
} from "antd";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  FilePdfOutlined,
  MinusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

import SourceTag from "./SourceTag";
import { type ReportContentData, type ReportItem } from "../smartReportMockData";

type Props = {
  report: ReportItem;
  content: ReportContentData;
  onRegenerate: () => void;
};

const rankColorMap: Record<number, string> = { 1: "#ffd700", 2: "#c0c0c0", 3: "#cd7f32" };

const insertSources = (text: string, sources: Array<{ text: string; source: string }>) => {
  if (!sources.length) return <>{text}</>;
  const nodes: React.ReactNode[] = [text];
  sources.forEach((s, idx) => {
    nodes.push(<SourceTag key={`${s.text}-${idx}`} source={s.source} />);
  });
  return <>{nodes}</>;
};

const ReportContent: React.FC<Props> = ({ report, content, onRegenerate }) => {
  const rankingColumns = [
    {
      title: "排名",
      dataIndex: "rank",
      key: "rank",
      width: 70,
      render: (rank: number) =>
        rank <= 3 ? (
          <span
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: rankColorMap[rank],
              color: "#fff",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
            }}
          >
            {rank}
          </span>
        ) : (
          <span style={{ color: "#999" }}>{rank}</span>
        ),
    },
    { title: "单位名称", dataIndex: "name", key: "name" },
    { title: "任务完成数", dataIndex: "taskCount", key: "taskCount" },
    {
      title: "完成率",
      dataIndex: "completionRate",
      key: "completionRate",
      render: (v: number) => <Progress percent={v} size="small" status={v < 60 ? "exception" : "active"} />,
    },
    { title: "上报及时率", dataIndex: "reportRate", key: "reportRate", render: (v: number) => `${v}%` },
    { title: "综合评分", dataIndex: "score", key: "score" },
  ];

  const trendNode = (trend: "up" | "down" | "flat", value: string) => {
    if (trend === "up") return <span style={{ color: "#52c41a" }}><ArrowUpOutlined /> {value}</span>;
    if (trend === "down") return <span style={{ color: "#ff4d4f" }}><ArrowDownOutlined /> {value}</span>;
    return <span style={{ color: "#999" }}><MinusOutlined /> {value}</span>;
  };

  return (
    <div style={{ flex: 1, overflow: "auto", background: "#f5f5f5" }}>
      <style>{`.smart-low-rate-row td{background:#fff1f0 !important;}`}</style>
      <div style={{ position: "sticky", top: 0, zIndex: 5, padding: "12px 20px", borderBottom: "1px solid #f0f0f0", background: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography.Title level={5} style={{ marginBottom: 0 }}>{report.title}</Typography.Title>
        <Space>
          <Button icon={<FilePdfOutlined />} onClick={() => message.info("功能开发中，敬请期待")}>下载PDF报告</Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              Modal.confirm({
                title: "确认重新生成此报告？原报告内容将被覆盖。",
                okText: "确认",
                cancelText: "取消",
                onOk: onRegenerate,
              });
            }}
          >
            重新生成
          </Button>
        </Space>
      </div>

      <div style={{ maxWidth: 900, margin: "16px auto", background: "#fff", border: "1px solid #f0f0f0", borderRadius: 8, padding: "24px 32px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <Typography.Title level={3} style={{ textAlign: "center", marginBottom: 8 }}>{content.title}</Typography.Title>
        <div style={{ textAlign: "center", fontSize: 13, color: "#999", lineHeight: 1.8 }}>
          <div>生成时间：{content.generatedAt}</div>
          <div>数据周期：{content.dataRange}</div>
          <div>数据来源：基于{content.sourceCount}的数据分析生成</div>
        </div>

        <Typography.Title level={5} style={{ marginTop: 24, marginBottom: 16 }}>一、报告概要</Typography.Title>
        <Alert
          type="info"
          showIcon
          message={
            <div style={{ lineHeight: 1.8 }}>
              {content.summary.map((s, idx) => (
                <p key={idx} style={{ marginBottom: 10 }}>{insertSources(s.text, s.sources)}</p>
              ))}
            </div>
          }
        />

        <Typography.Title level={5} style={{ marginTop: 24, marginBottom: 16 }}>二、数据总览</Typography.Title>
        <Row gutter={[12, 12]}>
          {content.statistics.map((s) => (
            <Col span={8} key={s.title}>
              <Card hoverable bodyStyle={{ padding: "16px 20px" }} style={{ borderRadius: 8, transition: "box-shadow 0.3s" }}>
                <Statistic title={s.title} value={s.value} suffix={s.suffix} />
                <div style={{ marginTop: 8 }}>{trendNode(s.trend, s.trendValue)}</div>
                <div style={{ fontSize: 12, color: "#bfbfbf", marginTop: 8, borderTop: "1px dashed #f0f0f0", paddingTop: 8 }}>
                  来源：{s.source}
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        <Typography.Title level={5} style={{ marginTop: 24, marginBottom: 16 }}>三、各单位工作完成情况</Typography.Title>
        <Table
          size="small"
          pagination={false}
          dataSource={content.unitRanking}
          columns={rankingColumns}
          rowKey="rank"
          rowClassName={(r: (typeof content.unitRanking)[number]) => (r.completionRate < 60 ? "smart-low-rate-row" : "")}
        />
        <div style={{ height: 300, background: "#fafafa", borderRadius: 8, border: "1px dashed #d9d9d9", marginTop: 16, display: "flex", alignItems: "center", justifyContent: "center", color: "#999" }}>
          [各单位完成率柱状图 - 可集成ECharts/AntV]
        </div>
        <div style={{ fontSize: 12, color: "#bfbfbf", marginTop: 8 }}>数据来源：采集任务系统-各单位任务完成统计、数据上报模块-各单位上报及时率统计</div>

        <Collapse
          defaultActiveKey={["department", "town", "soe"]}
          style={{ marginTop: 16 }}
          items={[
            {
              key: "department",
              label: content.categoryAnalysis.department.title,
              children: <div style={{ fontSize: 14, lineHeight: 1.8, color: "#333" }}>{insertSources(content.categoryAnalysis.department.content, content.categoryAnalysis.department.sources)}</div>,
            },
            {
              key: "town",
              label: content.categoryAnalysis.town.title,
              children: <div style={{ fontSize: 14, lineHeight: 1.8, color: "#333" }}>{insertSources(content.categoryAnalysis.town.content, content.categoryAnalysis.town.sources)}</div>,
            },
            {
              key: "soe",
              label: content.categoryAnalysis.soe.title,
              children: <div style={{ fontSize: 14, lineHeight: 1.8, color: "#333" }}>{insertSources(content.categoryAnalysis.soe.content, content.categoryAnalysis.soe.sources)}</div>,
            },
          ]}
        />

        <Typography.Title level={5} style={{ marginTop: 24, marginBottom: 16 }}>四、重点工作进展</Typography.Title>
        <Timeline
          items={content.keyProjects.map((p) => ({
            dot: <span style={{ width: 10, height: 10, borderRadius: "50%", background: p.status === "green" ? "#52c41a" : p.status === "red" ? "#ff4d4f" : "#1890ff", display: "inline-block" }} />,
            children: (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <Typography.Text style={{ fontWeight: 500 }}>{p.name}</Typography.Text>
                  <Tag>{p.unit}</Tag>
                </div>
                <div style={{ lineHeight: 1.8 }}>{insertSources(p.description, p.sources)}</div>
              </div>
            ),
          }))}
        />

        <Typography.Title level={5} style={{ marginTop: 24, marginBottom: 16 }}>五、问题与风险提示</Typography.Title>
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
          {content.risks.map((r) => (
            <Alert
              key={r.title}
              type={r.level}
              showIcon
              style={{ borderRadius: 8 }}
              message={r.title}
              description={
                <div style={{ lineHeight: 1.8 }}>
                  <p>{insertSources(r.description, r.sources)}</p>
                  <p><strong>建议措施：</strong>{r.suggestions}</p>
                </div>
              }
            />
          ))}
        </Space>

        <Typography.Title level={5} style={{ marginTop: 24, marginBottom: 16 }}>六、建议与下一步计划</Typography.Title>
        <ol style={{ margin: 0, paddingLeft: 20 }}>
          {content.suggestions.map((s) => (
            <li key={s.title} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{s.title}</div>
              <div style={{ fontSize: 14, color: "#333", lineHeight: 1.9, marginTop: 6 }}>{s.content}</div>
              <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>建议责任单位：{s.target}</div>
            </li>
          ))}
        </ol>

        <div style={{ marginTop: 24, display: "flex", justifyContent: "center" }}>
          <Button type="primary" icon={<FilePdfOutlined />} onClick={() => message.info("功能开发中，敬请期待")}>
            下载PDF报告
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportContent;

