import React from "react";
import { Modal, Typography } from "antd";

import type { UserItem } from "./userData";

export interface UserFormValues {
  name: string;
  account: string;
  phone: string;
  password?: string;
  orgId: string;
  role?: string;
  email?: string;
  status?: "active" | "disabled";
  remark?: string;
}

interface UserFormModalProps {
  open: boolean;
  mode: "create" | "edit";
  record?: UserItem | null;
  onCancel: () => void;
  onSubmit: (values: UserFormValues) => void;
}

const UserFormModal: React.FC<UserFormModalProps> = ({ open, mode, onCancel }) => {
  return (
    <Modal open={open} title={mode === "create" ? "新增用户" : "编辑用户"} onCancel={onCancel} footer={null}>
      <Typography.Text type="secondary">该组件已由 UserFormDrawer 替代。</Typography.Text>
    </Modal>
  );
};

export default UserFormModal;
