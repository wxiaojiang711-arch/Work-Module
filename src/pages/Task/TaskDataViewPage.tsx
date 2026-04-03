import React, { useEffect, useMemo, useRef, useState } from "react";
import { Breadcrumb, Button, Card, Divider, Empty, Input, Modal, Space, Steps, Tabs, Tag, message } from "antd";
import type { StepsProps } from "antd";
import { Link, useLocation, useParams } from "react-router-dom";

import {
  availableTemplates,
  fillStatusTextMap,
  taskListMock,
  taskTemplateMap,
  unitProgressMock,
  type UnitProgressItem,
} from "./taskConstants";
import styles from "./TaskDataViewPage.module.css";
import reportStyles from "../DataReport/DataReport.module.css";

type StepOneData = {
  职能职责: string;
  组织架构: string;
};

type CardItem = { id: string; title: string; detail: string };
type IndicatorRow = { id: string; name: string; values: string[] };
type TaskRow = { id: string; name: string; quarters: string[]; owner: string };

type FileFormData = {
  fileId: string;
  fileName: string;
  templateId: string;
  step1: StepOneData;
  step2: { files: string[] };
  step3: CardItem[];
  step4: string;
  step5: CardItem[];
  step6: CardItem[];
  step7: IndicatorRow[];
  step8: TaskRow[];
};

type UnitFormData = {
  unitName: string;
  files: FileFormData[];
};

const makeDataGovernanceFile = (): FileFormData => ({
  fileId: "file-001",
  fileName: "数据治理实施方案",
  templateId: "tpl-001",
  step1: {
    职能职责: "负责全区数据治理与共享交换，统筹推进数字政府建设和重点信息化项目落地。",
    组织架构: "设有数据治理科、平台建设科、应用推广科，现有工作人员30人。",
  },
  step2: {
    files: ["数据治理实施方案（正文）.pdf", "数据治理任务分工表.xlsx"],
  },
  step3: [
    { id: "1", title: "数据治理", detail: "建立全区统一数据标准体系，推进多源数据清洗、汇聚和质量管理。" },
    { id: "2", title: "数据共享", detail: "建设跨部门共享交换平台，打通重点业务系统数据链路。" },
    { id: "3", title: "场景应用", detail: "围绕城市运行、民生服务等场景建设数据应用专题。" },
  ],
  step4: "以“平台统一、标准统一、数据统一”为主线，持续提升数据资源治理能力和业务支撑能力。",
  step5: [
    { id: "1", title: "数据中台一期", detail: "完成核心模块建设并接入15个委办局重点数据源。" },
    { id: "2", title: "城市运行大屏", detail: "建成城市运行监测看板，实现重点指标实时展示。" },
  ],
  step6: [
    { id: "1", title: "数据质量参差不齐", detail: "部分部门历史数据缺失，口径不一致，影响横向对比分析。" },
    { id: "2", title: "共享协同机制待强化", detail: "跨部门协同流程仍有堵点，部分共享需求响应时效偏慢。" },
  ],
  step7: [
    { id: "1", name: "数据接入量(TB)", values: ["100", "150", "200", "250", "300", "350", "400"] },
    { id: "2", name: "共享接口数", values: ["50", "80", "120", "150", "180", "220", "280"] },
  ],
  step8: [
    { id: "1", name: "数据治理提升", quarters: ["完成标准制定", "推进数据清洗", "建立质量评估", "持续优化机制"], owner: "张三" },
    { id: "2", name: "平台能力建设", quarters: ["需求调研", "系统开发", "试点运行", "全面推广"], owner: "李四" },
  ],
});

