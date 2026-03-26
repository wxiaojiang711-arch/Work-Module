import React from 'react';
import { Button, Dialog, Popup, SwipeAction } from 'antd-mobile';
import { DeleteOutline } from 'antd-mobile-icons';
import type { ChatSession } from '../mobileMockData';

type SessionDrawerProps = {
  visible: boolean;
  sessions: ChatSession[];
  activeSessionId: string | null;
  onClose: () => void;
  onCreateSession: () => void;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  onClearAllSessions: () => void;
};

const SessionDrawer: React.FC<SessionDrawerProps> = ({
  visible,
  sessions,
  activeSessionId,
  onClose,
  onCreateSession,
  onSelectSession,
  onDeleteSession,
  onClearAllSessions,
}) => {
  const handleDelete = async (id: string) => {
    const confirmed = await Dialog.confirm({
      content: '确认删除该会话？删除后不可恢复。',
      confirmText: '删除',
      cancelText: '取消',
    });
    if (confirmed) {
      onDeleteSession(id);
    }
  };

  const handleClearAll = async () => {
    const confirmed = await Dialog.confirm({
      content: '确认清空全部会话？此操作不可恢复。',
      confirmText: '清空',
      cancelText: '取消',
    });
    if (confirmed) {
      onClearAllSessions();
      onClose();
    }
  };

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      position="left"
      bodyStyle={{ width: '75vw', height: '100vh', padding: 16, background: '#fff' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Button
          color="primary"
          block
          style={{ borderRadius: 8, marginBottom: 12 }}
          onClick={() => {
            onCreateSession();
            onClose();
          }}
        >
          新建对话
        </Button>

        <div style={{ flex: 1, overflowY: 'auto', paddingRight: 2 }}>
          {sessions.map((session) => {
            const selected = session.id === activeSessionId;
            return (
              <div key={session.id} style={{ marginBottom: 8 }}>
                <SwipeAction
                  rightActions={[
                    {
                      key: 'delete',
                      color: 'danger',
                      text: <DeleteOutline />,
                      onClick: () => handleDelete(session.id),
                    },
                  ]}
                >
                  <div
                    onClick={() => {
                      onSelectSession(session.id);
                      onClose();
                    }}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 8,
                      background: selected ? '#e6f7ff' : '#fff',
                      borderLeft: selected ? '3px solid #1890ff' : '3px solid transparent',
                      cursor: 'pointer',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 14,
                        color: '#333',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {session.title}
                    </div>
                    <div style={{ marginTop: 4, fontSize: 12, color: '#999' }}>{session.relativeTime}</div>
                  </div>
                </SwipeAction>
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 12,
            textAlign: 'center',
            color: '#ff4d4f',
            fontSize: 13,
            cursor: 'pointer',
          }}
          onClick={handleClearAll}
        >
          清空全部会话
        </div>
      </div>
    </Popup>
  );
};

export default SessionDrawer;
