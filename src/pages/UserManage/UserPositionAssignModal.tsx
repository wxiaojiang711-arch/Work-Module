import React, { useMemo } from "react";
import { Button, Form, Modal, Radio, Select, Space, Typography, message } from "antd";

import styles from "./UserPositionAssignModal.module.css";
import type { PositionOption, UserPositionAssignment } from "./userData";

type AssignFormValues = {
  positionId?: string;
  orgId?: string;
  isPrimary?: boolean;
};

type UserPositionAssignModalProps = {
  open: boolean;
  userName: string;
  orgName: string;
  orgId: string;
  positions: UserPositionAssignment[];
  positionOptions: PositionOption[];
  orgOptions: Array<{ label: string; value: string }>;
  onCancel: () => void;
  onSave: (positions: UserPositionAssignment[]) => void;
};

const UserPositionAssignModal: React.FC<UserPositionAssignModalProps> = ({
  open,
  userName,
  orgName,
  orgId,
  positions,
  positionOptions,
  orgOptions,
  onCancel,
  onSave,
}) => {
  const [form] = Form.useForm<AssignFormValues>();

  const enabledPositionOptions = useMemo(
    () =>
      positionOptions
        .filter((item) => item.status === "enabled")
        .map((item) => ({ label: `${item.name} - ${item.code}`, value: item.id })),
    [positionOptions],
  );

  const positionMap = useMemo(() => {
    const map = new Map<string, PositionOption>();
    positionOptions.forEach((item) => map.set(item.id, item));
    return map;
  }, [positionOptions]);

  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      const existed = positions.some((item) => item.id === values.positionId);
      if (existed) {
        message.error("该职务已分配");
        return;
      }

      const position = positionMap.get(values.positionId ?? "");
      if (!position) return;

      const isFirst = positions.length === 0;
      const nextPrimary = Boolean(values.isPrimary) || isFirst;

      const nextItem: UserPositionAssignment = {
        id: position.id,
        name: position.name,
        code: position.code,
        orgId: values.orgId ?? orgId,
        orgName: orgOptions.find((opt) => opt.value === (values.orgId ?? orgId))?.label ?? orgName,
        isPrimary: nextPrimary,
        validRange: undefined,
      };

      let next = [...positions, nextItem];
      if (nextPrimary) {
        next = next.map((item) => (item.id === nextItem.id ? item : { ...item, isPrimary: false }));
      }

      onSave(next);
      form.resetFields();
      form.setFieldValue("orgId", orgId);
      form.setFieldValue("isPrimary", false);
    } catch (error) {
      // handled by form
    }
  };

  const handleRemove = (id: string) => {
    let next = positions.filter((item) => item.id !== id);
    if (next.length && !next.some((item) => item.isPrimary)) {
      next = next.map((item, index) => (index === 0 ? { ...item, isPrimary: true } : item));
    }
    onSave(next);
  };

  const handleModalSave = () => {
    if (!positions.length) {
      message.error("请至少添加一个职务");
      return;
    }
    if (!positions.some((item) => item.isPrimary)) {
      message.error("请设置一个主职务");
      return;
    }
    message.success("职务分配已更新");
    onCancel();
  };

  return (
    <Modal
      open={open}
      title={`分配职务 - ${userName}`}
      onCancel={onCancel}
      width={700}
      footer={null}
      destroyOnClose
      bodyStyle={{ maxHeight: "80vh", overflow: "auto", paddingInline: 24 }}
    >
      <div style={{ marginTop: 12 }}>
        <div className={styles.sectionTitle}>当前职务列表</div>
        {positions.length === 0 ? (
          <Typography.Text style={{ fontSize: 13, color: "#999" }}>暂无分配职务</Typography.Text>
        ) : (
          <Space direction="vertical" size={8} style={{ width: "100%" }}>
            {positions.map((item) => (
              <div key={item.id} className={styles.positionCard}>
                <div className={styles.cardMeta}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#333" }}>{item.name}</span>
                    {item.isPrimary ? <span className={styles.primaryTag}>主职务</span> : null}
                  </div>
                  <div style={{ fontSize: 13, color: "#999" }}>
                    {item.orgName}
                    {item.validRange ? ` · ${item.validRange[0]} 至 ${item.validRange[1]}` : " · 长期有效"}
                  </div>
                </div>
                <button type="button" className={styles.deleteBtn} onClick={() => handleRemove(item.id)}>
                  ×
                </button>
              </div>
            ))}
          </Space>
        )}
      </div>

      <div style={{ marginTop: 24 }}>
        <div className={styles.sectionTitle}>添加职务</div>
        <Form
          form={form}
          layout="vertical"
          initialValues={{ orgId, isPrimary: false }}
          style={{ marginTop: 12 }}
        >
          <Form.Item
            name="positionId"
            label="选择职务"
            rules={[
              { required: true, message: "请选择职务" },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  return positions.some((item) => item.id === value)
                    ? Promise.reject(new Error("该职务已分配"))
                    : Promise.resolve();
                },
              },
            ]}
          >
            <Select
              showSearch
              placeholder="请选择职务"
              options={enabledPositionOptions}
              style={{ width: "100%", height: 40 }}
            />
          </Form.Item>

          <Form.Item
            name="orgId"
            label="职务所在单位"
            rules={[{ required: true, message: "请选择单位" }]}
          >
            <Select
              showSearch
              placeholder="请选择单位"
              options={orgOptions}
              style={{ width: "100%", height: 40 }}
            />
          </Form.Item>

          <div style={{ marginTop: 12 }}>
            <Form.Item name="isPrimary" label="是否为主职务">
              <Radio.Group>
                <Radio value={true} style={{ marginRight: 24 }}>
                  是
                </Radio>
                <Radio value={false}>否</Radio>
              </Radio.Group>
            </Form.Item>
            <Typography.Text style={{ color: "#999", fontSize: 13, display: "block", marginTop: -16 }}>
              用户可以拥有多个职务，但只能有一个主职务。主职务用于确定用户的默认权限范围。
            </Typography.Text>
          </div>

          <div style={{ marginTop: 16 }}>
            <Button type="primary" onClick={handleAdd} style={{ width: 120, height: 40, background: "#2b5cd6" }}>
              + 添加职务
            </Button>
          </div>
        </Form>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 24 }}>
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
            onClick={handleModalSave}
            style={{ width: 100, height: 40, background: "#2b5cd6" }}
          >
            保存
          </Button>
        </Space>
      </div>
    </Modal>
  );
};

export default UserPositionAssignModal;
