import React, { useMemo } from "react";
import {
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Select,
  TreeSelect,
} from "antd";

import type { OrgNode, OrgStatus, OrgType } from "./orgConstants";
import { orgTypeLabelMap } from "./orgConstants";

export interface OrgFormValues {
  fullName: string;
  title: string;
  code: string;
  type: OrgType;
  parentKey?: string;
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
  treeData: OrgNode[];
  initialValues?: Partial<OrgFormValues>;
  parentFixed?: boolean;
  typeFixed?: boolean;
  onCancel: () => void;
  onSubmit: (values: OrgFormValues) => void;
}

const mapTreeToSelect = (nodes: OrgNode[]): { title: string; value: string; key: string; children?: any[] }[] =>
  nodes.map((node) => ({
    title: node.title,
    value: node.key,
    key: node.key,
    children: mapTreeToSelect(node.children),
  }));

const OrgFormModal: React.FC<OrgFormModalProps> = ({
  open,
  mode,
  currentType,
  treeData,
  initialValues,
  parentFixed,
  typeFixed,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm<OrgFormValues>();

  const typeOptions = useMemo(
    () =>
      (Object.keys(orgTypeLabelMap) as OrgType[]).map((type) => ({
        label: orgTypeLabelMap[type],
        value: type,
      })),
    [],
  );

  const treeSelectData = useMemo(() => mapTreeToSelect(treeData), [treeData]);

  return (
    <Modal
      open={open}
      title={mode === "create" ? "新增组织" : "编辑组织"}
      okText="确定"
      cancelText="取消"
      destroyOnClose
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
          status: "active",
          type: currentType,
          ...initialValues,
        }}
      >
        <Form.Item label="组织全称" name="fullName" rules={[{ required: true, message: "请输入组织全称" }]}>
          <Input placeholder="请输入组织全称" />
        </Form.Item>
        <Form.Item label="组织简称" name="title" rules={[{ required: true, message: "请输入组织简称" }]}>
          <Input placeholder="请输入组织简称" />
        </Form.Item>
        <Form.Item label="组织编码" name="code" rules={[{ required: true, message: "请输入组织编码" }]}>
          <Input placeholder="请输入组织编码" disabled={mode === "edit"} />
        </Form.Item>
        <Form.Item label="组织类型" name="type" rules={[{ required: true, message: "请选择组织类型" }]}>
          <Select options={typeOptions} disabled={typeFixed || mode === "edit"} />
        </Form.Item>
        <Form.Item label="上级组织" name="parentKey">
          <TreeSelect
            treeData={treeSelectData}
            placeholder="请选择上级组织"
            allowClear
            disabled={parentFixed}
            treeDefaultExpandAll
          />
        </Form.Item>
        <Form.Item label="负责人" name="leader">
          <Input placeholder="请输入负责人姓名" />
        </Form.Item>
        <Form.Item label="联系电话" name="phone">
          <Input placeholder="请输入联系电话" />
        </Form.Item>
        <Form.Item label="排序号" name="sort">
          <InputNumber min={1} placeholder="数字越小越靠前" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="状态" name="status">
          <Radio.Group
            options={[
              { label: "启用", value: "active" },
              { label: "停用", value: "inactive" },
            ]}
          />
        </Form.Item>
        <Form.Item label="备注" name="remark">
          <Input.TextArea placeholder="请输入备注信息" maxLength={200} showCount />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default OrgFormModal;
