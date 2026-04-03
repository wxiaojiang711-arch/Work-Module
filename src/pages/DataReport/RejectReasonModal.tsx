import React from "react";
import { Descriptions, Modal } from "antd";

interface RejectReasonModalProps {
  open: boolean;
  onClose: () => void;
  rejectTime?: string | null;
  rejectBy?: string | null;
  rejectReason?: string | null;
}

const RejectReasonModal: React.FC<RejectReasonModalProps> = ({
  open,
  onClose,
  rejectTime,
  rejectBy,
  rejectReason,
}) => {
  return (
    <Modal open={open} width={480} title="退回详情" footer={null} onCancel={onClose}>
      <Descriptions column={1} layout="vertical" size="small">
        <Descriptions.Item label="退回时间">{rejectTime || "-"}</Descriptions.Item>
        <Descriptions.Item label="退回人">{rejectBy || "-"}</Descriptions.Item>
        <Descriptions.Item label="退回原因">{rejectReason || "-"}</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default RejectReasonModal;
