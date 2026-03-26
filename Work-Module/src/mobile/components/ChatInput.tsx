import React from 'react';
import { Button, TextArea, Toast } from 'antd-mobile';
import { SendOutline, SoundOutline } from 'antd-mobile-icons';

type ChatInputProps = {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
};

const ChatInput: React.FC<ChatInputProps> = ({ value, onChange, onSend }) => {
  const canSend = value.trim().length > 0;

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 50,
        background: '#fff',
        borderTop: '1px solid #f0f0f0',
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'flex-end',
        gap: 8,
        zIndex: 99,
      }}
    >
      <Button
        fill="solid"
        onClick={() => {
          Toast.show({ content: '语音输入功能开发中，敬请期待' });
        }}
        style={{
          width: 36,
          height: 36,
          minWidth: 36,
          borderRadius: '50%',
          border: 'none',
          background: '#f5f5f5',
          color: '#999',
          padding: 0,
        }}
      >
        <SoundOutline />
      </Button>

      <div
        style={{
          flex: 1,
          borderRadius: 20,
          background: '#f5f5f5',
          padding: '6px 10px',
        }}
      >
        <TextArea
          value={value}
          placeholder="请输入您的问题..."
          autoSize={{ minRows: 1, maxRows: 4 }}
          onChange={onChange}
          style={{
            '--font-size': '14px',
            '--placeholder-color': '#999',
            background: 'transparent',
          }}
          onEnterPress={(e) => {
            e.preventDefault();
            if (canSend) onSend();
          }}
        />
      </div>

      <Button
        fill="solid"
        disabled={!canSend}
        onClick={onSend}
        style={{
          width: 36,
          height: 36,
          minWidth: 36,
          borderRadius: '50%',
          border: 'none',
          padding: 0,
          background: canSend ? '#1890ff' : '#f5f5f5',
          color: canSend ? '#fff' : '#999',
        }}
      >
        <SendOutline />
      </Button>
    </div>
  );
};

export default ChatInput;
