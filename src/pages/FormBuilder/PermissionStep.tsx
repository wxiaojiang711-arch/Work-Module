import React from "react";
import { Card, Radio, Space, TreeSelect, Typography } from "antd";

import { frequencyOptions, permissionTreeData, type FormConfig } from "./constants";

interface PermissionStepProps {
  formConfig: FormConfig;
  onChange: (patch: Partial<FormConfig>) => void;
}

const PermissionStep: React.FC<PermissionStepProps> = ({ formConfig, onChange }) => {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", paddingBottom: 80 }}>
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        <Card title="更新频率">
          <Radio.Group
            value={formConfig.updateFrequency}
            options={frequencyOptions}
            onChange={(event) => onChange({ updateFrequency: event.target.value })}
          />
        </Card>

        <Card title="编辑权限">
          <Typography.Paragraph type="secondary">设置哪些组织和人员可以填写此表单</Typography.Paragraph>
          <TreeSelect
            treeData={permissionTreeData}
            treeCheckable
            value={formConfig.editPermissions}
            style={{ width: "100%" }}
            placeholder="请选择可编辑的部门"
            showSearch
            allowClear
            maxTagCount="responsive"
            onChange={(value) => onChange({ editPermissions: value as string[] })}
          />
        </Card>

        <Card title="查看权限">
          <Typography.Paragraph type="secondary">设置哪些组织和人员可以查阅此表单的提交数据</Typography.Paragraph>
          <TreeSelect
            treeData={permissionTreeData}
            treeCheckable
            value={formConfig.viewPermissions}
            style={{ width: "100%" }}
            placeholder="请选择可查看的部门"
            showSearch
            allowClear
            maxTagCount="responsive"
            onChange={(value) => onChange({ viewPermissions: value as string[] })}
          />
        </Card>
      </Space>
    </div>
  );
};

export default PermissionStep;
