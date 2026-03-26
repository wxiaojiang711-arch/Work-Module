import React from "react";
import {
  ArrowLeftOutlined,
  DownloadOutlined,
  FormOutlined,
  PrinterOutlined,
  RollbackOutlined,
  TableOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Button, Dropdown, Modal, Space, Tabs, message } from "antd";
import type { TabsProps } from "antd";
import { useNavigate, useParams } from "react-router-dom";

import styles from "./DataReport.module.css";
import FormTableReadonly from "./FormTableReadonly";
import FormTextReadonly from "./FormTextReadonly";
import TaskInfoCard from "./TaskInfoCard";

export type TaskDetail = {
  id: string;
  name: string;
  issuer: string;
  deadline: string;
  submittedAt: string;
  submitter: string;
  formCount: number;
  status: "submitted";
  description: string;
};

export type FormTextData = {
  basicInfo: {
    orgName: string;
    reporter: string;
    reportDate: string;
    reportPeriod: string;
  };
  fields: Array<{
    group: string;
    items: Array<{
      key: string;
      label: string;
      required: boolean;
      aiGenerated: boolean;
      value: string;
    }>;
  }>;
  attachments: Array<{ id: string; name: string; size: string; type: string }>;
};

export type FormTableData1 = {
  rows: Array<{
    id: number;
    name: string;
    unit: string;
    yearTarget: number;
    quarterValue: number;
    totalValue: number;
    rate: number;
    remark: string;
  }>;
  source: string;
};

export type FormTableData2 = {
  rows: Array<{
    id: number;
    name: string;
    type: string;
    totalInvestment: number;
    quarterInvestment: number;
    totalCompleted: number;
    rate: number;
    progress: string;
    problems: string;
    owner: string;
  }>;
  source: string;
};

const taskDetail: TaskDetail = {
  id: "task-submitted-001",
  name: "2024年第一季度人才引进情况统计",
  issuer: "区人社局",
  deadline: "2024-03-31 23:59:59",
  submittedAt: "2024-03-19 14:20:00",
  submitter: "王五",
  formCount: 3,
  status: "submitted",
  description: "请各单位提交2024年第一季度工作完成情况总结，包括重点工作完成情况、量化指标、重点项目进展等内容。",
};

const formTabs = [
  { key: "form-001", name: "季度工作总结报告", type: "text", icon: "FormOutlined" },
  { key: "form-002", name: "量化指标填报表", type: "table", icon: "TableOutlined" },
  { key: "form-003", name: "重点项目进展表", type: "table", icon: "TableOutlined" },
] as const;

