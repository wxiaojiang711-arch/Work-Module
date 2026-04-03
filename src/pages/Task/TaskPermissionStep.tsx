import React from "react";
import { Collapse, Form, Select, Space, Tree, Typography } from "antd";
import type { TreeProps } from "antd";
import type { TaskConfig } from "./taskConstants";
import { departmentList, orgTypeLabelMap, soeList, townList } from "../OrganizationList/orgData";

interface TaskPermissionStepProps {
  taskConfig: TaskConfig;
  onChange: (patch: Partial<TaskConfig>) => void;
}

const unitTreeData: TreeProps["treeData"] = [
  {
    key: "level-department",
    title: orgTypeLabelMap.department,
    children: departmentList.map((item) => ({ key: item.id, title: item.fullName })),
  },
  {
    key: "level-town",
    title: orgTypeLabelMap.town,
    children: townList.map((item) => ({ key: item.id, title: item.fullName })),
  },
  {
    key: "level-soe",
    title: orgTypeLabelMap.soe,
    children: soeList.map((item) => ({ key: item.id, title: item.fullName })),
  },
];

const roleOptions = [
  { label: "部门负责人", value: "dept_lead" },
  { label: "业务处室", value: "biz_office" },
  { label: "信息员", value: "info_staff" },
  { label: "审核人", value: "reviewer" },
  { label: "管理员", value: "admin" },
  { label: "填报人员", value: "reporter" },
];

const TaskPermissionStep: React.FC<TaskPermissionStepProps> = ({ taskConfig, onChange }) => {
  const fillScope = taskConfig.fillUnitScope ?? "all";
  const selectedFillUnits = taskConfig.fillUnitCustom ?? [];
  const isFillCustom = fillScope === "custom";
  const selectedRoles = taskConfig.fillRoles ?? [];

  const normalizeChecked = (checked: React.Key[] | { checked: React.Key[] }) =>
    Array.isArray(checked) ? checked : checked.checked;

  return (
    <Form layout="vertical" style={{ maxWidth: 800, margin: "0 auto", height: 520, overflow: "auto" }}>
      <Collapse
        defaultActiveKey={["fill_permission"]}
        items={[
          {
            key: "fill_permission",
            label: <span style={{ fontSize: 16, fontWeight: 600 }}>【填报权限】</span>,
            children: (
              <Space direction="vertical" size={0} style={{ width: "100%" }}>
                <div style={{ marginBottom: 12, lineHeight: "22px" }}>
                  <span>
                    <span style={{ color: "#ff4d4f", marginRight: 4 }}>*</span>
                    填报单位范围
                    <Typography.Text type="secondary" style={{ marginLeft: 0 }}>
                      （选择“部分单位可填报”时可按层级展开并勾选具体单位）
                    </Typography.Text>
                  </span>
                </div>
                <Form.Item style={{ marginTop: 0, marginBottom: 4 }}>
                  <Select
                    value={fillScope}
                    style={{ width: 655 }}
                    options={[
                      { value: "all", label: "全部单位可填报" },
                      { value: "custom", label: "部分单位可填报" },
                    ]}
                    placeholder="请选择填报单位范围"
                    onChange={(value) => {
                      if (value === "all") {
                        onChange({
                          fillUnitScope: "all",
                          fillUnitCustom: [],
                          fillPermissions: ["all"],
                        });
                        return;
                      }
                      onChange({
                        fillUnitScope: "custom",
                        fillUnitCustom: [],
                        fillPermissions: [],
                      });
                    }}
                  />
                </Form.Item>
                <div style={{ marginBottom: 12 }}>
                  <Typography.Text type="secondary">
                    {isFillCustom ? `已选择 ${selectedFillUnits.length} 个单位` : "当前为全部单位"}
                  </Typography.Text>
                </div>
                {isFillCustom ? (
                  <div
                    style={{
                      border: "1px solid #f0f0f0",
                      borderRadius: 6,
                      padding: 12,
                      height: 320,
                      overflow: "auto",
                    }}
                  >
                    <Tree
                      checkable
                      defaultExpandAll
                      selectable={false}
                      treeData={unitTreeData}
                      checkedKeys={selectedFillUnits}
                      onCheck={(checkedKeys) => {
                        const keys = normalizeChecked(checkedKeys).map(String);
                        onChange({
                          fillUnitCustom: keys,
                          fillPermissions: keys,
                        });
                      }}
                    />
                  </div>
                ) : null}
                <div style={{ marginTop: 16 }}>
                  <div style={{ marginBottom: 8 }}>
                    <span style={{ color: "#ff4d4f", marginRight: 4 }}>*</span>
                    填报角色范围
                    <Typography.Text type="secondary" style={{ marginLeft: 8 }}>
                      （支持按角色配置上传权限，仅所选角色对应的用户可以进行文件上传。）
                    </Typography.Text>
                  </div>
                  <Select
                    mode="multiple"
                    allowClear
                    placeholder="请选择填报角色"
                    value={selectedRoles}
                    style={{ width: 655 }}
                    options={roleOptions}
                    onChange={(value) => onChange({ fillRoles: value })}
                  />
                </div>
              </Space>
            ),
          },
        ]}
      />
    </Form>
  );
};

export default TaskPermissionStep;
