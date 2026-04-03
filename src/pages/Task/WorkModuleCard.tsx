import React, { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Descriptions,
  Modal,
  Popconfirm,
  Progress,
  Space,
  Switch,
  Tag,
  TreeSelect,
  Typography,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import {
  permissionTreeData,
  workModuleInfoMock,
  workModuleStatusConfig,
  type TaskConfig,
  type WorkModuleInfo,
  type WorkModuleStatus,
} from "./taskConstants";

const { RangePicker } = DatePicker;

const WorkModuleCard: React.FC = () => {
  const navigate = useNavigate();
  const [moduleInfo, setModuleInfo] = useState<WorkModuleInfo>(workModuleInfoMock);
  const [generateModalOpen, setGenerateModalOpen] = useState(false);

  useEffect(() => {
    window.localStorage.setItem("workModuleStatus", "notGenerated");
    setModuleInfo((prev) => ({ ...prev, status: "notGenerated" }));
  }, []);

  useEffect(() => {
    const storedStatus = window.localStorage.getItem("workModuleStatus") as WorkModuleStatus | null;
    if (storedStatus && storedStatus !== moduleInfo.status) {
      setModuleInfo((prev) => ({ ...prev, status: storedStatus }));
    }
  }, [moduleInfo.status]);

  // 生成弹窗表单状态
  const [fillUnits, setFillUnits] = useState<string[]>(["dept_bigdata", "dept_fagai", "dept_wenlv"]);
  const now = dayjs();
  const quarterEnd = now.month(Math.floor(now.month() / 3) * 3 + 2).endOf("month");
  const [fillTimeRange, setFillTimeRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([now, quarterEnd]);
  const [needReview, setNeedReview] = useState(true);

  const statusConfig = workModuleStatusConfig[moduleInfo.status];
  const progressPercent =
    moduleInfo.progress.total === 0
      ? 0
      : Math.round((moduleInfo.progress.completed / moduleInfo.progress.total) * 100);

  const handleGenerate = () => {
    setGenerateModalOpen(false);
    setModuleInfo((prev) => ({ ...prev, status: "inProgress" }));
    message.success("本期任务已生成草稿");
  };

  const handleQuickCreate = () => {
    const periodMap: Record<string, string> = {
      "一季度": "第一季度",
      "二季度": "第二季度",
      "三季度": "第三季度",
      "四季度": "第四季度",
    };
    const normalizedPeriod =
      Object.entries(periodMap).reduce((acc, [short, full]) => acc.replace(short, full), moduleInfo.period);
    const preset: Partial<TaskConfig> = {
      name: `工作模块`,
      taskPeriod: normalizedPeriod,
      urgency: "normal",
      description: `请各单位完成${moduleInfo.period}工作模块更新填报。`,
      attachments: [],
      selectedTemplates: ["tpl-001", "tpl-002"],
      fillUnitScope: "all",
      fillPermissions: ["all"],
    };
    navigate("/task/create", { state: { preset, source: "workModule" } });
  };

  const handleViewProgress = () => {
    navigate("/task/detail/task-001");
  };

  const handleRemind = () => {
    message.success("已发送催办提醒");
  };

  const handleEndFill = () => {
    window.localStorage.setItem("workModuleStatus", "completed");
    setModuleInfo((prev) => ({ ...prev, status: "completed" }));
    message.success("已结束本期填报");
  };

  const renderActionButtons = () => {
    const status: WorkModuleStatus = moduleInfo.status;

    switch (status) {
      case "notGenerated":
        return (
            <Space direction="vertical" size={12} style={{ width: "100%", alignItems: "center" }}>
              <Space size={24}>
                <Button
                  type="primary"
                  style={{ width: 120 }}
                  onClick={handleQuickCreate}
                >
                一键生成本期任务
              </Button>
              <Button
                style={{ width: 120, background: "#fff" }}
                onClick={() => navigate("/task/work-module/history")}
              >
                查看历史期次
              </Button>
            </Space>
          </Space>
        );

      case "inProgress":
        return (
          <Space size={12} style={{ width: "100%", justifyContent: "center" }}>
            <Button type="primary" onClick={handleViewProgress}>
              查看进度
            </Button>
            <Popconfirm
              title=""
              description="确认催办未完成单位吗？"
              okText="确认"
              cancelText="取消"
              onConfirm={handleRemind}
            >
              <Button>催办</Button>
            </Popconfirm>
            <Button onClick={handleEndFill}>结束填报</Button>
          </Space>
        );

      case "completed":
        return (
          <Space size={12} style={{ width: "100%", justifyContent: "center" }}>
            <Button type="primary" onClick={handleViewProgress}>
              查看本期
            </Button>
            <Button onClick={handleQuickCreate}>一键生成下期任务</Button>
            <Button onClick={() => navigate("/task/work-module/history")}>查看历史期次</Button>
          </Space>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div
        style={{
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          padding: "20px 24px",
          marginBottom: 16,
        }}
      >
        {/* 标题区 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Typography.Title level={4} style={{ margin: 0, fontWeight: 400, color: "#1a1a2e" }}>
              工作模块
            </Typography.Title>
            <Typography.Text type="secondary" style={{ fontSize: 13 }}>
              用于定期下发各单位工作模块更新填报任务，支持一键生成本期任务并发布。
            </Typography.Text>
          </div>
          <div />
        </div>

        {/* 主体区：左右分栏 */}
        <div style={{ display: "flex", gap: 24 }}>
          {/* 左侧：本期概览与进度 */}
          <div style={{ flex: "0 0 65%" }}>
            {/* 本期信息 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                marginBottom: 12,
                flexWrap: "wrap",
              }}
            >
              <Typography.Text>
                <span style={{ color: "#999" }}>当前期次：</span>
                {moduleInfo.period}
              </Typography.Text>
              <Typography.Text>
                <span style={{ color: "#999" }}>截止时间：</span>
                {moduleInfo.deadline}
              </Typography.Text>
              <Tag color={statusConfig.color}>{statusConfig.text}</Tag>
            </div>

            {/* 进度条 */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <Typography.Text style={{ color: "#999", whiteSpace: "nowrap" }}>
                本期进度：已报 {moduleInfo.progress.completed} / 应报 {moduleInfo.progress.total}
              </Typography.Text>
              <Progress
                percent={progressPercent}
                strokeColor={progressPercent >= 80 ? "#52c41a" : "#2b5cd6"}
                showInfo={false}
                style={{ flex: 1, marginBottom: 0 }}
                size={["100%", 10]}
              />
              <Typography.Text style={{ whiteSpace: "nowrap" }}>{progressPercent}%</Typography.Text>
            </div>

            {/* 风险提示 */}
            {moduleInfo.overdueCount > 0 ? (
              <Typography.Text type="danger" style={{ cursor: "pointer" }} onClick={handleViewProgress}>
                逾期单位 {moduleInfo.overdueCount} 个
              </Typography.Text>
            ) : moduleInfo.status === "completed" ? (
              <Typography.Text type="secondary">暂无逾期</Typography.Text>
            ) : null}
          </div>

          {/* 右侧：快捷操作区 */}
          <div
            style={{
              flex: "0 0 35%",
              display: "flex",
              flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 12,
            paddingLeft: 24,
            borderLeft: "1px solid #f0f0f0",
          }}
        >
            {renderActionButtons()}
          </div>
        </div>
      </div>

      {/* 一键生成弹窗 */}
      <Modal
        title="确认生成本期工作模块任务"
        open={generateModalOpen}
        onCancel={() => setGenerateModalOpen(false)}
        onOk={handleGenerate}
        okText="确认生成"
        cancelText="取消"
        width={600}
      >
        <Descriptions column={1} style={{ marginTop: 16 }} labelStyle={{ width: 120 }}>
          <Descriptions.Item label="期次">{moduleInfo.period}</Descriptions.Item>
          <Descriptions.Item label="关联模板">工作模块（固定）</Descriptions.Item>
          <Descriptions.Item label="填报范围">
            <TreeSelect
              treeData={permissionTreeData}
              value={fillUnits}
              onChange={setFillUnits}
              treeCheckable
              showCheckedStrategy={TreeSelect.SHOW_CHILD}
              placeholder="选择填报单位"
              style={{ width: "100%" }}
              maxTagCount={3}
            />
          </Descriptions.Item>
          <Descriptions.Item label="填报时间窗">
            <RangePicker
              showTime
              value={fillTimeRange}
              onChange={(dates) => {
                if (dates && dates[0] && dates[1]) {
                  setFillTimeRange([dates[0], dates[1]]);
                }
              }}
              style={{ width: "100%" }}
            />
          </Descriptions.Item>
          <Descriptions.Item label="是否需要审核">
            <Space>
              <Switch checked={needReview} onChange={setNeedReview} />
              {needReview && <Typography.Text type="secondary">审核方：区委办公室</Typography.Text>}
            </Space>
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </>
  );
};

export default WorkModuleCard;