const formTextData: FormTextData = {
  basicInfo: {
    orgName: "区大数据局",
    reporter: "张三",
    reportDate: "2024-03-19",
    reportPeriod: "2024年第一季度",
  },
  fields: [
    {
      group: "本季度工作完成情况",
      items: [
        {
          key: "keyWorkCompletion",
          label: "重点工作完成情况",
          required: true,
          aiGenerated: true,
          value:
            "2024年第一季度，我局围绕数字政府建设年度目标，扎实推进各项重点工作。一是政务云平台迁移工作取得重大进展，完成12个部门业务系统的云上迁移，迁移率从年初的45%提升至85%，超额完成季度目标。二是\"一网通办\"平台持续优化，新增上线政务服务事项126项，网上可办率提升至96.8%。三是数据共享交换平台完成升级改造，新增数据接口47个，日均数据交换量达到150万条。",
        },
        {
          key: "quantitativeIndicators",
          label: "量化指标完成情况",
          required: true,
          aiGenerated: true,
          value:
            "1. 政务云迁移率：85%（目标75%，超额完成）\n2. 网上可办率：96.8%（目标95%，超额完成）\n3. 数据接口新增数：47个（目标40个，超额完成）\n4. 日均数据交换量：150万条（同比增长35%）\n5. 12345热线工单处理及时率：98.2%（目标95%）\n6. 政务系统安全事件：0起",
        },
        {
          key: "keyProjectProgress",
          label: "重点项目推进情况",
          required: false,
          aiGenerated: false,
          value:
            "智慧城市一期项目：本季度完成数据中台核心模块部署，城市运行管理中心大屏系统完成第一版开发，已接入交通、环保、城管三个领域的实时数据。项目总投资1.2亿元，已完成投资0.45亿元，占总投资的37.5%，进度符合预期。",
        },
        {
          key: "budgetExecution",
          label: "经费使用情况",
          required: true,
          aiGenerated: true,
          value:
            "本季度部门预算总额1200万元，实际支出680万元，预算执行率56.7%。主要支出方向：政务云平台运维费用280万元，智慧城市项目建设费用220万元，数据安全防护费用100万元，人员培训及差旅费用80万元。预算执行进度与时序进度基本匹配。",
        },
      ],
    },
    {
      group: "特色亮点",
      items: [
        {
          key: "innovationHighlights",
          label: "创新举措与亮点",
          required: true,
          aiGenerated: true,
          value:
            "一是在全市率先推出\"免证办\"服务模式，通过电子证照共享，实现32类高频事项\"零材料\"办理，累计服务群众1.2万人次，获得省政务服务中心通报表扬。二是创新开发\"数据体检\"工具，自动检测各部门数据质量问题，累计发现并修复数据质量问题3600余条，数据准确率提升至99.2%。三是建立\"首席数据官\"制度，在全区15个部门设立首席数据官，推动数据资源统筹管理。",
        },
        {
          key: "honorsAndAwards",
          label: "获得荣誉或表彰",
          required: false,
          aiGenerated: false,
          value:
            "1. \"免证办\"服务模式获评省级政务服务创新案例\n2. 政务云平台建设经验在全市数字政府建设推进会上作典型发言\n3. 数据共享交换平台获评市级优秀信息化项目",
        },
      ],
    },
    {
      group: "存在问题与困难",
      items: [
        {
          key: "mainProblems",
          label: "主要问题与困难",
          required: true,
          aiGenerated: true,
          value:
            "一是部分部门对数据共享的积极性不高，存在\"数据壁垒\"现象，跨部门数据共享推进难度较大。二是基层信息化人才短缺，部分镇街缺乏专职信息化管理人员，影响系统推广应用效果。三是网络安全形势日趋严峻，本季度共拦截网络攻击1.2万次，较去年同期增长40%，安全防护压力持续加大。",
        },
        {
          key: "causeAnalysis",
          label: "原因分析",
          required: false,
          aiGenerated: false,
          value:
            "数据共享推进困难的主要原因：一是缺乏强制性的数据共享制度约束；二是部分部门担心数据安全风险；三是各部门数据标准不统一，对接成本较高。基层信息化人才短缺的原因：一是镇街编制有限，难以设置专职岗位；二是信息化岗位薪酬缺乏竞争力，人才流失严重。",
        },
      ],
    },
    {
      group: "下季度工作计划",
      items: [
        {
          key: "keyWorkPlan",
          label: "重点工作计划",
          required: true,
          aiGenerated: true,
          value:
            "一是加快推进智慧城市一期项目建设，力争二季度完成城市运行管理中心全部功能开发，接入不少于10个领域的实时数据。二是深化\"一网通办\"改革，新增上线政务服务事项100项以上，推动50项高频事项实现\"秒批秒办\"。三是启动全区统一数据共享交换平台二期建设，制定数据共享目录和交换标准。四是组织开展全区信息化人才培训计划，计划培训基层信息化管理人员200人次。五是升级网络安全防护体系，部署AI智能威胁检测系统。",
        },
        {
          key: "resourceSupport",
          label: "预计需要的资源支持",
          required: false,
          aiGenerated: false,
          value:
            "一是智慧城市一期项目二季度需追加建设资金300万元。二是数据共享交换平台二期建设需申请专项资金500万元。三是建议区委组织部在镇街增设信息化管理岗位编制。",
        },
        {
          key: "coordinationMatters",
          label: "需要协调解决的事项",
          required: false,
          aiGenerated: false,
          value:
            "一是请区政府办牵头，推动出台《增城区政务数据共享管理办法》。二是请区财政局支持智慧城市项目和数据共享平台的资金需求。三是请区委网信办协调省市网络安全资源，对全区政务系统开展一次全面的安全评估和渗透测试。",
        },
      ],
    },
  ],
  attachments: [
    { id: "att-001", name: "2024年Q1政务云迁移进度明细表.xlsx", size: "1.2MB", type: "xlsx" },
    { id: "att-002", name: "免证办服务模式工作方案.docx", size: "3.5MB", type: "docx" },
    { id: "att-003", name: "省政务服务中心通报表扬文件.pdf", size: "856KB", type: "pdf" },
  ],
};

const formTableData1: FormTableData1 = {
  rows: [
    { id: 1, name: "政务云迁移率", unit: "%", yearTarget: 95, quarterValue: 85, totalValue: 85, rate: 89.5, remark: "超额完成季度目标" },
    { id: 2, name: "网上可办率", unit: "%", yearTarget: 98, quarterValue: 96.8, totalValue: 96.8, rate: 98.8, remark: "" },
    { id: 3, name: "数据接口新增数", unit: "个", yearTarget: 120, quarterValue: 47, totalValue: 47, rate: 39.2, remark: "按计划推进" },
    { id: 4, name: "日均数据交换量", unit: "万条", yearTarget: 200, quarterValue: 150, totalValue: 150, rate: 75.0, remark: "同比增长35%" },
    { id: 5, name: "12345热线工单处理及时率", unit: "%", yearTarget: 95, quarterValue: 98.2, totalValue: 98.2, rate: 103.4, remark: "超额完成" },
    { id: 6, name: "政务系统安全事件", unit: "起", yearTarget: 0, quarterValue: 0, totalValue: 0, rate: 100, remark: "零事故" },
    { id: 7, name: "基层培训人次", unit: "人次", yearTarget: 500, quarterValue: 120, totalValue: 120, rate: 24.0, remark: "按计划推进" },
    { id: 8, name: "数据质量问题修复数", unit: "条", yearTarget: 10000, quarterValue: 3600, totalValue: 3600, rate: 36.0, remark: "数据准确率提升至99.2%" },
  ],
  source: "区大数据局知识库-2024年Q1量化指标统计表",
};

