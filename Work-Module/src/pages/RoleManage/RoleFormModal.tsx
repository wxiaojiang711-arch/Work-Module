import React from 'react';
import { Form, Input, Modal, Typography } from 'antd';

import type { RoleItem } from './roleMockData';

type Props = {
  open: boolean;
  mode: 'create' | 'edit';
  role: RoleItem | null;
  onCancel: () => void;
  onSubmit: (payload: Pick<RoleItem, 'name' | 'code' | 'description' | 'type' | 'color' | 'userCount' | 'permissionModules' | 'permissions'>) => void;
};

const codeRule = /^[a-zA-Z0-9_]+$/;

const RoleFormModal: React.FC<Props> = ({ open, mode, role, onCancel, onSubmit }) => {
  const [form] = Form.useForm();
  const isEdit = mode === 'edit';

  return (
    <Modal
      title={isEdit ? '编辑角色' : '新建角色'}
      open={open}
      width={480}
      destroyOnClose
      onCancel={onCancel}
      onOk={async () => {
        const values = await form.validateFields();
        onSubmit({
          name: values.name,
          code: values.code,
          description: values.description || '',
          type: role?.type ?? 'custom',
          color: role?.color ?? '#722ed1',
          userCount: role?.userCount ?? 0,
          permissionModules: role?.permissionModules ?? [],
          permissions: role?.permissions ?? [],
        });
      }}
      okText='确认'
      cancelText='取消'
    >
      <Form
        form={form}
        layout='vertical'
        initialValues={{
          name: role?.name,
          code: role?.code,
          description: role?.description,
        }}
      >
        <Form.Item label='角色名称' name='name' rules={[{ required: true, message: '请输入角色名称' }]}>
          <Input placeholder='请输入角色名称' maxLength={20} />
        </Form.Item>

        <Form.Item
          label='角色编码'
          name='code'
          rules={[
            { required: true, message: '请输入角色编码' },
            {
              validator: (_, val) => {
                if (!val || codeRule.test(val)) return Promise.resolve();
                return Promise.reject(new Error('仅允许英文字母、数字和下划线'));
              },
            },
          ]}
        >
          <Input disabled={isEdit} placeholder='请输入角色编码，如 data_officer' maxLength={30} />
        </Form.Item>

        <Form.Item label='角色描述' name='description'>
          <Input.TextArea placeholder='请输入角色描述' maxLength={200} autoSize={{ minRows: 2, maxRows: 4 }} />
        </Form.Item>

        <Typography.Text type='secondary'>
          角色类型：{role?.type === 'preset' ? '系统预置' : '自定义'}
        </Typography.Text>
      </Form>
    </Modal>
  );
};

export default RoleFormModal;
