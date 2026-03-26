import React from "react";
import { Progress, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";

import type { FormTableData1, FormTableData2 } from "./ReportDetailPage";
import styles from "./DataReport.module.css";

interface FormTableReadonlyProps {
  data: FormTableData1 | FormTableData2;
  tableType: "quantitative" | "project";
}

const projectTypeColorMap: Record<string, string> = {
  基建类: "blue",
  信息化类: "green",
  民生类: "orange",
  产业类: "purple",
};

const rateColor = (rate: number) => {
  if (rate > 100) return "#52c41a";
  if (rate < 60) return "#ff4d4f";
  return "#1677ff";
};

const QuantitativeTable: React.FC<{ data: FormTableData1 }> = ({ data }) => {
  const columns: ColumnsType<FormTableData1["rows"][number]> = [
    { title: "序号", dataIndex: "id", key: "id", width: 72 },
    { title: "指标名称", dataIndex: "name", key: "name", width: 220 },
    { title: "计量单位", dataIndex: "unit", key: "unit", width: 100 },
    { title: "年度目标值", dataIndex: "yearTarget", key: "yearTarget", width: 120 },
    { title: "本季度完成值", dataIndex: "quarterValue", key: "quarterValue", width: 130 },
    { title: "累计完成值", dataIndex: "totalValue", key: "totalValue", width: 130 },
    {
      title: "完成率",
      dataIndex: "rate",
      key: "rate",
      width: 180,
      render: (rate: number) => (
        <Progress
          percent={Math.round(rate)}
          size="small"
          status="active"
          strokeColor={rateColor(rate)}
          format={(value) => <span style={{ color: rateColor(rate), fontWeight: 500 }}>{value}%</span>}
        />
      ),
    },
    { title: "备注", dataIndex: "remark", key: "remark" },
  ];

  return <Table rowKey="id" bordered size="small" pagination={false} columns={columns} dataSource={data.rows} />;
};

const ProjectTable: React.FC<{ data: FormTableData2 }> = ({ data }) => {
  const columns: ColumnsType<FormTableData2["rows"][number]> = [
    { title: "序号", dataIndex: "id", key: "id", width: 72 },
    { title: "项目名称", dataIndex: "name", key: "name", width: 180 },
    {
      title: "项目类型",
      dataIndex: "type",
      key: "type",
      width: 110,
      render: (type: string) => <Tag color={projectTypeColorMap[type] ?? "default"}>{type}</Tag>,
    },
    { title: "总投资（万元）", dataIndex: "totalInvestment", key: "totalInvestment", width: 130 },
    { title: "本季度完成投资（万元）", dataIndex: "quarterInvestment", key: "quarterInvestment", width: 170 },
    { title: "累计完成投资（万元）", dataIndex: "totalCompleted", key: "totalCompleted", width: 160 },
    {
      title: "投资完成率",
      dataIndex: "rate",
      key: "rate",
      width: 180,
      render: (rate: number) => (
        <Progress
          percent={Math.round(rate)}
          size="small"
          status="active"
          strokeColor={rateColor(rate)}
          format={(value) => <span style={{ color: rateColor(rate), fontWeight: 500 }}>{value}%</span>}
        />
      ),
    },
    { title: "当前进展", dataIndex: "progress", key: "progress", width: 260 },
    { title: "存在问题", dataIndex: "problems", key: "problems", width: 220 },
    { title: "责任人", dataIndex: "owner", key: "owner", width: 90, fixed: "right" },
  ];

  return (
    <Table
      rowKey="id"
      bordered
      size="small"
      pagination={false}
      columns={columns}
      dataSource={data.rows}
      scroll={{ x: 1700 }}
    />
  );
};

const FormTableReadonly: React.FC<FormTableReadonlyProps> = ({ data, tableType }) => {
  return (
    <div>
      {tableType === "quantitative" ? (
        <QuantitativeTable data={data as FormTableData1} />
      ) : (
        <ProjectTable data={data as FormTableData2} />
      )}
      <div className={styles.sourceText}>数据来源：{data.source}</div>
    </div>
  );
};

export default FormTableReadonly;
