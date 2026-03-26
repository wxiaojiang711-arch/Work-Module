import React from "react";
import { Form, Input, Modal } from "antd";

interface ChangePasswordModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ open, onCancel, onSubmit }) => {
  const [form] = Form.useForm();

  return (
    <Modal
      open={open}
      width={420}
      title="修改密码"
      okText="确认修改"
      cancelText="取消"
      destroyOnClose
      onCancel={onCancel}
      onOk={() => {
        form.validateFields().then(() => {
          onSubmit();
          form.resetFields();
        });
      }}
    >
      <Form form={form} layout="vertical" initialValues={{ newPassword: "", confirmPassword: "" }}>
        <Form.Item
          label="原密码"
          name="oldPassword"
          rules={[{ required: true, message: "请输入原密码" }]}
        >
          <Input.Password placeholder="请输入原密码" />
        </Form.Item>
        <Form.Item
          label="新密码"
          name="newPassword"
          rules={[
            { required: true, message: "请输入新密码" },
            {
              pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\W_]{8,}$/,
              message: "新密码至少8位，且包含字母和数字",
            },
          ]}
        >
          <Input.Password placeholder="请输入新密码（至少8位，包含字母和数字）" />
        </Form.Item>
        <Form.Item
          label="确认新密码"
          name="confirmPassword"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "请再次输入新密码" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("两次输入的密码不一致"));
              },
            }),
          ]}
        >
          <Input.Password placeholder="请再次输入新密码" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChangePasswordModal;