const makeServiceCapabilityFile = (): FileFormData => ({
  fileId: "file-002",
  fileName: "公共服务能力提升清单",
  templateId: "tpl-002",
  step1: {
    职能职责: "负责公共服务事项统筹管理，推进业务协同和服务效率提升。",
    组织架构: "设综合协调组、流程优化组、监督评估组，形成闭环管理机制。",
  },
  step2: {
    files: ["公共服务能力提升清单.docx", "服务事项流程图.vsdx"],
  },
  step3: [
    { id: "1", title: "事项梳理", detail: "按业务链条梳理服务事项，明确责任环节与办结时限。" },
    { id: "2", title: "流程优化", detail: "聚焦高频事项压减材料和环节，缩短平均办理时长。" },
    { id: "3", title: "质量评估", detail: "建立服务质量评价指标体系并开展季度复盘。" },
  ],
  step4: "坚持“减环节、减材料、减时限”，持续提升群众和企业办事便利度。",
  step5: [
    { id: "1", title: "高频事项提速", detail: "20项高频事项平均办理时长下降30%。" },
    { id: "2", title: "线上服务覆盖", detail: "线上可办率提升至95%，跨部门联办事项明显增加。" },
  ],
  step6: [
    { id: "1", title: "系统对接复杂", detail: "历史系统接口标准不一，导致联办事项流转效率不稳定。" },
    { id: "2", title: "基层执行差异", detail: "部分单位执行标准不统一，存在重复提交材料问题。" },
  ],
  step7: [
    { id: "1", name: "线上可办率(%)", values: ["72", "80", "86", "90", "93", "95", "98"] },
    { id: "2", name: "平均办结时长(天)", values: ["12", "10", "9", "8", "7", "6", "5"] },
  ],
  step8: [
    { id: "1", name: "流程标准化", quarters: ["完成摸底", "形成标准", "试点运行", "全面执行"], owner: "王五" },
    { id: "2", name: "系统联通改造", quarters: ["接口梳理", "开发联调", "灰度发布", "稳定运营"], owner: "赵六" },
  ],
});

const baseFormDataByUnitName: Record<string, UnitFormData> = {
  区大数据局: {
    unitName: "区大数据局",
    files: [makeDataGovernanceFile(), makeServiceCapabilityFile()],
  },
  区发改委: {
    unitName: "区发改委",
    files: [
      {
        ...makeDataGovernanceFile(),
        fileId: "file-101",
        fileName: "重点项目推进台账",
        templateId: "tpl-005",
        step1: {
          职能职责: "负责全区经济社会发展规划编制，统筹重大项目管理与投资调度。",
          组织架构: "设综合科、投资科、产业科等业务科室。",
        },
      },
      {
        ...makeServiceCapabilityFile(),
        fileId: "file-102",
        fileName: "投资运行分析报告",
        templateId: "tpl-001",
      },
    ],
  },
  区文旅委: {
    unitName: "区文旅委",
    files: [
      {
        ...makeDataGovernanceFile(),
        fileId: "file-201",
        fileName: "文旅融合发展计划",
        templateId: "tpl-002",
        step1: {
          职能职责: "负责全区文旅融合发展与公共文化服务体系建设。",
          组织架构: "设文化科、旅游科、产业科等业务科室。",
        },
      },
      {
        ...makeServiceCapabilityFile(),
        fileId: "file-202",
        fileName: "重点活动执行手册",
        templateId: "tpl-003",
      },
    ],
  },
};

const unitAliasToName: Record<string, string> = {
  "u-001": "区大数据局",
  "u-002": "区发改委",
  "u-003": "区文旅委",
  "dept-001": "区大数据局",
  "dept-002": "区发改委",
  "dept-003": "区文旅委",
};

