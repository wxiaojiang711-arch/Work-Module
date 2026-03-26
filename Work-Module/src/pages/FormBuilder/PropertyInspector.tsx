import React from "react";
import { Button, Card, Form, Input, InputNumber, Space, Switch, Typography, Select } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

import type { FormField } from "./constants";

interface PropertyInspectorProps {
  activeComponent: FormField | null;
  onUpdateComponent: (id: string, updater: (field: FormField) => FormField) => void;
}

const optionSupportedTypes = new Set(["radio", "checkbox", "select"] as const);

const PropertyInspector: React.FC<PropertyInspectorProps> = ({ activeComponent, onUpdateComponent }) => {
  if (!activeComponent) {
    return (
      <Card title="属性配置" size="small">
        <Typography.Text type="secondary">请在画布中选择一个组件</Typography.Text>
      </Card>
    );
  }

  const patchComponent = (updater: (field: FormField) => FormField) => {
    onUpdateComponent(activeComponent.id, updater);
  };

  const options = activeComponent.props.options ?? [];

  return (
    <Card title="属性配置" size="small">
      <Form layout="vertical">
        <Form.Item label="标题">
          <Input value={activeComponent.label} onChange={(event) => patchComponent((field) => ({ ...field, label: event.target.value }))} />
        </Form.Item>

        <Form.Item label="占位提示">
          <Input
            value={activeComponent.props.placeholder}
            onChange={(event) =>
              patchComponent((field) => ({
                ...field,
                props: {
                  ...field.props,
                  placeholder: event.target.value,
                },
              }))
            }
          />
        </Form.Item>

        <Form.Item label="是否必填" valuePropName="checked">
          <Switch
            checked={activeComponent.validation.required}
            onChange={(checked) =>
              patchComponent((field) => ({
                ...field,
                validation: {
                  ...field.validation,
                  required: checked,
                },
              }))
            }
          />
        </Form.Item>

        {optionSupportedTypes.has(activeComponent.type as "radio" | "checkbox" | "select") ? (
          <>
            <Typography.Text strong style={{ marginBottom: 8, display: "block" }}>
              选项列表
            </Typography.Text>
            <Space direction="vertical" size={8} style={{ width: "100%" }}>
              {options.map((option, index) => (
                <Space key={option.value} style={{ width: "100%" }}>
                  <Input
                    value={option.label}
                    onChange={(event) => {
                      const next = [...options];
                      next[index] = { ...next[index], label: event.target.value };
                      patchComponent((field) => ({ ...field, props: { ...field.props, options: next } }));
                    }}
                  />
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => {
                      const next = options.filter((_, i) => i !== index);
                      patchComponent((field) => ({ ...field, props: { ...field.props, options: next } }));
                    }}
                  />
                </Space>
              ))}
              <Button
                block
                icon={<PlusOutlined />}
                onClick={() => {
                  const next = [...options, { label: `选项${options.length + 1}`, value: `option_${Date.now()}` }];
                  patchComponent((field) => ({ ...field, props: { ...field.props, options: next } }));
                }}
              >
                添加选项
              </Button>
            </Space>
          </>
        ) : null}

        {activeComponent.type === "number" ? (
          <Space size={8} style={{ width: "100%" }}>
            <Form.Item label="最小值" style={{ flex: 1 }}>
              <InputNumber
                style={{ width: "100%" }}
                value={activeComponent.props.min}
                onChange={(value) =>
                  patchComponent((field) => ({
                    ...field,
                    props: {
                      ...field.props,
                      min: typeof value === "number" ? value : undefined,
                    },
                  }))
                }
              />
            </Form.Item>
            <Form.Item label="最大值" style={{ flex: 1 }}>
              <InputNumber
                style={{ width: "100%" }}
                value={activeComponent.props.max}
                onChange={(value) =>
                  patchComponent((field) => ({
                    ...field,
                    props: {
                      ...field.props,
                      max: typeof value === "number" ? value : undefined,
                    },
                  }))
                }
              />
            </Form.Item>
          </Space>
        ) : null}

        {activeComponent.type === "datePicker" ? (
          <Form.Item label="日期格式">
            <Select
              value={activeComponent.props.format}
              options={[
                { label: "YYYY-MM-DD", value: "YYYY-MM-DD" },
                { label: "YYYY/MM/DD", value: "YYYY/MM/DD" },
                { label: "YYYY年MM月DD日", value: "YYYY年MM月DD日" },
              ]}
              onChange={(value) =>
                patchComponent((field) => ({
                  ...field,
                  props: {
                    ...field.props,
                    format: value,
                  },
                }))
              }
            />
          </Form.Item>
        ) : null}
      </Form>
    </Card>
  );
};

export default PropertyInspector;
