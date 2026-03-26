import React, { useMemo, useState } from "react";
import { Breadcrumb, Button, Card, Select, Space, Table, Tag, Typography, message } from "antd";
import type { TableProps } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

import styles from "./DataReport.module.css";
import {
  workModuleOverviewMock,
  workModulePeriods,
  workModuleStatusMap,
  type WorkModuleStatus,
} from "./workModuleColumnMock";

const WorkModuleColumnPage: React.FC = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const query = useMemo(() => new URLSearchParams(search), [search]);

  const defaultPeriod = query.get("period") ?? workModuleOverviewMock.currentPeriod;
  const defaultTaskId = query.get("taskId") ?? workModuleOverviewMock.currentTaskId;

  const [selectedPeriod, setSelectedPeriod] = useState(defaultPeriod);
  const [selectedTaskId, setSelectedTaskId] = useState(defaultTaskId);

  const currentPeriodMeta = useMemo(
    () => workModulePeriods.find((item) => item.period === selectedPeriod) ?? workModulePeriods[0],
    [selectedPeriod],
  );
  const currentStatusMeta = workModuleStatusMap[currentPeriodMeta.status];

  const historyPeriods = useMemo(
    () => workModulePeriods.filter((item) => item.period !== selectedPeriod),
    [selectedPeriod],
  );

  const goFill = (taskId: string) => navigate(`/report/fill/${taskId}`);

  const openPeriod = (period: string, taskId: string) => {
    setSelectedPeriod(period);
    setSelectedTaskId(taskId);
    navigate(`/report/work-module?period=${period}&taskId=${taskId}`);
  };

  const historyColumns: TableProps<(typeof historyPeriods)[number]>["columns"] = [
    { title: "期次", dataIndex: "period", key: "period", width: 120 },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (value: WorkModuleStatus) => (
        <Tag color={workModuleStatusMap[value].color}>{workModuleStatusMap[value].label}</Tag>
      ),
    },
    { title: "提交时间", dataIndex: "submitTime", key: "submitTime", width: 180 },
    { title: "提交人", dataIndex: "submitter", key: "submitter", width: 120 },
    {
      title: "操作",
      key: "actions",
      width: 180,
      render: (_value, record) => (
        <Space size={0}>
          <Button type="link" onClick={() => openPeriod(record.period, record.taskId)}>
            查看详情
          </Button>
          <Button type="link" onClick={() => message.info("导出功能开发中")}>
            导出
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <Breadcrumb items={[{ title: "数据上报" }, { title: "工作模块专栏" }]} style={{ marginBottom: 12 }} />

      <Card className={`${styles.workModuleEntryCard} ${styles.workModuleEntryCardCompact}`}>
        <div className={styles.workModuleEntryHeader}>
          <Typography.Title level={5} style={{ margin: 0 }}>
            工作模块专栏
          </Typography.Title>
          <Button type="primary" onClick={() => goFill(selectedTaskId)}>
            {currentStatusMeta.primaryText}
          </Button>
        </div>
        <div className={styles.workModuleEntryBody}>
          <div className={styles.workModuleMainInfo} style={{ minWidth: "100%" }}>
            <div className={styles.workModuleInfoGrid}>
              <div className={styles.workModuleInfoItem}>
                期次选择：
                <strong>
                  <Select
                    value={selectedPeriod}
                    style={{ width: 140, marginLeft: 6 }}
                    options={workModulePeriods.map((item) => ({ label: item.period, value: item.period }))}
                    onChange={(period) => {
                      const target = workModulePeriods.find((item) => item.period === period);
                      if (!target) return;
                      openPeriod(target.period, target.taskId);
                    }}
                  />
                </strong>
              </div>
              <div className={styles.workModuleInfoItem}>
                状态：
                <strong>
                  <Tag color={currentStatusMeta.color} style={{ marginLeft: 6 }}>
                    {currentStatusMeta.label}
                  </Tag>
                </strong>
              </div>
              <div className={styles.workModuleInfoItem}>
                截止时间：<strong>{currentPeriodMeta.deadlineTime}</strong>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className={styles.workModuleColumnCard} style={{ marginTop: 16 }}>
        <Table
          rowKey="period"
          size="small"
          columns={historyColumns}
          dataSource={historyPeriods}
          pagination={{ pageSize: 10, showSizeChanger: false }}
        />
      </Card>
    </div>
  );
};

export default WorkModuleColumnPage;
