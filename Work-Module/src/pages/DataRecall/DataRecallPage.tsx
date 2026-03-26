import React, { useMemo, useState } from "react";
import { Drawer, message } from "antd";
import dayjs from "dayjs";

import SessionPanel from "./components/SessionPanel";
import ComparePanel from "./components/ComparePanel";
import ChatInput from "./components/ChatInput";
import { mockGenerateResponse, sessionList as initialSessionList, type RecallSession } from "./recallMockData";

const DataRecallPage: React.FC = () => {
  const [sessions, setSessions] = useState<RecallSession[]>(initialSessionList);
  const [activeSessionId, setActiveSessionId] = useState(initialSessionList[0]?.id || "");
  const [inputValue, setInputValue] = useState("");
  const [settingOpen, setSettingOpen] = useState(false);

  const currentSession = useMemo(
    () => sessions.find((s) => s.id === activeSessionId) || null,
    [activeSessionId, sessions],
  );

  const updateSession = (id: string, updater: (session: RecallSession) => RecallSession) => {
    setSessions((prev) => prev.map((s) => (s.id === id ? updater(s) : s)));
  };

  const handleNewSession = () => {
    const id = `session-${Date.now()}`;
    const item: RecallSession = {
      id,
      title: "新会话",
      createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      relativeTime: "刚刚",
      messages: [],
    };
    setSessions((prev) => [item, ...prev]);
    setActiveSessionId(id);
    setInputValue("");
  };

  const handleDeleteSession = (id: string) => {
    const left = sessions.filter((s) => s.id !== id);
    setSessions(left);
    if (activeSessionId === id) {
      setActiveSessionId(left[0]?.id || "");
    }
  };

  const handleSend = () => {
    const question = inputValue.trim();
    if (!question || !currentSession) return;

    const now = dayjs().format("YYYY-MM-DD HH:mm:ss");
    const pairId = `pair-${Date.now()}`;

    updateSession(currentSession.id, (session) => ({
      ...session,
      title: session.messages.length === 0 ? question.slice(0, 20) : session.title,
      relativeTime: "刚刚",
      messages: [
        ...session.messages,
        {
          id: pairId,
          role: "pair",
          question,
          beforeTreatment: "",
          afterTreatment: "",
          afterSource: "",
          time: now,
          answerTime: "",
          loading: true,
        },
      ],
    }));

    setInputValue("");

    window.setTimeout(() => {
      const result = mockGenerateResponse(question);
      updateSession(currentSession.id, (session) => ({
        ...session,
        messages: session.messages.map((msg) =>
          msg.id === pairId
            ? {
                ...msg,
                beforeTreatment: result.beforeTreatment,
                afterTreatment: result.afterTreatment,
                afterSource: result.afterSource,
                answerTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                loading: false,
              }
            : msg,
        ),
      }));
    }, 1000);
  };

  return (
    <div style={{ display: "flex", height: "calc(100vh - 56px)", background: "#f5f5f5", overflow: "hidden" }}>
      <SessionPanel
        sessions={sessions}
        activeId={activeSessionId}
        onNew={handleNewSession}
        onClearAll={() => {
          setSessions([]);
          setActiveSessionId("");
          setInputValue("");
          message.success("会话已清空");
        }}
        onSelect={setActiveSessionId}
        onDelete={handleDeleteSession}
      />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          height: "100%",
          overflow: "hidden",
          background: "#fff",
        }}
      >
        <ComparePanel currentSession={currentSession} onOpenSetting={() => setSettingOpen(true)} />
        <ChatInput value={inputValue} onChange={setInputValue} onSend={handleSend} />
      </div>

      <Drawer
        title="召回设置"
        placement="right"
        width={360}
        open={settingOpen}
        onClose={() => setSettingOpen(false)}
      >
        设置面板预留，可在此扩展召回参数、模型版本、检索范围等配置。
      </Drawer>
    </div>
  );
};

export default DataRecallPage;
