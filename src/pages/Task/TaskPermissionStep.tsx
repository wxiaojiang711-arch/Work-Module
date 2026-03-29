import React from "react";
import { Collapse, Form, Select, Space, Tree, Typography } from "antd";
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
  const fillScope = taskConfig.fillUnitScope ?? "all";
  const selectedFillUnits = taskConfig.fillUnitCustom ?? [];
  const isFillCustom = fillScope === "custom";

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
                <div style={{ marginBottom: 20, lineHeight: "22px" }}>
                  <span>
                    填报单位范围
                    <Typography.Text type="secondary" style={{ marginLeft: 0 }}>
                      （选择“部分单位填报”时可按层级展开并勾选具体单位）
                    </Typography.Text>
                  </span>
                </div>
                <Form.Item style={{ marginTop: 0, marginBottom: 5 }}>
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
                <div style={{ marginTop: 10 }}>
                  <Typography.Text type="secondary">
                    {isFillCustom ? `已选择 ${selectedFillUnits.length} 个单位` : "当前为全部单位"}
                  </Typography.Text>
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
