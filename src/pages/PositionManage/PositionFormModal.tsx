import React, { useEffect } from "react";
import { Button, Form, Input, Modal, Radio, Select, Space, Tag, Typography } from "antd";

export type PositionFormValues = {
  name: string;
  description?: string;
  roles: string[];
  status: "enabled" | "disabled";
};

type PositionFormModalProps = {
  open: boolean;
  mode: "create" | "edit";
  roleOptions: string[];
  existingNames: string[];
  editingName: string;
  initialValues?: PositionFormValues;
  onCancel: () => void;
  onSubmit: (values: PositionFormValues) => void;
};

const PositionFormModal: React.FC<PositionFormModalProps> = ({
  open,
  mode,
  roleOptions,
  existingNames,
  editingName,
  initialValues,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm<PositionFormValues>();
  const selectedRoles = Form.useWatch("roles", form) ?? [];

  useEffect(() => {
    if (open) {
      form.setFieldsValue(
        initialValues ?? {
          name: "",
          description: "",
          roles: [],
          status: "enabled",
        },
      );
    }
  }, [form, initialValues, open]);

  return (
    <Modal
      open={open}
      title={mode === "create" ? "新增职务" : "编辑职务"}
      onCancel={onCancel}
      width={600}
      footer={null}
      destroyOnClose
      bodyStyle={{ maxHeight: "80vh", overflow: "auto", paddingInline: 24 }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => onSubmit(values)}
        requiredMark={false}
        style={{ paddingBottom: 8 }}
      >
        <Form.Item
          label={
            <span>
              <span style={{ color: "#f5222d", marginRight: 4 }}>*</span>
              职务名称
            </span>
          }
          name="name"
          rules={[
            { required: true, message: "请输入职务名称" },
            { min: 2, max: 50, message: "职务名称长度需为2-50字符" },
            {
              validator: async (_rule, value) => {
                if (!value) return;
                const existed =
                  existingNames.includes(value) && value !== editingName;
                if (existed) {
                  throw new Error("职务名称已存在");
                }
              },
            },
          ]}
        >
          <Input placeholder="请输入职务名称" style={{ height: 40 }} />
        </Form.Item>

        <Form.Item
          label="职务描述"
          name="description"
          rules={[
            { max: 500, message: "最多输入500字符" },
          ]}
        >
          <Input.TextArea
            placeholder="请输入职务描述"
            autoSize={{ minRows: 4, maxRows: 8 }}
            showCount
            maxLength={500}
            style={{ resize: "vertical" }}
          />
        </Form.Item>

        <Form.Item
          label={
            <span>
              <span style={{ color: "#f5222d", marginRight: 4 }}>*</span>
              分配角色
            </span>
          }
          name="roles"
          rules={[{ required: true, message: "请至少选择一个角色" }]}
        >
          <Select
            mode="multiple"
            allowClear
            showSearch
            placeholder="请选择角色"
            options={roleOptions.map((name) => ({ label: name, value: name }))}
            style={{ width: "100%" }}
          />
        </Form.Item>

        {selectedRoles.length > 0 && (
          <div style={{ marginTop: -8, marginBottom: 12 }}>
            <Space size={[8, 8]} wrap>
              {selectedRoles.map((role) => (
                <Tag
                  key={role}
                  closable
                  onClose={(e) => {
                    e.preventDefault();
                    form.setFieldValue(
                      "roles",
                      selectedRoles.filter((item: string) => item !== role),
                    );
                  }}
                  style={{
                    background: "#e6f0ff",
                    color: "#2b5cd6",
                    border: "none",
                    borderRadius: 4,
                    padding: "2px 10px",
                    height: 28,
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  {role}
                </Tag>
              ))}
            </Space>
          </div>
        )}

        <Form.Item
          label={
            <span>
              <span style={{ color: "#f5222d", marginRight: 4 }}>*</span>
              状态
            </span>
          }
          name="status"
          rules={[{ required: true, message: "请选择状态" }]}
        >
          <Radio.Group>
            <Radio value="enabled" style={{ marginRight: 24 }}>
              启用
            </Radio>
            <Radio value="disabled">禁用</Radio>
          </Radio.Group>
        </Form.Item>

        <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 8 }}>
          <Space>
            <Button
              onClick={onCancel}
              style={{
                width: 100,
                height: 40,
                color: "#666",
                borderColor: "#d9d9d9",
              }}
            >
              取消
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                width: 100,
                height: 40,
                background: "#2b5cd6",
              }}
            >
              保存
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
};

export default PositionFormModal;
