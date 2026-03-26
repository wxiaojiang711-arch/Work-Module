import React, { useEffect, useMemo, useState } from 'react';
import { Dialog, Toast } from 'antd-mobile';
import { SearchOutline, UnorderedListOutline } from 'antd-mobile-icons';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

import ChatArea from '../components/ChatArea';
import ChatInput from '../components/ChatInput';
import SessionDrawer from '../components/SessionDrawer';
import {
  currentUser,
  defaultRecentSearches,
  getMockAssistantReply,
  hotQuestions,
  sessionList,
  type ChatMessage,
  type ChatSession,
} from '../mobileMockData';

const RECENT_SEARCH_KEY = 'mobile_ai_recent_searches';

const getGreeting = (name: string) => {
  const hour = dayjs().hour();
  if (hour >= 6 && hour < 12) return `早上好，${name}`;
  if (hour >= 12 && hour < 18) return `下午好，${name} ☀️`;
  if (hour >= 18 && hour < 24) return `晚上好，${name}`;
  return `夜深了，${name}`;
};

const buildSessionTitle = (input: string) => (input.length > 16 ? `${input.slice(0, 16)}...` : input);

const AIHomePage: React.FC = () => {
  const navigate = useNavigate();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>(sessionList);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(sessionList[0]?.id ?? null);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(defaultRecentSearches);

  useEffect(() => {
    const cached = localStorage.getItem(RECENT_SEARCH_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as string[];
        if (Array.isArray(parsed)) {
          setRecentSearches(parsed.slice(0, 3));
        }
      } catch {
        localStorage.removeItem(RECENT_SEARCH_KEY);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(recentSearches.slice(0, 3)));
  }, [recentSearches]);

  const activeSession = useMemo(
    () => sessions.find((item) => item.id === activeSessionId) ?? null,
    [sessions, activeSessionId]
  );

  const inNewSessionState = !activeSession || activeSession.messages.length === 0;

  const createSession = () => {
    const id = `session-${Date.now()}`;
    const session: ChatSession = {
      id,
      title: '新对话',
      createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      relativeTime: '刚刚',
      messages: [],
    };
    setSessions((prev) => [session, ...prev]);
    setActiveSessionId(id);
    setInputValue('');
  };

  const syncSessionMessages = (sessionId: string, updater: (messages: ChatMessage[]) => ChatMessage[]) => {
    setSessions((prev) =>
      prev.map((session) => {
        if (session.id !== sessionId) return session;
        const newMessages = updater(session.messages);
        const userMsg = newMessages.find((m) => m.role === 'user');
        return {
          ...session,
          messages: newMessages,
          title: userMsg ? buildSessionTitle(userMsg.content) : session.title,
          relativeTime: '刚刚',
        };
      })
    );
  };

  const updateRecentSearch = (question: string) => {
    setRecentSearches((prev) => [question, ...prev.filter((item) => item !== question)].slice(0, 3));
  };

  const sendQuestion = (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || loading) return;

    let targetId = activeSessionId;
    if (!targetId) {
      targetId = `session-${Date.now()}`;
      const newSession: ChatSession = {
        id: targetId,
        title: buildSessionTitle(trimmed),
        createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        relativeTime: '刚刚',
        messages: [],
      };
      setSessions((prev) => [newSession, ...prev]);
      setActiveSessionId(targetId);
    }

    const now = dayjs().format('HH:mm');
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      time: now,
    };

    syncSessionMessages(targetId, (messages) => [...messages, userMessage]);
    updateRecentSearch(trimmed);
    setInputValue('');
    setLoading(true);

    window.setTimeout(() => {
      const reply = getMockAssistantReply(trimmed);
      const aiMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: reply.content,
        sources: reply.sources,
        time: dayjs().format('HH:mm'),
      };
      syncSessionMessages(targetId!, (messages) => [...messages, aiMessage]);
      setLoading(false);
    }, 1200);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f5f5f5',
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: 50,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      }}
    >
      <SessionDrawer
        visible={drawerVisible}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onClose={() => setDrawerVisible(false)}
        onCreateSession={createSession}
        onSelectSession={setActiveSessionId}
        onDeleteSession={(id) => {
          setSessions((prev) => prev.filter((item) => item.id !== id));
          if (activeSessionId === id) {
            const remaining = sessions.filter((item) => item.id !== id);
            setActiveSessionId(remaining[0]?.id ?? null);
          }
        }}
        onClearAllSessions={() => {
          setSessions([]);
          setActiveSessionId(null);
        }}
      />

      <div
        style={{
          height: 44,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          background: '#fff',
          borderBottom: '1px solid #f0f0f0',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <span style={{ display: 'inline-flex', cursor: 'pointer' }} onClick={() => setDrawerVisible(true)}>
          <UnorderedListOutline fontSize={20} />
        </span>
        <span style={{ fontSize: 16, fontWeight: 600 }}>AI问数</span>
        <span style={{ width: 20 }} />
      </div>

      {inNewSessionState ? (
        <>
          <div style={{ padding: '24px 16px 8px' }}>
            <div style={{ fontSize: 22, fontWeight: 600, color: '#333' }}>{getGreeting(currentUser.name)}</div>
            <div style={{ marginTop: 8, fontSize: 14, color: '#999' }}>我是AI助手，有什么可以帮您？</div>
          </div>

          <div style={{ padding: '0 16px 120px' }}>
            <div style={{ fontSize: 13, color: '#999', marginBottom: 8 }}>热门问题</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {hotQuestions.map((item) => (
                <div
                  key={item}
                  onClick={() => sendQuestion(item)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 16,
                    background: '#f5f5f5',
                    color: '#333',
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  {item}
                </div>
              ))}
            </div>

            {recentSearches.length > 0 ? (
              <div style={{ marginTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: '#999' }}>最近搜索</span>
                  <span
                    style={{ fontSize: 12, color: '#999', cursor: 'pointer' }}
                    onClick={async () => {
                      const ok = await Dialog.confirm({
                        content: '确认清空最近搜索记录？',
                        confirmText: '清空',
                        cancelText: '取消',
                      });
                      if (ok) setRecentSearches([]);
                    }}
                  >
                    清空
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {recentSearches.map((item) => (
                    <div
                      key={item}
                      style={{
                        padding: '8px 10px 8px 12px',
                        borderRadius: 16,
                        background: '#f5f5f5',
                        color: '#333',
                        fontSize: 13,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                      onClick={() => sendQuestion(item)}
                    >
                      <span>{item}</span>
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          setRecentSearches((prev) => prev.filter((s) => s !== item));
                          Toast.show({ content: '已删除' });
                        }}
                        style={{ fontSize: 12, color: '#999' }}
                      >
                        ×
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </>
      ) : (
        <ChatArea messages={activeSession?.messages ?? []} loading={loading} />
      )}

      <div
        onClick={() => navigate('/m/search')}
        style={{
          position: 'fixed',
          right: 16,
          bottom: 120,
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: '#1890ff',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 22,
          boxShadow: '0 4px 12px rgba(24,144,255,0.4)',
          cursor: 'pointer',
          animation: 'pulse 2s infinite',
          zIndex: 98,
        }}
      >
        <SearchOutline />
      </div>

      <ChatInput value={inputValue} onChange={setInputValue} onSend={() => sendQuestion(inputValue)} />

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default AIHomePage;
