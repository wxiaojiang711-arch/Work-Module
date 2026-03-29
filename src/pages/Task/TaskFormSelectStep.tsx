import React, { useMemo, useState } from "react";
import { Button, Card, Empty, Input, List, Select, Space, Tag, Typography } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

import {
  availableTemplates,
  templateCategoryTextMap,
  type TaskConfig,
  type TemplateItem,
} from "./taskConstants";

interface TaskFormSelectStepProps {
  taskConfig: TaskConfig;
  onChange: (patch: Partial<TaskConfig>) => void;
}

const TaskFormSelectStep: React.FC<TaskFormSelectStepProps> = ({ taskConfig, onChange }) => {
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | TemplateItem["category"]>("all");

  const selectedSet = useMemo(() => new Set(taskConfig.selectedTemplates), [taskConfig.selectedTemplates]);

  const filteredTemplates = useMemo(() => {
    return availableTemplates.filter((item) => {
      const matchSearch =
        !searchText || item.name.toLowerCase().includes(searchText.trim().toLowerCase());
      const matchCategory = categoryFilter === "all" || item.category === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [searchText, categoryFilter]);

  const selectedTemplates = useMemo(
    () => availableTemplates.filter((item) => selectedSet.has(item.id)),
    [selectedSet],
  );

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", gap: 16 }}>
        <Card title="可选表单模板" style={{ width: 500, minHeight: 520 }}>
          <Space direction="vertical" style={{ width: "100%" }} size={12}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Select
                value={categoryFilter}
                style={{ width: 130 }}
                options={[
                  { value: "all", label: "全部" },
                  { value: "decision", label: "决策库" },
                  { value: "department", label: "单位库-部门" },
                  { value: "town", label: "单位库-镇街" },
                  { value: "soe", label: "单位库-国企" },
                  { value: "theme", label: "主题库" },
                ]}
                onChange={(value) => setCategoryFilter(value)}
              />

              <Input.Search
                placeholder="请输入模板名称"
                allowClear
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                style={{ flex: 1 }}
              />
            </div>

            <List
              bordered
              dataSource={filteredTemplates}
              locale={{ emptyText: "暂无可选模板" }}
              renderItem={(item) => {
                const selected = selectedSet.has(item.id);

                return (
                  <List.Item
                    actions={[
                      <Button
                        key="add"
                        icon={<PlusOutlined />}
                        disabled={selected}
                        onClick={() =>
                          onChange({ selectedTemplates: [...taskConfig.selectedTemplates, item.id] })
                        }
                      >
                        {selected ? "已添加" : "添加"}
                      </Button>,
                    ]}
                  >
                    <Space direction="vertical" size={2}>
                      <Typography.Text>{item.name}</Typography.Text>
                      <Tag>{templateCategoryTextMap[item.category]}</Tag>
                    </Space>
                  </List.Item>
                );
              }}
            />
          </Space>
        </Card>

        <Card title={`已选表单模板 (${selectedTemplates.length}个)`} style={{ width: 500, minHeight: 520 }}>
          {selectedTemplates.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="请从左侧添加表单模板" />
          ) : (
            <List
              bordered
              dataSource={selectedTemplates}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button
                      key="remove"
                      danger
                      type="text"
                      icon={<DeleteOutlined />}
                      onClick={() =>
                        onChange({
                          selectedTemplates: taskConfig.selectedTemplates.filter((id) => id !== item.id),
                        })
                      }
                    >
                      移除
                    </Button>,
                  ]}
                >
                  <Typography.Text>{item.name}</Typography.Text>
                </List.Item>
              )}
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default TaskFormSelectStep;