const TaskDataViewPage: React.FC = () => {
  const { taskId, unitId } = useParams<{ taskId: string; unitId: string }>();
  const location = useLocation() as { state?: { progress?: UnitProgressItem; taskName?: string } };
  const task = useMemo(() => taskListMock.find((item) => item.id === taskId), [taskId]);
  const progressTarget = useMemo(() => {
    return (
      location.state?.progress ??
      (unitProgressMock.find((item) => item.unitId === (unitId ?? "")) ?? null)
    );
  }, [location.state, unitId]);
  const [activeTabKey, setActiveTabKey] = useState<string>("file-0");
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [auditResult, setAuditResult] = useState<"approve" | "reject" | "">("");
  const [auditReason, setAuditReason] = useState("");
  const [auditRemark, setAuditRemark] = useState("");
  const [auditTarget, setAuditTarget] = useState<UnitProgressItem | null>(null);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditResultError, setAuditResultError] = useState("");
  const [auditReasonError, setAuditReasonError] = useState("");
  const [auditRemarkError, setAuditRemarkError] = useState("");
  const [reasonFocused, setReasonFocused] = useState(false);
  const [remarkFocused, setRemarkFocused] = useState(false);
  const reasonRef = useRef<any>(null);

  const getAuditSteps = (target: UnitProgressItem | null): StepsProps["items"] => {
    const submitTime = target?.submitTime ?? "-";
    const auditTime = target?.auditTime ?? "-";
    const secondAuditTime = auditTime !== "-" ? auditTime : "2024-03-20 10:00:00";
    const auditStatusText =
      target?.fillStatus === "approved"
        ? "通过"
        : target?.fillStatus === "rejected"
          ? "退回"
          : target?.fillStatus === "submitted"
            ? "审核中"
            : "待提交";
    const remarkText = target?.auditRemark ?? "-";
    const reasonText = target?.auditReason ?? "数据填写不完整，请补充缺失字段。";
    const secondStatus =
      target?.fillStatus === "approved"
        ? "finish"
        : target?.fillStatus === "rejected"
          ? "error"
          : target?.fillStatus === "submitted"
            ? "process"
            : "wait";
    const finalStatus = target?.fillStatus === "approved" ? "process" : "wait";

    return [
      {
        title: "数据专员",
        status: "finish",
        description: (
          <div style={{ fontSize: 13, color: "#666" }}>
            <div>审核状态：通过</div>
            <div>审核备注：-</div>
            <div>审核时间：{submitTime}</div>
          </div>
        ),
      },
      {
        title: "单位管理员",
        status: secondStatus,
        description: (
          <div style={{ fontSize: 13, color: "#666" }}>
            <div>审核状态：{auditStatusText}</div>
            <div>审核备注：{remarkText}</div>
            <div>退回原因：{reasonText}</div>
            <div>审核时间：{secondAuditTime}</div>
          </div>
        ),
      },
      {
        title: "区委办公室",
        status: finalStatus,
        description: (
          <div style={{ fontSize: 13, color: "#666" }}>
            <div>审核状态：待审核</div>
            <div>审核备注：-</div>
            <div>审核时间：-</div>
          </div>
        ),
      },
    ];
  };

  const getAuditDetailSteps = (target: UnitProgressItem | null): StepsProps["items"] => {
    const submitTime = target?.submitTime ?? "-";
    const auditTime = target?.auditTime ?? "-";
    const reasonText = target?.auditReason;
    const remarkText = target?.auditRemark ?? "-";
    const auditStatus =
      target?.fillStatus === "approved"
        ? "通过"
        : target?.fillStatus === "rejected"
          ? "退回"
          : "待审核";
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
            <div>审核备注：{remarkText}</div>
            {reasonText ? <div>退回原因：{reasonText}</div> : null}
            <div style={{ whiteSpace: "nowrap" }}>
              审核时间：{auditTime !== "-" ? auditTime : "2024-03-20 10:00:00"}
            </div>
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

  const templateNameById = useMemo(
    () => availableTemplates.reduce<Record<string, string>>((acc, item) => {
      acc[item.id] = item.name;
      return acc;
    }, {}),
    [],
  );

  const unitData = useMemo(() => {
    const safeUnitId = unitId ?? "";
    const fromAlias = unitAliasToName[safeUnitId];
    if (fromAlias && baseFormDataByUnitName[fromAlias]) {
      return baseFormDataByUnitName[fromAlias];
    }

    const fromProgress = unitProgressMock.find((item) => item.unitId === safeUnitId)?.unitName;
    if (fromProgress && baseFormDataByUnitName[fromProgress]) {
      return baseFormDataByUnitName[fromProgress];
    }

    const firstTemplate = Object.values(baseFormDataByUnitName)[0];
    if (!firstTemplate) {
      return null;
    }

    return {
      ...firstTemplate,
      unitName: fromProgress ?? (safeUnitId || "当前单位"),
    };
  }, [unitId]);

  if (!unitData) {
    return (
      <div style={{ padding: 20, background: "#f3f6fb", height: "100%", overflow: "auto" }}>
        <Empty description={`暂无数据（unitId: ${unitId ?? "-"}）`} />
      </div>
    );
  }

  const taskTemplateIds = taskId ? (taskTemplateMap[taskId] ?? []) : [];
  const filesForCurrentTask = taskTemplateIds.length > 0
    ? unitData.files.filter((file) => taskTemplateIds.includes(file.templateId))
    : unitData.files;
  const filesToRender = filesForCurrentTask.length > 0 ? filesForCurrentTask : unitData.files;

  const fileTabs = filesToRender.map((file, index) => ({
    key: `file-${index}`,
    label: index === 1 ? "工作模块" : (templateNameById[file.templateId] ?? file.fileName),
  }));

  const activeFileIndex = Number(activeTabKey.replace("file-", ""));
  const currentFileData = filesToRender[activeFileIndex] ?? filesToRender[0];
  const indicatorPairs = useMemo(
    () => [
      { id: "kv-01", key: "规上工业产值（亿元）", value: "1250" },
      { id: "kv-02", key: "规上工业产值增速（%）", value: "8.5" },
      { id: "kv-03", key: "规上工业增加值增速（%）", value: "7.2" },
      { id: "kv-04", key: "工业投资（亿元）", value: "320" },
      { id: "kv-05", key: "工业投资增速（%）", value: "6.1" },
      { id: "kv-06", key: "制造业亩均税收增速（%）", value: "5.4" },
      { id: "kv-07", key: "制造业投资（亿元）", value: "210" },
      { id: "kv-08", key: "制造业投资增速（%）", value: "4.8" },
      { id: "kv-09", key: "高技术制造业产值占比（%）", value: "32.6" },
      { id: "kv-10", key: "企业技术改造投资（亿元）", value: "95" },
      { id: "kv-11", key: "工业用电量（亿千瓦时）", value: "58" },
      { id: "kv-12", key: "工业用电量增速（%）", value: "3.9" },
      { id: "kv-13", key: "新增规上工业企业数（家）", value: "42" },
      { id: "kv-14", key: "单位能耗下降（%）", value: "2.1" },
      { id: "kv-15", key: "工业固定资产投资增速（%）", value: "5.9" },
      { id: "kv-16", key: "战略性新兴产业产值（亿元）", value: "180" },
      { id: "kv-17", key: "专精特新企业数（家）", value: "65" },
      { id: "kv-18", key: "高新技术企业数（家）", value: "120" },
      { id: "kv-19", key: "科技型中小企业数（家）", value: "260" },
      { id: "kv-20", key: "工业增加值增速（%）", value: "6.7" },
    ],
    [],
  );

  useEffect(() => {
    if (activeFileIndex >= filesToRender.length) {
      setActiveTabKey("file-0");
    }
  }, [activeFileIndex, filesToRender.length]);

  if (!currentFileData) {
    return (
      <div style={{ padding: 20, background: "#f3f6fb", height: "100%", overflow: "auto" }}>
        <Empty description="当前单位未配置文件数据" />
      </div>
    );
  }

  return (
    <div style={{ padding: "20px 20px 0", background: "#f3f6fb", height: "100%", overflow: "auto", display: "flex", flexDirection: "column", minHeight: "100%" }}>
      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: 16 }}>
          <Breadcrumb
            items={[
              { title: <Link to="/task">采集任务</Link> },
              { title: <Link to={`/task/detail/${taskId}`}>任务详情</Link> },
              { title: `${unitData.unitName}数据详情` },
            ]}
          />
        </div>

        <Card style={{ marginBottom: 16 }}>
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
                      <div style={{ fontSize: 14, color: "#666" }}>上报单位：{progressTarget?.unitName ?? unitData.unitName}</div>
                      <div style={{ fontSize: 14, color: "#666" }}>上报人：{progressTarget?.submitter ?? "-"}</div>
                      <div style={{ fontSize: 14, color: "#666" }}>上报时间：{progressTarget?.submitTime ?? "-"}</div>
                      <div style={{ fontSize: 14, color: "#666" }}>
                        上报状态：
                        <span style={progressTarget?.fillStatus === "revoked" ? { color: "#ff4d4f", fontWeight: 600 } : {}}>
                          {progressTarget ? fillStatusTextMap[progressTarget.fillStatus] : "-"}
                        </span>
                      </div>
                    </div>
                    {progressTarget?.fillStatus === "revoked" ? (
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                          gap: "10px 16px",
                          marginTop: 10,
                        }}
                      >
                        <div style={{ fontSize: 14, color: "#666" }}>撤销时间：{progressTarget.withdrawTime ?? "-"}</div>
                        <div style={{ fontSize: 14, color: "#666" }}>撤销原因：{progressTarget.withdrawReason ?? "-"}</div>
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
                    <Steps direction="horizontal" size="small" items={getAuditDetailSteps(progressTarget)} />
                  </div>
                ),
              },
            ]}
          />
        </Card>

        <Card style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>上报详情</div>
          <Tabs items={fileTabs} activeKey={activeTabKey} onChange={setActiveTabKey} />

          {activeFileIndex === 0 ? (
            <div style={{ padding: "12px 0" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", border: "1px solid #f0f0f0", borderRadius: 8, background: "#fafafa" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ fontSize: 14, color: "#333" }}>区级工作模块采集说明（2026年一季度）.docx</div>
                </div>
                <Space size={12}>
                  <Button type="link" style={{ paddingInline: 4 }}>预览</Button>
                  <Button type="link" style={{ paddingInline: 4 }}>下载</Button>
                </Space>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>1. 部门简介</h3>
                <div className={styles.richTextView}>
                  <p>{currentFileData.step1.职能职责}</p>
                  <p>{currentFileData.step1.组织架构}</p>
                </div>
              </div>

            <Divider />

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>3. 核心业务</h3>
              <div className={styles.richTextView}>
                {currentFileData.step3.map((card) => (
                  <p key={card.id}>{card.title}：{card.detail}</p>
                ))}
              </div>
            </div>

            <Divider />

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>4. 特色优势</h3>
              <div className={styles.richTextView}>
                <p>{currentFileData.step4}</p>
              </div>
            </div>

            <Divider />

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>5. 标志性成果打造情况</h3>
              <div className={styles.richTextView}>
                {currentFileData.step5.map((card) => (
                  <p key={card.id}>{card.title}：{card.detail}</p>
                ))}
              </div>
            </div>

            <Divider />

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>6. 存在的主要问题</h3>
              <div className={styles.richTextView}>
                {currentFileData.step6.map((card) => (
                  <p key={card.id}>{card.title}：{card.detail}</p>
                ))}
              </div>
            </div>

            <Divider />

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>7. 主要指标数据表</h3>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ border: "1px solid #e8e8e8", background: "#fafafa", padding: 8, textAlign: "left" }}>
                      指标名称
                    </th>
                    <th style={{ border: "1px solid #e8e8e8", background: "#fafafa", padding: 8, textAlign: "left" }}>
                      指标值
                    </th>
                    <th style={{ border: "1px solid #e8e8e8", background: "#fafafa", padding: 8, textAlign: "left" }}>
                      指标名称
                    </th>
                    <th style={{ border: "1px solid #e8e8e8", background: "#fafafa", padding: 8, textAlign: "left" }}>
                      指标值
                    </th>
                    <th style={{ border: "1px solid #e8e8e8", background: "#fafafa", padding: 8, textAlign: "left" }}>
                      指标名称
                    </th>
                    <th style={{ border: "1px solid #e8e8e8", background: "#fafafa", padding: 8, textAlign: "left" }}>
                      指标值
                    </th>
                    <th style={{ border: "1px solid #e8e8e8", background: "#fafafa", padding: 8, textAlign: "left" }}>
                      指标名称
                    </th>
                    <th style={{ border: "1px solid #e8e8e8", background: "#fafafa", padding: 8, textAlign: "left" }}>
                      指标值
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 }).map((_, rowIndex) => {
                    const first = indicatorPairs[rowIndex * 4];
                    const second = indicatorPairs[rowIndex * 4 + 1];
                    const third = indicatorPairs[rowIndex * 4 + 2];
                    const fourth = indicatorPairs[rowIndex * 4 + 3];
                    return (
                      <tr key={`row-${rowIndex}`}>
                        <td style={{ border: "1px solid #e8e8e8", padding: 8 }}>{first ? first.key : ""}</td>
                        <td style={{ border: "1px solid #e8e8e8", padding: 8 }}>{first ? first.value || "-" : ""}</td>
                        <td style={{ border: "1px solid #e8e8e8", padding: 8 }}>{second ? second.key : ""}</td>
                        <td style={{ border: "1px solid #e8e8e8", padding: 8 }}>{second ? second.value || "-" : ""}</td>
                        <td style={{ border: "1px solid #e8e8e8", padding: 8 }}>{third ? third.key : ""}</td>
                        <td style={{ border: "1px solid #e8e8e8", padding: 8 }}>{third ? third.value || "-" : ""}</td>
                        <td style={{ border: "1px solid #e8e8e8", padding: 8 }}>{fourth ? fourth.key : ""}</td>
                        <td style={{ border: "1px solid #e8e8e8", padding: 8 }}>{fourth ? fourth.value || "-" : ""}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <Divider />

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>8. 季度主要目标任务分解表</h3>
              <div className={styles.richTextView}>
                {currentFileData.step8.map((row) => (
                  <p key={row.id}>
                    任务名称：{row.name}；第一季度：{row.quarters[0]}；第二季度：{row.quarters[1]}；第三季度：{row.quarters[2]}；第四季度：{row.quarters[3]}；责任人：{row.owner}
                  </p>
                ))}
              </div>
            </div>
            </>
          )}
        </Card>
      </div>

      <div className={reportStyles.stickyFooter} style={{ marginTop: "auto" }}>
        <Space>
          <Button
            type="primary"
            style={{ width: 100 }}
            onClick={() => {
              const safeUnitId = unitId ?? "";
              const fallbackTarget: UnitProgressItem = {
                unitId: safeUnitId || "unknown",
                unitName: unitData.unitName,
                fillStatus: "submitted",
                submitTime: null,
                submitter: null,
              };
              setAuditTarget(unitProgressMock.find((item) => item.unitId === safeUnitId) ?? fallbackTarget);
              setAuditResult("approve");
              setAuditReason("");
              setAuditRemark("");
              setAuditResultError("");
              setAuditReasonError("");
              setAuditRemarkError("");
              setAuditModalOpen(true);
            }}
          >
            审核
          </Button>
        </Space>
      </div>

      <Modal
        title="上报数据审核"
        open={auditModalOpen}
        onCancel={() => setAuditModalOpen(false)}
        width={600}
        footer={null}
        destroyOnClose
        bodyStyle={{ maxHeight: "70vh", overflow: "auto", paddingInline: 24 }}
      >
        <div style={{ marginTop: 36, marginBottom: 24 }}>
          <Steps direction="vertical" size="small" items={getAuditSteps(auditTarget)} />
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#333", marginBottom: 12 }}>
            <span style={{ color: "#f5222d", marginRight: 4 }}>*</span>审核结果
          </div>
          <Space direction="horizontal" size={24}>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="radio"
                name="auditResult"
                value="approve"
                checked={auditResult === "approve"}
                onChange={() => {
                  setAuditResult("approve");
                  setAuditResultError("");
                  setAuditReasonError("");
                }}
                style={{ width: 16, height: 16 }}
              />
              <span style={{ color: "#333" }}>审核通过</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="radio"
                name="auditResult"
                value="reject"
                checked={auditResult === "reject"}
                onChange={() => {
                  setAuditResult("reject");
                  setAuditResultError("");
                }}
                style={{ width: 16, height: 16 }}
              />
              <span style={{ color: "#333" }}>退回修改</span>
            </label>
          </Space>
          {auditResultError ? (
            <div style={{ color: "#f5222d", fontSize: 12, marginTop: 8 }}>{auditResultError}</div>
          ) : null}
        </div>

        {auditResult === "reject" ? (
          <>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#333", marginBottom: 8 }}>
                <span style={{ color: "#f5222d", marginRight: 4 }}>*</span>退回原因
              </div>
              <Input.TextArea
                ref={reasonRef}
                value={auditReason}
                onChange={(event) => {
                  setAuditReason(event.target.value);
                  setAuditReasonError("");
                }}
                onFocus={() => setReasonFocused(true)}
                onBlur={() => setReasonFocused(false)}
                placeholder="请输入退回原因，说明需要修改的内容"
                autoSize={{ minRows: 4, maxRows: 7 }}
                maxLength={500}
                style={{
                  borderRadius: 6,
                  borderColor: auditReasonError ? "#f5222d" : "#d9d9d9",
                  padding: 12,
                  boxShadow: reasonFocused ? "0 0 0 2px rgba(43,92,214,0.1)" : "none",
                }}
              />
              {auditReasonError ? (
                <div style={{ color: "#f5222d", fontSize: 12, marginTop: 8 }}>{auditReasonError}</div>
              ) : null}
              <div style={{ textAlign: "right", fontSize: 13, color: "#999", marginTop: 8, marginBottom: 12 }}>
                {auditReason.length}/500
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, color: "#666", marginBottom: 8 }}>常用退回原因</div>
              <Space size={[8, 8]} wrap>
                {[
                  "数据填写不完整，请补充完整信息",
                  "上传的文件格式不正确，请重新上传",
                  "数据内容与实际情况不符，请核实后修改",
                  "缺少必要的附件材料，请补充上传",
                  "数据填写有误，请仔细核对后修改",
                  "其他原因",
                ].map((text) => (
                  <Button
                    key={text}
                    type="default"
                    size="small"
                    style={{
                      borderRadius: 4,
                      borderColor: "#d9d9d9",
                      color: "#666",
                    }}
                    onClick={() => {
                      setAuditReason(text === "其他原因" ? "" : text);
                      setAuditReasonError("");
                      window.setTimeout(() => reasonRef.current?.focus(), 0);
                    }}
                  >
                    {text}
                  </Button>
                ))}
              </Space>
            </div>
          </>
        ) : null}

        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#333", marginBottom: 8 }}>审核备注</div>
          <div style={{ position: "relative" }}>
            <Input.TextArea
              value={auditRemark}
              onChange={(event) => {
                setAuditRemark(event.target.value);
                setAuditRemarkError("");
              }}
              onFocus={() => setRemarkFocused(true)}
              onBlur={() => setRemarkFocused(false)}
              placeholder="可填写审核备注信息（可选）"
              autoSize={{ minRows: 3, maxRows: 6 }}
              maxLength={100}
              style={{
                borderRadius: 6,
                borderColor: auditRemarkError ? "#f5222d" : "#d9d9d9",
                padding: "12px 12px 28px",
                boxShadow: remarkFocused ? "0 0 0 2px rgba(43,92,214,0.1)" : "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                right: 12,
                bottom: 8,
                fontSize: 12,
                color: "#999",
              }}
            >
              {auditRemark.length}/100
            </div>
          </div>
          {auditRemarkError ? (
            <div style={{ color: "#f5222d", fontSize: 12, marginTop: 8 }}>{auditRemarkError}</div>
          ) : null}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24 }}>
          <Button
            onClick={() => setAuditModalOpen(false)}
            style={{ width: 100, height: 40, color: "#666", borderColor: "#d9d9d9" }}
            disabled={auditLoading}
          >
            取消
          </Button>
          {auditResult === "approve" ? (
            <Button
              type="primary"
              loading={auditLoading}
              style={{ width: 120, height: 40, background: "#52c41a" }}
              onClick={() => {
                if (!auditResult) {
                  setAuditResultError("请选择审核结果");
                  return;
                }
                if (auditRemark.length > 100) {
                  setAuditRemarkError("审核备注最多100个字符");
                  return;
                }
                setAuditLoading(true);
                window.setTimeout(() => {
                  message.success("审核成功");
                  setAuditLoading(false);
                  setAuditModalOpen(false);
                }, 600);
              }}
            >
              审核通过
            </Button>
          ) : null}
          {auditResult === "reject" ? (
            <Button
              danger
              type="primary"
              loading={auditLoading}
              style={{ width: 120, height: 40 }}
              onClick={() => {
                if (!auditResult) {
                  setAuditResultError("请选择审核结果");
                  return;
                }
                const trimmed = auditReason.trim();
                if (!trimmed) {
                  setAuditReasonError("请输入退回原因");
                  return;
                }
                if (trimmed.length < 10) {
                  setAuditReasonError("退回原因至少10个字符");
                  return;
                }
                if (trimmed.length > 500) {
                  setAuditReasonError("退回原因最多500个字符");
                  return;
                }
                if (auditRemark.length > 100) {
                  setAuditRemarkError("审核备注最多100个字符");
                  return;
                }
                setAuditLoading(true);
                window.setTimeout(() => {
                  message.success("审核成功");
                  setAuditLoading(false);
                  setAuditModalOpen(false);
                }, 600);
              }}
            >
              退回修改
            </Button>
          ) : null}
        </div>
      </Modal>
    </div>
  );
};

export default TaskDataViewPage;

