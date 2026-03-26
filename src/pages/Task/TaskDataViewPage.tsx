import React, { useEffect, useMemo, useState } from "react";
import { Breadcrumb, Card, Divider, Empty, Tabs, Tag } from "antd";
import { Link, useParams } from "react-router-dom";

import { availableTemplates, taskTemplateMap, unitProgressMock } from "./taskConstants";
import styles from "./TaskDataViewPage.module.css";

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
  const [activeTabKey, setActiveTabKey] = useState<string>("file-0");

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
    label: templateNameById[file.templateId] ?? file.fileName,
  }));

  const activeFileIndex = Number(activeTabKey.replace("file-", ""));
  const currentFileData = filesToRender[activeFileIndex] ?? filesToRender[0];

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
    <div style={{ padding: 20, background: "#f3f6fb", height: "100%", overflow: "auto" }}>
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
        <Tabs items={fileTabs} activeKey={activeTabKey} onChange={setActiveTabKey} />

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>1. 部门简介</h3>
          <div className={styles.fieldGroup}>
            <div className={styles.field}>
              <label className={styles.label}>职能职责</label>
              <div className={styles.value}>{currentFileData.step1.职能职责}</div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>组织架构</label>
              <div className={styles.value}>{currentFileData.step1.组织架构}</div>
            </div>
          </div>
        </div>

        <Divider />

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>2. 附件清单</h3>
          <div className={styles.fileList}>
            {currentFileData.step2.files.map((file) => (
              <Tag key={file} color="blue">
                {file}
              </Tag>
            ))}
          </div>
        </div>

        <Divider />

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>3. 核心业务</h3>
          <div className={styles.cardList}>
            {currentFileData.step3.map((card) => (
              <div key={card.id} className={styles.card}>
                <div className={styles.cardTitle}>{card.title}</div>
                <div className={styles.cardDetail}>{card.detail}</div>
              </div>
            ))}
          </div>
        </div>

        <Divider />

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>4. 特色优势</h3>
          <div className={styles.value}>{currentFileData.step4}</div>
        </div>

        <Divider />

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>5. 标志性成果打造情况</h3>
          <div className={styles.cardList}>
            {currentFileData.step5.map((card) => (
              <div key={card.id} className={styles.card}>
                <div className={styles.cardTitle}>{card.title}</div>
                <div className={styles.cardDetail}>{card.detail}</div>
              </div>
            ))}
          </div>
        </div>

        <Divider />

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>6. 存在的主要问题</h3>
          <div className={styles.cardList}>
            {currentFileData.step6.map((card) => (
              <div key={card.id} className={styles.card}>
                <div className={styles.cardTitle}>{card.title}</div>
                <div className={styles.cardDetail}>{card.detail}</div>
              </div>
            ))}
          </div>
        </div>

        <Divider />

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>7. 主要指标数据表</h3>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>指标名称</th>
                  <th>2021年</th>
                  <th>2022年</th>
                  <th>2023年</th>
                  <th>2024年</th>
                  <th>2025年</th>
                  <th>2026目标</th>
                  <th>2030目标</th>
                </tr>
              </thead>
              <tbody>
                {currentFileData.step7.map((row) => (
                  <tr key={row.id}>
                    <td>{row.name}</td>
                    {row.values.map((value, index) => (
                      <td key={`${row.id}-${index}`}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Divider />

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>8. 季度主要目标任务分解表</h3>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>任务名称</th>
                  <th>第一季度</th>
                  <th>第二季度</th>
                  <th>第三季度</th>
                  <th>第四季度</th>
                  <th>责任人</th>
                </tr>
              </thead>
              <tbody>
                {currentFileData.step8.map((row) => (
                  <tr key={row.id}>
                    <td>{row.name}</td>
                    {row.quarters.map((quarter, index) => (
                      <td key={`${row.id}-q-${index}`}>{quarter}</td>
                    ))}
                    <td>{row.owner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TaskDataViewPage;
