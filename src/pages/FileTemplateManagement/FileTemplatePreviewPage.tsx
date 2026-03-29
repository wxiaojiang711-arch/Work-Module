import React, { useMemo, useState } from "react";
import { Card, Form, Input } from "antd";
import dayjs from "dayjs";

import styles from "../DataReport/DataReport.module.css";
import {
  buildInitialFormData,
  currentUser,
  formFieldsConfig,
  type FormFieldKey,
  type ReportFormData,
} from "../../mobile/pages/reportFillMockData";

const groupOrder = ["基本信息", "本季度工作完成情况", "特色亮点", "存在问题与困难", "下季度工作计划"];

const placeholderMap: Partial<Record<FormFieldKey, string>> = {
  keyWorkCompletion: "请详细描述本季度重点工作的完成情况，包括目标达成度、关键节点完成情况等",
  quantitativeIndicators: "请列举本季度主要量化指标的完成数据，如任务完成数、完成率、同比增长等",
  keyProjectProgress: "如有重点项目，请描述项目进展、投资完成情况、存在问题等",
  budgetExecution: "请说明本季度相关经费的使用情况，包括预算执行率、主要支出方向等",
  innovationHighlights: "请描述本季度工作中的创新做法、典型经验或突出成效",
  honorsAndAwards: "如有获得上级表彰、媒体报道等情况，请简要说明",
  mainProblems: "请客观分析本季度工作中遇到的主要问题、困难和不足",
  causeAnalysis: "请分析产生上述问题的主要原因",
  keyWorkPlan: "请列出下季度的重点工作计划和目标",
  resourceSupport: "请说明下季度工作推进中预计需要的人力、资金、政策等资源支持",
  coordinationMatters: "如需上级部门或其他单位协调支持的事项，请具体说明",
};

const FileTemplatePreviewPage: React.FC = () => {
  const [formData] = useState<ReportFormData>(buildInitialFormData());
  const today = dayjs().format("YYYY-MM-DD");

  const grouped = useMemo(() => {
    const map: Record<string, Array<(typeof formFieldsConfig)[number]>> = {
      基本信息: [],
      本季度工作完成情况: [],
      特色亮点: [],
      存在问题与困难: [],
      下季度工作计划: [],
    };
    formFieldsConfig.forEach((f) => map[f.group].push(f));
    return map;
  }, []);

  return (
    <div className={styles.page}>
      <Card className={styles.formCard}>
        <div className={styles.formSection}>
          <Form layout="vertical" style={{ marginTop: 16 }}>
            {groupOrder.map((groupName, groupIndex) => (
              <div key={groupName}>
                <div
                  style={{
                    marginTop: groupIndex === 0 ? 0 : 20,
                    marginBottom: 12,
                    fontSize: 15,
                    fontWeight: 500,
                  }}
                >
                  {groupIndex + 1 === 1
                    ? "第一组："
                    : groupIndex + 1 === 2
                      ? "第二组："
                      : groupIndex + 1 === 3
                        ? "第三组："
                        : groupIndex + 1 === 4
                          ? "第四组："
                          : "第五组："}
                  {groupName}
                </div>

                {groupName === "基本信息" ? (
                  <>
                    <Form.Item label="填报单位">
                      <Input value={currentUser.orgName} disabled style={{ background: "#f5f5f5" }} />
                    </Form.Item>
                    <Form.Item label="填报人">
                      <Input value={currentUser.name} disabled style={{ background: "#f5f5f5" }} />
                    </Form.Item>
                    <Form.Item label="填报日期">
                      <Input value={today} disabled style={{ background: "#f5f5f5" }} />
                    </Form.Item>
                  </>
                ) : null}

                {grouped[groupName].map((field) => {
                  const key = field.key;
                  const value = formData[key] || "";
                  const maxLen = field.maxLength || 0;
                  const count = value.length;
                  const ratio = maxLen ? count / maxLen : 0;
                  const countColor = maxLen && count >= maxLen ? "#ff4d4f" : ratio > 0.9 ? "#fa8c16" : "#bfbfbf";

                  if (key === "reportPeriod") {
                    return (
                      <div key={key} style={{ position: "relative" }}>
                        <Form.Item
                          label={
                            <span>
                              {field.required ? <span style={{ color: "#ff4d4f", marginRight: 4 }}>*</span> : null}
                              {field.label}
                            </span>
                          }
                        >
                          <select
                            disabled
                            value={value}
                            style={{
                              width: "100%",
                              height: 36,
                              borderRadius: 8,
                              border: "1px solid #e8e8e8",
                              padding: "0 10px",
                              background: "#f5f5f5",
                            }}
                          >
                            <option value="">请选择报告期间</option>
                            <option value="2024-Q1">2024年第一季度</option>
                            <option value="2024-Q2">2024年第二季度</option>
                            <option value="2024-Q3">2024年第三季度</option>
                            <option value="2024-Q4">2024年第四季度</option>
                          </select>
                        </Form.Item>
                      </div>
                    );
                  }

                  return (
                    <div key={key} style={{ position: "relative" }}>
                      <Form.Item
                        label={
                          <span>
                            {field.required ? <span style={{ color: "#ff4d4f", marginRight: 4 }}>*</span> : null}
                            {field.label}
                          </span>
                        }
                      >
                        <Input.TextArea
                          disabled
                          autoSize={{ minRows: 4, maxRows: 10 }}
                          maxLength={maxLen}
                          value={value}
                          placeholder={placeholderMap[key]}
                          style={{
                            borderRadius: 8,
                            borderColor: "#e8e8e8",
                            background: "#f5f5f5",
                          }}
                        />
                        <div style={{ textAlign: "right", fontSize: 12, color: countColor }}>
                          {count}/{maxLen}
                        </div>
                      </Form.Item>
                    </div>
                  );
                })}
              </div>
            ))}
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default FileTemplatePreviewPage;
