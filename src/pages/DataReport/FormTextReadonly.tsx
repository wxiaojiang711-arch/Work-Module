import React from "react";
import { Button, Descriptions, Space, Typography } from "antd";

import type { FormTextData } from "./ReportDetailPage";
import styles from "./DataReport.module.css";

interface FormTextReadonlyProps {
  data: FormTextData;
}

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
        <Descriptions.Item label="上报单位">{data.basicInfo.orgName}</Descriptions.Item>
        <Descriptions.Item label="上报人">{data.basicInfo.reporter}</Descriptions.Item>
        <Descriptions.Item label="上报日期">{data.basicInfo.reportDate}</Descriptions.Item>
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
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {data.attachments.map((file) => (
            <div
              key={file.id}
              className={styles.attachmentItem}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ fontSize: 14, color: "#333" }}>
                  {file.name}
                  <span style={{ marginLeft: 10, fontSize: 12, color: "#999" }}>{file.size}</span>
                </div>
              </div>
              <Space size={12}>
                <Button type="link" style={{ paddingInline: 4 }} onClick={() => void 0}>
                  预览
                </Button>
                <Button type="link" style={{ paddingInline: 4 }} onClick={() => void 0}>
                  下载
                </Button>
              </Space>
            </div>
          ))}
        </div>
      ) : (
        <span className={styles.sourceText}>无附件</span>
      )}
    </div>
  );
};

export default FormTextReadonly;
