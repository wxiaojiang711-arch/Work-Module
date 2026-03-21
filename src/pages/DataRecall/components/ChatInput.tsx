import React from "react";
import { Button, Input } from "antd";
import { SendOutlined } from "@ant-design/icons";

type ChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
};

const ChatInput: React.FC<ChatInputProps> = ({ value, onChange, onSend }) => {
  const disabled = !value.trim();

  return (
    <div
      style={{
        padding: "16px 20px",
        borderTop: "1px solid #f0f0f0",
        background: "#fff",
        display: "flex",
        alignItems: "flex-end",
        gap: 12,
      }}
    >
      <Input.TextArea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="请输入测试问题...（Enter 发送，Shift+Enter 换行）"
        autoSize={{ minRows: 2, maxRows: 6 }}
        style={{ flex: 1, borderRadius: 8, padding: "10px 14px", fontSize: 14, resize: "none" }}
        onPressEnter={(e) => {
          if (e.shiftKey) {
            return;
          }
          e.preventDefault();
          if (!disabled) {
            onSend();
          }
        }}
      />
      <Button
        type="primary"
        icon={<SendOutlined />}
        style={{ borderRadius: 20, height: 42, paddingLeft: 20, paddingRight: 20 }}
        disabled={disabled}
        onClick={onSend}
      >
        发送
      </Button>
    </div>
  );
};

export default ChatInput;
