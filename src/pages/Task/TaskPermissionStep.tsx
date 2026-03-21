import React from "react";
import { Card, Space, TreeSelect, Typography } from "antd";

import { permissionTreeData, type TaskConfig } from "./taskConstants";

interface TaskPermissionStepProps {
  taskConfig: TaskConfig;
  onChange: (patch: Partial<TaskConfig>) => void;
}

const TaskPermissionStep: React.FC<TaskPermissionStepProps> = ({ taskConfig, onChange }) => {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", paddingBottom: 24 }}>
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        <Card title="填写权限">
          <Typography.Paragraph type="secondary">
            设置哪些组织可以填写此采集任务中的表单
          </Typography.Paragraph>
          <TreeSelect
            treeData={permissionTreeData}
            treeCheckable
            value={taskConfig.fillPermissions}
            style={{ width: "100%" }}
            placeholder="请选择可填写的单位"
            allowClear
            maxTagCount="responsive"
            onChange={(value) => onChange({ fillPermissions: value as string[] })}
          />
        </Card>

        <Card title="查看权限">
          <Typography.Paragraph type="secondary">
            设置哪些组织可以查阅此采集任务的提交数据
          </Typography.Paragraph>
          <TreeSelect
            treeData={permissionTreeData}
            treeCheckable
            value={taskConfig.viewPermissions}
            style={{ width: "100%" }}
            placeholder="请选择可查看的单位"
            allowClear
            maxTagCount="responsive"
            onChange={(value) => onChange({ viewPermissions: value as string[] })}
          />
        </Card>
      </Space>
    </div>
  );
};

export default TaskPermissionStep;
