import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Popup, Toast } from 'antd-mobile';
import { FrownOutline, LikeOutline, MessageFill } from 'antd-mobile-icons';
import type { ChatMessage } from '../mobileMockData';

type ChatAreaProps = {
  messages: ChatMessage[];
  loading: boolean;
};

const renderAssistantContent = (
  text: string,
  sources: NonNullable<ChatMessage['sources']> | undefined,
  onOpenSource: (source: string) => void
) => {
  if (!sources?.length) return text;
  return (
    <>
      {text}
      {sources.map((item, idx) => (
        <span
          key={`${item.text}-${idx}`}
          onClick={() => onOpenSource(item.source)}
          style={{ color: '#1890ff', fontSize: 12, marginLeft: 6, cursor: 'pointer' }}
        >
          [来源]
        </span>
      ))}
    </>
  );
};

const ChatArea: React.FC<ChatAreaProps> = ({ messages, loading }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sourcePopup, setSourcePopup] = useState<{ visible: boolean; content: string }>({
    visible: false,
    content: '',
  });

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [messages, loading]);

  const loadingDots = useMemo(
    () => (
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', minHeight: 18 }}>
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#999',
              display: 'inline-block',
              animation: `ai-dot-bounce 1.2s ${dot * 0.15}s infinite ease-in-out`,
            }}
          />
        ))}
      </div>
    ),
    []
  );

  return (
    <>
      <div
        ref={containerRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px 16px',
          paddingBottom: 120,
        }}
      >
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div key={msg.id} style={{ marginBottom: 14, display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
              {isUser ? (
                <div style={{ maxWidth: '75%' }}>
                  <div style={{ fontSize: 11, color: '#bfbfbf', textAlign: 'right', marginBottom: 4 }}>{msg.time}</div>
                  <div
                    style={{
                      background: '#1890ff',
                      color: '#fff',
                      borderRadius: '16px 16px 4px 16px',
                      padding: '10px 14px',
                      fontSize: 14,
                      lineHeight: 1.6,
                      wordBreak: 'break-word',
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 8, maxWidth: '88%' }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: '#1890ff',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <MessageFill fontSize={16} />
                  </div>
                  <div style={{ maxWidth: '75%' }}>
                    <div style={{ fontSize: 11, color: '#bfbfbf', marginBottom: 4 }}>{msg.time}</div>
                    <div
                      style={{
                        background: '#f5f5f5',
                        color: '#333',
                        borderRadius: '16px 16px 16px 4px',
                        padding: '10px 14px',
                        fontSize: 14,
                        lineHeight: 1.6,
                        wordBreak: 'break-word',
                      }}
                    >
                      {renderAssistantContent(msg.content, msg.sources, (source) => {
                        setSourcePopup({ visible: true, content: source });
                      })}
                    </div>
                    <div
                      style={{
                        marginTop: 6,
                        fontSize: 12,
                        color: '#999',
                        display: 'flex',
                        gap: 12,
                      }}
                    >
                      <span
                        style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(msg.content);
                            Toast.show({ content: '已复制' });
                          } catch {
                            Toast.show({ content: '复制失败' });
                          }
                        }}
                      >
                        复制
                      </span>
                      <span style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <LikeOutline /> 有用
                      </span>
                      <span style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <FrownOutline /> 无用
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ display: 'flex', gap: 8, maxWidth: '88%' }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: '#1890ff',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <MessageFill fontSize={16} />
              </div>
              <div
                style={{
                  background: '#f5f5f5',
                  borderRadius: '16px 16px 16px 4px',
                  padding: '10px 14px',
                }}
              >
                {loadingDots}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <Popup
        visible={sourcePopup.visible}
        onMaskClick={() => setSourcePopup({ visible: false, content: '' })}
        position="bottom"
        bodyStyle={{ borderTopLeftRadius: 12, borderTopRightRadius: 12, minHeight: 120, padding: 16 }}
      >
        <div style={{ fontSize: 14, color: '#333', lineHeight: 1.7 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>数据来源</div>
          <div>{sourcePopup.content}</div>
        </div>
      </Popup>

      <style>{`
        @keyframes ai-dot-bounce {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
          40% { transform: scale(1.15); opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default ChatArea;
