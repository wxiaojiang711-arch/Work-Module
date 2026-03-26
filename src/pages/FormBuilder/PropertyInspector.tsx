import React from "react";
import { Button, Card, Form, Input, InputNumber, Space, Switch, Typography, Select, Radio, Checkbox, ColorPicker, Slider } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

import type { FormField } from "./constants";

interface PropertyInspectorProps {
  activeComponent: FormField | null;
  onUpdateComponent: (id: string, updater: (field: FormField) => FormField) => void;
  showUpdateFrequency?: boolean;
}

const optionSupportedTypes = new Set(["radio", "checkbox", "select"] as const);

const PropertyInspector: React.FC<PropertyInspectorProps> = ({
  activeComponent,
  onUpdateComponent,
  showUpdateFrequency = true,
}) => {
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

        {activeComponent.type === "textLabel" ? (
          <>
            <Form.Item label="文本内容">
              <Input.TextArea
                rows={3}
                value={activeComponent.props.text}
                onChange={(e) =>
                  patchComponent((field) => ({
                    ...field,
                    props: { ...field.props, text: e.target.value },
                  }))
                }
              />
            </Form.Item>
            <Form.Item label="对齐方式">
              <Radio.Group
                value={activeComponent.props.textAlign}
                onChange={(e) =>
                  patchComponent((field) => ({
                    ...field,
                    props: { ...field.props, textAlign: e.target.value },
                  }))
                }
              >
                <Radio.Button value="left">左对齐</Radio.Button>
                <Radio.Button value="center">居中</Radio.Button>
                <Radio.Button value="right">右对齐</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="字体大小">
              <Select
                value={activeComponent.props.fontSize}
                onChange={(value) =>
                  patchComponent((field) => ({
                    ...field,
                    props: { ...field.props, fontSize: value },
                  }))
                }
              >
                <Select.Option value="small">小</Select.Option>
                <Select.Option value="medium">中</Select.Option>
                <Select.Option value="large">大</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="文本颜色">
              <ColorPicker
                value={activeComponent.props.textColor}
                onChange={(_, hex) =>
                  patchComponent((field) => ({
                    ...field,
                    props: { ...field.props, textColor: hex },
                  }))
                }
              />
            </Form.Item>
          </>
        ) : null}

        {activeComponent.type === "image" ? (
          <>
            <Form.Item label="上传数量限制">
              <InputNumber
                min={1}
                max={10}
                value={activeComponent.props.uploadLimit}
                onChange={(value) =>
                  patchComponent((field) => ({
                    ...field,
                    props: { ...field.props, uploadLimit: value ?? 1 },
                  }))
                }
              />
            </Form.Item>
            <Form.Item label="显示预览" valuePropName="checked">
              <Switch
                checked={activeComponent.props.showPreview}
                onChange={(checked) =>
                  patchComponent((field) => ({
                    ...field,
                    props: { ...field.props, showPreview: checked },
                  }))
                }
              />
            </Form.Item>
          </>
        ) : null}

        {activeComponent.type === "richText" ? (
          <>
            <Form.Item label="编辑器高度">
              <Slider
                min={200}
                max={600}
                value={activeComponent.props.editorHeight}
                onChange={(value) =>
                  patchComponent((field) => ({
                    ...field,
                    props: { ...field.props, editorHeight: value },
                  }))
                }
              />
            </Form.Item>
            <Form.Item label="显示字数统计" valuePropName="checked">
              <Switch
                checked={activeComponent.props.showWordCount}
                onChange={(checked) =>
                  patchComponent((field) => ({
                    ...field,
                    props: { ...field.props, showWordCount: checked },
                  }))
                }
              />
            </Form.Item>
            {activeComponent.props.showWordCount && (
              <Form.Item label="最大字数">
                <InputNumber
                  min={0}
                  value={activeComponent.props.maxWords}
                  onChange={(value) =>
                    patchComponent((field) => ({
                      ...field,
                      props: { ...field.props, maxWords: value ?? undefined },
                    }))
                  }
                />
              </Form.Item>
            )}
          </>
        ) : null}

        {activeComponent.type === "group" ? (
          <>
            <Form.Item label="分组标题">
              <Input
                value={activeComponent.props.groupTitle}
                onChange={(e) =>
                  patchComponent((field) => ({
                    ...field,
                    props: { ...field.props, groupTitle: e.target.value },
                  }))
                }
              />
            </Form.Item>
            <Form.Item label="边框样式">
              <Select
                value={activeComponent.props.borderStyle}
                onChange={(value) =>
                  patchComponent((field) => ({
                    ...field,
                    props: { ...field.props, borderStyle: value },
                  }))
                }
              >
                <Select.Option value="solid">实线</Select.Option>
                <Select.Option value="dashed">虚线</Select.Option>
                <Select.Option value="none">无边框</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="边框颜色">
              <ColorPicker
                value={activeComponent.props.borderColor}
                onChange={(_, hex) =>
                  patchComponent((field) => ({
                    ...field,
                    props: { ...field.props, borderColor: hex },
                  }))
                }
              />
            </Form.Item>
            <Form.Item label="背景颜色">
              <ColorPicker
                value={activeComponent.props.backgroundColor}
                onChange={(_, hex) =>
                  patchComponent((field) => ({
                    ...field,
                    props: { ...field.props, backgroundColor: hex },
                  }))
                }
              />
            </Form.Item>
            <Form.Item label="内边距">
              <InputNumber
                min={0}
                max={50}
                value={activeComponent.props.padding}
                onChange={(value) =>
                  patchComponent((field) => ({
                    ...field,
                    props: { ...field.props, padding: value ?? 16 },
                  }))
                }
              />
            </Form.Item>
          </>
        ) : null}

        {activeComponent.type === "orgTree" ? (
          <>
            <Form.Item label="树级别">
              <Select
                value={activeComponent.props.treeLevel}
                onChange={(value) =>
                  patchComponent((field) => ({
                    ...field,
                    props: { ...field.props, treeLevel: value },
                  }))
                }
              >
                <Select.Option value={2}>2级</Select.Option>
                <Select.Option value={3}>3级</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="默认展开级别">
              <Select
                value={activeComponent.props.defaultExpandLevel}
                onChange={(value) =>
                  patchComponent((field) => ({
                    ...field,
                    props: { ...field.props, defaultExpandLevel: value },
                  }))
                }
              >
                <Select.Option value="all">全部展开</Select.Option>
                <Select.Option value="first">展开第一级</Select.Option>
                <Select.Option value="none">全部收起</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="显示添加按钮" valuePropName="checked">
              <Switch
                checked={activeComponent.props.showAddButton}
                onChange={(checked) =>
                  patchComponent((field) => ({
                    ...field,
                    props: { ...field.props, showAddButton: checked },
                  }))
                }
              />
            </Form.Item>
            <Form.Item label="显示删除按钮" valuePropName="checked">
              <Switch
                checked={activeComponent.props.showDeleteButton}
                onChange={(checked) =>
                  patchComponent((field) => ({
                    ...field,
                    props: { ...field.props, showDeleteButton: checked },
                  }))
                }
              />
            </Form.Item>
          </>
        ) : null}

        {activeComponent.type === "indicatorTable" ? (
          <>
            <Form.Item label="行数">
              <InputNumber
                min={1}
                max={20}
                value={activeComponent.props.tableRows}
                onChange={(value) =>
                  patchComponent((field) => ({
                    ...field,
                    props: { ...field.props, tableRows: value ?? 2 },
                  }))
                }
              />
            </Form.Item>
            <Form.Item label="列数">
              <InputNumber
                min={1}
                max={20}
                value={activeComponent.props.tableCols}
                onChange={(value) =>
                  patchComponent((field) => ({
                    ...field,
                    props: { ...field.props, tableCols: value ?? 3 },
                  }))
                }
              />
            </Form.Item>
            <Form.Item label="允许添加行" valuePropName="checked">
              <Switch
                checked={activeComponent.props.allowAddRow}
                onChange={(checked) =>
                  patchComponent((field) => ({
                    ...field,
                    props: { ...field.props, allowAddRow: checked },
                  }))
                }
              />
            </Form.Item>
          </>
        ) : null}

        {showUpdateFrequency ? (
          <Form.Item label="更新频率">
            <Select
              value={activeComponent.props.updateFrequency}
              onChange={(value) =>
                patchComponent((field) => ({
                  ...field,
                  props: { ...field.props, updateFrequency: value },
                }))
              }
            >
              <Select.Option value="daily">每天更新</Select.Option>
              <Select.Option value="weekly">每周更新</Select.Option>
              <Select.Option value="monthly">每月更新</Select.Option>
              <Select.Option value="quarterly">每季度更新</Select.Option>
              <Select.Option value="irregular">不定期更新</Select.Option>
            </Select>
          </Form.Item>
        ) : null}

      </Form>
    </Card>
  );
};

export default PropertyInspector;