const formTableData2: FormTableData2 = {
  rows: [
    {
      id: 1,
      name: "智慧城市一期项目",
      type: "信息化类",
      totalInvestment: 12000,
      quarterInvestment: 2500,
      totalCompleted: 4500,
      rate: 37.5,
      progress: "数据中台核心模块部署完成，城市运行管理中心大屏系统完成第一版开发",
      problems: "部分部门数据接入配合度不高",
      owner: "张三",
    },
    {
      id: 2,
      name: "政务云平台扩容工程",
      type: "信息化类",
      totalInvestment: 3000,
      quarterInvestment: 1200,
      totalCompleted: 1200,
      rate: 40.0,
      progress: "完成硬件采购和机房改造，云平台扩容部署进行中",
      problems: "部分设备交付延迟",
      owner: "李四",
    },
    {
      id: 3,
      name: "数据共享交换平台升级",
      type: "信息化类",
      totalInvestment: 2000,
      quarterInvestment: 800,
      totalCompleted: 800,
      rate: 40.0,
      progress: "完成平台架构升级，新增数据接口47个",
      problems: "无",
      owner: "王五",
    },
    {
      id: 4,
      name: "12345热线智能化改造",
      type: "信息化类",
      totalInvestment: 1500,
      quarterInvestment: 400,
      totalCompleted: 400,
      rate: 26.7,
      progress: "AI智能分拨系统完成开发，进入测试阶段",
      problems: "训练数据量不足，分拨准确率待提升",
      owner: "赵六",
    },
  ],
  source: "区大数据局知识库-2024年Q1重点项目进展台账",
};

const ReportDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId: string }>();

  const exportItems = [
    {
      key: "word",
      label: "导出为Word",
      onClick: () => message.info("导出功能开发中"),
    },
    {
      key: "pdf",
      label: "导出为PDF",
      onClick: () => message.info("导出功能开发中"),
    },
    {
      key: "excel",
      label: "导出为Excel",
      onClick: () => message.info("导出功能开发中"),
    },
  ];

  const tabItems: TabsProps["items"] = [
    {
      key: "form-001",
      label: (
        <span className={styles.tabLabel}>
          <FormOutlined />
          季度工作总结报告
        </span>
      ),
      children: <FormTextReadonly data={formTextData} />,
    },
    {
      key: "form-002",
      label: (
        <span className={styles.tabLabel}>
          <TableOutlined />
          量化指标填报表
        </span>
      ),
      children: <FormTableReadonly tableType="quantitative" data={formTableData1} />,
    },
    {
      key: "form-003",
      label: (
        <span className={styles.tabLabel}>
          <TableOutlined />
          重点项目进展表
        </span>
      ),
      children: <FormTableReadonly tableType="project" data={formTableData2} />,
    },
  ];

  return (
    <div className={styles.page}>
      <Breadcrumb
        style={{ marginBottom: 12 }}
        items={[
          {
            title: (
              <a
                onClick={(event) => {
                  event.preventDefault();
                  navigate("/report");
                }}
              >
                数据上报
              </a>
            ),
          },
          {
            title: (
              <a
                onClick={(event) => {
                  event.preventDefault();
                  navigate("/report");
                }}
              >
                已上报
              </a>
            ),
          },
          { title: "查看详情" },
        ]}
      />

      <div className={styles.actionBar}>
        <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          返回列表
        </Button>
        <Space>
          <Dropdown menu={{ items: exportItems }} trigger={["click"]}>
            <Button icon={<DownloadOutlined />}>导出</Button>
          </Dropdown>
          <Button icon={<PrinterOutlined />} onClick={() => message.info("打印功能开发中")}>
            打印
          </Button>
          <Button
            danger
            icon={<RollbackOutlined />}
            onClick={() => {
              Modal.confirm({
                title: "确认撤回此次上报？",
                content: "撤回后数据将退回至“待上报”状态，可重新编辑后提交。",
                okText: "确认",
                cancelText: "取消",
                onOk: () => {
                  message.success("已撤回");
                  navigate("/report");
                },
              });
            }}
          >
            撤回
          </Button>
        </Space>
      </div>

      <TaskInfoCard task={{ ...taskDetail, id: taskId ?? taskDetail.id }} />

      <Tabs type="card" style={{ marginTop: 16 }} items={tabItems} />
    </div>
  );
};

export default ReportDetailPage;
