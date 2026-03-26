import React, { useMemo, useState } from "react";
import {
  Breadcrumb,
  Button,
  Card,
  Descriptions,
  Input,
  Modal,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import type { TableProps } from "antd";
import { Link, useParams } from "react-router-dom";

import {
  fillStatusColorMap,
  fillStatusTextMap,
  taskListMock,
  taskStatusColorMap,
  taskStatusTextMap,
  unitProgressMock,
  type FillStatus,
  type UnitProgressItem,
} from "./taskConstants";

const TaskDetailPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const task = useMemo(() => taskListMock.find((item) => item.id === taskId) ?? taskListMock[0], [taskId]);

  const [unitList, setUnitList] = useState<UnitProgressItem[]>(unitProgressMock);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectTarget, setRejectTarget] = useState<UnitProgressItem | null>(null);

  const completedCount = unitList.filter((item) => item.fillStatus === "submitted").length;
  const totalCount = unitList.length;
  const pendingCount = totalCount - completedCount;
  const percent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const columns: TableProps<UnitProgressItem>["columns"] = [
    { title: "单位名称", dataIndex: "unitName", key: "unitName" },
    {
      title: "填报状态",
      dataIndex: "fillStatus",
      key: "fillStatus",
      render: (value: FillStatus) => <Tag color={fillStatusColorMap[value]}>{fillStatusTextMap[value]}</Tag>,
    },
    {
      title: "提交时间",
      dataIndex: "submitTime",
      key: "submitTime",
      render: (value: string | null) => value ?? "-",
    },
    {
      title: "填报人",
      dataIndex: "submitter",
      key: "submitter",
      render: (value: string | null) => value ?? "-",
    },
    {
      title: "操作",
      key: "actions",
      width: 320,
      render: (_value, record) => (
        <Space size={1}>
          <Link to={`/task/${task.id}/view/${record.unitId}`}>
            <Button
              type="link"
              style={{ paddingInline: 4 }}
              disabled={record.fillStatus !== "submitted"}
            >
              查看数据
            </Button>
          </Link>
          <Button
            type="link"
            danger
            style={{ paddingInline: 4 }}
            disabled={record.fillStatus !== "submitted"}
            onClick={() => {
              setRejectTarget(record);
              setRejectReason("");
              setRejectModalOpen(true);
            }}
          >
            退回
          </Button>
          <Button
            type="link"
            style={{ paddingInline: 4 }}
            disabled={record.fillStatus === "submitted"}
            onClick={() => message.success(`已向 ${record.unitName} 发送催办`)}
          >
            催办
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20, background: "#f3f6fb", height: "100%", overflow: "auto" }}>
      <Space direction="vertical" size={12} style={{ width: "100%" }}>
        <Breadcrumb
          items={[
            { title: <Link to="/task">采集任务</Link> },
            { title: task.name },
          ]}
        />

        <Card
          title="任务概览"
          extra={
            <Space>
              <Button onClick={() => message.success("已向未完成单位发送催办")}>一键催办</Button>
              <Button type="primary" onClick={() => message.success("已导出全部数据")}>导出全部数据</Button>
            </Space>
          }
        >
          <Descriptions column={3} bordered size="small">
            <Descriptions.Item label="任务名称">{task.name}</Descriptions.Item>
            <Descriptions.Item label="任务状态">
              <Tag color={taskStatusColorMap[task.status]}>{taskStatusTextMap[task.status]}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="创建人">{task.creator}</Descriptions.Item>
            <Descriptions.Item label="开始时间">{task.startTime}</Descriptions.Item>
            <Descriptions.Item label="截止时间">{task.deadline}</Descriptions.Item>
            <Descriptions.Item label="关联表单数">{task.formCount}</Descriptions.Item>
            <Descriptions.Item label="应填单位数">{totalCount}</Descriptions.Item>
            <Descriptions.Item label="已完成单位数">
              <span style={{ color: "#3f8600" }}>{completedCount}</span>
            </Descriptions.Item>
            <Descriptions.Item label="未完成单位数">
              <span style={{ color: "#cf1322" }}>{pendingCount}</span>
            </Descriptions.Item>
            <Descriptions.Item label="任务描述" span={3}>
              {task.description ?? "-"}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card title="各单位填报明细">
          <Table<UnitProgressItem>
            rowKey="unitId"
            columns={columns}
            dataSource={unitList}
            pagination={{ pageSize: 10 }}
            locale={{ emptyText: "暂无单位进度数据" }}
          />
        </Card>
      </Space>

      <Modal
        title={rejectTarget ? `退回：${rejectTarget.unitName}` : "退回"}
        open={rejectModalOpen}
        onCancel={() => setRejectModalOpen(false)}
        onOk={() => {
          if (!rejectReason.trim()) {
            message.warning("请填写退回原因");
            return;
          }

          if (rejectTarget) {
            setUnitList((prev) =>
              prev.map((item) =>
                item.unitId === rejectTarget.unitId
                  ? { ...item, fillStatus: "rejected", submitTime: null, submitter: null }
                  : item,
              ),
            );
          }

          setRejectModalOpen(false);
          message.success("已退回并通知该单位重新填报");
        }}
      >
        <Input.TextArea
          rows={4}
          value={rejectReason}
          onChange={(event) => setRejectReason(event.target.value)}
          placeholder="请填写退回原因"
        />
      </Modal>
    </div>
  );
};

export default TaskDetailPage;
