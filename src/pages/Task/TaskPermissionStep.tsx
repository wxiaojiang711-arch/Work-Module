import React from "react";
import { Checkbox, Collapse, Form, Select, Space, Tree } from "antd";
import type { TreeProps } from "antd";
import type { TaskConfig } from "./taskConstants";

interface TaskPermissionStepProps {
  taskConfig: TaskConfig;
  onChange: (patch: Partial<TaskConfig>) => void;
}

const unitTreeData: TreeProps["treeData"] = [
  {
    key: "level-department",
    title: "部门",
    children: [
      { key: "dept_bigdata", title: "区大数据局" },
      { key: "dept_fagai", title: "区发改委" },
      { key: "dept_wenlv", title: "区文旅委" },
      { key: "dept_jiaotong", title: "区交通局" },
    ],
  },
  {
    key: "level-town",
    title: "镇街",
    children: [
      { key: "town_xintang", title: "新塘镇" },
      { key: "town_shitan", title: "石滩镇" },
      { key: "town_zhongxin", title: "中新镇" },
    ],
  },
  {
    key: "level-soe",
    title: "国企",
    children: [
      { key: "soe_chengtou", title: "区城投集团" },
      { key: "soe_jiaotou", title: "区交投集团" },
      { key: "soe_wentou", title: "区文投集团" },
    ],
  },
];

const TaskPermissionStep: React.FC<TaskPermissionStepProps> = ({ taskConfig, onChange }) => {
  const roleOptions = [
    { label: "数据专员", value: "data_specialist" },
    { label: "单位管理员", value: "unit_admin" },
    { label: "其他", value: "other" },
  ];

  const selectedUnits = taskConfig.fillUnitCustom ?? [];
  const isPartial = taskConfig.fillUnitScope === "custom";

  return (
    <Form layout="vertical" style={{ maxWidth: 800, margin: "0 auto" }}>
      <Collapse
        defaultActiveKey={["fill_permission"]}
        items={[
          {
            key: "fill_permission",
            label: <span style={{ fontSize: 16, fontWeight: 600 }}>【填报权限】</span>,
            children: (
              <Space direction="vertical" size={12} style={{ width: "100%" }}>
                <Form.Item
                  label={
                    <span>
                      填报单位范围
                      <span style={{ color: "#8c8c8c" }}>（选择“部分单位填报”时可按层级展开并勾选具体单位）</span>
                    </span>
                  }
                  required
                  style={{ marginBottom: 12 }}
                >
                  <Space direction="vertical" size={8} style={{ width: "100%" }}>
                    <Select
                      value={taskConfig.fillUnitScope}
                      placeholder="请选择填报单位范围"
                      options={[
                        { label: "全部单位填报", value: "all" },
                        { label: "部分单位填报", value: "custom" },
                      ]}
                      onChange={(value) => {
                        if (value === "all") {
                          onChange({ fillUnitScope: "all", fillUnitCustom: [] });
                          return;
                        }
                        onChange({ fillUnitScope: "custom" });
                      }}
                    />

                    {isPartial ? (
                      <div
                        style={{
                          border: "1px solid #e6eaf0",
                          borderRadius: 8,
                          padding: 12,
                          height: 260,
                          overflowY: "auto",
                          background: "#fafbfc",
                        }}
                      >
                        <Tree
                          checkable
                          defaultExpandAll
                          treeData={unitTreeData}
                          checkedKeys={selectedUnits}
                          onCheck={(checkedKeys) => onChange({ fillUnitCustom: checkedKeys as string[] })}
                        />
                      </div>
                    ) : null}
                  </Space>

                </Form.Item>

                <Form.Item
                  label={
                    <span>
                      填报人员角色
                      <span style={{ color: "#8c8c8c" }}>（选择哪些角色可以进行数据填报）</span>
                    </span>
                  }
                  required
                  style={{ marginBottom: 0 }}
                >
                  <Checkbox.Group
                    value={taskConfig.fillRoles}
                    onChange={(value) => onChange({ fillRoles: value as string[] })}
                    options={roleOptions}
                  />
                </Form.Item>
              </Space>
            ),
          },
        ]}
      />
    </Form>
  );
};

export default TaskPermissionStep;
