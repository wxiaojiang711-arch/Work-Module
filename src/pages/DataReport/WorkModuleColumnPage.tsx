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
  const { pathname, search } = useLocation();
  const basePath = pathname.startsWith("/report/structured") ? "/report/structured" : "/report";
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

  const goFill = (taskId: string) => navigate(`${basePath}/fill/${taskId}`);

  const openPeriod = (period: string, taskId: string) => {
    setSelectedPeriod(period);
    setSelectedTaskId(taskId);
    navigate(`${basePath}/work-module?period=${period}&taskId=${taskId}`);
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
          <Button type="link" onClick={() => navigate(`${basePath}/view/${record.taskId}`)}>
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

      <Card className={styles.workModuleEntryCard}>
        <div className={styles.workModuleEntryHeader}>
          <div>
            <h3 className={styles.workModuleEntryTitle}>{"\u5de5\u4f5c\u6a21\u5757\u4e13\u680f"}</h3>
            <div className={styles.workModuleEntrySubTitle}>{"\u6309\u5b63\u5ea6\u66f4\u65b0\uff5c\u7528\u4e8e\u6301\u7eed\u7ef4\u62a4\u5404\u5355\u4f4d\u5de5\u4f5c\u6a21\u5757\u5185\u5bb9"}</div>
          </div>
          <Space>
            <Button type="primary" onClick={() => goFill(selectedTaskId)}>
              {currentStatusMeta.primaryText}
            </Button>
          </Space>
        </div>
        <div className={styles.workModuleEntryBody}>
          <div className={styles.workModuleMainInfo} style={{ minWidth: "100%" }}>
            <div className={`${styles.workModuleInfoGrid} ${styles.workModuleInfoGridFour}`}>
              <div className={styles.workModuleInfoItem}>
                {"\u5f53\u524d\u671f\u6b21\uff1a"}
                <span style={{ marginLeft: 6 }}>
                  <Select
                    value={selectedPeriod}
                    style={{ width: 140 }}
                    options={workModulePeriods.map((item) => ({ label: item.period, value: item.period }))}
                    onChange={(period) => {
                      const target = workModulePeriods.find((item) => item.period === period);
                      if (!target) return;
                      openPeriod(target.period, target.taskId);
                    }}
                  />
                </span>
              </div>
              <div className={styles.workModuleInfoItem}>
                {"\u72b6\u6001\uff1a"}
                <span>
                  <Tag color={currentStatusMeta.color} style={{ marginLeft: 6 }}>
                    {currentStatusMeta.label}
                  </Tag>
                </span>
              </div>
              <div className={styles.workModuleInfoItem}>
                {"\u622a\u6b62\u65f6\u95f4\uff1a"}
                <span>{currentPeriodMeta.deadlineTime}</span>
              </div>
              <div className={styles.workModuleInfoItem}>
                {"\u4e0b\u53d1\u5355\u4f4d\uff1a"}
                <span>{workModuleOverviewMock.issuerOrgName}</span>
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
