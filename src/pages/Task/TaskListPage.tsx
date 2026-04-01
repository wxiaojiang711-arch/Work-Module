import React, { useMemo, useState } from "react";
import type { MenuProps, TableProps } from "antd";
import {
  Button,
  DatePicker,
  Dropdown,
  Input,
  Popconfirm,
  Progress,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import {
  taskListMock,
  taskStatusColorMap,
  taskStatusTextMap,
  type TaskItem,
  type TaskStatus,
} from "./taskConstants";
import WorkModuleCard from "./WorkModuleCard";

const TaskListPage: React.FC = () => {
  const navigate = useNavigate();

  const [taskList, setTaskList] = useState<TaskItem[]>(taskListMock);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [originalName, setOriginalName] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterStatus, setFilterStatus] = useState<TaskStatus | "">("");
  const [filterCreator, setFilterCreator] = useState("");
  const [filterTimeRange, setFilterTimeRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);

  const handleCopyTask = (record: TaskItem) => {
    const now = new Date();
    const newTask: TaskItem = {
      ...record,
      id: `task-copy-${Date.now()}`,
      name: `${record.name} - 副本`,
      status: "pending",
      progress: { completed: 0, total: record.progress.total },
      startTime: "",
      deadline: "",
      creator: "当前用户",
      createdAt: now.toISOString().slice(0, 19).replace("T", " "),
    };

    setTaskList((prev) => [newTask, ...prev]);
    setEditingRowId(newTask.id);
    setEditingName(newTask.name);
    setOriginalName(record.name);
  };

  const validateCopyName = (name: string): string | null => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      return "任务名称不能为空";
    }
    if (trimmedName === originalName) {
      return "复制任务的名称不能与原任务相同，请修改";
    }
    const isDuplicate = taskList.some((task) => task.id !== editingRowId && task.name === trimmedName);
    if (isDuplicate) {
      return "该任务名称已存在，请重新输入";
    }
    return null;
  };

  const handleSaveCopy = () => {
    const error = validateCopyName(editingName);
    if (error) {
      message.error(error);
      return;
    }

    const trimmedName = editingName.trim();
    setTaskList((prev) => prev.map((task) => (task.id === editingRowId ? { ...task, name: trimmedName } : task)));
    setEditingRowId(null);
    setEditingName("");
    setOriginalName("");
    message.success("复制任务已保存");
  };

  const handleCancelCopy = () => {
    if (!editingRowId) {
      return;
    }
    setTaskList((prev) => prev.filter((task) => task.id !== editingRowId));
    setEditingRowId(null);
    setEditingName("");
    setOriginalName("");
  };

  const filteredTasks = useMemo(() => {
    return taskList.filter((task) => {
      if (filterName.trim() && !task.name.includes(filterName.trim())) {
        return false;
      }
      if (filterCreator.trim() && !task.creator.includes(filterCreator.trim())) {
        return false;
      }
      if (filterStatus && task.status !== filterStatus) {
        return false;
      }
      const [start, end] = filterTimeRange;
      if (start || end) {
        const taskStart = dayjs(task.startTime);
        const taskEnd = dayjs(task.deadline);
        if (start && taskStart.isBefore(start, "minute")) {
          return false;
        }
        if (end && taskEnd.isAfter(end, "minute")) {
          return false;
        }
      }
      return true;
    });
  }, [filterCreator, filterName, filterStatus, filterTimeRange, taskList]);

  const columns: TableProps<TaskItem>["columns"] = [
    {
      title: "任务名称",
      dataIndex: "name",
      key: "name",
      width: 260,
      render: (_value, record) => {
        if (record.id === editingRowId) {
          const hasError = Boolean(validateCopyName(editingName));
          return (
            <Input
              autoFocus
              value={editingName}
              status={hasError ? "error" : ""}
              onChange={(event) => setEditingName(event.target.value)}
              onPressEnter={handleSaveCopy}
            />
          );
        }
        return <Link to={`/task/detail/${record.id}`}>{record.name}</Link>;
      },
    },
    {
      title: "关联表单数",
      dataIndex: "formCount",
      key: "formCount",
      width: 120,
    },
    {
      title: "任务状态",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (value: TaskStatus) => <Tag color={taskStatusColorMap[value]}>{taskStatusTextMap[value]}</Tag>,
    },
    {
      title: "填报进度",
      key: "progress",
      width: 220,
      render: (_value, record) => {
        const percent = record.progress.total === 0 ? 0 : Math.round((record.progress.completed / record.progress.total) * 100);
        return (
          <div>
            <Progress percent={percent} size="small" />
            <Typography.Text type="secondary">
              已完成 {record.progress.completed}/{record.progress.total} 个单位
            </Typography.Text>
          </div>
        );
      },
    },
    { title: "开始时间", dataIndex: "startTime", key: "startTime", width: 170 },
    { title: "截止时间", dataIndex: "deadline", key: "deadline", width: 170 },
    { title: "创建人", dataIndex: "creator", key: "creator", width: 100 },
    {
      title: "操作",
      key: "actions",
      width: 280,
      fixed: "right",
      render: (_value, record) => {
        if (record.id === editingRowId) {
          return (
            <Space size={0}>
              <Button type="link" icon={<CheckOutlined />} style={{ color: "#52c41a", paddingInline: 4 }} onClick={handleSaveCopy}>
                保存
              </Button>
              <Button type="link" icon={<CloseOutlined />} style={{ paddingInline: 4 }} onClick={handleCancelCopy}>
                取消
              </Button>
            </Space>
          );
        }

        const moreItems: MenuProps["items"] = [
          {
            key: "copy",
            label: "复制任务",
            onClick: () => handleCopyTask(record),
          },
          {
            key: "export",
            label: "导出数据",
            onClick: () => message.success(`已导出数据：${record.name}`),
          },
          {
            key: "delete",
            label: "删除",
            danger: true,
            disabled: !(record.status === "pending" || record.status === "finished"),
            onClick: () => {
              if (record.status !== "pending" && record.status !== "finished") {
                message.warning("当前状态不可删除");
                return;
              }
              setTaskList((prev) => prev.filter((item) => item.id !== record.id));
              message.success("任务已删除");
            },
          },
        ];

        return (
          <Space size={0} wrap>
            <Button type="link" style={{ paddingInline: 4 }} onClick={() => navigate(`/task/detail/${record.id}`)}>
              查看进度
            </Button>
            <Button type="link" style={{ paddingInline: 4 }} disabled={record.status !== "pending"} onClick={() => navigate(`/task/edit/${record.id}`)}>
              编辑
            </Button>
            <Popconfirm
              title="确认催办未完成单位吗？"
              okText="确认"
              cancelText="取消"
              disabled={record.status !== "collecting"}
              onConfirm={() => message.success("催办已发送")}
            >
              <Button type="link" style={{ paddingInline: 4 }} disabled={record.status !== "collecting"}>
                催办
              </Button>
            </Popconfirm>
            <Popconfirm
              title="确认提前结束该任务吗？"
              okText="确认"
              cancelText="取消"
              disabled={record.status !== "collecting"}
              onConfirm={() => {
                setTaskList((prev) =>
                  prev.map((item) => (item.id === record.id ? { ...item, status: "finished" } : item)),
                );
                message.success("任务已结束");
              }}
            >
              <Button type="link" style={{ paddingInline: 4 }} disabled={record.status !== "collecting"}>
                结束填报
              </Button>
            </Popconfirm>

            <Dropdown menu={{ items: moreItems }}>
              <Button type="link" style={{ paddingInline: 4 }}>更多</Button>
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ padding: 20, background: "#f3f6fb", height: "100%", overflow: "auto" }}>
      <Typography.Title level={5} style={{ marginTop: 0 }}>采集任务</Typography.Title>

      <WorkModuleCard />

      <div style={{ marginTop: 12, marginBottom: 12 }}>
        <Button type="primary" style={{ width: 120 }} onClick={() => navigate("/task/create")}>
          创建采集任务
        </Button>
      </div>

      <div
        style={{
          marginTop: 12,
          marginBottom: 12,
          padding: "12px 16px",
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
          <Space wrap size={[12, 12]} align="center" style={{ flex: 1 }}>
            <Space size={8} align="center">
              <span style={{ color: "#666", minWidth: 56 }}>任务名称</span>
              <Input
                placeholder="请输入"
                value={filterName}
                onChange={(event) => setFilterName(event.target.value)}
                style={{ width: 200 }}
                allowClear
              />
            </Space>
            <Space size={8} align="center">
              <span style={{ color: "#666", minWidth: 56 }}>任务状态</span>
              <Select
                placeholder="请选择"
                value={filterStatus || undefined}
                onChange={(value) => setFilterStatus(value)}
                style={{ width: 160 }}
                allowClear
                options={[
                  { label: taskStatusTextMap.pending, value: "pending" },
                  { label: taskStatusTextMap.collecting, value: "collecting" },
                  { label: taskStatusTextMap.finished, value: "finished" },
                ]}
              />
            </Space>
            <Space size={8} align="center">
              <span style={{ color: "#666", minWidth: 56 }}>创建人</span>
              <Input
                placeholder="请输入"
                value={filterCreator}
                onChange={(event) => setFilterCreator(event.target.value)}
                style={{ width: 160 }}
                allowClear
              />
            </Space>
            <Space size={8} align="center">
              <span style={{ color: "#666", minWidth: 56 }}>任务时间</span>
              <DatePicker.RangePicker
                showTime
                value={filterTimeRange}
                onChange={(value) => setFilterTimeRange(value ?? [null, null])}
                style={{ width: 320 }}
              />
            </Space>
          </Space>
          <Space size={8} style={{ marginLeft: "auto" }}>
            <Button type="primary">查看</Button>
            <Button
              onClick={() => {
                setFilterName("");
                setFilterStatus("");
                setFilterCreator("");
                setFilterTimeRange([null, null]);
              }}
            >
              重置
            </Button>
          </Space>
        </div>
      </div>

      <Table<TaskItem>
        rowKey="id"
        columns={columns}
        dataSource={filteredTasks}
        locale={{ emptyText: "暂无采集任务" }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ["10", "20", "50"],
          showTotal: (total) => `共 ${total} 条`,
        }}
      />
    </div>
  );
};

export default TaskListPage;





