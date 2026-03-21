import React, { useMemo, useState } from "react";
import type { MenuProps, TableProps } from "antd";
import {
  Button,
  Col,
  DatePicker,
  Dropdown,
  Input,
  Popconfirm,
  Progress,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

import {
  taskListMock,
  taskStatusColorMap,
  taskStatusTextMap,
  type TaskItem,
  type TaskStatus,
} from "./taskConstants";

const TaskListPage: React.FC = () => {
  const navigate = useNavigate();

  const [taskList, setTaskList] = useState<TaskItem[]>(taskListMock);
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | TaskStatus>("all");
  const [rangeText, setRangeText] = useState<[string, string] | null>(null);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [originalName, setOriginalName] = useState("");

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

  const filteredList = useMemo(() => {
    return taskList.filter((item) => {
      const matchKeyword = !keyword.trim() || item.name.toLowerCase().includes(keyword.trim().toLowerCase());
      const matchStatus = statusFilter === "all" || item.status === statusFilter;
      const matchRange =
        !rangeText || (item.createdAt.slice(0, 10) >= rangeText[0] && item.createdAt.slice(0, 10) <= rangeText[1]);
      return matchKeyword && matchStatus && matchRange;
    });
  }, [keyword, rangeText, statusFilter, taskList]);

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
      width: 460,
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
          <Space size={0}>
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
                结束任务
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

      <Row gutter={[12, 12]} style={{ marginBottom: 12 }} align="middle" justify="space-between">
        <Col>
          <Space wrap>
            <Input.Search
              placeholder="请输入任务名称"
              allowClear
              style={{ width: 260 }}
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
            />
            <Select
              style={{ width: 140 }}
              value={statusFilter}
              options={[
                { label: "全部", value: "all" },
                { label: "待开始", value: "pending" },
                { label: "采集中", value: "collecting" },
                { label: "已结束", value: "finished" },
              ]}
              onChange={(value) => setStatusFilter(value)}
            />
            <DatePicker.RangePicker
              onChange={(value) => {
                const start = value?.[0]?.format("YYYY-MM-DD");
                const end = value?.[1]?.format("YYYY-MM-DD");
                if (!start || !end) {
                  setRangeText(null);
                  return;
                }
                setRangeText([start, end]);
              }}
            />
            <Button type="primary">查询</Button>
            <Button
              onClick={() => {
                setKeyword("");
                setStatusFilter("all");
                setRangeText(null);
              }}
            >
              重置
            </Button>
          </Space>
        </Col>

        <Col>
          <Button type="primary" onClick={() => navigate("/task/create")}>创建采集任务</Button>
        </Col>
      </Row>

      <Table<TaskItem>
        rowKey="id"
        columns={columns}
        dataSource={filteredList}
        scroll={{ x: 1700 }}
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

