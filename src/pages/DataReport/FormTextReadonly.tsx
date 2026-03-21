import React from "react";
import { Button, Descriptions, Space, Typography } from "antd";
import {
  FileExcelOutlined,
  FileImageOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";

import type { FormTextData } from "./ReportDetailPage";
import styles from "./DataReport.module.css";

interface FormTextReadonlyProps {
  data: FormTextData;
}

const fileTypeColorMap: Record<string, string> = {
  docx: "#1890ff",
  doc: "#1890ff",
  xlsx: "#52c41a",
  xls: "#52c41a",
  pdf: "#ff4d4f",
  jpg: "#fa8c16",
  png: "#fa8c16",
};

const renderFileIcon = (type: string) => {
  const color = fileTypeColorMap[type] ?? "#8c8c8c";

  if (["doc", "docx"].includes(type)) {
    return <FileWordOutlined style={{ color }} className={styles.fileIcon} />;
  }
  if (["xls", "xlsx"].includes(type)) {
    return <FileExcelOutlined style={{ color }} className={styles.fileIcon} />;
  }
  if (type === "pdf") {
    return <FilePdfOutlined style={{ color }} className={styles.fileIcon} />;
  }
  if (["jpg", "png"].includes(type)) {
    return <FileImageOutlined style={{ color }} className={styles.fileIcon} />;
  }
  return <PaperClipOutlined style={{ color }} className={styles.fileIcon} />;
};

const ReadonlyField: React.FC<{ label: string; required: boolean; aiGenerated?: boolean; value?: string }> = ({
  label,
  required,
  aiGenerated,
  value,
}) => {
  const empty = !value?.trim();

  return (
    <div>
      <div className={styles.readonlyFieldLabelRow}>
        <span className={styles.readonlyFieldLabel}>{label}</span>
        <span className={styles.readonlyFieldRequired}>{required ? "必填" : "选填"}</span>
      </div>
      <div className={styles.readonlyFieldContent}>
        {aiGenerated ? <span className={styles.aiTag}>AI填充</span> : null}
        {empty ? <span className={styles.emptyText}>未填写</span> : <Typography.Paragraph style={{ marginBottom: 0 }}>{value}</Typography.Paragraph>}
      </div>
    </div>
  );
};

const FormTextReadonly: React.FC<FormTextReadonlyProps> = ({ data }) => {
  return (
    <div>
      <div className={styles.groupTitle}>第一组：基本信息</div>
      <Descriptions bordered size="small" column={4} labelStyle={{ color: "#999" }} contentStyle={{ color: "#333" }}>
        <Descriptions.Item label="填报单位">{data.basicInfo.orgName}</Descriptions.Item>
        <Descriptions.Item label="填报人">{data.basicInfo.reporter}</Descriptions.Item>
        <Descriptions.Item label="填报日期">{data.basicInfo.reportDate}</Descriptions.Item>
        <Descriptions.Item label="报告期间">{data.basicInfo.reportPeriod}</Descriptions.Item>
      </Descriptions>

      {data.fields.map((group, index) => (
        <div key={group.group}>
          <div className={styles.groupTitle}>第{index + 2}组：{group.group}</div>
          {group.items.map((item) => (
            <ReadonlyField
              key={item.key}
              label={item.label}
              required={item.required}
              aiGenerated={item.aiGenerated}
              value={item.value}
            />
          ))}
        </div>
      ))}

      <div className={styles.groupTitle}>第六组：附件</div>
      {data.attachments.length ? (
        <Space direction="vertical" style={{ width: "100%" }}>
          {data.attachments.map((file) => (
            <div className={styles.attachmentItem} key={file.id}>
              {renderFileIcon(file.type)}
              <span className={styles.fileName}>{file.name}</span>
              <span className={styles.fileSize}>{file.size}</span>
              <Button type="link" style={{ paddingInline: 0 }} onClick={() => void 0}>
                下载
              </Button>
            </div>
          ))}
        </Space>
      ) : (
        <span className={styles.sourceText}>无附件</span>
      )}
    </div>
  );
};

export default FormTextReadonly;
