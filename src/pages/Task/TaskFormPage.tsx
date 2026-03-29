import React, { useMemo, useState } from "react";
import { Breadcrumb, Button, Card, DatePicker, Space, Steps, message } from "antd";
import dayjs from "dayjs";
import { Link, useNavigate, useParams } from "react-router-dom";

import TaskBasicInfoStep from "./TaskBasicInfoStep";
import TaskFormSelectStep from "./TaskFormSelectStep";
import TaskPermissionStep from "./TaskPermissionStep";
import { taskListMock, type TaskConfig } from "./taskConstants";

const TaskFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId?: string }>();
  const [currentStep, setCurrentStep] = useState(0);

  const currentTask = useMemo(() => taskListMock.find((item) => item.id === taskId), [taskId]);

  const [taskConfig, setTaskConfig] = useState<TaskConfig>({
    name: currentTask?.name ?? "",
    urgency: "normal",
    timeRange: currentTask
      ? [dayjs(currentTask.startTime), dayjs(currentTask.deadline)]
      : [null, null],
    description: currentTask?.description ?? "",
    attachments: [],
    selectedTemplates: currentTask ? ["tpl-001", "tpl-002"] : [],
    fillPermissions: [],
    fillUnitScope: "all",
  });

  const stepItems = [
    {
      title: "基本信息",
      description: (
        <span style={{ whiteSpace: "nowrap", lineHeight: "20px", display: "inline-block" }}>
          填写任务名称、时间及说明
        </span>
      ),
    },
    {
      title: "选择表单模板",
      description: (
        <span style={{ whiteSpace: "nowrap", lineHeight: "20px", display: "inline-block" }}>
          关联需要采集的文件模板
        </span>
      ),
    },
    { title: "权限配置", description: "设置填写与查看权限" },
  ];

  const handleNext = () => {
    if (currentStep === 0) {
      const [start, end] = taskConfig.timeRange;
      if (!taskConfig.name.trim()) {
        message.warning("请输入任务名称");
        return;
      }
      if (!start || !end) {
        message.warning("请选择任务时间");
        return;
      }
    }

    if (currentStep === 1) {
      if (taskConfig.selectedTemplates.length === 0) {
        message.warning("请至少选择一个表单模板");
        return;
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, 2));
  };

  const handlePublish = () => {
    const [start, end] = taskConfig.timeRange;
    if (!taskConfig.name.trim() || !start || !end) {
      message.warning("请先完成基本信息");
      return;
    }
    if (taskConfig.selectedTemplates.length === 0) {
      message.warning("请至少选择一个表单模板");
      return;
    }
    if (taskConfig.fillPermissions.length === 0) {
      message.warning("请选择填写权限");
      return;
    }

    message.success(taskId ? "任务更新成功" : "任务发布成功");
    navigate("/task");
  };

  return (
    <div style={{ padding: 16, background: "#f3f6fb", height: "100%", overflow: "auto" }}>
      <Card style={{ marginBottom: 12 }}>
        <Breadcrumb
          items={[
            { title: <Link to="/task">采集任务</Link> },
            { title: taskId ? "编辑采集任务" : "创建采集任务" },
          ]}
        />
      </Card>

      <Card>
        <Steps current={currentStep} items={stepItems} />
      </Card>

      <Card style={{ marginTop: 12, marginBottom: 90 }}>
        {currentStep === 0 ? (
          <Space direction="vertical" style={{ width: "100%" }} size={16}>
            <div style={{ maxWidth: 700, margin: "0 auto" }}>
              <div style={{ marginBottom: 8, fontWeight: 500 }}>
                <span style={{ color: "#ff4d4f", marginRight: 4 }}>*</span>
                任务时间
              </div>
              <DatePicker.RangePicker
                showTime
                style={{ width: "100%" }}
                value={taskConfig.timeRange}
                onChange={(value) => onTaskPatch({ timeRange: value ?? [null, null] })}
              />
            </div>
            <TaskBasicInfoStep taskConfig={taskConfig} onChange={(patch) => onTaskPatch(patch)} />
          </Space>
        ) : null}

        {currentStep === 1 ? (
          <TaskFormSelectStep taskConfig={taskConfig} onChange={(patch) => onTaskPatch(patch)} />
        ) : null}

        {currentStep === 2 ? (
          <TaskPermissionStep taskConfig={taskConfig} onChange={(patch) => onTaskPatch(patch)} />
        ) : null}
      </Card>

      <div
        style={{
          position: "fixed",
          left: 240,
          right: 0,
          bottom: 0,
          borderTop: "1px solid #e6ebf5",
          background: "#fff",
          padding: "12px 20px",
          display: "flex",
          justifyContent: "flex-end",
          zIndex: 12,
        }}
      >
        <Space>
          <Button disabled={currentStep === 0} onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}>
            上一步
          </Button>
          {currentStep < 2 ? (
            <Button type="primary" onClick={handleNext}>
              下一步
            </Button>
          ) : (
            <Button type="primary" onClick={handlePublish}>
              发布任务
            </Button>
          )}
        </Space>
      </div>
    </div>
  );

  function onTaskPatch(patch: Partial<TaskConfig>) {
    setTaskConfig((prev) => ({ ...prev, ...patch }));
  }
};

export default TaskFormPage;

