import React from "react";
import { Form, Input, InputNumber, Modal, Radio, Select } from "antd";

import type { OrgStatus, OrgType, OrganizationItem } from "./orgData";
import { orgTypeLabelMap } from "./orgData";

export interface OrgFormValues {
  fullName: string;
  shortName: string;
  code: string;
  type: OrgType;
  leader?: string;
  phone?: string;
  sort?: number;
  status: OrgStatus;
  remark?: string;
}

interface OrgFormModalProps {
  open: boolean;
  mode: "create" | "edit";
  currentType: OrgType;
  record?: OrganizationItem | null;
  onCancel: () => void;
  onSubmit: (values: OrgFormValues) => void;
}

const OrgFormModal: React.FC<OrgFormModalProps> = ({
  open,
  mode,
  currentType,
  record,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm<OrgFormValues>();

  return (
    <Modal
      open={open}
      width={560}
      destroyOnClose
      title={mode === "create" ? "新增组织" : "编辑组织"}
      okText="确定"
      cancelText="取消"
      onCancel={onCancel}
      onOk={() => {
        form.validateFields().then((values) => onSubmit(values));
      }}
    >
      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        initialValues={{
          fullName: record?.fullName,
          shortName: record?.shortName,
          code: record?.code,
          type: record?.type ?? currentType,
          leader: record?.leader,
          phone: record?.phone,
          sort: record?.sort,
          status: record?.status ?? "active",
          remark: record?.remark,
        }}
      >
        <Form.Item name="fullName" label="组织全称" rules={[{ required: true, message: "请输入组织全称" }]}>
          <Input placeholder="请输入组织全称" />
        </Form.Item>
        <Form.Item name="shortName" label="组织简称" rules={[{ required: true, message: "请输入组织简称" }]}>
          <Input placeholder="请输入组织简称" />
        </Form.Item>
        <Form.Item name="code" label="组织编码" rules={[{ required: true, message: "请输入组织编码" }]}>
          <Input placeholder="请输入组织编码" disabled={mode === "edit"} />
        </Form.Item>
        <Form.Item name="type" label="组织类型" rules={[{ required: true, message: "请选择组织类型" }]}>
          <Select
            disabled
            options={(Object.keys(orgTypeLabelMap) as OrgType[]).map((key) => ({
              label: orgTypeLabelMap[key],
              value: key,
            }))}
          />
        </Form.Item>
        <Form.Item name="leader" label="负责人">
          <Input placeholder="请输入负责人姓名" />
        </Form.Item>
        <Form.Item name="phone" label="联系电话">
          <Input placeholder="请输入联系电话" />
        </Form.Item>
        <Form.Item name="sort" label="排序号">
          <InputNumber min={1} style={{ width: "100%" }} placeholder="数字越小越靠前" />
        </Form.Item>
        <Form.Item name="status" label="状态">
          <Radio.Group
            options={[
              { label: "启用", value: "active" },
              { label: "停用", value: "stopped" },
            ]}
          />
        </Form.Item>
        <Form.Item name="remark" label="备注">
          <Input.TextArea maxLength={200} showCount />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default OrgFormModal;
