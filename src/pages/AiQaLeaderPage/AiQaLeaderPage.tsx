import React, { useCallback, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { message } from "antd";

import QuestionInput from "./components/QuestionInput";
import HistorySidebar from "./components/HistorySidebar";
import AnswerDisplay from "./components/AnswerDisplay";
import EvidenceDrawer from "./components/EvidenceDrawer";
import TaskModal from "./components/TaskModal";
import type { QaAnswer, QaSession, ReportTaskPayload, TimeRange } from "./types";
import { askQuestion, createReportTask, getHistorySessions, getSessionDetail } from "./mock";
import styles from "./AiQaLeaderPage.module.css";

const AiQaLeaderPage: React.FC = () => {
  const [sessions, setSessions] = useState<QaSession[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<QaAnswer | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [evidenceVisible, setEvidenceVisible] = useState(false);
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [taskModalInitialValues, setTaskModalInitialValues] = useState<Partial<ReportTaskPayload>>();

  useEffect(() => {
    void loadSessions();
  }, []);

  const loadSessions = async () => {
    setSessionsLoading(true);
    try {
      const data = await getHistorySessions();
      setSessions(data);
    } catch {
      message.error("加载历史会话失败");
    } finally {
      setSessionsLoading(false);
    }
  };

  const handleAsk = useCallback(async (question: string, timeRange: TimeRange, customRange?: [string, string]) => {
    setLoading(true);
    try {
      const answer = await askQuestion(question, timeRange, customRange);
      setCurrentAnswer(answer);
      setCurrentSessionId(undefined);
    } catch {
      message.error("提问失败，请重试");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSelectSession = useCallback(async (sessionId: string) => {
    setLoading(true);
    setCurrentSessionId(sessionId);
    try {
      const answer = await getSessionDetail(sessionId);
      setCurrentAnswer(answer);
    } catch {
      message.error("加载会话失败");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleGenerateReport = useCallback(() => {
    if (!currentAnswer) return;

    const content = `
领导简报
========================================
问题：${currentAnswer.question}
时间：${dayjs(currentAnswer.createdAt).format("YYYY-MM-DD HH:mm:ss")}

一、结论摘要
----------------------------------------
${currentAnswer.summary.map((s, i) => `${i + 1}. ${s}`).join("\n")}

二、关键指标
----------------------------------------
${currentAnswer.kpis
  .map((k) => `${k.label}：${k.value}${k.unit}（${k.trend === "up" ? "↑" : k.trend === "down" ? "↓" : "→"}${Math.abs(k.delta)}${k.unit}）`)
  .join("\n")}

三、风险提示
----------------------------------------
${currentAnswer.risks
  .map(
    (r, i) => `${i + 1}. ${r.title}（${r.level === "red" ? "红灯" : "黄灯"}）\n   影响范围：${r.impact}\n   可能原因：${r.reason}\n   建议动作：${r.suggestion}`,
  )
  .join("\n\n")}

四、处置建议
----------------------------------------
${currentAnswer.actions.map((a, i) => `${i + 1}. ${a.text}`).join("\n")}
    `.trim();

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const date = dayjs().format("YYYY-MM-DD");
    a.download = `领导简报-${currentAnswer.question.substring(0, 20)}-${date}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    message.success("简报已生成并下载");
  }, [currentAnswer]);

  const handleGenerateTask = useCallback(
    (riskId?: string) => {
      if (!currentAnswer) return;

      let initialValues: Partial<ReportTaskPayload> = {
        attachedSummary: currentAnswer.summary.join("\n"),
        attachedEvidenceIds: [...currentAnswer.evidence.definitions.map((d) => d.id), ...currentAnswer.evidence.rules.map((r) => r.id)],
        relatedTopics: ["topic-population"],
      };

      if (riskId) {
        const risk = currentAnswer.risks.find((r) => r.id === riskId);
        if (risk) {
          initialValues = {
            ...initialValues,
            taskName: `【数据质量核查】${risk.title}`,
            linkedRiskId: riskId,
            template: "quality",
          };
        }
      } else {
        initialValues = {
          ...initialValues,
          taskName: `【数据质量核查】${currentAnswer.question}`,
          template: "quality",
        };
      }

      setTaskModalInitialValues(initialValues);
      setTaskModalVisible(true);
    },
    [currentAnswer],
  );

  const handleSubmitTask = useCallback(
    async (payload: ReportTaskPayload) => {
      try {
        const result = await createReportTask(payload);
        if (result.success) {
          message.success(`数据上报任务已生成，任务编号：${result.taskId}`);

          if (payload.linkedRiskId && currentAnswer) {
            const updatedRisks = currentAnswer.risks.map((r) =>
              r.id === payload.linkedRiskId ? { ...r, taskId: result.taskId } : r,
            );
            setCurrentAnswer({ ...currentAnswer, risks: updatedRisks });
          }

          setTaskModalVisible(false);
        }
      } catch {
        message.error("生成任务失败");
      }
    },
    [currentAnswer],
  );

  const summaryText = useMemo(() => {
    if (!currentAnswer) return "";
    return currentAnswer.summary.map((s, i) => `${i + 1}. ${s}`).join("\n");
  }, [currentAnswer]);

  const handleCopySummary = useCallback(() => {
    if (!summaryText) return;
    navigator.clipboard
      .writeText(summaryText)
      .then(() => message.success("要点已复制到剪贴板"))
      .catch(() => message.error("复制失败，请手动复制"));
  }, [summaryText]);

  const handleContinueAsk = useCallback(() => {
    message.info("请在输入框中继续提问");
  }, []);

  const handleTaskLinkClick = useCallback((taskId: string) => {
    message.info(`跳转到任务详情页（占位）：${taskId}`);
  }, []);

  return (
    <div className={styles.pageLayout}>
      <QuestionInput onAsk={handleAsk} loading={loading} />

      <div className={styles.contentArea}>
        <div className={styles.historySidebar}>
          <HistorySidebar
            sessions={sessions}
            onSelectSession={handleSelectSession}
            loading={sessionsLoading}
            currentSessionId={currentSessionId}
          />
        </div>

        <AnswerDisplay
          answer={currentAnswer}
          loading={loading}
          onGenerateReport={handleGenerateReport}
          onGenerateTask={handleGenerateTask}
          onContinueAsk={handleContinueAsk}
          onCopySummary={handleCopySummary}
          onShowEvidence={() => setEvidenceVisible(true)}
          onTaskLinkClick={handleTaskLinkClick}
        />
      </div>

      {currentAnswer && (
        <>
          <EvidenceDrawer
            visible={evidenceVisible}
            onClose={() => setEvidenceVisible(false)}
            evidence={currentAnswer.evidence}
            trust={currentAnswer.trust}
            answerId={currentAnswer.id}
          />

          <TaskModal
            visible={taskModalVisible}
            onClose={() => setTaskModalVisible(false)}
            onSubmit={handleSubmitTask}
            initialValues={taskModalInitialValues}
            mode="single"
          />
        </>
      )}
    </div>
  );
};

export default AiQaLeaderPage;
